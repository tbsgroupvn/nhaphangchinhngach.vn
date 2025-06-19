import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách vận chuyển - TBS GROUP',
  description: 'Quy định về phí vận chuyển, thời gian giao hàng và điều kiện vận chuyển của TBS GROUP',
  keywords: 'chính sách vận chuyển, phí vận chuyển, thời gian giao hàng'
}

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            🚛 Chính sách vận chuyển
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quy định về phí vận chuyển, thời gian giao hàng và các điều kiện vận chuyển của TBS GROUP
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Phí vận chuyển</h2>
            <p>Phí vận chuyển được tính dựa trên:</p>
            <ul>
              <li>Trọng lượng và thể tích hàng hóa</li>
              <li>Khoảng cách vận chuyển</li>
              <li>Loại dịch vụ vận chuyển (thường/nhanh/hỏa tốc)</li>
              <li>Giá trị hàng hóa (ảnh hưởng đến phí bảo hiểm)</li>
            </ul>

            <h2>Thời gian vận chuyển</h2>
            <ul>
              <li><strong>Từ Trung Quốc về Việt Nam:</strong> 7-15 ngày làm việc</li>
              <li><strong>Trong nội địa Việt Nam:</strong> 1-3 ngày làm việc</li>
              <li><strong>Dịch vụ nhanh:</strong> Giảm 30-50% thời gian</li>
            </ul>

            <h2>Trách nhiệm bảo hiểm</h2>
            <p>
              TBS GROUP cam kết bảo hiểm 100% giá trị hàng hóa trong quá trình vận chuyển. 
              Trong trường hợp có sự cố, chúng tôi sẽ bồi thường theo giá trị thực tế của hàng hóa.
            </p>

            <h2>Quy trình giao nhận</h2>
            <ol>
              <li>Thông báo trước khi giao hàng 2-4 giờ</li>
              <li>Giao hàng tại địa chỉ đã thỏa thuận</li>
              <li>Kiểm tra hàng hóa trước khi nhận</li>
              <li>Ký xác nhận hoàn thành giao hàng</li>
            </ol>

            <h2>Liên hệ</h2>
            <p>
              Mọi thắc mắc về vận chuyển, vui lòng liên hệ hotline:{' '}
              <a href="tel:+84976005335">0976 005 335</a>
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