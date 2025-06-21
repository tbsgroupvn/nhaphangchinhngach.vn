import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon, HomeIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import glossaryData from '@/data/glossary.json'
import GlossarySearch from '@/components/GlossarySearch'

// SEO Metadata
export const metadata: Metadata = {
  title: 'Từ điển Thuật ngữ Hải quan, Xuất nhập khẩu – TBS GROUP',
  description: 'Từ điển thuật ngữ hải quan và xuất nhập khẩu đầy đủ nhất. Tra cứu nhanh các khái niệm về logistics, thông quan, thương mại quốc tế với giải thích chi tiết.',
  keywords: 'từ điển hải quan, thuật ngữ xuất nhập khẩu, logistics, thông quan, HS code, incoterms, bill of lading',
  openGraph: {
    title: 'Từ điển Thuật ngữ Hải quan & XNK – TBS GROUP',
    description: 'Tra cứu thuật ngữ hải quan, logistics và thương mại quốc tế',
    type: 'website',
  }
}

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link 
              href="/" 
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <HomeIcon className="w-4 h-4 mr-1" />
              Trang chủ
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <Link 
              href="/tin-tuc" 
              className="hover:text-blue-600 transition-colors"
            >
              Blog
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Từ điển thuật ngữ</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpenIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-700">
              Từ điển Thuật ngữ Hải quan & XNK
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tra cứu nhanh các thuật ngữ chuyên ngành về hải quan, xuất nhập khẩu, logistics và thương mại quốc tế. 
            Được biên soạn bởi đội ngũ chuyên gia TBS GROUP.
          </p>
          <Link 
            href="/tin-tuc"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Quay lại Blog
          </Link>
        </div>

        {/* Search and Terms - Client Component */}
        <GlossarySearch glossaryData={glossaryData} />

        {/* Call to Action */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Cần hỗ trợ thêm về thuật ngữ XNK?
            </h3>
            <p className="text-blue-700 mb-4">
              Đội ngũ chuyên gia TBS GROUP sẵn sàng tư vấn miễn phí về các vấn đề hải quan và logistics
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Liên hệ tư vấn
              </Link>
              <Link
                href="/dich-vu"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-300 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors"
              >
                Xem dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 