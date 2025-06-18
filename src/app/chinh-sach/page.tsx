import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chính sách TBS GROUP - Điều khoản và quy định dịch vụ',
  description: 'Tổng hợp các chính sách của TBS GROUP: Vận chuyển, đổi trả, bảo mật và điều khoản sử dụng.',
  keywords: 'chính sách TBS GROUP, điều khoản dịch vụ, quy định'
}

export default function PoliciesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Chính sách TBS GROUP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Các chính sách và điều khoản được thiết kế để bảo vệ quyền lợi khách hàng
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/chinh-sach/van-chuyen" className="card hover:shadow-xl transition-all">
              <h3 className="text-xl font-semibold mb-3">🚛 Chính sách vận chuyển</h3>
              <p className="text-gray-600">Quy định về phí vận chuyển và thời gian giao hàng</p>
            </Link>
            <Link href="/chinh-sach/doi-tra" className="card hover:shadow-xl transition-all">
              <h3 className="text-xl font-semibold mb-3">↩️ Chính sách đổi trả</h3>
              <p className="text-gray-600">Điều kiện và quy trình đổi trả hàng hóa</p>
            </Link>
            <Link href="/chinh-sach/cookie" className="card hover:shadow-xl transition-all">
              <h3 className="text-xl font-semibold mb-3">🍪 Chính sách Cookie</h3>
              <p className="text-gray-600">Thông tin về việc sử dụng cookie và bảo mật</p>
            </Link>
            <Link href="/chinh-sach/dieu-khoan" className="card hover:shadow-xl transition-all">
              <h3 className="text-xl font-semibold mb-3">📋 Điều khoản sử dụng</h3>
              <p className="text-gray-600">Các điều khoản và điều kiện sử dụng dịch vụ</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 