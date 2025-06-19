'use client'

import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminHelp() {
  const guides = [
    {
      title: '🚀 Bắt đầu sử dụng',
      icon: '🌟',
      content: [
        'Đăng nhập bằng tài khoản admin hoặc editor',
        'Xem tổng quan trong Dashboard',
        'Sử dụng menu bên trái để điều hướng',
        'Tham khảo các hướng dẫn chi tiết bên dưới'
      ]
    },
    {
      title: '🏢 Quản lý dịch vụ',
      icon: '📋',
      content: [
        'Truy cập "Quản lý dịch vụ" từ menu',
        'Sử dụng bộ lọc để tìm kiếm dịch vụ',
        'Click "Thêm dịch vụ mới" để tạo dịch vụ',
        'Chỉnh sửa bằng icon ✏️, xem trước bằng 👁️',
        'Thay đổi trạng thái xuất bản bằng cách click vào badge trạng thái'
      ]
    },
    {
      title: '📰 Quản lý tin tức',
      icon: '✍️',
      content: [
        'Chọn loại bài viết: Tin ngành, Nội bộ, Kiến thức XNK',
        'Sử dụng AI Assistant để tạo nội dung nhanh',
        'Thêm hình ảnh từ thư viện Media',
        'Đặt lịch xuất bản hoặc lưu bản nháp',
        'Gắn tag và chuyên mục phù hợp'
      ]
    },
    {
      title: '🔔 Quản lý Popup',
      icon: '🎯',
      content: [
        'Tạo popup thông báo, khuyến mãi',
        'Thiết lập thời gian hiển thị',
        'Chọn trang hiển thị popup',
        'Lên lịch kích hoạt tự động',
        'Theo dõi hiệu quả qua Analytics'
      ]
    },
    {
      title: '🤖 AI Assistant',
      icon: '✨',
      content: [
        'Chọn loại nội dung muốn tạo',
        'Nhập mô tả chi tiết yêu cầu',
        'Sử dụng gợi ý nhanh có sẵn',
        'Chỉnh sửa nội dung được tạo',
        'Sao chép và sử dụng cho bài viết'
      ]
    },
    {
      title: '🖼️ Quản lý Media',
      icon: '📤',
      content: [
        'Upload hình ảnh, tài liệu PDF',
        'Tổ chức file theo thư mục',
        'Tối ưu kích thước ảnh tự động',
        'Sao chép link để sử dụng',
        'Xóa file không cần thiết để tiết kiệm dung lượng'
      ]
    },
    {
      title: '⚙️ Cài đặt hệ thống',
      icon: '🔧',
      content: [
        'Cập nhật thông tin công ty',
        'Thay đổi logo, banner',
        'Cài đặt thông tin liên hệ',
        'Kết nối Social Media',
        'Cấu hình email, Google Maps'
      ]
    },
    {
      title: '💾 Backup & Export',
      icon: '🛡️',
      content: [
        'Tự động backup dữ liệu hàng ngày',
        'Export dữ liệu Excel/CSV',
        'Import dữ liệu từ file',
        'Khôi phục từ backup',
        'Đồng bộ với Netlify tự động'
      ]
    }
  ]

  const tips = [
    {
      icon: '💡',
      title: 'Sử dụng AI Assistant',
      content: 'Tận dụng AI để tạo nội dung nhanh chóng. Mô tả càng chi tiết, kết quả càng chính xác.'
    },
    {
      icon: '🔍',
      title: 'Tìm kiếm hiệu quả',
      content: 'Sử dụng bộ lọc và tìm kiếm để quản lý nội dung dễ dàng khi có nhiều bài viết.'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      content: 'CMS được tối ưu cho mobile. Bạn có thể quản lý nội dung từ điện thoại.'
    },
    {
      icon: '⚡',
      title: 'Phím tắt',
      content: 'Ctrl+S để lưu nhanh, Ctrl+Enter để xuất bản, ESC để hủy.'
    }
  ]

  const faq = [
    {
      q: 'Làm sao để thay đổi mật khẩu?',
      a: 'Liên hệ IT Team để reset mật khẩu. Trong tương lai sẽ có tính năng tự đổi mật khẩu.'
    },
    {
      q: 'Tôi có thể xóa bài viết đã xuất bản không?',
      a: 'Có, nhưng nên chuyển về trạng thái nháp thay vì xóa để tránh mất dữ liệu.'
    },
    {
      q: 'AI Assistant có tính phí không?',
      a: 'Hiện tại miễn phí cho tất cả nhân viên. Có giới hạn số lần sử dụng mỗi ngày.'
    },
    {
      q: 'Làm sao biết thay đổi đã được cập nhật lên website?',
      a: 'Thay đổi được đồng bộ tự động trong vòng 2-5 phút. Check trạng thái ở Dashboard.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Hướng dẫn sử dụng" 
        subtitle="TBS GROUP Content Management System"
      />
      
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Quick Start */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-4">👋</span>
            <h2 className="text-2xl font-bold">Chào mừng bạn đến với TBS CMS!</h2>
          </div>
          <p className="text-primary-100 mb-6">
            Hệ thống quản trị nội dung được thiết kế đơn giản, thân thiện để bạn có thể quản lý website TBS GROUP một cách dễ dàng.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📊 Dashboard</h3>
              <p className="text-sm text-primary-100">Xem tổng quan và thống kê</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🤖 AI Assistant</h3>
              <p className="text-sm text-primary-100">Tạo nội dung tự động</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📱 Mobile Ready</h3>
              <p className="text-sm text-primary-100">Sử dụng mọi lúc, mọi nơi</p>
            </div>
          </div>
        </div>

        {/* User Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {guides.map((guide, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{guide.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{guide.title}</h3>
              </div>
              <ul className="space-y-2">
                {guide.content.map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tips & Tricks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            ⚡ Mẹo sử dụng hiệu quả
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <span className="text-2xl mr-3">{tip.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            ❓ Câu hỏi thường gặp
          </h3>
          
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index}>
                <h4 className="font-medium text-gray-900 mb-2">
                  {index + 1}. {item.q}
                </h4>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">🆘 Cần hỗ trợ thêm?</h3>
          <p className="text-green-100 mb-4">
            Đội ngũ IT sẵn sàng hỗ trợ bạn 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="tel:0976005335"
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              📞 Hotline: 0976 005 335
            </a>
            <a 
              href="mailto:it@tbsgroup.vn"
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              ✉️ Email: it@tbsgroup.vn
            </a>
            <a 
              href="https://zalo.me/0976005335"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              💬 Chat Zalo
            </a>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>TBS CMS v1.0 • Phát triển bởi TBS IT Team • Cập nhật: 15/01/2025</p>
        </div>
      </div>
    </div>
  )
} 