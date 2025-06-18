import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackToTop from '@/components/BackToTop'
import MessengerButton from '@/components/MessengerButton'
import JobsSection from '@/components/JobsSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tuyển dụng TBS GROUP - Cơ hội nghề nghiệp trong lĩnh vực xuất nhập khẩu',
  description: 'Tham gia đội ngũ TBS GROUP với mức lương hấp dẫn, môi trường chuyên nghiệp và cơ hội phát triển. Tuyển dụng các vị trí trong lĩnh vực logistics.',
  keywords: 'tuyển dụng TBS GROUP, việc làm logistics, xuất nhập khẩu, cơ hội nghề nghiệp'
}

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-white">
        <div className="container-max text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Tuyển dụng TBS GROUP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tham gia đội ngũ chuyên nghiệp của TBS GROUP và phát triển sự nghiệp trong lĩnh vực xuất nhập khẩu
          </p>
        </div>
      </section>

      {/* Jobs Content */}
      <JobsSection />

      <Footer />
      <BackToTop />
      <MessengerButton />
    </main>
  )
} 