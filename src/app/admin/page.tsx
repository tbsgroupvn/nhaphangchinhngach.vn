'use client'

import { useEffect } from 'react'

export default function AdminPage() {
  useEffect(() => {
    window.location.href = '/admin/dashboard'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng đến dashboard...</p>
      </div>
    </div>
  )
} 