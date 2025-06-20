'use client'

import React, { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { FaUpload, FaFolderOpen, FaSearch, FaSync, FaGoogleDrive, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { googleDriveService } from '@/lib/google-drive-service'
import Image from 'next/image'

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  url: string
  thumbnail?: string
  size: number
  uploadedAt: string
  folder: string
  tags: string[]
  downloads: number
  description: string
}

const MediaPage = () => {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [driveConnected, setDriveConnected] = useState(false)
  const [syncingDrive, setSyncingDrive] = useState(false)

  // Folder structure
  const folders = [
    { id: 'all', name: 'Tất cả file' },
    { id: 'images', name: 'Hình ảnh' },
    { id: 'banners', name: 'Banner & Slides' },
    { id: 'logos', name: 'Logo & Branding' },
    { id: 'services', name: 'Ảnh dịch vụ' },
    { id: 'documents', name: 'Tài liệu' },
    { id: 'videos', name: 'Video' },
    { id: 'uploads', name: 'Uploads' }
  ]

  useEffect(() => {
    loadFiles()
    initializeGoogleDrive()
  }, [])

  const initializeGoogleDrive = async () => {
    try {
      await googleDriveService.initialize()
      setDriveConnected(googleDriveService.getSignInStatus())
    } catch (error) {
      console.error('Failed to initialize Google Drive:', error)
    }
  }

  const handleGoogleDriveSignIn = async () => {
    try {
      setLoading(true)
      const success = await googleDriveService.signIn()
      setDriveConnected(success)
      if (success) {
        await syncWithGoogleDrive()
      }
    } catch (error) {
      console.error('Google Drive sign in failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleDriveSignOut = async () => {
    try {
      await googleDriveService.signOut()
      setDriveConnected(false)
    } catch (error) {
      console.error('Google Drive sign out failed:', error)
    }
  }

  const syncWithGoogleDrive = async () => {
    try {
      setSyncingDrive(true)
      const result = await googleDriveService.syncWithDrive()
      
      if (result.success) {
        setFiles(prevFiles => {
          const localFiles = prevFiles.filter(f => !f.url.includes('drive.google.com'))
          return [...localFiles, ...result.files]
        })
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncingDrive(false)
    }
  }

  const loadFiles = () => {
    // Mock data for demo - in production, load from API
    const mockFiles: MediaFile[] = [
      {
        id: '1',
        name: 'tbs-logo.png',
        type: 'image',
        url: '/images/tbs-logo.png',
        thumbnail: '/images/tbs-logo.png',
        size: 45000,
        uploadedAt: '2024-12-20',
        folder: 'logos',
        tags: ['logo', 'branding'],
        downloads: 25,
        description: 'TBS GROUP main logo'
      },
      {
        id: '2',
        name: 'zalo-qr.png',
        type: 'image',
        url: '/images/zalo-qr.png',
        thumbnail: '/images/zalo-qr.png',
        size: 32000,
        uploadedAt: '2024-12-20',
        folder: 'uploads',
        tags: ['qr', 'zalo'],
        downloads: 12,
        description: 'Zalo QR code for contact'
      }
    ]

    setFiles(mockFiles)
    setFilteredFiles(mockFiles)
  }

  // Filter and search logic
  useEffect(() => {
    let filtered = files

    if (selectedFolder !== 'all') {
      filtered = filtered.filter(file => file.folder === selectedFolder)
    }

    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredFiles(filtered)
  }, [files, selectedFolder, searchTerm])

  const handleFileUpload = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return

    setLoading(true)
    try {
      const fileArray = Array.from(uploadedFiles)
      
      // If Google Drive is connected, upload there
      if (driveConnected) {
        const results = await Promise.all(
          fileArray.map(file => googleDriveService.uploadFile(file, selectedFolder))
        )
        
        // Convert to MediaFile format
        const newFiles = results.map(driveFile => 
          googleDriveService.driveFileToMediaFile(driveFile)
        )
        
        setFiles(prev => [...prev, ...newFiles])
      } else {
        // Local upload simulation
        const newFiles: MediaFile[] = fileArray.map((file, index) => ({
          id: Date.now() + index + '',
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' :
                file.type.startsWith('audio/') ? 'audio' : 'document',
          url: URL.createObjectURL(file),
          size: file.size,
          uploadedAt: new Date().toISOString().split('T')[0],
          folder: selectedFolder === 'all' ? 'uploads' : selectedFolder,
          tags: [],
          downloads: 0,
          description: `Uploaded file: ${file.name}`
        }))

        setFiles(prev => [...prev, ...newFiles])
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setLoading(false)
      setUploadModalOpen(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return '🖼️'
      case 'video': return '🎥'
      case 'audio': return '🎵'
      default: return '📄'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📁 Quản lý Media</h1>
          <p className="text-gray-600 mt-2">
            Quản lý hình ảnh, video và tài liệu của website
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          {/* Google Drive Integration */}
          <div className="flex items-center gap-2">
            {driveConnected ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={syncWithGoogleDrive}
                  disabled={syncingDrive}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                >
                  <FaSync className={`w-4 h-4 ${syncingDrive ? 'animate-spin' : ''}`} />
                  {syncingDrive ? 'Đang sync...' : 'Sync Drive'}
                </button>
                <button
                  onClick={handleGoogleDriveSignOut}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Thoát Drive
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleDriveSignIn}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <FaGoogleDrive className="w-4 h-4" />
                <FaSignInAlt className="w-3 h-3" />
                Kết nối Google Drive
              </button>
            )}
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
          >
            <FaUpload className="w-4 h-4" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Google Drive Status */}
      {driveConnected && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <FaGoogleDrive className="w-5 h-5" />
            <span className="font-medium">Đã kết nối Google Drive</span>
          </div>
          <p className="text-green-600 text-sm mt-1">
            Files sẽ được tự động lưu trữ trên Google Drive của bạn
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Folder Filter */}
        <div className="flex items-center gap-2">
          <FaFolderOpen className="w-4 h-4 text-gray-500" />
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            📊
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            📋
          </button>
        </div>
      </div>

      {/* Files Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredFiles.map(file => (
            <div key={file.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              {file.type === 'image' ? (
                <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={file.thumbnail || file.url}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                  />
                </div>
              ) : (
                <div className="aspect-square mb-3 bg-gray-100 rounded-lg flex items-center justify-center text-4xl">
                  {getFileIcon(file.type)}
                </div>
              )}
              
              <h3 className="font-medium text-sm truncate mb-1">{file.name}</h3>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              <p className="text-xs text-gray-400 mt-1">{file.uploadedAt}</p>
              
              {file.url.includes('drive.google.com') && (
                <div className="flex items-center gap-1 mt-2">
                  <FaGoogleDrive className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600">Drive</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tên file</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Loại</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kích thước</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ngày tải</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Lượt tải</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vị trí</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.map(file => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {file.type === 'image' ? (
                        <Image
                          src={file.thumbnail || file.url}
                          alt={file.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        {file.url.includes('drive.google.com') && (
                          <div className="flex items-center gap-1">
                            <FaGoogleDrive className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-blue-600">Google Drive</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 capitalize">{file.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatFileSize(file.size)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.uploadedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.downloads}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {folders.find(f => f.id === file.folder)?.name || file.folder}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
              <Dialog.Title className="text-lg font-medium mb-4">
                📤 Upload Files
              </Dialog.Title>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragOver ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
              >
                <FaUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Kéo thả files vào đây hoặc
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700"
                >
                  Chọn files
                </label>
              </div>

              {driveConnected && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <FaGoogleDrive className="w-4 h-4" />
                    <span>Files sẽ được lưu trên Google Drive</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có files nào
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Không tìm thấy files phù hợp' : 'Bắt đầu bằng cách upload files mới'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Upload Files Đầu Tiên
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default MediaPage 