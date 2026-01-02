'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaHome, FaServicestack, FaNewspaper, FaBriefcase, 
  FaComments, FaFileAlt, FaImage, FaBell, FaCog, 
  FaUser, FaSignOutAlt, FaBars, FaTimes, FaChartLine,
  FaUsers, FaGlobe, FaShieldAlt
} from 'react-icons/fa';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Quản lý bài viết']); // Default expand posts section
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/cms-logout', { method: 'POST' });
      router.push('/cms-login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(item => item !== menuName)
        : [...prev, menuName]
    );
  };

  const navigation = [
    {
      name: 'Tổng quan',
      href: '/admin/dashboard',
      icon: FaChartLine,
      description: 'Dashboard & thống kê'
    },
    {
      name: 'Quản lý dịch vụ',
      icon: FaServicestack,
      children: [
        { name: 'Danh sách dịch vụ', href: '/admin/services' },
        { name: 'Thêm dịch vụ mới', href: '/admin/services/create' },
        { name: 'Bảng giá & FAQ', href: '/admin/services/pricing' },
        { name: 'Feedback khách hàng', href: '/admin/services/feedback' }
      ]
    },
    {
      name: 'Quản lý bài viết',
      icon: FaNewspaper,
      children: [
        { name: 'Tất cả bài viết', href: '/admin/posts' },
        { name: 'Tin ngành', href: '/admin/posts?category=news' },
        { name: 'Tin nội bộ', href: '/admin/posts?category=internal' },
        { name: 'Cẩm nang XNK', href: '/admin/posts?category=guide' },
        { name: 'Câu chuyện KH', href: '/admin/posts?category=stories' },
        { name: 'Tạo bài viết mới', href: '/admin/posts/create' }
      ]
    },
    {
      name: 'Quản lý tài nguyên',
      icon: FaImage,
      children: [
        { name: 'Thư viện media', href: '/admin/media' },
        { name: 'Tải lên tệp', href: '/admin/media?tab=upload' }
      ]
    },
    {
      name: 'Popup & Thông báo',
      icon: FaBell,
      children: [
        { name: 'Quản lý popup', href: '/admin/popups' }
      ]
    },
    {
      name: 'Chính sách',
      icon: FaFileAlt,
      children: [
        { name: 'Quản lý chính sách', href: '/admin/policies' }
      ]
    },
    {
      name: 'Cài đặt website',
      icon: FaCog,
      children: [
        { name: 'Thông tin chung', href: '/admin/settings?tab=general' },
        { name: 'Logo & Giao diện', href: '/admin/settings?tab=appearance' },
        { name: 'Mạng xã hội', href: '/admin/settings?tab=social' },
        { name: 'SEO & Analytics', href: '/admin/settings?tab=seo' }
      ]
    },
    {
      name: 'Phân quyền',
      icon: FaShieldAlt,
      children: [
        { name: 'Quản lý tài khoản', href: '/admin/users' },
        { name: 'Nhóm quyền', href: '/admin/roles' }
      ]
    }
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl border-r border-gray-200
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-red-600 to-red-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FaGlobe className="text-red-600 text-lg" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">TBS GROUP</h1>
              <p className="text-red-100 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-red-800 p-2 rounded-lg"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-3 space-y-2">
            {navigation.map((item, index) => (
              <div key={index}>
                {item.href ? (
                  // Single navigation item
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all
                      ${isActive(item.href) 
                        ? 'bg-red-50 text-red-700 border-l-4 border-red-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon className={`text-lg ${isActive(item.href) ? 'text-red-600' : ''}`} />
                    <div>
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      )}
                    </div>
                  </Link>
                ) : (
                  // Navigation group with children
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleMenu(item.name)}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="text-lg text-gray-600" />
                        <span>{item.name}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedMenus.includes(item.name) ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    {expandedMenus.includes(item.name) && (
                      <div className="ml-6 space-y-1">
                        {item.children?.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.href}
                            className={`
                              block px-3 py-2 rounded-lg text-sm transition-all
                              ${isActive(child.href)
                                ? 'bg-red-50 text-red-700 font-medium border-l-2 border-red-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin TBS</p>
              <p className="text-xs text-gray-500">Super Administrator</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Link
              href="/admin/profile"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FaUser className="text-xs" />
              <span>Hồ sơ cá nhân</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
            >
              <FaSignOutAlt className="text-xs" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:shadow-none">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <FaBars />
              </button>
              
              <div className="hidden lg:block">
                <nav className="flex space-x-1" aria-label="Breadcrumb">
                  <Link href="/admin" className="text-gray-500 hover:text-gray-700 text-sm">
                    Admin
                  </Link>
                  <span className="text-gray-400 text-sm">/</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {navigation.find(item => item.href && isActive(item.href))?.name || 
                     navigation.find(item => item.children?.some(child => isActive(child.href)))?.name ||
                     'Tổng quan'}
                  </span>
                </nav>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/admin/posts/create"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  + Bài viết
                </Link>
                
                <Link
                  href="/admin/services/create"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                >
                  + Dịch vụ
                </Link>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <FaBell className="text-lg" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Website Link */}
              <Link
                href="/"
                target="_blank"
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaGlobe className="text-xs" />
                <span>Xem website</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
} 