'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '../../../components/admin/AdminProvider'

export default function NetlifyCMSPage() {
  const { user, logout } = useAdmin()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra quyền truy cập
    if (!user) {
      window.location.href = '/admin'
      return
    }

    // Tự động chuyển đến Netlify CMS
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Netlify CMS
              </h1>
              <p className="text-sm text-gray-500">
                Hệ thống quản lý nội dung chuyên nghiệp
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Xin chào, {user.username}
              </span>
              <button
                onClick={() => window.location.href = '/admin'}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                ← Trở về Dashboard
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CMS Content */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải Netlify CMS...</p>
            </div>
          </div>
        ) : (
          <div className="h-screen">
            <iframe
              src="/admin/index.html"
              className="w-full h-full border-0"
              title="Netlify CMS"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        )}
      </div>

      {/* Fallback cho trường hợp iframe không load */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-medium text-gray-900 mb-2">
            Không thể tải CMS?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Thử truy cập trực tiếp vào Netlify CMS
          </p>
          <div className="flex space-x-2">
            <a
              href="/admin/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 text-xs font-medium text-center text-white bg-primary-600 border border-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Mở tab mới
            </a>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-3 py-2 text-xs font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Tải lại
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 