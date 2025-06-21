'use client'

import { useState, useMemo } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRightIcon, MagnifyingGlassIcon, HomeIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import glossaryData from '@/data/glossary.json'

interface GlossaryTerm {
  term: string
  english: string
  description: string
}

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
  const [searchQuery, setSearchQuery] = useState('')

  // Real-time search filtering
  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) {
      return glossaryData
    }

    const query = searchQuery.toLowerCase().trim()
    return glossaryData.filter((item: GlossaryTerm) =>
      item.term.toLowerCase().includes(query) ||
      item.english.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

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

        {/* Search Box */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Nhập từ khóa để tìm kiếm thuật ngữ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          {searchQuery && (
            <p className="text-center mt-3 text-gray-600">
              Tìm thấy <span className="font-semibold text-blue-600">{filteredTerms.length}</span> thuật ngữ
              {filteredTerms.length === 0 && (
                <span className="block mt-1 text-gray-500 italic">
                  Không tìm thấy thuật ngữ phù hợp. Thử từ khóa khác.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Terms Grid */}
        {filteredTerms.length > 0 ? (
          <div className="grid gap-6">
            {filteredTerms.map((item: GlossaryTerm, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                  <h2 className="text-xl font-semibold text-blue-600 mb-1">
                    {item.term}
                  </h2>
                  <span className="text-sm text-gray-500 italic lg:ml-4 lg:text-right lg:flex-shrink-0">
                    ({item.english})
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy thuật ngữ phù hợp
            </h3>
            <p className="text-gray-600 mb-4">
              Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả thuật ngữ
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600">
              Từ điển hiện có <span className="font-semibold text-blue-600">{glossaryData.length}</span> thuật ngữ chuyên ngành
              <br />
              <span className="text-sm text-gray-500 mt-1 inline-block">
                Được cập nhật thường xuyên bởi đội ngũ chuyên gia TBS GROUP
              </span>
            </p>
          </div>
        </div>

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