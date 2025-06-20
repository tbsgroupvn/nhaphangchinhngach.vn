'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaClock, FaCheck, FaExclamationTriangle,
  FaFileAlt, FaShieldAlt, FaTruck, FaUndo, FaGavel, FaCookie, FaSearch,
  FaFilter, FaSave, FaHistory, FaUser, FaCalendar
} from 'react-icons/fa'
import AdminHeader from '../../../components/admin/AdminHeader'

interface Policy {
  id: string
  title: string
  slug: string
  type: 'terms' | 'privacy' | 'shipping' | 'return' | 'cookie' | 'other'
  content: string
  version: string
  status: 'draft' | 'active' | 'archived'
  lastModified: string
  modifiedBy: string
  effectiveDate: string
  views: number
  approvedBy?: string
  approvedDate?: string
  template: boolean
}

interface PolicyTemplate {
  id: string
  name: string
  type: Policy['type']
  content: string
  variables: string[]
}

export default function PoliciesPage() {
  const router = useRouter()
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: '1',
      title: 'Điều khoản sử dụng dịch vụ',
      slug: 'dieu-khoan-su-dung',
      type: 'terms',
      content: 'Điều khoản sử dụng dịch vụ xuất nhập khẩu của TBS GROUP...',
      version: '2.1',
      status: 'active',
      lastModified: '2024-12-15',
      modifiedBy: 'Admin TBS',
      effectiveDate: '2024-12-20',
      views: 1250,
      approvedBy: 'Giám đốc',
      approvedDate: '2024-12-16',
      template: false
    },
    {
      id: '2',
      title: 'Chính sách bảo mật thông tin',
      slug: 'chinh-sach-bao-mat',
      type: 'privacy',
      content: 'Chính sách bảo mật và xử lý dữ liệu cá nhân khách hàng...',
      version: '1.5',
      status: 'active',
      lastModified: '2024-12-10',
      modifiedBy: 'Admin TBS',
      effectiveDate: '2024-12-12',
      views: 890,
      approvedBy: 'Trưởng phòng Pháp chế',
      approvedDate: '2024-12-11',
      template: false
    },
    {
      id: '3',
      title: 'Chính sách vận chuyển',
      slug: 'chinh-sach-van-chuyen',
      type: 'shipping',
      content: 'Quy định về vận chuyển hàng hóa xuất nhập khẩu...',
      version: '3.0',
      status: 'draft',
      lastModified: '2024-12-18',
      modifiedBy: 'Phòng Logistics',
      effectiveDate: '2025-01-01',
      views: 0,
      template: false
    }
  ])

  const [templates] = useState<PolicyTemplate[]>([
    {
      id: 't1',
      name: 'Mẫu điều khoản dịch vụ logistics',
      type: 'terms',
      content: 'Mẫu chuẩn cho điều khoản sử dụng dịch vụ logistics...',
      variables: ['COMPANY_NAME', 'SERVICE_NAME', 'EFFECTIVE_DATE']
    },
    {
      id: 't2',
      name: 'Mẫu chính sách bảo mật GDPR',
      type: 'privacy',
      content: 'Mẫu chính sách bảo mật tuân thủ GDPR...',
      variables: ['COMPANY_NAME', 'CONTACT_EMAIL', 'DPO_NAME']
    }
  ])

  const [activeTab, setActiveTab] = useState<'policies' | 'templates'>('policies')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)

  const policyTypes = [
    { value: 'terms', label: 'Điều khoản sử dụng', icon: FaGavel, color: 'text-blue-600' },
    { value: 'privacy', label: 'Chính sách bảo mật', icon: FaShieldAlt, color: 'text-green-600' },
    { value: 'shipping', label: 'Chính sách vận chuyển', icon: FaTruck, color: 'text-purple-600' },
    { value: 'return', label: 'Chính sách đổi trả', icon: FaUndo, color: 'text-orange-600' },
    { value: 'cookie', label: 'Chính sách Cookie', icon: FaCookie, color: 'text-yellow-600' },
    { value: 'other', label: 'Khác', icon: FaFileAlt, color: 'text-gray-600' }
  ]

  const getTypeInfo = (type: Policy['type']) => {
    return policyTypes.find(t => t.value === type) || policyTypes[5]
  }

  const getStatusBadge = (status: Policy['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">✅ Đang áp dụng</span>
      case 'draft':  
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">📝 Bản nháp</span>
      case 'archived':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">📦 Lưu trữ</span>
      default:
        return null
    }
  }

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || policy.type === typeFilter
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSelectPolicy = (policyId: string) => {
    setSelectedPolicies(prev => 
      prev.includes(policyId) 
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    )
  }

  const handleDeleteSelected = () => {
    if (confirm(`Bạn có chắc muốn xóa ${selectedPolicies.length} chính sách đã chọn?`)) {
      setPolicies(prev => prev.filter(policy => !selectedPolicies.includes(policy.id)))
      setSelectedPolicies([])
    }
  }

  const handleChangeStatus = (policyId: string, newStatus: Policy['status']) => {
    setPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
        : policy
    ))
  }

  const handleCreateFromTemplate = (template: PolicyTemplate) => {
    const newPolicy: Policy = {
      id: Date.now().toString(),
      title: `${template.name} - Bản sao`,
      slug: template.name.toLowerCase().replace(/\s+/g, '-'),
      type: template.type,
      content: template.content,
      version: '1.0',
      status: 'draft',
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: 'Admin TBS',
      effectiveDate: '',
      views: 0,
      template: false
    }
    
    setPolicies(prev => [newPolicy, ...prev])
    setEditingPolicy(newPolicy)
  }

  const stats = {
    total: policies.length,
    active: policies.filter(p => p.status === 'active').length,
    draft: policies.filter(p => p.status === 'draft').length,
    totalViews: policies.reduce((sum, p) => sum + p.views, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Quản lý chính sách" 
        subtitle="Tạo, chỉnh sửa và quản lý các chính sách, điều khoản của website"
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng chính sách</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang áp dụng</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <FaCheck className="text-green-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bản nháp</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <FaClock className="text-yellow-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lượt xem</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
              </div>
              <FaEye className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'policies', label: 'Chính sách', icon: FaFileAlt },
                { id: 'templates', label: 'Mẫu có sẵn', icon: FaHistory }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === 'policies' && (
            <div className="p-6">
              {/* Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {selectedPolicies.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Đã chọn {selectedPolicies.length} chính sách
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

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <FaPlus />
                  Tạo chính sách mới
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm chính sách..."
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
                  {policyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang áp dụng</option>
                  <option value="draft">Bản nháp</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>

              {/* Policies List */}
              <div className="space-y-4">
                {filteredPolicies.map(policy => {
                  const typeInfo = getTypeInfo(policy.type)
                  
                  return (
                    <div
                      key={policy.id}
                      className={`bg-gray-50 rounded-lg border-2 p-6 transition-all ${
                        selectedPolicies.includes(policy.id) ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedPolicies.includes(policy.id)}
                            onChange={() => handleSelectPolicy(policy.id)}
                            className="mt-1 rounded border-gray-300"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <typeInfo.icon className={`text-lg ${typeInfo.color}`} />
                              <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                              {getStatusBadge(policy.status)}
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                v{policy.version}
                              </span>
                            </div>
                            
                            <p className="text-gray-600 mb-3 line-clamp-2">{policy.content}</p>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <FaUser />
                                <span>Sửa bởi: {policy.modifiedBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaCalendar />
                                <span>Ngày sửa: {policy.lastModified}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FaEye />
                                <span>{policy.views.toLocaleString()} lượt xem</span>
                              </div>
                              {policy.effectiveDate && (
                                <div className="flex items-center gap-1">
                                  <FaClock />
                                  <span>Hiệu lực: {policy.effectiveDate}</span>
                                </div>
                              )}
                            </div>
                            
                            {policy.approvedBy && (
                              <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-800">
                                ✅ Đã phê duyệt bởi {policy.approvedBy} vào {policy.approvedDate}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => window.open(`/chinh-sach/${policy.slug}`, '_blank')}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Xem trước"
                          >
                            <FaEye />
                          </button>
                          
                          <button
                            onClick={() => setEditingPolicy(policy)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          
                          <div className="relative group">
                            <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                              <FaClock />
                            </button>
                            
                            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-10 min-w-48">
                              {policy.status !== 'active' && (
                                <button
                                  onClick={() => handleChangeStatus(policy.id, 'active')}
                                  className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                >
                                  ✅ Kích hoạt
                                </button>
                              )}
                              {policy.status !== 'draft' && (
                                <button
                                  onClick={() => handleChangeStatus(policy.id, 'draft')}
                                  className="w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                                >
                                  📝 Chuyển về nháp
                                </button>
                              )}
                              {policy.status !== 'archived' && (
                                <button
                                  onClick={() => handleChangeStatus(policy.id, 'archived')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                >
                                  📦 Lưu trữ
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn xóa chính sách này?')) {
                                setPolicies(prev => prev.filter(p => p.id !== policy.id))
                              }
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Xóa"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredPolicies.length === 0 && (
                <div className="text-center py-12">
                  <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy chính sách</h3>
                  <p className="text-gray-500">Thử thay đổi bộ lọc tìm kiếm hoặc tạo chính sách mới.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mẫu chính sách có sẵn</h3>
                <p className="text-gray-600">Sử dụng các mẫu chuẩn để tạo chính sách nhanh chóng.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map(template => {
                  const typeInfo = getTypeInfo(template.type)
                  
                  return (
                    <div key={template.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <typeInfo.icon className={`text-xl ${typeInfo.color}`} />
                          <div>
                            <h4 className="font-semibold text-gray-900">{template.name}</h4>
                            <span className="text-sm text-gray-500">{typeInfo.label}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">{template.content}</p>
                      
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Biến có thể thay thế:</h5>
                        <div className="flex flex-wrap gap-2">
                          {template.variables.map(variable => (
                            <span
                              key={variable}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono"
                            >
                              {`{{${variable}}}`}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleCreateFromTemplate(template)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                      >
                        <FaPlus />
                        Sử dụng mẫu này
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Policy Editor Modal */}
        {editingPolicy && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chỉnh sửa: {editingPolicy.title}
                  </h3>
                  <button
                    onClick={() => setEditingPolicy(null)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề chính sách *
                    </label>
                    <input
                      type="text"
                      value={editingPolicy.title}
                      onChange={(e) => setEditingPolicy(prev => prev ? {...prev, title: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại chính sách *
                    </label>
                    <select
                      value={editingPolicy.type}
                      onChange={(e) => setEditingPolicy(prev => prev ? {...prev, type: e.target.value as Policy['type']} : null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {policyTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phiên bản
                    </label>
                    <input
                      type="text"
                      value={editingPolicy.version}
                      onChange={(e) => setEditingPolicy(prev => prev ? {...prev, version: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày hiệu lực
                    </label>
                    <input
                      type="date"
                      value={editingPolicy.effectiveDate}
                      onChange={(e) => setEditingPolicy(prev => prev ? {...prev, effectiveDate: e.target.value} : null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung chính sách *
                  </label>
                  <textarea
                    value={editingPolicy.content}
                    onChange={(e) => setEditingPolicy(prev => prev ? {...prev, content: e.target.value} : null)}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nhập nội dung chính sách chi tiết..."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingPolicy(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  
                  <button
                    onClick={() => {
                      // Save changes
                      setPolicies(prev => prev.map(p => 
                        p.id === editingPolicy.id ? editingPolicy : p
                      ))
                      setEditingPolicy(null)
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <FaSave />
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 