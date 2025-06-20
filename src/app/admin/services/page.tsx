'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaFilter, 
  FaSearch, FaSort, FaSortUp, FaSortDown, FaImage, FaCog
} from 'react-icons/fa'


interface Service {
  id: string
  title: string
  category: string
  status: 'active' | 'inactive'
  views: number
  createdAt: string
  updatedAt: string
  author: string
  image?: string
  price: string
  featured: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<keyof Service>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Mock data - Replace with real API calls
  useEffect(() => {
    setTimeout(() => {
      setServices([
        {
          id: '1',
          title: 'Dịch vụ nhập khẩu chính ngạch từ Trung Quốc',
          category: 'nhap-khau-chinh-ngach',
          status: 'active',
          views: 2840,
          createdAt: '2024-01-15',
          updatedAt: '2024-12-20',
          author: 'Admin TBS',
          image: '/images/service1.jpg',
          price: 'Liên hệ báo giá',
          featured: true
        },
        {
          id: '2',
          title: 'Vận chuyển đường biển từ Trung Quốc',
          category: 'van-chuyen-duong-bien',
          status: 'active',
          views: 1654,
          createdAt: '2024-02-10',
          updatedAt: '2024-12-18',
          author: 'Admin TBS',
          price: '50.000đ/kg',
          featured: false
        },
        {
          id: '3',
          title: 'Gom hàng lẻ FCL/LCL',
          category: 'gom-hang-le',
          status: 'active',
          views: 1205,
          createdAt: '2024-03-05',
          updatedAt: '2024-12-15',
          author: 'Admin TBS',
          price: '80.000đ/kg',
          featured: true
        },
        {
          id: '4',
          title: 'Thông quan hải quan nhanh chóng',
          category: 'thong-quan-hai-quan',
          status: 'inactive',
          views: 892,
          createdAt: '2024-01-20',
          updatedAt: '2024-11-30',
          author: 'Admin TBS',
          price: '2.000.000đ/lô',
          featured: false
        },
        {
          id: '5',
          title: 'Ủy thác xuất nhập khẩu',
          category: 'uy-thac-xnk',
          status: 'active',
          views: 756,
          createdAt: '2024-04-12',
          updatedAt: '2024-12-10',
          author: 'Admin TBS',
          price: '3% giá trị hàng',
          featured: false
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'nhap-khau-chinh-ngach', label: 'Nhập khẩu chính ngạch' },
    { value: 'van-chuyen-duong-bien', label: 'Vận chuyển đường biển' },
    { value: 'van-chuyen-duong-bo', label: 'Vận chuyển đường bộ' },
    { value: 'gom-hang-le', label: 'Gom hàng lẻ' },
    { value: 'thong-quan-hai-quan', label: 'Thông quan hải quan' },
    { value: 'uy-thac-xnk', label: 'Ủy thác xuất nhập khẩu' }
  ]

  // Filter and sort services
  const filteredServices = services
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || service.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      const aValue = a[sortField] as string | number
      const bValue = b[sortField] as string | number
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field: keyof Service) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleStatusToggle = (id: string) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
        : service
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      setServices(prev => prev.filter(service => service.id !== id))
    }
  }

  const getSortIcon = (field: keyof Service) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />
    return sortDirection === 'asc' ? <FaSortUp className="text-red-600" /> : <FaSortDown className="text-red-600" />
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý dịch vụ</h1>
          <p className="text-gray-600">
            Quản lý tất cả dịch vụ xuất nhập khẩu của TBS GROUP
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <Link
            href="/admin/services/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Thêm dịch vụ mới
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng dịch vụ</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCog className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">
                  {services.filter(s => s.status === 'active').length}
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
                <p className="text-sm text-gray-600">Tạm ẩn</p>
                <p className="text-2xl font-bold text-orange-600">
                  {services.filter(s => s.status === 'inactive').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaEyeSlash className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-purple-600">
                  {services.reduce((total, s) => total + s.views, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaEye className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Tìm kiếm
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên hoặc mô tả..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm ẩn</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Danh mục
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setCategoryFilter('all')
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                🔄 Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mr-4">
                          {service.image ? (
                            <img src={service.image} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <FaImage className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {service.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {service.price}
                          </div>
                          {service.featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                              Nổi bật
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {service.views.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{new Date(service.updatedAt).toLocaleDateString('vi-VN')}</div>
                      <div className="text-xs">bởi {service.author}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(service.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          service.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {service.status === 'active' ? (
                          <>
                            <FaEye className="mr-1" />
                            Hiển thị
                          </>
                        ) : (
                          <>
                            <FaEyeSlash className="mr-1" />
                            Ẩn
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(service.id)}
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
          
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">🔍</div>
              <p className="text-gray-500">Không tìm thấy dịch vụ nào</p>
              <p className="text-sm text-gray-400 mt-1">
                Thử thay đổi bộ lọc hoặc tạo dịch vụ mới
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 mt-6 bg-white rounded-lg border border-gray-200">
            <div className="text-sm text-gray-700">
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredServices.length)} của {filteredServices.length} kết quả
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

        {/* Bulk Actions */}
        {filteredServices.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Tổng cộng {services.length} dịch vụ
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm">
                📤 Xuất Excel
              </button>
              <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm">
                📋 Sao chép
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 