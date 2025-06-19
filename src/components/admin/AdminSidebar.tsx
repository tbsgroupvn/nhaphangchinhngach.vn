'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdmin } from './AdminProvider'

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAdmin()

  const menuItems = [
    {
      title: 'Tổng quan',
      icon: '📊',
      href: '/admin',
      exact: true
    },
    {
      title: 'Quản lý dịch vụ',
      icon: '🏢',
      href: '/admin/services',
      submenu: [
        { title: 'Danh sách dịch vụ', href: '/admin/services' },
        { title: 'Thêm dịch vụ mới', href: '/admin/services/new' },
        { title: 'Danh mục dịch vụ', href: '/admin/services/categories' }
      ]
    },
    {
      title: 'Quản lý tin tức',
      icon: '📰',
      href: '/admin/news',
      submenu: [
        { title: 'Tất cả bài viết', href: '/admin/news' },
        { title: 'Thêm bài viết', href: '/admin/news/new' },
        { title: 'Tin tức ngành', href: '/admin/news/industry' },
        { title: 'Tin nội bộ', href: '/admin/news/internal' },
        { title: 'Kiến thức XNK', href: '/admin/news/knowledge' },
        { title: 'Câu chuyện KH', href: '/admin/news/customer-stories' }
      ]
    },
    {
      title: 'Popup & Thông báo',
      icon: '🔔',
      href: '/admin/popups',
      submenu: [
        { title: 'Danh sách popup', href: '/admin/popups' },
        { title: 'Tạo popup mới', href: '/admin/popups/new' },
        { title: 'Lên lịch thông báo', href: '/admin/popups/schedule' }
      ]
    },
    {
      title: 'Quản lý chính sách',
      icon: '📜',
      href: '/admin/policies',
      submenu: [
        { title: 'Tất cả chính sách', href: '/admin/policies' },
        { title: 'Điều khoản sử dụng', href: '/admin/policies/terms' },
        { title: 'Chính sách vận chuyển', href: '/admin/policies/shipping' },
        { title: 'Chính sách đổi trả', href: '/admin/policies/return' },
        { title: 'Chính sách Cookie', href: '/admin/policies/cookie' }
      ]
    },
    {
      title: 'Quản lý media',
      icon: '🖼️',
      href: '/admin/media',
      submenu: [
        { title: 'Thư viện ảnh', href: '/admin/media/images' },
        { title: 'Tài liệu', href: '/admin/media/documents' },
        { title: 'Upload file', href: '/admin/media/upload' }
      ]
    },
    {
      title: 'Cài đặt giao diện',
      icon: '🎨',
      href: '/admin/settings',
      submenu: [
        { title: 'Thông tin công ty', href: '/admin/settings/company' },
        { title: 'Logo & Banner', href: '/admin/settings/branding' },
        { title: 'Liên hệ', href: '/admin/settings/contact' },
        { title: 'Social Media', href: '/admin/settings/social' }
      ]
    },
    {
      title: 'Thống kê & Analytics',
      icon: '📈',
      href: '/admin/analytics',
      submenu: [
        { title: 'Dashboard Analytics', href: '/admin/analytics' },
        { title: 'Google Analytics', href: 'https://analytics.google.com' },
        { title: 'Microsoft Clarity', href: 'https://clarity.microsoft.com' },
        { title: 'Search Console', href: 'https://search.google.com/console' }
      ]
    },
    {
      title: 'AI Content Assistant',
      icon: '🤖',
      href: '/admin/ai-assistant'
    },
    {
      title: 'Backup & Export',
      icon: '💾',
      href: '/admin/backup',
      submenu: [
        { title: 'Export dữ liệu', href: '/admin/backup/export' },
        { title: 'Import dữ liệu', href: '/admin/backup/import' },
        { title: 'Lịch sử backup', href: '/admin/backup/history' }
      ]
    }
  ]

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleSubmenu = (href: string) => {
    setExpandedMenus(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">TBS</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">TBS CMS</h1>
                <p className="text-xs text-gray-500">Hệ thống quản trị</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">{isCollapsed ? '▶️' : '◀️'}</span>
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-primary-600 font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item, index) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0
            const isExpanded = expandedMenus.includes(item.href)
            const active = isActive(item.href, item.exact)

            return (
              <li key={index}>
                {hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        active
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {!isCollapsed && <span>{item.title}</span>}
                      </div>
                      {!isCollapsed && (
                        <span className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          ▶️
                        </span>
                      )}
                    </button>
                    
                    {!isCollapsed && isExpanded && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                pathname === subItem.href
                                  ? 'bg-primary-100 text-primary-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="space-y-2">
            <Link
              href="/admin/help"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="mr-2">❓</span>
              Hướng dẫn sử dụng
            </Link>
            <button
              onClick={logout}
              className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors w-full"
            >
              <span className="mr-2">🚪</span>
              Đăng xuất
            </button>
          </div>
        )}
        {isCollapsed && (
          <div className="space-y-2">
            <button
              onClick={logout}
              className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Đăng xuất"
            >
              🚪
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 