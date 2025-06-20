'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaUser, FaUsers,
  FaShieldAlt, FaCrown, FaUserTie, FaUserCheck, FaUserTimes, FaClock,
  FaHistory, FaKey, FaEnvelope, FaPhone, FaCalendar, FaSave, FaBan
} from 'react-icons/fa'
import AdminHeader from '../../../components/admin/AdminHeader'

interface User {
  id: string
  username: string
  email: string
  fullName: string
  phone?: string
  avatar?: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'banned'
  lastLogin: string
  createdAt: string
  createdBy: string
  permissions: string[]
  loginAttempts: number
  emailVerified: boolean
  twoFactorEnabled: boolean
}

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: string[]
  userCount: number
  color: string
}

interface Activity {
  id: string
  userId: string
  username: string
  action: string
  target: string
  timestamp: string
  ip: string
  userAgent: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin_tbs',
      email: 'admin@tbsgroup.vn',
      fullName: 'Admin TBS GROUP',
      phone: '0123456789',
      avatar: '/images/avatar-admin.jpg',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-12-20T10:30:00',
      createdAt: '2024-01-01',
      createdBy: 'System',
      permissions: ['*'],
      loginAttempts: 0,
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: '2',
      username: 'editor_logistics',
      email: 'editor@tbsgroup.vn',
      fullName: 'Nguyễn Văn Logistics',
      phone: '0987654321',
      role: 'editor',
      status: 'active',
      lastLogin: '2024-12-19T16:45:00',
      createdAt: '2024-03-15',
      createdBy: 'admin_tbs',
      permissions: ['posts.create', 'posts.edit', 'services.edit', 'media.upload'],
      loginAttempts: 0,
      emailVerified: true,
      twoFactorEnabled: false
    },
    {
      id: '3',
      username: 'viewer_intern',
      email: 'intern@tbsgroup.vn',
      fullName: 'Trần Thị Thực tập',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-12-10T09:15:00',
      createdAt: '2024-11-01',
      createdBy: 'editor_logistics',
      permissions: ['dashboard.view', 'posts.view', 'services.view'],
      loginAttempts: 2,
      emailVerified: false,
      twoFactorEnabled: false
    }
  ])

  const [roles] = useState<Role[]>([
    {
      id: 'super_admin',
      name: 'super_admin',
      displayName: 'Super Admin',
      description: 'Toàn quyền hệ thống, không thể bị hạn chế',
      permissions: ['*'],
      userCount: 1,
      color: 'text-red-600 bg-red-100'
    },
    {
      id: 'admin',
      name: 'admin',
      displayName: 'Administrator',
      description: 'Quản trị viên, có thể quản lý hầu hết tính năng',
      permissions: ['users.manage', 'content.manage', 'settings.manage', 'analytics.view'],
      userCount: 2,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'editor',
      name: 'editor',
      displayName: 'Editor',
      description: 'Biên tập viên, quản lý nội dung và media',
      permissions: ['posts.manage', 'services.manage', 'media.manage', 'analytics.view'],
      userCount: 5,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'viewer',
      name: 'viewer',
      displayName: 'Viewer',
      description: 'Chỉ xem, không được chỉnh sửa',
      permissions: ['dashboard.view', 'posts.view', 'services.view'],
      userCount: 3,
      color: 'text-gray-600 bg-gray-100'
    }
  ])

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      userId: '1',
      username: 'admin_tbs',
      action: 'Đăng nhập hệ thống',
      target: 'Dashboard',
      timestamp: '2024-12-20T10:30:00',
      ip: '192.168.1.100',
      userAgent: 'Chrome 120.0'
    },
    {
      id: '2',
      userId: '2',
      username: 'editor_logistics',
      action: 'Tạo bài viết mới',
      target: 'Post: "Quy trình nhập khẩu mới 2024"',
      timestamp: '2024-12-19T16:45:00',
      ip: '192.168.1.101',
      userAgent: 'Firefox 121.0'
    },
    {
      id: '3',
      userId: '1',
      username: 'admin_tbs',
      action: 'Cập nhật thông tin dịch vụ',
      target: 'Service: "Nhập khẩu chính ngạch"',
      timestamp: '2024-12-19T14:20:00',
      ip: '192.168.1.100',
      userAgent: 'Chrome 120.0'
    }
  ])

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'activities'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    role: 'viewer' as User['role'],
    password: '',
    confirmPassword: ''
  })

  const getRoleInfo = (roleName: User['role']) => {
    return roles.find(r => r.name === roleName) || roles[3]
  }

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'super_admin': return <FaCrown className="text-red-600" />
      case 'admin': return <FaShieldAlt className="text-purple-600" />
      case 'editor': return <FaUserTie className="text-blue-600" />
      case 'viewer': return <FaUser className="text-gray-600" />
      default: return <FaUser className="text-gray-600" />
    }
  }

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">✅ Hoạt động</span>
      case 'inactive':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">⏸️ Tạm dừng</span>
      case 'banned':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">🚫 Bị khóa</span>
      default:
        return null
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'delete') => {
    if (!selectedUsers.length) return
    
    const confirmMessage = {
      activate: `Kích hoạt ${selectedUsers.length} tài khoản đã chọn?`,
      deactivate: `Tạm dừng ${selectedUsers.length} tài khoản đã chọn?`,
      delete: `XÓA VĨNH VIỄN ${selectedUsers.length} tài khoản đã chọn? Hành động này không thể hoàn tác!`
    }

    if (confirm(confirmMessage[action])) {
      if (action === 'delete') {
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
      } else {
        const newStatus = action === 'activate' ? 'active' : 'inactive'
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) 
            ? { ...user, status: newStatus as User['status'] }
            : user
        ))
      }
      setSelectedUsers([])
    }
  }

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.email || !newUser.fullName || !newUser.password) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp')
      return
    }

    if (users.some(u => u.username === newUser.username)) {
      alert('Tên đăng nhập đã tồn tại')
      return
    }

    if (users.some(u => u.email === newUser.email)) {
      alert('Email đã được sử dụng')
      return
    }

    const roleInfo = getRoleInfo(newUser.role)
    const createdUser: User = {
      id: Date.now().toString(),
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      phone: newUser.phone,
      role: newUser.role,
      status: 'active',
      lastLogin: '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'admin_tbs',
      permissions: roleInfo.permissions,
      loginAttempts: 0,
      emailVerified: false,
      twoFactorEnabled: false
    }

    setUsers(prev => [createdUser, ...prev])
    setNewUser({
      username: '',
      email: '',
      fullName: '',
      phone: '',
      role: 'viewer',
      password: '',
      confirmPassword: ''
    })
    setShowCreateModal(false)
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length,
    recentLogins: users.filter(u => {
      if (!u.lastLogin) return false
      const loginDate = new Date(u.lastLogin)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return loginDate > weekAgo
    }).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Quản lý người dùng" 
        subtitle="Quản lý tài khoản, phân quyền và theo dõi hoạt động của người dùng"
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <FaUserCheck className="text-green-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quản trị viên</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <FaShieldAlt className="text-purple-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đăng nhập gần đây</p>
                <p className="text-2xl font-bold text-orange-600">{stats.recentLogins}</p>
              </div>
              <FaClock className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'users', label: 'Người dùng', icon: FaUsers, count: users.length },
                { id: 'roles', label: 'Nhóm quyền', icon: FaShieldAlt, count: roles.length },
                { id: 'activities', label: 'Nhật ký hoạt động', icon: FaHistory, count: activities.length }
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
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="p-6">
              {/* Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {selectedUsers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Đã chọn {selectedUsers.length} người dùng
                      </span>
                      <button
                        onClick={() => handleBulkAction('activate')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        <FaUserCheck className="inline mr-1" />
                        Kích hoạt
                      </button>
                      <button
                        onClick={() => handleBulkAction('deactivate')}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      >
                        <FaUserTimes className="inline mr-1" />
                        Tạm dừng
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete')}
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
                  Thêm người dùng
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm người dùng..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">Tất cả vai trò</option>
                  {roles.map(role => (
                    <option key={role.name} value={role.name}>{role.displayName}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                  <option value="banned">Bị khóa</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(filteredUsers.map(u => u.id))
                              } else {
                                setSelectedUsers([])
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="text-left p-4 font-medium text-gray-900">Người dùng</th>
                        <th className="text-left p-4 font-medium text-gray-900">Vai trò</th>
                        <th className="text-left p-4 font-medium text-gray-900">Trạng thái</th>
                        <th className="text-left p-4 font-medium text-gray-900">Đăng nhập cuối</th>
                        <th className="text-left p-4 font-medium text-gray-900">Bảo mật</th>
                        <th className="text-left p-4 font-medium text-gray-900">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => {
                        const roleInfo = getRoleInfo(user.role)
                        
                        return (
                          <tr key={user.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-4">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                  {user.avatar ? (
                                    <Image src={user.avatar} alt={user.fullName} width={40} height={40} className="w-full h-full object-cover" />
                                  ) : (
                                    <FaUser className="text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{user.fullName}</p>
                                  <p className="text-sm text-gray-500">@{user.username}</p>
                                  <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getRoleIcon(user.role)}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                                  {roleInfo.displayName}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              {getStatusBadge(user.status)}
                              {user.loginAttempts > 0 && (
                                <div className="text-xs text-red-600 mt-1">
                                  {user.loginAttempts} lần thử đăng nhập thất bại
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {user.lastLogin ? formatDateTime(user.lastLogin) : 'Chưa đăng nhập'}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-xs">
                                {user.emailVerified ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">✓ Email</span>
                                ) : (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded">✗ Email</span>
                                )}
                                {user.twoFactorEnabled ? (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">🔐 2FA</span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded">🔓 2FA</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingUser(user)}
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Chỉnh sửa"
                                >
                                  <FaEdit />
                                </button>
                                
                                <button
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                                  title="Xem chi tiết"
                                >
                                  <FaEye />
                                </button>
                                
                                <button
                                  className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded"
                                  title="Đặt lại mật khẩu"
                                >
                                  <FaKey />
                                </button>
                                
                                {user.role !== 'super_admin' && (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Bạn có chắc muốn xóa tài khoản ${user.username}?`)) {
                                        setUsers(prev => prev.filter(u => u.id !== user.id))
                                      }
                                    }}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Xóa"
                                  >
                                    <FaTrash />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nhóm quyền hệ thống</h3>
                <p className="text-gray-600">Quản lý các vai trò và quyền hạn trong hệ thống.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map(role => (
                  <div key={role.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(role.name as User['role'])}
                        <div>
                          <h4 className="font-semibold text-gray-900">{role.displayName}</h4>
                          <p className="text-sm text-gray-500">{role.userCount} người dùng</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${role.color}`}>
                        {role.name}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{role.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Quyền hạn:</h5>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.slice(0, 4).map(permission => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {permission === '*' ? 'Toàn quyền' : permission}
                          </span>
                        ))}
                        {role.permissions.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{role.permissions.length - 4} quyền khác
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        <FaEdit className="inline mr-1" />
                        Chỉnh sửa
                      </button>
                      
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                        <FaEye className="inline mr-1" />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nhật ký hoạt động</h3>
                <p className="text-gray-600">Theo dõi các hoạt động của người dùng trong hệ thống.</p>
              </div>

              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUser className="text-blue-600 text-sm" />
                        </div>
                        <div>
                          <p className="text-gray-900">
                            <span className="font-medium">{activity.username}</span> {activity.action}
                          </p>
                          {activity.target && (
                            <p className="text-sm text-gray-600 mt-1">
                              Mục tiêu: {activity.target}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span>⏰ {formatDateTime(activity.timestamp)}</span>
                            <span>🌐 {activity.ip}</span>
                            <span>💻 {activity.userAgent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Thêm người dùng mới</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập *
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="user@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="0123456789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò *
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {roles.filter(r => r.name !== 'super_admin').map(role => (
                        <option key={role.name} value={role.name}>{role.displayName}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Mật khẩu mạnh"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu *
                    </label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Nhập lại mật khẩu"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  
                  <button
                    onClick={handleCreateUser}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <FaSave />
                    Tạo tài khoản
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