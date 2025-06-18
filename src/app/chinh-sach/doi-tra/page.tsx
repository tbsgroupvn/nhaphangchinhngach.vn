import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách đổi trả - TBS GROUP',
  description: 'Chính sách đổi trả hàng hóa và hoàn tiền của TBS GROUP. Điều kiện và quy trình đổi trả rõ ràng, minh bạch.',
  keywords: 'chính sách đổi trả, hoàn tiền, TBS GROUP'
}

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            ↩️ Chính sách đổi trả
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Điều kiện và quy trình đổi trả hàng hóa, hoàn tiền rõ ràng và minh bạch
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2>Điều kiện đổi trả</h2>
            <p>TBS GROUP chấp nhận đổi trả hàng hóa trong các trường hợp sau:</p>
            <ul>
              <li><strong>Hàng hóa bị lỗi do nhà sản xuất:</strong> Được đổi/trả 100%</li>
              <li><strong>Hàng không đúng mô tả:</strong> Khác biệt &gt;20% so với thông tin đặt hàng</li>
              <li><strong>Hư hỏng trong vận chuyển:</strong> Do lỗi đóng gói hoặc vận chuyển</li>
              <li><strong>Thay đổi ý kiến khách hàng:</strong> Trong vòng 7 ngày, phí đổi trả 15%</li>
            </ul>

            <h2>Quy trình đổi trả</h2>
            <ol>
              <li><strong>Thông báo đổi trả:</strong> Liên hệ hotline 0976 005 335 trong 7 ngày</li>
              <li><strong>Cung cấp bằng chứng:</strong> Hình ảnh, video sản phẩm lỗi</li>
              <li><strong>Đánh giá yêu cầu:</strong> TBS xem xét và phản hồi trong 24h</li>
              <li><strong>Xử lý đổi trả:</strong> Đổi hàng mới hoặc hoàn tiền</li>
            </ol>

            <h2>Thời gian xử lý</h2>
            <ul>
              <li><strong>Đổi hàng:</strong> 10-15 ngày làm việc</li>
              <li><strong>Hoàn tiền:</strong> 3-7 ngày làm việc sau khi nhận hàng trả</li>
              <li><strong>Trường hợp khẩn cấp:</strong> Xử lý ưu tiên trong 24h</li>
            </ul>

            <h2>Chi phí đổi trả</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Nguyên nhân</th>
                  <th className="border border-gray-300 p-2">Chi phí vận chuyển</th>
                  <th className="border border-gray-300 p-2">Phí xử lý</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Lỗi nhà sản xuất</td>
                  <td className="border border-gray-300 p-2">TBS chịu 100%</td>
                  <td className="border border-gray-300 p-2">Miễn phí</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Lỗi vận chuyển</td>
                  <td className="border border-gray-300 p-2">TBS chịu 100%</td>
                  <td className="border border-gray-300 p-2">Miễn phí</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Đổi ý khách hàng</td>
                  <td className="border border-gray-300 p-2">Khách hàng chi trả</td>
                  <td className="border border-gray-300 p-2">15% giá trị hàng</td>
                </tr>
              </tbody>
            </table>

            <h2>Liên hệ hỗ trợ</h2>
            <p>
              Để được hỗ trợ đổi trả nhanh chóng, vui lòng liên hệ:{' '}
              <a href="tel:+84976005335">0976 005 335</a> hoặc{' '}
              <a href="mailto:support@xuatnhapkhautbs.vn">support@xuatnhapkhautbs.vn</a>
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