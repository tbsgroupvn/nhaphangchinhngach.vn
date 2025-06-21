'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import ServiceDropdown from './ServiceDropdown'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false)
  const pathname = usePathname()
  
  // Add timeout refs for hover delays
  const serviceTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const newsTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current)
      if (newsTimeoutRef.current) clearTimeout(newsTimeoutRef.current)
    }
  }, [])

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return 'text-primary-600 bg-primary-50'
    if (path !== '/' && pathname.startsWith(path)) return 'text-primary-600 bg-primary-50'
    return 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
  }

  const closeMenu = () => setIsMenuOpen(false)

  // Improved hover handlers with delays
  const handleServiceMouseEnter = () => {
    if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current)
    setIsServiceDropdownOpen(true)
  }

  const handleServiceMouseLeave = () => {
    serviceTimeoutRef.current = setTimeout(() => {
      setIsServiceDropdownOpen(false)
    }, 150) // 150ms delay before closing
  }

  const handleNewsMouseEnter = () => {
    if (newsTimeoutRef.current) clearTimeout(newsTimeoutRef.current)
    setIsNewsDropdownOpen(true)
  }

  const handleNewsMouseLeave = () => {
    newsTimeoutRef.current = setTimeout(() => {
      setIsNewsDropdownOpen(false)
    }, 150) // 150ms delay before closing
  }

  return (
    <>
      {/* Top bar - Hidden on small screens to save space */}
      <div className="hidden sm:block bg-primary-700 text-white py-2">
        <div className="container-max">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="flex items-center touch-target">
                <span className="mr-1">📞</span>
                <a href="tel:0976005335" className="hover:text-primary-200 transition-colors">0976 005 335</a>
              </span>
              <span className="hidden sm:flex items-center">
                <span className="mr-1">✉️</span>
                <a href="mailto:info@xuatnhapkhautbs.vn" className="hover:text-primary-200 transition-colors">info@xuatnhapkhautbs.vn</a>
              </span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a 
                href="https://zalo.me/0976005335" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary-200 transition-colors touch-target group"
              >
                <span className="mr-1 group-hover:animate-bounce">💬</span>
                <span className="hidden sm:inline">Chat Zalo</span>
              </a>
              <a 
                href="https://tiktok.com/@tbslogistics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary-200 transition-colors touch-target group"
              >
                <svg className="w-4 h-4 mr-1 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.2 8.2 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z"/>
                </svg>
                <span className="hidden sm:inline">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav className={`bg-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-xl bg-white/95 backdrop-blur-sm' : ''}`}>
      <div className="container-max">
          <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center">
              <Link href="/" className="flex items-center group" onClick={closeMenu}>
              <Image
                src="/images/tbs-logo.png"
                alt="TBS GROUP Logo"
                width={40}
                height={40}
                className="mr-2 sm:mr-3 w-8 h-8 sm:w-12 sm:h-12 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 rounded-lg shadow-md group-hover:shadow-lg"
                priority
              />
                <span className="text-lg sm:text-2xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors">
                TBS GROUP
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link 
                href="/" 
                className={`flex items-center transition-all duration-300 px-4 py-3 rounded-lg ${isActive('/')} hover:scale-105 group`}
              >
                <svg className="w-4 h-4 mr-1 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Trang chủ
            </Link>

              <Link 
                href="/gioi-thieu" 
                className={`flex items-center transition-all duration-300 px-4 py-3 rounded-lg ${isActive('/gioi-thieu')} hover:scale-105 group`}
              >
                <svg className="w-4 h-4 mr-1 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Giới thiệu
            </Link>

              {/* Services Dropdown - Improved UX */}
              <div 
                className="relative"
                onMouseEnter={handleServiceMouseEnter}
                onMouseLeave={handleServiceMouseLeave}
              >
                <Link 
                  href="/dich-vu" 
                  className={`flex items-center transition-all duration-300 px-4 py-3 rounded-lg ${isActive('/dich-vu')} hover:scale-105 group`}
                >
                  <svg className="w-4 h-4 mr-1 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Dịch vụ
                  <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${isServiceDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
            </Link>
                
                {/* Invisible bridge to connect menu to dropdown */}
                {isServiceDropdownOpen && (
                  <div className="absolute top-full left-0 w-full h-2 bg-transparent" />
                )}
                
                {/* Dropdown Menu */}
                <ServiceDropdown isOpen={isServiceDropdownOpen} />
              </div>

              {/* News Dropdown - Improved UX */}
              <div 
                className="relative"
                onMouseEnter={handleNewsMouseEnter}
                onMouseLeave={handleNewsMouseLeave}
              >
                <Link 
                  href="/tin-tuc" 
                  className={`flex items-center transition-all duration-300 px-4 py-3 rounded-lg ${isActive('/tin-tuc')} hover:scale-105 group`}
                >
                  <svg className="w-4 h-4 mr-1 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Tin tức
                  <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${isNewsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                
                {/* Invisible bridge to connect menu to dropdown */}
                {isNewsDropdownOpen && (
                  <div className="absolute top-full left-0 w-full h-2 bg-transparent" />
                )}
                
                {/* News Dropdown Menu */}
                {isNewsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-5 duration-300">
                    <div className="p-4">
                      <div className="space-y-2">

                        <Link
                          href="/tin-tuc/nganh"
                          className="flex items-center p-4 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 group hover:scale-[1.02] min-h-[72px] cursor-pointer"
                        >
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300 group-hover:scale-110">
                              <span className="text-xl group-hover:animate-bounce">📈</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
                              Tin tức ngành
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 group-hover:text-primary-600 transition-colors duration-300">
                              Cập nhật thông tin thị trường
                            </p>
                          </div>
                        </Link>
                        
                        <div className="relative">
                          <Link
                            href="/tin-tuc/noi-bo"
                            className="flex items-center p-4 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 group hover:scale-[1.02] min-h-[72px] cursor-pointer"
                          >
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300 group-hover:scale-110">
                                <span className="text-xl group-hover:animate-bounce">🏢</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
                                Tin nội bộ
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 group-hover:text-primary-600 transition-colors duration-300">
                                Hoạt động công ty & Tuyển dụng
                              </p>
                            </div>
                          </Link>
                          
                          {/* Sub-menu for Tin nội bộ - Improved spacing */}
                          <div className="ml-8 mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                            <Link
                              href="/tin-tuc/noi-bo/hoat-dong-cong-ty"
                              className="flex items-center p-3 rounded-xl hover:bg-teal-50 hover:text-teal-700 transition-all duration-300 group min-h-[52px] cursor-pointer"
                            >
                              <span className="text-lg mr-3 group-hover:animate-bounce">🎯</span>
                              <span className="text-sm font-medium">Hoạt động công ty</span>
                            </Link>
                            <Link
                              href="/tin-tuc/noi-bo/tuyen-dung"
                              className="flex items-center p-3 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all duration-300 group min-h-[52px] cursor-pointer"
                            >
                              <span className="text-lg mr-3 group-hover:animate-bounce">👥</span>
                              <span className="text-sm font-medium">Tuyển dụng</span>
                            </Link>
                          </div>
                        </div>
                        
                        <Link
                          href="/tin-tuc/cam-nang-xnk"
                          className="flex items-center p-4 rounded-xl hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 group hover:scale-[1.02] min-h-[72px] cursor-pointer"
                        >
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-300 group-hover:scale-110">
                              <span className="text-xl group-hover:animate-bounce">📚</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-300">
                              Kiến thức - Cẩm nang XNK
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 group-hover:text-primary-600 transition-colors duration-300">
                              Tài liệu và hướng dẫn chuyên môn
                            </p>
                          </div>
                        </Link>
                      </div>
                      
                      {/* View All News */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href="/tin-tuc"
                          className="flex items-center justify-center w-full px-4 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-300 group hover:scale-[1.02] min-h-[52px]"
                        >
                          <svg className="w-5 h-5 mr-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                          <span className="text-base font-semibold">Xem tất cả tin tức</span>
            </Link>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                  </div>
                )}
              </div>



              <Link 
                href="/lien-he" 
                className={`flex items-center transition-all duration-300 px-4 py-3 rounded-lg ${isActive('/lien-he')} hover:scale-105 group`}
              >
                <svg className="w-4 h-4 mr-1 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Liên hệ
            </Link>

              {/* Animated Call Button */}
              <a 
                href="tel:+84976005335" 
                className="btn-primary text-sm relative overflow-hidden group animate-pulse hover:animate-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <svg className="w-4 h-4 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
                <span className="relative z-10">Gọi ngay</span>
            </a>
          </div>

            {/* Mobile Contact + Menu Button */}
            <div className="flex items-center space-x-2 lg:hidden">
              {/* Quick contact on mobile with animation */}
              <a 
                href="tel:+84976005335" 
                className="btn-primary text-sm px-3 py-2 animate-pulse hover:animate-none group"
              >
                <svg className="w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              
              {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 touch-target transition-all duration-300 group"
                aria-label="Toggle menu"
            >
                <svg className={`h-6 w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''} group-hover:scale-110`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="py-4 space-y-2 bg-gray-50 rounded-xl mb-4">
              <Link 
                href="/" 
                className={`flex items-center px-5 py-4 transition-all duration-300 rounded-xl mx-3 ${isActive('/')} hover:scale-[0.98] group min-h-[56px] text-base font-medium`}
                onClick={closeMenu}
              >
                <svg className="w-6 h-6 mr-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Trang chủ
              </Link>
              
              <Link 
                href="/gioi-thieu" 
                className={`flex items-center px-5 py-4 transition-all duration-300 rounded-xl mx-3 ${isActive('/gioi-thieu')} hover:scale-[0.98] group min-h-[56px] text-base font-medium`}
                onClick={closeMenu}
              >
                <svg className="w-6 h-6 mr-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Giới thiệu
              </Link>
              
              <Link 
                href="/dich-vu" 
                className={`flex items-center px-5 py-4 transition-all duration-300 rounded-xl mx-3 ${isActive('/dich-vu')} hover:scale-[0.98] group min-h-[56px] text-base font-medium`}
                onClick={closeMenu}
              >
                <svg className="w-6 h-6 mr-4 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Dịch vụ
              </Link>
              
              <Link 
                href="/tin-tuc" 
                className={`flex items-center px-5 py-4 transition-all duration-300 rounded-xl mx-3 ${isActive('/tin-tuc')} hover:scale-[0.98] group min-h-[56px] text-base font-medium`}
                onClick={closeMenu}
              >
                <svg className="w-6 h-6 mr-4 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Tin tức
              </Link>

              {/* Mobile News Sub-menu */}
              <div className="ml-4 space-y-2">

                <Link 
                  href="/tin-tuc/nganh" 
                  className="flex items-center px-5 py-4 text-sm text-gray-600 hover:text-primary-600 transition-colors rounded-xl hover:bg-primary-50 font-medium min-h-[52px]"
                  onClick={closeMenu}
                >
                  <span className="mr-3 text-lg">📈</span>
                  Tin tức ngành
                </Link>
                <Link 
                  href="/tin-tuc/noi-bo" 
                  className="flex items-center px-5 py-4 text-sm text-gray-600 hover:text-primary-600 transition-colors rounded-xl hover:bg-primary-50 font-medium min-h-[52px]"
                  onClick={closeMenu}
                >
                  <span className="mr-3 text-lg">🏢</span>
                  Tin nội bộ
                </Link>
                <div className="ml-6 space-y-2">
                  <Link 
                    href="/tin-tuc/noi-bo/hoat-dong-cong-ty" 
                    className="flex items-center px-4 py-3 text-sm text-gray-500 hover:text-primary-600 transition-colors rounded-xl hover:bg-primary-50 min-h-[48px]"
                    onClick={closeMenu}
                  >
                    <span className="mr-3 text-base">🎯</span>
                    Hoạt động công ty
                  </Link>
                  <Link 
                    href="/tin-tuc/noi-bo/tuyen-dung" 
                    className="flex items-center px-4 py-3 text-sm text-gray-500 hover:text-primary-600 transition-colors rounded-xl hover:bg-primary-50 min-h-[48px]"
                    onClick={closeMenu}
                  >
                    <span className="mr-3 text-base">👥</span>
                    Tuyển dụng
                  </Link>
                </div>
                <Link 
                  href="/tin-tuc/cam-nang-xnk" 
                  className="flex items-center px-5 py-4 text-sm text-gray-600 hover:text-primary-600 transition-colors rounded-xl hover:bg-primary-50 font-medium min-h-[52px]"
                  onClick={closeMenu}
                >
                  <span className="mr-3 text-lg">📚</span>
                  Kiến thức - Cẩm nang XNK
                </Link>
              </div>
              

              
              <Link 
                href="/lien-he" 
                className={`flex items-center px-5 py-4 transition-all duration-300 rounded-xl mx-3 ${isActive('/lien-he')} hover:scale-[0.98] group min-h-[56px] text-base font-medium`}
                onClick={closeMenu}
              >
                <svg className="w-6 h-6 mr-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Liên hệ
              </Link>

              {/* Mobile Quick Actions */}
              <div className="px-3 pt-4 border-t border-gray-200 mt-4">
                <div className="grid grid-cols-2 gap-3">
            <a 
              href="https://zalo.me/0976005335" 
              target="_blank" 
              rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-4 bg-blue-100 text-blue-700 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-200 hover:scale-[0.98] group min-h-[52px] text-base"
                    onClick={closeMenu}
            >
                    <span className="mr-3 text-lg group-hover:animate-bounce">💬</span>
                    Chat Zalo
            </a>
            <a 
                    href="mailto:info@xuatnhapkhautbs.vn"
                    className="flex items-center justify-center px-4 py-4 bg-green-100 text-green-700 rounded-xl font-semibold transition-all duration-300 hover:bg-green-200 hover:scale-[0.98] group min-h-[52px] text-base"
                    onClick={closeMenu}
                  >
                    <span className="mr-3 text-lg group-hover:animate-pulse">✉️</span>
                    Email
                  </a>
                </div>
              </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  )
} 