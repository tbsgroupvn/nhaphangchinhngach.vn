'use client'

import { useState } from 'react'
import { 
  FaPlus, FaEdit, FaTrash, FaShieldAlt, FaCrown, FaUserTie, FaUser,
  FaCheck, FaTimes, FaSave, FaCopy, FaSearch, FaUsers
} from 'react-icons/fa'
import AdminHeader from '../../../components/admin/AdminHeader'

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: string[]
  userCount: number
  isDefault: boolean
  isSystem: boolean
  color: string
  createdAt: string
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'super_admin',
      name: 'super_admin',
      displayName: 'Super Administrator',
      description: 'Toan quyen he thong, khong the bi han che',
      permissions: ['*'],
      userCount: 1,
      isDefault: false,
      isSystem: true,
      color: 'bg-red-100 text-red-800',
      createdAt: '2024-01-01'
    },
    {
      id: 'admin',
      name: 'admin',
      displayName: 'Administrator',
      description: 'Quan tri vien voi quyen quan ly hau het tinh nang',
      permissions: ['users.manage', 'content.manage', 'settings.manage'],
      userCount: 2,
      isDefault: false,
      isSystem: false,
      color: 'bg-purple-100 text-purple-800',
      createdAt: '2024-01-01'
    },
    {
      id: 'editor',
      name: 'editor',
      displayName: 'Editor',
      description: 'Bien tap vien quan ly noi dung va media',
      permissions: ['posts.manage', 'services.manage', 'media.manage'],
      userCount: 5,
      isDefault: true,
      isSystem: false,
      color: 'bg-blue-100 text-blue-800',
      createdAt: '2024-01-01'
    },
    {
      id: 'viewer',
      name: 'viewer',
      displayName: 'Viewer',
      description: 'Chi duoc xem, khong co quyen chinh sua',
      permissions: ['dashboard.view', 'posts.view', 'services.view'],
      userCount: 3,
      isDefault: false,
      isSystem: false,
      color: 'bg-gray-100 text-gray-800',
      createdAt: '2024-01-01'
    }
  ])

  const [searchQuery, setSearchQuery] = useState('')

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'super_admin': return <FaCrown className="text-red-600" />
      case 'admin': return <FaShieldAlt className="text-purple-600" />
      case 'editor': return <FaUserTie className="text-blue-600" />
      case 'viewer': return <FaUser className="text-gray-600" />
      default: return <FaUser className="text-gray-600" />
    }
  }

  const filteredRoles = roles.filter(role => 
    role.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Quan ly vai tro" 
        subtitle="Tao va quan ly cac vai tro va quyen han trong he thong"
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tong vai tro</p>
                <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
              </div>
              <FaShieldAlt className="text-blue-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vai tro tuy chinh</p>
                <p className="text-2xl font-bold text-green-600">{roles.filter(r => !r.isSystem).length}</p>
              </div>
              <FaUserTie className="text-green-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tong quyen han</p>
                <p className="text-2xl font-bold text-purple-600">25</p>
              </div>
              <FaCheck className="text-purple-600 text-xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nguoi dung</p>
                <p className="text-2xl font-bold text-orange-600">{roles.reduce((sum, r) => sum + r.userCount, 0)}</p>
              </div>
              <FaUsers className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tim kiem vai tro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
            <FaPlus />
            Tao vai tro moi
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRoles.map(role => (
            <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getRoleIcon(role.name)}
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {role.displayName}
                      {role.isSystem && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          He thong
                        </span>
                      )}
                      {role.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                          Mac dinh
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500">{role.userCount} nguoi dung</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                  {role.name}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{role.description}</p>
              
              {/* Permissions Preview */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quyen han:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.includes('*') ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      Toan quyen
                    </span>
                  ) : (
                    <>
                      {role.permissions.slice(0, 3).map(permission => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                        >
                          {permission}
                        </span>
                      ))}
                      {role.permissions.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{role.permissions.length - 3} quyen khac
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center gap-2">
                  <FaEdit />
                  Chinh sua
                </button>
                
                <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm" title="Nhan ban">
                  <FaCopy />
                </button>
                
                {!role.isSystem && (
                  <button className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm" title="Xoa">
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 