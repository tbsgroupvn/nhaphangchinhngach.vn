'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdminHeader from '../../../components/admin/AdminHeader'
import { services } from '../../../data/services'

interface Service {
  id: string
  title: string
  slug: string
  category: string
  status: 'published' | 'draft'
  icon: string
  description: string
  updatedAt: string
  author: string
}

export default function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Convert services data to management format
  const servicesData: Service[] = services.map((service, index) => ({
    id: `service_${index + 1}`,
    title: service.title,
    slug: service.slug,
    category: service.category,
    status: 'published' as const,
    icon: service.icon,
    description: service.description,
    updatedAt: '2025-01-15',
    author: 'admin'
  }))

  const [servicesList, setServicesList] = useState(servicesData)

  const filteredServices = servicesList.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const toggleStatus = (id: string) => {
    setServicesList(prev => prev.map(service => 
      service.id === id 
        ? { ...service, status: service.status === 'published' ? 'draft' : 'published' }
        : service
    ))
  }

  const deleteService = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
      setServicesList(prev => prev.filter(service => service.id !== id))
    }
  }

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'import', label: 'Nhập khẩu' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'consulting', label: 'Tư vấn' },
    { value: 'support', label: 'Hỗ trợ' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Quản lý dịch vụ" 
        subtitle={`${servicesList.length} dịch vụ • ${filteredServices.length} hiển thị`}
      >
        <Link
          href="/admin/services/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <span className="mr-2">➕</span>
          Thêm dịch vụ mới
        </Link>
      </AdminHeader>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Tìm kiếm
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên hoặc mô tả..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Trạng thái
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📂 Danh mục
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
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
                  setSearchTerm('')
                  setFilterStatus('all')
                  setFilterCategory('all')
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                🔄 Đặt lại
              </button>
            </div>
          </div>
        </div>

        {/* Services Table */}
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
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cập nhật
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-lg">{service.icon}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {service.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(service.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          service.status === 'published'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {service.status === 'published' ? (
                          <>
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            Đã xuất bản
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                            Bản nháp
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{service.updatedAt}</div>
                      <div className="text-xs">bởi {service.author}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/services/edit/${service.id}`}
                          className="text-primary-600 hover:text-primary-700 p-1 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </Link>
                        <Link
                          href={`/dich-vu/${service.slug}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                          title="Xem trước"
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                          title="Xóa"
                        >
                          🗑️
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

        {/* Bulk Actions */}
        {filteredServices.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị {filteredServices.length} trên {servicesList.length} dịch vụ
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