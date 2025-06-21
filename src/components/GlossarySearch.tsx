'use client'

import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface GlossaryTerm {
  term: string
  english: string
  description: string
}

interface GlossarySearchProps {
  glossaryData: GlossaryTerm[]
}

export default function GlossarySearch({ glossaryData }: GlossarySearchProps) {
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
  }, [searchQuery, glossaryData])

  return (
    <>
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
    </>
  )
} 