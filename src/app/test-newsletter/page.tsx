import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import Newsletter from '@/components/Newsletter'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Newsletter - TBS GROUP',
  description: 'Trang test newsletter TBS GROUP',
  keywords: 'newsletter, test, TBS GROUP'
}

export default function TestNewsletterPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Test Newsletter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trang test để kiểm tra chức năng đăng ký newsletter
          </p>
        </div>
      </section>

      <Newsletter />

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 