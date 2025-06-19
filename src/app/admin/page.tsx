'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/components/admin/AdminProvider'
import AdminHeader from '@/components/admin/AdminHeader'
import StatsCard from '@/components/admin/StatsCard'
import RecentActivity from '@/components/admin/RecentActivity'
import QuickActions from '@/components/admin/QuickActions'

export default function AdminDashboard() {
  const { user } = useAdmin()
  const [stats, setStats] = useState({
    services: { total: 11, published: 11, draft: 0 },
    news: { total: 45, published: 42, draft: 3 },
    popups: { total: 5, active: 2, scheduled: 1, inactive: 2 },
    policies: { total: 5, updated: 2 },
    media: { total: 156, images: 98, documents: 58 },
    visitors: { today: 1247, thisWeek: 8952, thisMonth: 34816 }
  })

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'service',
      action: 'updated',
      title: 'Cập nhật dịch vụ "Nhập khẩu chính ngạch"',
      user: 'admin',
      time: '2 phút trước',
      icon: '🏢'
    },
    {
      id: 2,
      type: 'news',
      action: 'created',
      title: 'Tạo bài viết "Quy định mới về thuế nhập khẩu 2025"',
      user: 'editor',
      time: '15 phút trước',
      icon: '📰'
    },
    {
      id: 3,
      type: 'popup',
      action: 'activated',
      title: 'Kích hoạt popup "Khuyến mãi tháng 1"',
      user: 'admin',
      time: '1 giờ trước',
      icon: '🔔'
    },
    {
      id: 4,
      type: 'media',
      action: 'uploaded',
      title: 'Upload 5 hình ảnh mới vào thư viện',
      user: 'editor',
      time: '2 giờ trước',
      icon: '🖼️'
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Tổng quan" 
        subtitle="Dashboard quản trị website TBS GROUP"
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Chào mừng trở lại, {user?.username}! 👋
                </h2>
                <p className="text-primary-100">
                  Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Dịch vụ"
            value={stats.services.total}
            subtitle={`${stats.services.published} đã xuất bản`}
            icon="🏢"
            color="blue"
            trend={{ value: 0, label: "Ổn định" }}
          />
          <StatsCard
            title="Bài viết"
            value={stats.news.total}
            subtitle={`${stats.news.draft} bản nháp`}
            icon="📰"
            color="green"
            trend={{ value: 3, label: "Bài mới tuần này" }}
          />
          <StatsCard
            title="Popup hoạt động"
            value={stats.popups.active}
            subtitle={`${stats.popups.scheduled} đã lên lịch`}
            icon="🔔"
            color="orange"
            trend={{ value: 1, label: "Popup mới" }}
          />
          <StatsCard
            title="Lượt truy cập hôm nay"
            value={stats.visitors.today.toLocaleString()}
            subtitle="Tuần này: +12%"
            icon="👥"
            color="purple"
            trend={{ value: 12, label: "Tăng so với tuần trước" }}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivities} />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔧 Trạng thái hệ thống
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-800">Website</p>
                  <p className="text-xs text-green-600">Hoạt động bình thường</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-800">Database</p>
                  <p className="text-xs text-green-600">Kết nối ổn định</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Backup</p>
                  <p className="text-xs text-yellow-600">Lần cuối: 2 giờ trước</p>
                </div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 