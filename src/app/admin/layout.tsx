import React from 'react'
import { Metadata } from 'next'
import AdminProvider from '@/components/admin/AdminProvider'

export const metadata: Metadata = {
  title: 'TBS GROUP CMS - Hệ thống quản trị nội dung',
  description: 'Hệ thống quản trị nội dung website TBS GROUP',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AdminProvider>
  )
} 