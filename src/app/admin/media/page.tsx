'use client';

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { 
  FaUpload, FaFolder, FaImage, FaVideo, FaFileAlt, FaDownload,
  FaTrash, FaEye, FaCopy, FaEdit, FaSearch, FaFilter, FaSort,
  FaList, FaTh, FaPlus, FaCloud, FaChartBar, FaShare,
  FaExclamationTriangle
} from 'react-icons/fa'
import AdminHeader from '../../../components/admin/AdminHeader'

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  url: string
  thumbnail?: string
  size: number
  dimensions?: { width: number; height: number }
  uploadedAt: string
  folder: string
  tags: string[]
  downloads: number
  description: string
}

interface Folder {
  id: string
  name: string
  parent: string | null
  itemCount: number
  createdAt: string
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'banner-homepage.jpg',
      type: 'image',
      url: '/images/banner-1.jpg',
      thumbnail: '/images/banner-1.jpg',
      size: 2500000,
      dimensions: { width: 1920, height: 1080 },
      uploadedAt: '2024-12-20',
      folder: 'banners',
      tags: ['homepage', 'banner', 'logistics'],
      downloads: 45,
      description: 'Banner chính trang chủ'
    },
    {
      id: '2',
      name: 'tbs-logo.png',
      type: 'image',
      url: '/images/tbs-logo.png',
      thumbnail: '/images/tbs-logo.png',
      size: 150000,
      dimensions: { width: 400, height: 300 },
      uploadedAt: '2024-12-19',
      folder: 'logos',
      tags: ['logo', 'branding'],
      downloads: 123,
      description: 'Logo công ty TBS GROUP'
    },
    {
      id: '3',
      name: 'service-guide.pdf',
      type: 'document',
      url: '/documents/service-guide.pdf',
      size: 5200000,
      uploadedAt: '2024-12-18',
      folder: 'documents',
      tags: ['guide', 'service', 'pdf'],
      downloads: 78,
      description: 'Hướng dẫn sử dụng dịch vụ'
    }
  ])

  const [folders, setFolders] = useState<Folder[]>([
    { id: 'images', name: 'Hình ảnh', parent: null, itemCount: 25, createdAt: '2024-12-01' },
    { id: 'banners', name: 'Banner & Slides', parent: 'images', itemCount: 8, createdAt: '2024-12-01' },
    { id: 'logos', name: 'Logo & Branding', parent: 'images', itemCount: 5, createdAt: '2024-12-01' },
    { id: 'services', name: 'Ảnh dịch vụ', parent: 'images', itemCount: 12, createdAt: '2024-12-01' },
    { id: 'documents', name: 'Tài liệu', parent: null, itemCount: 15, createdAt: '2024-12-01' },
    { id: 'videos', name: 'Video', parent: null, itemCount: 3, createdAt: '2024-12-01' }
  ])

  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'uploadedAt' | 'size' | 'downloads'>('uploadedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image load errors
  const handleImageError = (fileId: string) => {
    setImageErrors(prev => {
      const newSet = new Set(prev)
      newSet.add(fileId)
      return newSet
    })
  }

  // Drag & Drop upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const newFile: MediaFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: getFileType(file.type),
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        size: file.size,
        dimensions: file.type.startsWith('image/') ? { width: 0, height: 0 } : undefined,
        uploadedAt: new Date().toISOString().split('T')[0],
        folder: currentFolder || 'root',
        tags: [],
        downloads: 0,
        description: ''
      }
      
      setFiles(prev => [...prev, newFile])
    })
    setShowUploadModal(false)
  }, [currentFolder])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  })

  const getFileType = (mimeType: string): MediaFile['type'] => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'document'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <FaImage className="text-blue-500" />
      case 'video': return <FaVideo className="text-purple-500" />
      case 'document': return <FaFileAlt className="text-red-500" />
      default: return <FaFileAlt className="text-gray-500" />
    }
  }

  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = typeFilter === 'all' || file.type === typeFilter
      const matchesFolder = currentFolder === null || file.folder === currentFolder
      return matchesSearch && matchesType && matchesFolder
    })
    .sort((a, b) => {
      const aValue = a[sortBy] as string | number
      const bValue = b[sortBy] as string | number
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getCurrentFolderPath = () => {
    if (!currentFolder) return 'Thư mục gốc'
    const folder = folders.find(f => f.id === currentFolder)
    return folder ? folder.name : 'Thư mục gốc'
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName,
        parent: currentFolder,
        itemCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setFolders(prev => [...prev, newFolder])
      setNewFolderName('')
      setShowNewFolderModal(false)
    }
  }

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleDeleteSelected = () => {
    if (confirm(`Bạn có chắc muốn xóa ${selectedFiles.length} file đã chọn?`)) {
      setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)))
      setSelectedFiles([])
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('✅ Đã copy URL vào clipboard!')
    }).catch(() => {
      alert('❌ Không thể copy URL')
    })
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const totalDownloads = files.reduce((sum, file) => sum + file.downloads, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Quản lý tài nguyên" 
        subtitle="Upload, quản lý và tổ chức file media cho website"
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Production Warning */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-amber-600 text-lg mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">💡 Thư viện Media - Demo Mode</h4>
              <p className="text-sm text-amber-700 mb-2">
                Hiện tại đang chạy với mock data. Trong production, cần tích hợp với cloud storage.
              </p>
              <div className="text-sm text-amber-700">
                <p><strong>Khuyến nghị:</strong> Tích hợp với Cloudinary, AWS S3, hoặc Google Drive cho production.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng file</p>
                <p className="text-2xl font-bold text-gray-900">{files.length}</p>
              </div>
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dung lượng</p>
                <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
              </div>
              <FaChartBar className="text-green-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lượt tải</p>
                <p className="text-2xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
              </div>
              <FaDownload className="text-purple-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thư mục</p>
                <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
              </div>
              <FaFolder className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Folders */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Thư mục</h3>
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Tạo thư mục mới"
              >
                <FaPlus />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setCurrentFolder(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  currentFolder === null ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'
                }`}
              >
                <FaFolder className="text-yellow-500" />
                <span>Tất cả file</span>
                <span className="ml-auto text-sm text-gray-500">{files.length}</span>
              </button>

              {folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() => setCurrentFolder(folder.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    currentFolder === folder.id ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <FaFolder className="text-blue-500" />
                  <div className="flex-1">
                    <div>{folder.name}</div>
                    <div className="text-xs text-gray-500">{folder.itemCount} file</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Cloud Integration */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Tích hợp cloud</h4>
              <button 
                className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Tính năng sẽ có trong phiên bản production"
              >
                <FaCloud className="text-blue-600" />
                <span className="text-sm">Kết nối Google Drive</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaFolder className="text-blue-500" />
                    <span className="font-medium text-gray-900">{getCurrentFolderPath()}</span>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Đã chọn {selectedFiles.length} file
                      </span>
                      <button
                        onClick={handleDeleteSelected}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        <FaTrash className="inline mr-1" />
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                  >
                    <FaUpload />
                    Upload file
                  </button>

                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      title="Xem dạng lưới"
                    >
                      <FaTh />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      title="Xem dạng danh sách"
                    >
                      <FaList />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm file..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="image">Hình ảnh</option>
                  <option value="video">Video</option>
                  <option value="document">Tài liệu</option>
                  <option value="audio">Audio</option>
                </select>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="uploadedAt-desc">Mới nhất</option>
                  <option value="uploadedAt-asc">Cũ nhất</option>
                  <option value="name-asc">Tên A-Z</option>
                  <option value="name-desc">Tên Z-A</option>
                  <option value="size-desc">Kích thước lớn</option>
                  <option value="size-asc">Kích thước nhỏ</option>
                  <option value="downloads-desc">Tải nhiều nhất</option>
                </select>
              </div>
            </div>

            {/* File Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map(file => (
                  <div
                    key={file.id}
                    className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedFiles.includes(file.id) ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectFile(file.id)}
                  >
                    <div className="aspect-square rounded-lg bg-gray-100 mb-3 flex items-center justify-center overflow-hidden">
                      {file.thumbnail && !imageErrors.has(file.id) ? (
                        <Image 
                          src={file.thumbnail} 
                          alt={file.name}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(file.id)}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                      ) : (
                        <div className="text-4xl">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 truncate mb-1" title={file.name}>{file.name}</h4>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    <p className="text-xs text-gray-400">{file.downloads} lượt tải</p>
                    
                    <div className="flex justify-between items-center mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyUrl(file.url)
                        }}
                        className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Copy URL"
                      >
                        <FaCopy />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(file.url, '_blank')
                        }}
                        className="p-1 text-gray-600 hover:text-green-600 transition-colors"
                        title="Xem"
                      >
                        <FaEye />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const link = document.createElement('a')
                          link.href = file.url
                          link.download = file.name
                          link.click()
                        }}
                        className="p-1 text-gray-600 hover:text-purple-600 transition-colors"
                        title="Tải xuống"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4">
                          <input
                            type="checkbox"
                            checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles(filteredFiles.map(f => f.id))
                              } else {
                                setSelectedFiles([])
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">Tên file</th>
                        <th className="text-left p-4 font-medium text-gray-900">Loại</th>
                        <th className="text-left p-4 font-medium text-gray-900">Kích thước</th>
                        <th className="text-left p-4 font-medium text-gray-900">Ngày tải</th>
                        <th className="text-left p-4 font-medium text-gray-900">Lượt tải</th>
                        <th className="text-left p-4 font-medium text-gray-900">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map(file => (
                        <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => handleSelectFile(file.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                {file.thumbnail && !imageErrors.has(file.id) ? (
                                  <Image 
                                    src={file.thumbnail} 
                                    alt={file.name} 
                                    width={40}
                                    height={40}
                                    className="w-8 h-8 object-cover rounded"
                                    onError={() => handleImageError(file.id)}
                                  />
                                ) : (
                                  getFileIcon(file.type)
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900" title={file.name}>{file.name}</p>
                                <p className="text-sm text-gray-500">{file.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600 capitalize">{file.type}</td>
                          <td className="p-4 text-sm text-gray-600">{formatFileSize(file.size)}</td>
                          <td className="p-4 text-sm text-gray-600">{file.uploadedAt}</td>
                          <td className="p-4 text-sm text-gray-600">{file.downloads}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyUrl(file.url)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Copy URL"
                              >
                                <FaCopy />
                              </button>
                              <button
                                onClick={() => window.open(file.url, '_blank')}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Xem"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => {
                                  const link = document.createElement('a')
                                  link.href = file.url
                                  link.download = file.name
                                  link.click()
                                }}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="Tải xuống"
                              >
                                <FaDownload />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc muốn xóa file "${file.name}"?`)) {
                                    setFiles(prev => prev.filter(f => f.id !== file.id))
                                  }
                                }}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No files found */}
            {filteredFiles.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy file</h3>
                <p className="text-gray-500">
                  {searchQuery || typeFilter !== 'all' 
                    ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                    : 'Upload file đầu tiên để bắt đầu quản lý media'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload file mới</h3>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file hoặc click để chọn'}
                </p>
                <p className="text-sm text-gray-500">
                  Hỗ trợ: JPG, PNG, PDF, DOC, Video (tối đa 10MB mỗi file)
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Chọn file
                </button>
              </div>
            </div>
          </div>
        )}

        {/* New Folder Modal */}
        {showNewFolderModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo thư mục mới</h3>
              
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Tên thư mục..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowNewFolderModal(false)
                    setNewFolderName('')
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Tạo thư mục
                </button>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            onDrop(files)
          }}
        />
      </div>
    </div>
  )
} 