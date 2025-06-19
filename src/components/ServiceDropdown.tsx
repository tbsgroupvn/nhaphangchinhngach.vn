'use client'

import Link from 'next/link'
import { services } from '@/data/services'

interface ServiceDropdownProps {
  isOpen: boolean;
}

export default function ServiceDropdown({ isOpen }: ServiceDropdownProps) {
  if (!isOpen) return null;

  // Chỉ hiển thị 6 dịch vụ nổi bật nhất
  const featuredServices = services.slice(0, 6)

  return (
    <div className="absolute top-full left-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-5 duration-300">
      <div className="p-3">
        <div className="space-y-1">
          {featuredServices.map((service, index) => (
            <Link
              key={service.slug}
              href={`/dich-vu/${service.slug}`}
              className="flex items-center p-4 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 group hover:scale-[1.02] min-h-[64px] cursor-pointer"
              style={{
                animationDelay: `${index * 30}ms`
              }}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors duration-300 group-hover:scale-110">
                  <span className="text-lg group-hover:animate-bounce">{service.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-300 truncate leading-tight">
                  {service.title}
                </h4>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Xem chi tiết
                  </span>
                  <svg className="w-4 h-4 ml-1 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View All Services */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href="/dich-vu"
            className="flex items-center justify-center w-full px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300 group hover:scale-[1.02] min-h-[48px]"
          >
            <svg className="w-5 h-5 mr-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-base font-semibold">Xem tất cả 11 dịch vụ</span>
          </Link>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
    </div>
  )
} 