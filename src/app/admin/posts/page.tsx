'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSearch, 
  FaSort, FaSortUp, FaSortDown, FaImage, FaNewspaper,
  FaCalendar, FaUser, FaStar, FaFilter, FaTags
} from 'react-icons/fa';

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'published' | 'draft' | 'review';
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  author: string;
  image?: string;
  excerpt: string;
  featured: boolean;
  tags: string[];
  readTime: number;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'review'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Post>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // Mock data - Replace with real API calls
  useEffect(() => {
    setTimeout(() => {
      setPosts([
        {
          id: '1',
          title: 'Thuế suất nhập khẩu mới 2024 - Những thay đổi quan trọng',
          slug: 'thue-suat-nhap-khau-moi-2024',
          category: 'tin-tuc-nganh',
          status: 'published',
          views: 2156,
          createdAt: '2024-12-15',
          updatedAt: '2024-12-20',
          publishedAt: '2024-12-20',
          author: 'Admin TBS',
          image: '/images/news1.jpg',
          excerpt: 'Tổng cục Hải quan vừa công bố biểu thuế nhập khẩu ưu đãi đặc biệt năm 2024...',
          featured: true,
          tags: ['thuế', 'hải quan', 'chính sách'],
          readTime: 5
        },
        {
          id: '2',
          title: 'Cẩm nang xuất nhập khẩu cho người mới bắt đầu',
          slug: 'cam-nang-xuat-nhap-khau-cho-nguoi-moi',
          category: 'cam-nang-xnk',
          status: 'published',
          views: 1890,
          createdAt: '2024-12-10',
          updatedAt: '2024-12-18',
          publishedAt: '2024-12-18',
          author: 'Chuyên gia TBS',
          image: '/images/guide1.jpg',
          excerpt: 'Hướng dẫn chi tiết từ A-Z về quy trình xuất nhập khẩu dành cho người mới...',
          featured: true,
          tags: ['hướng dẫn', 'thủ tục', 'beginner'],
          readTime: 8
        },
        {
          id: '3',
          title: 'TBS GROUP mở rộng dịch vụ vận chuyển đường sắt',
          slug: 'tbs-group-mo-rong-van-chuyen-duong-sat',
          category: 'tin-noi-bo',
          status: 'published',
          views: 1432,
          createdAt: '2024-12-08',
          updatedAt: '2024-12-16',
          publishedAt: '2024-12-16',
          author: 'PR Team',
          image: '/images/internal1.jpg',
          excerpt: 'Công ty chính thức mở tuyến vận chuyển đường sắt từ Trung Quốc về Việt Nam...',
          featured: false,
          tags: ['công ty', 'mở rộng', 'đường sắt'],
          readTime: 4
        },
        {
          id: '4',
          title: 'Câu chuyện thành công: Nhập khẩu 1000 tấn thép từ Trung Quốc',
          slug: 'cau-chuyen-thanh-cong-nhap-khau-thep',
          category: 'cau-chuyen-khach-hang',
          status: 'review',
          views: 856,
          createdAt: '2024-12-05',
          updatedAt: '2024-12-14',
          author: 'Content Team',
          image: '/images/story1.jpg',
          excerpt: 'Chia sẻ từ khách hàng về việc nhập khẩu thép với số lượng lớn thông qua TBS...',
          featured: false,
          tags: ['khách hàng', 'thép', 'thành công'],
          readTime: 6
        },
        {
          id: '5',
          title: 'Hội thảo "Xu hướng logistics 2025" - Đăng ký tham gia',
          slug: 'hoi-thao-xu-huong-logistics-2025',
          category: 'hoat-dong-cong-ty',
          status: 'draft',
          views: 0,
          createdAt: '2024-12-01',
          updatedAt: '2024-12-12',
          author: 'Marketing Team',
          excerpt: 'TBS GROUP tổ chức hội thảo về xu hướng phát triển ngành logistics...',
          featured: false,
          tags: ['sự kiện', 'logistics', 'hội thảo'],
          readTime: 3
        },
        {
          id: '6',
          title: 'Tuyển dụng 10 nhân viên logistics kinh nghiệm',
          slug: 'tuyen-dung-nhan-vien-logistics',
          category: 'tuyen-dung',
          status: 'published',
          views: 1205,
          createdAt: '2024-11-28',
          updatedAt: '2024-12-10',
          publishedAt: '2024-12-10',
          author: 'HR Team',
          image: '/images/recruitment1.jpg',
          excerpt: 'Cơ hội nghề nghiệp tại TBS GROUP với mức lương hấp dẫn và phúc lợi đầy đủ...',
          featured: false,
          tags: ['tuyển dụng', 'logistics', 'việc làm'],
          readTime: 4
        }
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const categories = [
    { value: 'all', label: 'Tất cả danh mục', icon: '📁' },
    { value: 'tin-tuc-nganh', label: 'Tin tức ngành', icon: '📈' },
    { value: 'tin-noi-bo', label: 'Tin nội bộ', icon: '🏢' },
    { value: 'cam-nang-xnk', label: 'Cẩm nang XNK', icon: '📚' },
    { value: 'cau-chuyen-khach-hang', label: 'Câu chuyện KH', icon: '💬' },
    { value: 'hoat-dong-cong-ty', label: 'Hoạt động công ty', icon: '🎯' },
    { value: 'tuyen-dung', label: 'Tuyển dụng', icon: '👥' }
  ];

  const authors = [
    { value: 'all', label: 'Tất cả tác giả' },
    { value: 'Admin TBS', label: 'Admin TBS' },
    { value: 'Chuyên gia TBS', label: 'Chuyên gia TBS' },
    { value: 'Content Team', label: 'Content Team' },
    { value: 'Marketing Team', label: 'Marketing Team' },
    { value: 'HR Team', label: 'HR Team' },
    { value: 'PR Team', label: 'PR Team' }
  ];

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      const matchesAuthor = authorFilter === 'all' || post.author === authorFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesAuthor;
    })
    .sort((a, b) => {
      const aValue = a[sortField] as string | number;
      const bValue = b[sortField] as string | number;
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof Post) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusToggle = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { 
            ...post, 
            status: post.status === 'published' ? 'draft' : 'published',
            publishedAt: post.status === 'draft' ? new Date().toISOString().split('T')[0] : post.publishedAt
          }
        : post
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      setPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const handleBulkAction = (action: 'publish' | 'draft' | 'delete') => {
    if (selectedPosts.length === 0) return;
    
    if (action === 'delete') {
      if (confirm(`Bạn có chắc muốn xóa ${selectedPosts.length} bài viết đã chọn?`)) {
        setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)));
        setSelectedPosts([]);
      }
    } else {
      setPosts(prev => prev.map(post => 
        selectedPosts.includes(post.id) 
          ? { ...post, status: action as 'published' | 'draft' }
          : post
      ));
      setSelectedPosts([]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === paginatedPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(paginatedPosts.map(post => post.id));
    }
  };

  const getSortIcon = (field: keyof Post) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' ? <FaSortUp className="text-red-600" /> : <FaSortDown className="text-red-600" />;
  };

  const getStatusBadge = (status: Post['status']) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      review: 'bg-blue-100 text-blue-800'
    };
    
    const labels = {
      published: 'Đã đăng',
      draft: 'Bản nháp',
      review: 'Đang review'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý bài viết</h1>
          <p className="text-gray-600">
            Quản lý toàn bộ nội dung tin tức, cẩm nang và bài viết của website
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex gap-3">
          <Link
            href="/admin/posts/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Tạo bài viết mới
          </Link>
          
          <Link
            href="/admin/posts/ai-assistant"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaStar />
            AI Assistant
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng bài viết</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaNewspaper className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã đăng</p>
              <p className="text-2xl font-bold text-green-600">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FaEye className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bản nháp</p>
              <p className="text-2xl font-bold text-yellow-600">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaEyeSlash className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang review</p>
              <p className="text-2xl font-bold text-blue-600">
                {posts.filter(p => p.status === 'review').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaFilter className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng lượt đọc</p>
              <p className="text-2xl font-bold text-purple-600">
                {posts.reduce((total, p) => total + p.views, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaEye className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaSearch className="inline mr-2" />
              Tìm kiếm
            </label>
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, nội dung, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả</option>
              <option value="published">Đã đăng</option>
              <option value="draft">Bản nháp</option>
              <option value="review">Đang review</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tác giả
            </label>
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {authors.map(author => (
                <option key={author.value} value={author.value}>
                  {author.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-blue-900">
              Đã chọn {selectedPosts.length} bài viết
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Đăng
              </button>
              <button
                onClick={() => handleBulkAction('draft')}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
              >
                Nháp
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center">
          <input
            type="checkbox"
            checked={selectedPosts.length === paginatedPosts.length && paginatedPosts.length > 0}
            onChange={toggleSelectAll}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-4"
          />
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách bài viết ({filteredPosts.length})
          </h3>
        </div>

        {/* Posts Table/Grid */}
        <div className="divide-y divide-gray-200">
          {paginatedPosts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPosts([...selectedPosts, post.id]);
                    } else {
                      setSelectedPosts(selectedPosts.filter(id => id !== post.id));
                    }
                  }}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 mt-1"
                />

                {/* Image */}
                <div className="w-24 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  {post.image ? (
                    <Image src={post.image} alt={post.title} width={96} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-red-600 cursor-pointer">
                        {post.title}
                        {post.featured && (
                          <FaStar className="inline ml-2 text-yellow-500" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaUser />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendar />
                          {new Date(post.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEye />
                          {post.views.toLocaleString()} lượt đọc
                        </span>
                        <span>{post.readTime} phút đọc</span>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2 mt-2">
                        <FaTags className="text-gray-400 text-xs" />
                        {post.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-2 ml-4">
                      {getStatusBadge(post.status)}
                      
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Link>
                        
                        <button
                          onClick={() => handleStatusToggle(post.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title={post.status === 'published' ? 'Chuyển về nháp' : 'Đăng bài'}
                        >
                          {post.status === 'published' ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Category Badge */}
                      <div className="text-xs">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          {categories.find(c => c.value === post.category)?.icon} {categories.find(c => c.value === post.category)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FaNewspaper className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào</p>
            <p className="text-sm text-gray-400 mt-1">
              Thử thay đổi bộ lọc hoặc tạo bài viết mới
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPosts.length)} của {filteredPosts.length} kết quả
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === i + 1
                      ? 'bg-red-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 