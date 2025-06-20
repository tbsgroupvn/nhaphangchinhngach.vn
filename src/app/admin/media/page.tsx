'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FaUpload, FaFolder, FaImage, FaVideo, FaFile, FaDownload,
  FaTrash, FaEdit, FaSearch, FaFilter, FaGrid, FaList,
  FaCloud, FaCopy, FaEye, FaShare, FaTags, FaCalendar,
  FaSort, FaSortUp, FaSortDown, FaPlus, FaCog
} from 'react-icons/fa';

interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'document' | 'other';
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  folder: string;
  tags: string[];
  alt?: string;
  description?: string;
  uploadedAt: string;
  uploadedBy: string;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata: {
    views: number;
    downloads: number;
    usedIn: string[];
  };
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  path: string;
  createdAt: string;
  fileCount: number;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [sortField, setSortField] = useState<'name' | 'size' | 'uploadedAt'>('uploadedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock data - Replace with real API calls
  useEffect(() => {
    setTimeout(() => {
      setFolders([
        {
          id: 'images',
          name: 'Hình ảnh',
          path: '/images',
          createdAt: '2024-01-01',
          fileCount: 45
        },
        {
          id: 'documents',
          name: 'Tài liệu',
          path: '/documents',
          createdAt: '2024-01-01',
          fileCount: 12
        },
        {
          id: 'videos',
          name: 'Video',
          path: '/videos',
          createdAt: '2024-01-01',
          fileCount: 8
        },
        {
          id: 'logos',
          name: 'Logo & Brand',
          parentId: 'images',
          path: '/images/logos',
          createdAt: '2024-01-15',
          fileCount: 15
        }
      ]);

      setFiles([
        {
          id: '1',
          name: 'tbs-logo-2024.png',
          originalName: 'TBS Logo 2024.png',
          type: 'image',
          mimeType: 'image/png',
          size: 245760,
          url: '/images/tbs-logo.png',
          thumbnailUrl: '/images/tbs-logo.png',
          folder: 'logos',
          tags: ['logo', 'brand', 'tbs'],
          alt: 'Logo TBS GROUP 2024',
          description: 'Logo chính thức của TBS GROUP năm 2024',
          uploadedAt: '2024-12-20',
          uploadedBy: 'Admin',
          dimensions: { width: 512, height: 256 },
          metadata: {
            views: 156,
            downloads: 23,
            usedIn: ['homepage', 'about-page', 'footer']
          }
        },
        {
          id: '2',
          name: 'hero-background.jpg',
          originalName: 'Hero Background Image.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 1024000,
          url: '/images/hero-bg.jpg',
          thumbnailUrl: '/images/hero-bg-thumb.jpg',
          folder: 'images',
          tags: ['background', 'hero', 'banner'],
          alt: 'Hình nền trang chủ',
          uploadedAt: '2024-12-18',
          uploadedBy: 'Designer',
          dimensions: { width: 1920, height: 1080 },
          metadata: {
            views: 89,
            downloads: 12,
            usedIn: ['homepage']
          }
        },
        {
          id: '3',
          name: 'company-profile.pdf',
          originalName: 'TBS GROUP Company Profile 2024.pdf',
          type: 'document',
          mimeType: 'application/pdf',
          size: 2048000,
          url: '/documents/company-profile.pdf',
          folder: 'documents',
          tags: ['profile', 'company', 'brochure'],
          description: 'Hồ sơ năng lực công ty TBS GROUP',
          uploadedAt: '2024-12-15',
          uploadedBy: 'Marketing',
          metadata: {
            views: 234,
            downloads: 45,
            usedIn: ['about-page', 'contact-form']
          }
        },
        {
          id: '4',
          name: 'logistics-process-video.mp4',
          originalName: 'Quy trình logistics TBS.mp4',
          type: 'video',
          mimeType: 'video/mp4',
          size: 15360000,
          url: '/videos/logistics-process.mp4',
          thumbnailUrl: '/videos/logistics-thumb.jpg',
          folder: 'videos',
          tags: ['logistics', 'process', 'tutorial'],
          description: 'Video giới thiệu quy trình logistics của TBS GROUP',
          uploadedAt: '2024-12-10',
          uploadedBy: 'Content Team',
          metadata: {
            views: 67,
            downloads: 8,
            usedIn: ['services-page']
          }
        },
        {
          id: '5',
          name: 'warehouse-image-1.jpg',
          originalName: 'Kho bãi TBS 1.jpg',
          type: 'image',
          mimeType: 'image/jpeg',
          size: 856000,
          url: '/images/warehouse1.jpg',
          thumbnailUrl: '/images/warehouse1-thumb.jpg',
          folder: 'images',
          tags: ['warehouse', 'facility', 'tbs'],
          alt: 'Kho bãi TBS GROUP',
          uploadedAt: '2024-12-05',
          uploadedBy: 'Photographer',
          dimensions: { width: 1600, height: 900 },
          metadata: {
            views: 123,
            downloads: 18,
            usedIn: ['about-page', 'services-page']
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Drag & Drop functionality
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploading(true);
    
    // Simulate upload process
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          const newFile: MediaFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name.toLowerCase().replace(/\s+/g, '-'),
            originalName: file.name,
            type: file.type.startsWith('image/') ? 'image' : 
                  file.type.startsWith('video/') ? 'video' :
                  file.type === 'application/pdf' ? 'document' : 'other',
            mimeType: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
            thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
            folder: currentFolder,
            tags: [],
            uploadedAt: new Date().toISOString().split('T')[0],
            uploadedBy: 'Current User',
            dimensions: file.type.startsWith('image/') ? { width: 0, height: 0 } : undefined,
            metadata: {
              views: 0,
              downloads: 0,
              usedIn: []
            }
          };

          setFiles(prev => [newFile, ...prev]);
        }, 1000);
      };
      reader.readAsDataURL(file);
    });

    setTimeout(() => {
      setUploading(false);
      setShowUploadModal(false);
    }, 2000);
  }, [currentFolder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    },
    multiple: true
  });

  // Filter files
  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = typeFilter === 'all' || file.type === typeFilter;
      const matchesFolder = currentFolder === 'root' || file.folder === currentFolder;
      return matchesSearch && matchesType && matchesFolder;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string, mimeType: string) => {
    if (type === 'image') return <FaImage className="text-blue-500" />;
    if (type === 'video') return <FaVideo className="text-red-500" />;
    if (mimeType === 'application/pdf') return <FaFile className="text-red-600" />;
    return <FaFile className="text-gray-500" />;
  };

  const handleDelete = (fileId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa file này?')) {
      setFiles(prev => prev.filter(file => file.id !== fileId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;
    if (confirm(`Bạn có chắc muốn xóa ${selectedFiles.length} file đã chọn?`)) {
      setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Đã copy URL vào clipboard!');
  };

  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý tài nguyên</h1>
          <p className="text-gray-600">
            Upload, tổ chức và quản lý hình ảnh, video, tài liệu của website
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaUpload />
            Upload file
          </button>
          
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl">
            <FaCloud />
            Google Drive
          </button>
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
            <FaFile className="text-gray-400 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hình ảnh</p>
              <p className="text-2xl font-bold text-blue-600">
                {files.filter(f => f.type === 'image').length}
              </p>
            </div>
            <FaImage className="text-blue-400 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Video</p>
              <p className="text-2xl font-bold text-red-600">
                {files.filter(f => f.type === 'video').length}
              </p>
            </div>
            <FaVideo className="text-red-400 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dung lượng</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
              </p>
            </div>
            <FaCog className="text-purple-400 text-2xl" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả loại</option>
              <option value="image">Hình ảnh</option>
              <option value="video">Video</option>
              <option value="document">Tài liệu</option>
            </select>
          </div>

          {/* Right side - View controls */}
          <div className="flex items-center gap-3">
            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedFiles.length} file
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            )}

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-red-100 text-red-600' : 'text-gray-500'}`}
              >
                <FaGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-red-100 text-red-600' : 'text-gray-500'}`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Folders & Breadcrumb */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm">
            <FaFolder className="text-blue-500" />
            <span className="text-gray-600">Đường dẫn:</span>
            <button
              onClick={() => setCurrentFolder('root')}
              className="text-blue-600 hover:underline"
            >
              Gốc
            </button>
            {currentFolder !== 'root' && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900">
                  {folders.find(f => f.id === currentFolder)?.name}
                </span>
              </>
            )}
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <FaPlus />
            Tạo thư mục
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {folders
            .filter(folder => currentFolder === 'root' ? !folder.parentId : folder.parentId === currentFolder)
            .map(folder => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder.id)}
                className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <FaFolder className="text-blue-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-900 text-center">
                  {folder.name}
                </span>
                <span className="text-xs text-gray-500">
                  {folder.fileCount} file
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Files Grid/List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <h3 className="text-lg font-medium text-gray-900">
              File trong thư mục ({filteredFiles.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
              Sắp xếp
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles([...selectedFiles, file.id]);
                    } else {
                      setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                    }
                  }}
                  className="absolute top-2 left-2 z-10 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />

                {/* File Preview */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                  {file.type === 'image' && file.thumbnailUrl ? (
                    <img
                      src={file.thumbnailUrl}
                      alt={file.alt || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">
                      {getFileIcon(file.type, file.mimeType)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {file.originalName}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatFileSize(file.size)}
                  </p>
                  
                  {/* Tags */}
                  {file.tags.length > 0 && (
                    <div className="mb-2">
                      {file.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mr-1 mb-1"
                        >
                          {tag}
                        </span>
                      ))}
                      {file.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{file.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Xem"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Copy URL"
                  >
                    <FaCopy />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles([...selectedFiles, file.id]);
                    } else {
                      setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                    }
                  }}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />

                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {file.type === 'image' && file.thumbnailUrl ? (
                    <img
                      src={file.thumbnailUrl}
                      alt={file.alt || file.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    {getFileIcon(file.type, file.mimeType)}
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {file.originalName}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      {new Date(file.uploadedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEye />
                      {file.metadata.views} lượt xem
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Xem"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Copy URL"
                  >
                    <FaCopy />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FaFile className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500 text-lg">Không có file nào</p>
            <p className="text-sm text-gray-400 mt-1">
              Upload file hoặc thay đổi bộ lọc để xem nội dung
            </p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload file</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <FaUpload className="mx-auto text-gray-400 text-3xl mb-4" />
              {isDragActive ? (
                <p className="text-red-600">Thả file vào đây...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Kéo thả file vào đây hoặc click để chọn
                  </p>
                  <p className="text-sm text-gray-500">
                    Hỗ trợ: JPG, PNG, GIF, MP4, PDF, DOC, XLS (Max: 10MB)
                  </p>
                </div>
              )}
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Đang upload...</span>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 