'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { services, serviceCategories } from '@/data/services'

interface ServiceDropdownProps {
  isActive: (path: string) => string
}

export default function ServiceDropdown({ isActive }: ServiceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, typeof services>)

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      {/* Desktop Dropdown Button */}
      <div className="hidden md:block">
        <Link 
          href="/dich-vu" 
          className={`flex items-center transition-colors group ${isActive('/dich-vu')}`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span>Dịch vụ</span>
          <svg 
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Link>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-[800px] bg-white shadow-2xl rounded-xl border border-gray-100 py-6 px-8 z-50 mt-2">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  🏢 Dịch vụ theo danh mục
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(serviceCategories).map(([key, category]) => (
                    <Link
                      key={key}
                      href={`/dich-vu?category=${key}`}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                        {category.icon}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-primary-600">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {servicesByCategory[key]?.length || 0} dịch vụ
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right Column - Popular Services */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  ⭐ Dịch vụ nổi bật
                </h3>
                <div className="space-y-2">
                  {services.slice(0, 6).map((service) => (
                    <Link
                      key={service.id}
                      href={`/dich-vu/${service.slug}`}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-xl mr-3 group-hover:scale-110 transition-transform">
                        {service.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-primary-600 text-sm">
                          {service.title}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {service.shortDescription}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Services */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/dich-vu"
                    className="flex items-center justify-center w-full p-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Xem tất cả dịch vụ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Item */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full px-3 py-2 transition-colors ${isActive('/dich-vu')}`}
        >
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Dịch vụ
          </div>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              href="/dich-vu"
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              <span className="mr-2">📋</span>
              Tất cả dịch vụ
            </Link>
            
            {/* Categories */}
            {Object.entries(serviceCategories).map(([key, category]) => (
              <Link
                key={key}
                href={`/dich-vu?category=${key}`}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Link>
            ))}

            {/* Popular Services */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dịch vụ nổi bật
              </div>
              {services.slice(0, 5).map((service) => (
                <Link
                  key={service.id}
                  href={`/dich-vu/${service.slug}`}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <span className="mr-2">{service.icon}</span>
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 