import Link from 'next/link'

export default function QuickActions() {
  const quickActions = [
    {
      title: 'Netlify CMS',
      description: 'Hệ thống quản lý nội dung chuyên nghiệp',
      href: '/admin/cms',
      icon: '🎛️',
      color: 'bg-gradient-to-r from-primary-50 to-blue-50 text-primary-700 hover:from-primary-100 hover:to-blue-100 font-semibold border border-primary-200'
    },
    {
      title: 'Thêm dịch vụ mới',
      description: 'Tạo dịch vụ mới cho website',
      href: '/admin/services/new',
      icon: '🏢',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
    },
    {
      title: 'Viết bài mới',
      description: 'Tạo bài viết tin tức mới',
      href: '/admin/news/new',
      icon: '📝',
      color: 'bg-green-50 text-green-600 hover:bg-green-100'
    },
    {
      title: 'Tạo popup',
      description: 'Tạo popup thông báo mới',
      href: '/admin/popups/new',
      icon: '🔔',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    },
    {
      title: 'Upload file',
      description: 'Tải lên hình ảnh, tài liệu',
      href: '/admin/media/upload',
      icon: '📤',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100'
    },
    {
      title: 'AI Assistant',
      description: 'Tạo nội dung với AI',
      href: '/admin/ai-assistant',
      icon: '🤖',
      color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
    },
    {
      title: 'Cài đặt',
      description: 'Cấu hình hệ thống',
      href: '/admin/settings',
      icon: '⚙️',
      color: 'bg-gray-50 text-gray-600 hover:bg-gray-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          ⚡ Thao tác nhanh
        </h3>
        
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`flex items-center p-4 rounded-lg transition-all duration-200 ${action.color} group`}
            >
              <div className="flex-shrink-0 mr-4">
                <span className="text-xl">{action.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold group-hover:scale-105 transition-transform">
                  {action.title}
                </h4>
                <p className="text-xs opacity-80">
                  {action.description}
                </p>
              </div>
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Website Quick Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          🌐 Website hôm nay
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600">👥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Lượt truy cập</p>
                <p className="text-xs text-gray-500">Hôm nay</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">1,247</p>
              <p className="text-xs text-green-600">+12%</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600">📞</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Liên hệ</p>
                <p className="text-xs text-gray-500">Tuần này</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">23</p>
              <p className="text-xs text-blue-600">+5</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600">📄</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Trang phổ biến</p>
                <p className="text-xs text-gray-500">Dịch vụ</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">45%</p>
              <p className="text-xs text-gray-500">lượt xem</p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">
          🆘 Cần hỗ trợ?
        </h3>
        <p className="text-sm text-primary-100 mb-4">
          Xem hướng dẫn sử dụng hoặc liên hệ team IT để được hỗ trợ.
        </p>
        <div className="flex space-x-3">
          <Link
            href="/admin/help"
            className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
          >
            📖 Hướng dẫn
          </Link>
          <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
            💬 Liên hệ IT
          </button>
        </div>
      </div>
    </div>
  )
} 