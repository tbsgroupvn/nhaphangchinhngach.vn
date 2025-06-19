import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng - TBS GROUP',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ của TBS GROUP. Quyền và nghĩa vụ của khách hàng và công ty.',
  keywords: 'điều khoản sử dụng, quy định, TBS GROUP'
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            📋 Điều khoản sử dụng
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Các điều khoản và điều kiện sử dụng dịch vụ của TBS GROUP
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>1. Chấp nhận điều khoản</h2>
            <p>
              Khi sử dụng dịch vụ của TBS GROUP, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản này. 
              Nếu không đồng ý, vui lòng không sử dụng dịch vụ.
            </p>

            <h2>2. Định nghĩa dịch vụ</h2>
            <p>Dịch vụ của TBS GROUP bao gồm:</p>
            <ul>
              <li>Dịch vụ nhập khẩu chính ngạch</li>
              <li>Vận chuyển và logistics</li>
              <li>Tư vấn pháp lý xuất nhập khẩu</li>
              <li>Các dịch vụ hỗ trợ khác</li>
            </ul>

            <h2>3. Quyền và nghĩa vụ của khách hàng</h2>
            <h3>Quyền của khách hàng:</h3>
            <ul>
              <li>Được cung cấp dịch vụ đúng như cam kết</li>
              <li>Được bảo mật thông tin cá nhân</li>
              <li>Được hỗ trợ kỹ thuật 24/7</li>
              <li>Được đổi trả theo chính sách</li>
            </ul>

            <h3>Nghĩa vụ của khách hàng:</h3>
            <ul>
              <li>Cung cấp thông tin chính xác, đầy đủ</li>
              <li>Thanh toán đúng hạn theo hợp đồng</li>
              <li>Tuân thủ pháp luật Việt Nam</li>
              <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
            </ul>

            <h2>4. Trách nhiệm của TBS GROUP</h2>
            <ul>
              <li>Thực hiện dịch vụ đúng cam kết</li>
              <li>Bảo mật thông tin khách hàng</li>
              <li>Hỗ trợ khách hàng kịp thời</li>
              <li>Tuân thủ đầy đủ quy định pháp luật</li>
            </ul>

            <h2>5. Giới hạn trách nhiệm</h2>
            <p>TBS GROUP không chịu trách nhiệm trong các trường hợp:</p>
            <ul>
              <li>Thiên tai, thảm họa, chiến tranh</li>
              <li>Thay đổi chính sách của chính phủ</li>
              <li>Lỗi do khách hàng cung cấp thông tin sai</li>
              <li>Các yếu tố bất khả kháng khác</li>
            </ul>

            <h2>6. Bảo mật thông tin</h2>
            <p>
              TBS GROUP cam kết bảo mật tuyệt đối thông tin khách hàng. Thông tin chỉ được sử dụng 
              cho mục đích cung cấp dịch vụ và không chia sẻ với bên thứ ba.
            </p>

            <h2>7. Thay đổi điều khoản</h2>
            <p>
              TBS GROUP có quyền thay đổi điều khoản này bất cứ lúc nào. Thông báo thay đổi sẽ được 
              gửi đến khách hàng trước ít nhất 30 ngày.
            </p>

            <h2>8. Giải quyết tranh chấp</h2>
            <p>
              Mọi tranh chấp sẽ được giải quyết thông qua thương lượng. Nếu không thành, 
              sẽ đưa ra Tòa án có thẩm quyền tại Việt Nam.
            </p>

            <h2>9. Liên hệ</h2>
            <p>
              Mọi thắc mắc về điều khoản này, vui lòng liên hệ:{' '}
              <a href="tel:+84976005335">0976 005 335</a> hoặc{' '}
              <a href="mailto:legal@xuatnhapkhautbs.vn">legal@xuatnhapkhautbs.vn</a>
            </p>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Có hiệu lực:</strong> 01/01/2024<br/>
                <strong>Cập nhật lần cuối:</strong> 01/01/2024
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 