'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, CogIcon, CheckIcon } from '@heroicons/react/24/outline'
import { grantConsent, revokeConsent, hasConsent } from '@/lib/analytics'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 2000)
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(localStorage.getItem('cookie_preferences') || '{}')
        setPreferences(prev => ({ ...prev, ...savedPreferences }))
      } catch (e) {
        console.error('Error loading cookie preferences:', e)
      }
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    
    setPreferences(allAccepted)
    localStorage.setItem('cookie_consent', 'accepted')
    localStorage.setItem('cookie_preferences', JSON.stringify(allAccepted))
    localStorage.setItem('analytics_consent', 'true')
    
    grantConsent()
    setShowBanner(false)
    
    // Reload page to apply analytics scripts
    window.location.reload()
  }

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    
    setPreferences(onlyNecessary)
    localStorage.setItem('cookie_consent', 'rejected')
    localStorage.setItem('cookie_preferences', JSON.stringify(onlyNecessary))
    localStorage.setItem('analytics_consent', 'false')
    
    revokeConsent()
    setShowBanner(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookie_consent', 'custom')
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences))
    localStorage.setItem('analytics_consent', preferences.analytics ? 'true' : 'false')
    
    if (preferences.analytics) {
      grantConsent()
    } else {
      revokeConsent()
    }
    
    setShowBanner(false)
    setShowDetails(false)
    
    // Reload page to apply changes
    window.location.reload()
  }

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    if (key === 'necessary') return // Cannot disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-primary-600 shadow-2xl z-[9999] max-h-[90vh] overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {!showDetails ? (
            /* Main Banner */
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <CogIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    🍪 Chúng tôi sử dụng cookies
                  </h3>
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Website TBS GROUP sử dụng cookies để cải thiện trải nghiệm của bạn, phân tích lưu lượng truy cập và cung cấp nội dung phù hợp. Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và chỉ thu thập dữ liệu không định danh.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    ✅ Bảo vệ quyền riêng tư
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    📊 Phân tích không định danh  
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    🎯 Cải thiện trải nghiệm
                  </span>
                </div>
                
                <p className="text-sm text-gray-600">
                  Xem chi tiết trong{' '}
                  <a href="/chinh-sach/cookie" className="text-primary-600 hover:underline font-medium">
                    Chính sách Cookie
                  </a>{' '}
                  và{' '}
                  <a href="/chinh-sach/privacy" className="text-primary-600 hover:underline font-medium">
                    Chính sách Bảo mật
                  </a>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:flex-col xl:flex-row">
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2 min-w-[160px] justify-center"
                >
                  <CheckIcon className="w-5 h-5" />
                  Chấp nhận tất cả
                </button>
                
                <button
                  onClick={rejectAll}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors min-w-[160px]"
                >
                  Từ chối tất cả
                </button>
                
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors flex items-center gap-2 min-w-[160px] justify-center"
                >
                  <CogIcon className="w-5 h-5" />
                  Tùy chỉnh
                </button>
              </div>
            </div>
          ) : (
            /* Detailed Settings */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Cài đặt Cookie chi tiết
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        🔒 Cookies cần thiết
                      </h4>
                      <p className="text-sm text-gray-600">
                        Luôn được bật - Cần thiết cho hoạt động cơ bản của website
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Luôn bật
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Cookies này cần thiết để website hoạt động và không thể tắt. Chúng thường chỉ được thiết lập để phản hồi các hành động bạn thực hiện như đăng nhập, điền form liên hệ.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        📊 Cookies phân tích
                      </h4>
                      <p className="text-sm text-gray-600">
                        Google Analytics, Microsoft Clarity - Giúp chúng tôi hiểu cách bạn sử dụng website
                      </p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => updatePreference('analytics', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.analytics ? 'bg-primary-600' : 'bg-gray-200'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-700">
                    Cookies này giúp chúng tôi đếm lượt truy cập, hiểu nguồn lưu lượng để cải thiện hiệu suất website. Tất cả thông tin được thu thập là ẩn danh.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        🎯 Cookies tiếp thị
                      </h4>
                      <p className="text-sm text-gray-600">
                        Facebook Pixel, Google Ads - Hiển thị quảng cáo phù hợp
                      </p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => updatePreference('marketing', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.marketing ? 'bg-primary-600' : 'bg-gray-200'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-700">
                    Cookies này được sử dụng để hiển thị quảng cáo phù hợp với sở thích của bạn trên các website khác và mạng xã hội.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        ⚙️ Cookies chức năng
                      </h4>
                      <p className="text-sm text-gray-600">
                        Lưu trữ tùy chọn, ngôn ngữ - Cải thiện trải nghiệm
                      </p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => updatePreference('functional', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.functional ? 'bg-primary-600' : 'bg-gray-200'
                      }`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.functional ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-700">
                    Cookies này cho phép website nhớ các lựa chọn của bạn (như tên người dùng, ngôn ngữ) và cung cấp các tính năng nâng cao hơn.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={savePreferences}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Lưu tùy chỉnh
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Chấp nhận tất cả
                </button>
                <button
                  onClick={rejectAll}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Từ chối tất cả
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Floating cookie settings button (for users who want to change preferences later)
export function CookieSettingsButton() {
  const [showConsent, setShowConsent] = useState(false)

  const openSettings = () => {
    // Remove existing consent to show banner again
    localStorage.removeItem('cookie_consent')
    window.location.reload()
  }

  return (
    <button
      onClick={openSettings}
      className="fixed bottom-4 left-4 z-50 bg-white border-2 border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-105"
      title="Cài đặt Cookie"
    >
      <CogIcon className="w-6 h-6 text-gray-600" />
    </button>
  )
} 