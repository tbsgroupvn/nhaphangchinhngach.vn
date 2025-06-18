import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách Cookie - TBS GROUP',
  description: 'Chính sách sử dụng cookie và bảo vệ quyền riêng tư của TBS GROUP',
  keywords: 'chính sách cookie, bảo mật, quyền riêng tư'
}

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            🍪 Chính sách Cookie
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thông tin về việc sử dụng cookie và bảo vệ quyền riêng tư trên website TBS GROUP
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Cookie là gì?</h2>
            <p>
              Cookie là những tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn (máy tính, điện thoại, tablet) 
              khi bạn truy cập website. Cookie giúp website &ldquo;nhớ&rdquo; các thông tin về phiên duyệt web của bạn.
            </p>

            <h2>TBS GROUP sử dụng cookie như thế nào?</h2>
            <p>Chúng tôi sử dụng cookie cho các mục đích sau:</p>
            <ul>
              <li><strong>Cookie cần thiết:</strong> Đảm bảo website hoạt động bình thường</li>
              <li><strong>Cookie phân tích:</strong> Hiểu cách khách hàng sử dụng website</li>
              <li><strong>Cookie tiếp thị:</strong> Cung cấp nội dung phù hợp với sở thích</li>
            </ul>

            <h2>Quyền của bạn</h2>
            <p>Bạn có quyền:</p>
            <ul>
              <li>Từ chối cookie không cần thiết</li>
              <li>Xóa cookie đã lưu trên thiết bị</li>
              <li>Yêu cầu thông tin về cookie chúng tôi sử dụng</li>
            </ul>

            <h2>Liên hệ</h2>
            <p>
              Nếu có thắc mắc về chính sách cookie, vui lòng liên hệ:{' '}
              <a href="mailto:info@xuatnhapkhautbs.vn">info@xuatnhapkhautbs.vn</a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 