'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaBell, 
  FaCalendar, FaUsers, FaChartLine, FaPause, FaPlay,
  FaClock, FaTarget, FaMobile, FaDesktop, FaFilter
} from 'react-icons/fa';

interface Popup {
  id: string;
  title: string;
  type: 'modal' | 'banner' | 'toast' | 'slider';
  content: string;
  status: 'active' | 'paused' | 'scheduled' | 'expired';
  priority: 'low' | 'medium' | 'high';
  targetPages: string[];
  targetDevices: ('desktop' | 'mobile' | 'tablet')[];
  startDate: string;
  endDate?: string;
  showDelay: number; // seconds
  frequency: 'once' | 'session' | 'daily' | 'always';
  maxDisplays?: number;
  triggers: {
    pageLoad?: boolean;
    exitIntent?: boolean;
    scrollPercent?: number;
    timeOnPage?: number;
  };
  analytics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    conversionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PopupsPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'scheduled' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'modal' | 'banner' | 'toast' | 'slider'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortField, setSortField] = useState<keyof Popup>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - Replace with real API calls
  useEffect(() => {
    setTimeout(() => {
      setPopups([
        {
          id: '1',
          title: 'Chào mừng khách hàng mới',
          type: 'modal',
          content: 'Giảm 10% cho đơn hàng đầu tiên! Mã: WELCOME10',
          status: 'active',
          priority: 'high',
          targetPages: ['/', '/dich-vu'],
          targetDevices: ['desktop', 'mobile'],
          startDate: '2024-12-01',
          endDate: '2024-12-31',
          showDelay: 3,
          frequency: 'once',
          maxDisplays: 1,
          triggers: {
            pageLoad: true,
            exitIntent: false,
            timeOnPage: 5
          },
          analytics: {
            impressions: 1250,
            clicks: 85,
            conversions: 12,
            ctr: 6.8,
            conversionRate: 14.1
          },
          createdAt: '2024-12-01',
          updatedAt: '2024-12-20'
        },
        {
          id: '2',
          title: 'Ưu đãi Tết 2024',
          type: 'banner',
          content: 'Miễn phí vận chuyển cho tất cả đơn hàng trong tháng 1',
          status: 'scheduled',
          priority: 'high',
          targetPages: ['*'],
          targetDevices: ['desktop', 'mobile', 'tablet'],
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          showDelay: 0,
          frequency: 'session',
          triggers: {
            pageLoad: true
          },
          analytics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            conversionRate: 0
          },
          createdAt: '2024-12-15',
          updatedAt: '2024-12-20'
        },
        {
          id: '3',
          title: 'Newsletter Subscription',
          type: 'toast',
          content: 'Đăng ký nhận tin tức về xu hướng xuất nhập khẩu mới nhất',
          status: 'active',
          priority: 'medium',
          targetPages: ['/tin-tuc', '/tin-tuc/*'],
          targetDevices: ['desktop', 'mobile'],
          startDate: '2024-11-01',
          showDelay: 10,
          frequency: 'daily',
          triggers: {
            scrollPercent: 50,
            timeOnPage: 30
          },
          analytics: {
            impressions: 892,
            clicks: 124,
            conversions: 45,
            ctr: 13.9,
            conversionRate: 36.3
          },
          createdAt: '2024-11-01',
          updatedAt: '2024-12-18'
        },
        {
          id: '4',
          title: 'Tư vấn miễn phí',
          type: 'slider',
          content: 'Nhận tư vấn miễn phí từ chuyên gia TBS GROUP',
          status: 'paused',
          priority: 'medium',
          targetPages: ['/dich-vu/*'],
          targetDevices: ['desktop'],
          startDate: '2024-10-01',
          showDelay: 0,
          frequency: 'always',
          triggers: {
            exitIntent: true
          },
          analytics: {
            impressions: 456,
            clicks: 78,
            conversions: 23,
            ctr: 17.1,
            conversionRate: 29.5
          },
          createdAt: '2024-10-01',
          updatedAt: '2024-12-10'
        },
        {
          id: '5',
          title: 'Flash Sale - Giảm 20%',
          type: 'modal',
          content: 'Ưu đãi có thời hạn! Giảm 20% phí dịch vụ trong 24h',
          status: 'expired',
          priority: 'high',
          targetPages: ['*'],
          targetDevices: ['desktop', 'mobile'],
          startDate: '2024-12-15',
          endDate: '2024-12-16',
          showDelay: 1,
          frequency: 'once',
          maxDisplays: 1,
          triggers: {
            pageLoad: true
          },
          analytics: {
            impressions: 2340,
            clicks: 187,
            conversions: 34,
            ctr: 8.0,
            conversionRate: 18.2
          },
          createdAt: '2024-12-14',
          updatedAt: '2024-12-16'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort popups
  const filteredPopups = popups
    .filter(popup => {
      const matchesSearch = popup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           popup.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || popup.status === statusFilter;
      const matchesType = typeFilter === 'all' || popup.type === typeFilter;
      const matchesPriority = priorityFilter === 'all' || popup.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
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
  const totalPages = Math.ceil(filteredPopups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPopups = filteredPopups.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusToggle = (id: string) => {
    setPopups(prev => prev.map(popup => 
      popup.id === id 
        ? { 
            ...popup, 
            status: popup.status === 'active' ? 'paused' : 'active',
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : popup
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa popup này?')) {
      setPopups(prev => prev.filter(popup => popup.id !== id));
    }
  };

  const getStatusBadge = (status: Popup['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-blue-100 text-blue-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      active: 'Đang chạy',
      paused: 'Tạm dừng',
      scheduled: 'Đã lên lịch',
      expired: 'Hết hạn'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority: Popup['priority']) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const getTypeIcon = (type: Popup['type']) => {
    const icons = {
      modal: '🪟',
      banner: '📢',
      toast: '💬',
      slider: '📱'
    };
    return icons[type];
  };

  const getTotalStats = () => {
    return popups.reduce((acc, popup) => ({
      impressions: acc.impressions + popup.analytics.impressions,
      clicks: acc.clicks + popup.analytics.clicks,
      conversions: acc.conversions + popup.analytics.conversions
    }), { impressions: 0, clicks: 0, conversions: 0 });
  };

  const totalStats = getTotalStats();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Popup & Thông báo</h1>
          <p className="text-gray-600">
            Tạo và quản lý popup, banner, thông báo để tăng tương tác khách hàng
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex gap-3">
          <Link
            href="/admin/popups/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Tạo popup mới
          </Link>
          
          <Link
            href="/admin/popups/templates"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaBell />
            Mẫu có sẵn
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng popup</p>
              <p className="text-2xl font-bold text-gray-900">{popups.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBell className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang chạy</p>
              <p className="text-2xl font-bold text-green-600">
                {popups.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FaPlay className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lượt hiển thị</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalStats.impressions.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaEye className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lượt click</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalStats.clicks.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaTarget className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chuyển đổi</p>
              <p className="text-2xl font-bold text-orange-600">
                {totalStats.conversions.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Tìm kiếm popup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang chạy</option>
              <option value="paused">Tạm dừng</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả loại</option>
              <option value="modal">Modal</option>
              <option value="banner">Banner</option>
              <option value="toast">Toast</option>
              <option value="slider">Slider</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
                setPriorityFilter('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <FaFilter className="inline mr-2" />
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Popups Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Danh sách popup ({filteredPopups.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Popup
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại & Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lịch trình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hiệu suất
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thiết bị
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPopups.map((popup) => (
                <tr key={popup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="text-2xl mr-3">
                        {getTypeIcon(popup.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {popup.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {popup.content}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {getPriorityBadge(popup.priority)}
                          <span className="text-xs text-gray-500">
                            {popup.targetPages.includes('*') ? 'Tất cả trang' : `${popup.targetPages.length} trang`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {getStatusBadge(popup.status)}
                      <div className="text-xs text-gray-500 capitalize">
                        {popup.type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaCalendar className="text-xs" />
                        {new Date(popup.startDate).toLocaleDateString('vi-VN')}
                      </div>
                      {popup.endDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          đến {new Date(popup.endDate).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <FaClock />
                        Delay: {popup.showDelay}s
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hiển thị:</span>
                        <span className="font-medium">
                          {popup.analytics.impressions.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Click:</span>
                        <span className="font-medium">
                          {popup.analytics.clicks.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CTR:</span>
                        <span className="font-medium text-blue-600">
                          {popup.analytics.ctr}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {popup.targetDevices.includes('desktop') && (
                        <FaDesktop className="text-gray-400" title="Desktop" />
                      )}
                      {popup.targetDevices.includes('mobile') && (
                        <FaMobile className="text-gray-400" title="Mobile" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/popups/${popup.id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </Link>
                      
                      <button
                        onClick={() => handleStatusToggle(popup.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          popup.status === 'active'
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={popup.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                      >
                        {popup.status === 'active' ? <FaPause /> : <FaPlay />}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(popup.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Empty State */}
        {filteredPopups.length === 0 && (
          <div className="text-center py-12">
            <FaBell className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy popup nào</p>
            <p className="text-sm text-gray-400 mt-1">
              Thử thay đổi bộ lọc hoặc tạo popup mới
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPopups.length)} của {filteredPopups.length} kết quả
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