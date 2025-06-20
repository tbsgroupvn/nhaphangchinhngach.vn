'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  FaUpload, FaFolder, FaImage, FaVideo, FaFileAlt, FaDownload,
  FaTrash, FaEye, FaCopy, FaEdit, FaSearch, FaFilter, FaSort,
  FaList, FaTh, FaPlus, FaCloud, FaChartBar, FaShare, FaSpinner,
  FaCheckCircle, FaExclamationTriangle, FaTags
} from 'react-icons/fa'
import { MediaService, MediaFile, Folder, formatFileSize, getFileType } from '../../../../lib/supabase'

export default function EnhancedMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'uploaded_at' | 'size' | 'downloads'>('uploaded_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [notifications, setNotifications] = useState<{id: string, type: 'success' | 'error', message: string}[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [currentFolder, typeFilter, searchQuery])

  const loadData = async () => {
    try {
      setLoading(true)
      const [filesData, foldersData] = await Promise.all([
        MediaService.getFiles({
          folder_id: currentFolder,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: searchQuery || undefined
        }),
        MediaService.getFolders()
      ])
      
      setFiles(filesData)
      setFolders(foldersData)
    } catch (error) {
      console.error('Error loading data:', error)
      addNotification('error', 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const addNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }

  // Enhanced drag & drop upload with real Supabase storage
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    const uploadPromises = acceptedFiles.map(async (file) => {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        
        // Upload to Supabase Storage
        const fileUrl = await MediaService.uploadFile(file, currentFolder || undefined)
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 50 }))
        
        // Generate thumbnail for images
        let thumbnailUrl = undefined
        if (file.type.startsWith('image/')) {
          thumbnailUrl = await MediaService.generateThumbnail(file)
        }

        setUploadProgress(prev => ({ ...prev, [file.name]: 75 }))
        
        // Get image dimensions
        let dimensions = undefined
        if (file.type.startsWith('image/')) {
          dimensions = await getImageDimensions(file)
        }

        // Save metadata to database
        const fileData: Omit<MediaFile, 'id' | 'created_at' | 'updated_at'> = {
          name: file.name,
          type: getFileType(file.type),
          url: fileUrl,
          thumbnail_url: thumbnailUrl,
          size: file.size,
          dimensions,
          uploaded_at: new Date().toISOString().split('T')[0],
          folder_id: currentFolder,
          tags: [],
          downloads: 0,
          description: '',
          user_id: 'temp-user-id' // TODO: Get from auth
        }

        const savedFile = await MediaService.saveFileMetadata(fileData)
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
        
        return savedFile
      } catch (error) {
        console.error('Upload error:', error)
        addNotification('error', `Lỗi upload ${file.name}`)
        return null
      } finally {
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[file.name]
            return newProgress
          })
        }, 2000)
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)
    const successfulUploads = uploadedFiles.filter(Boolean) as MediaFile[]
    
    if (successfulUploads.length > 0) {
      setFiles(prev => [...successfulUploads, ...prev])
      addNotification('success', `Đã upload thành công ${successfulUploads.length} file`)
    }
    
    setUploading(false)
    setShowUploadModal(false)
  }, [currentFolder])

  const getImageDimensions = (file: File): Promise<{width: number, height: number}> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading
  })

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <FaImage className="text-blue-500" />
      case 'video': return <FaVideo className="text-purple-500" />
      case 'document': return <FaFileAlt className="text-red-500" />
      default: return <FaFileAlt className="text-gray-500" />
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    
    try {
      const folderData: Omit<Folder, 'id' | 'created_at' | 'updated_at'> = {
        name: newFolderName,
        parent_id: currentFolder,
        item_count: 0,
        user_id: 'temp-user-id' // TODO: Get from auth
      }
      
      const newFolder = await MediaService.createFolder(folderData)
      setFolders(prev => [...prev, newFolder])
      setNewFolderName('')
      setShowNewFolderModal(false)
      addNotification('success', 'Đã tạo thư mục mới')
    } catch (error) {
      console.error('Create folder error:', error)
      addNotification('error', 'Không thể tạo thư mục')
    }
  }

  const handleDeleteSelected = async () => {
    if (!confirm(`Bạn có chắc muốn xóa ${selectedFiles.length} file đã chọn?`)) return

    try {
      await Promise.all(selectedFiles.map(fileId => MediaService.deleteFile(fileId)))
      setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)))
      setSelectedFiles([])
      addNotification('success', `Đã xóa ${selectedFiles.length} file`)
    } catch (error) {
      console.error('Delete error:', error)
      addNotification('error', 'Có lỗi khi xóa file')
    }
  }

  const handleDownload = async (file: MediaFile) => {
    try {
      // Increment download count
      await MediaService.incrementDownload(file.id)
      
      // Update local state
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, downloads: f.downloads + 1 } : f
      ))
      
      // Download file
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name
      link.click()
    } catch (error) {
      console.error('Download error:', error)
      addNotification('error', 'Lỗi khi tải file')
    }
  }

  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = typeFilter === 'all' || file.type === typeFilter
      const matchesFolder = currentFolder === null || file.folder_id === currentFolder
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

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const totalDownloads = files.reduce((sum, file) => sum + file.downloads, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaExclamationTriangle className="text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý tài nguyên (Enhanced)</h1>
            <p className="text-gray-600">
              Upload, quản lý và tổ chức file media với Supabase
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              disabled={uploading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
              {uploading ? 'Đang upload...' : 'Upload file'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
                    <div className="text-xs text-gray-500">{folder.item_count} file</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Cloud Integration Status */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Tích hợp cloud</h4>
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheckCircle className="text-green-600" />
                <span className="text-sm text-green-800">Supabase Storage</span>
              </div>
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
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        <FaTrash className="inline mr-1" />
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    >
                      <FaTh />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
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
                  className="px-3 py-2 border border-gray-300 rounded-lg"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="uploaded_at-desc">Mới nhất</option>
                  <option value="uploaded_at-asc">Cũ nhất</option>
                  <option value="name-asc">Tên A-Z</option>
                  <option value="name-desc">Tên Z-A</option>
                  <option value="size-desc">Kích thước lớn</option>
                  <option value="size-asc">Kích thước nhỏ</option>
                  <option value="downloads-desc">Tải nhiều nhất</option>
                </select>
              </div>
            </div>

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-3">Đang upload...</h3>
                <div className="space-y-2">
                  {Object.entries(uploadProgress).map(([filename, progress]) => (
                    <div key={filename} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 flex-1 truncate">{filename}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12">{progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map(file => (
                  <div
                    key={file.id}
                    className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                      selectedFiles.includes(file.id) ? 'border-red-500 bg-red-50' : 'border-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedFiles(prev => 
                        prev.includes(file.id) 
                          ? prev.filter(id => id !== file.id)
                          : [...prev, file.id]
                      )
                    }}
                  >
                    <div className="aspect-square rounded-lg bg-gray-100 mb-3 flex items-center justify-center overflow-hidden">
                      {file.thumbnail_url ? (
                        <img 
                          src={file.thumbnail_url} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-4xl">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-gray-900 truncate mb-1">{file.name}</h4>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    <p className="text-xs text-gray-400">{file.downloads} lượt tải</p>
                    
                    {file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{file.tags.length - 2}</span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(file.url)
                          addNotification('success', 'Đã copy URL!')
                        }}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Copy URL"
                      >
                        <FaCopy />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(file.url, '_blank')
                        }}
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="Xem"
                      >
                        <FaEye />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(file)
                        }}
                        className="p-1 text-gray-600 hover:text-purple-600"
                        title="Tải xuống"
                      >
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                        <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.id)}
                              onChange={() => {
                                setSelectedFiles(prev => 
                                  prev.includes(file.id) 
                                    ? prev.filter(id => id !== file.id)
                                    : [...prev, file.id]
                                )
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                {file.thumbnail_url ? (
                                  <img src={file.thumbnail_url} alt={file.name} className="w-8 h-8 object-cover rounded" />
                                ) : (
                                  getFileIcon(file.type)
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500">{file.description || 'Không có mô tả'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600 capitalize">{file.type}</td>
                          <td className="p-4 text-sm text-gray-600">{formatFileSize(file.size)}</td>
                          <td className="p-4 text-sm text-gray-600">{file.uploaded_at}</td>
                          <td className="p-4 text-sm text-gray-600">{file.downloads}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(file.url)
                                  addNotification('success', 'Đã copy URL!')
                                }}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="Copy URL"
                              >
                                <FaCopy />
                              </button>
                              <button
                                onClick={() => window.open(file.url, '_blank')}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                title="Xem"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleDownload(file)}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                                title="Tải xuống"
                              >
                                <FaDownload />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Bạn có chắc muốn xóa file này?')) {
                                    MediaService.deleteFile(file.id).then(() => {
                                      setFiles(prev => prev.filter(f => f.id !== file.id))
                                      addNotification('success', 'Đã xóa file')
                                    }).catch(() => {
                                      addNotification('error', 'Lỗi khi xóa file')
                                    })
                                  }
                                }}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
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
                } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <FaSpinner className="animate-spin mx-auto h-12 w-12 text-gray-400 mb-4" />
                ) : (
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                )}
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {uploading ? 'Đang upload...' : 
                   isDragActive ? 'Thả file vào đây...' : 'Kéo thả file hoặc click để chọn'}
                </p>
                <p className="text-sm text-gray-500">
                  Hỗ trợ: JPG, PNG, PDF, DOC, Video (tối đa 10MB mỗi file)
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Tạo thư mục
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 