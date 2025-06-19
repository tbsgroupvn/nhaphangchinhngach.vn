'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '../../../components/admin/AdminProvider'
import AdminHeader from '../../../components/admin/AdminHeader'

export default function AnalyticsPage() {
  const { user } = useAdmin()
  const [timeRange, setTimeRange] = useState('7d')

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Thống kê & Phân tích" 
        subtitle="Dữ liệu chi tiết về lưu lượng truy cập và hành vi người dùng"
      />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
            {[
              { key: '1d', label: '24 giờ' },
              { key: '7d', label: '7 ngày' },
              { key: '30d', label: '30 ngày' },
              { key: '90d', label: '3 tháng' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setTimeRange(option.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === option.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">👥 Người dùng trực tuyến</h3>
              <p className="text-green-100">Đang truy cập website ngay bây giờ</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">23</div>
              <div className="flex items-center gap-1 text-green-100">
                <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
                <span className="text-sm">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Lượt xem trang"
            value="15,427"
            change={12.5}
            icon="👁️"
            color="blue"
          />
          <MetricCard
            title="Người dùng duy nhất"
            value="8,945"
            change={8.7}
            icon="👥"
            color="green"
          />
          <MetricCard
            title="Thời gian trung bình"
            value="2m 34s"
            change={15.2}
            icon="⏱️"
            color="purple"
          />
          <MetricCard
            title="Tỷ lệ thoát"
            value="42.3%"
            change={-5.8}
            icon="📊"
            color="orange"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Pages */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📄 Trang phổ biến nhất
            </h3>
            <div className="space-y-3">
              {[
                { page: '/dich-vu', views: 3456, change: 23.4 },
                { page: '/', views: 2890, change: 12.1 },
                { page: '/dich-vu/nhap-khau-chinh-ngach', views: 2134, change: 34.5 },
                { page: '/tin-tuc', views: 1876, change: -2.3 },
                { page: '/lien-he', views: 1654, change: 18.7 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{item.page}</div>
                      <div className="text-sm text-gray-500">{item.views.toLocaleString()} lượt xem</div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🌐 Nguồn lưu lượng
            </h3>
            <div className="space-y-3">
              {[
                { source: 'Organic Search', visitors: 4235, percentage: 47.3, color: '#3B82F6' },
                { source: 'Direct', visitors: 2145, percentage: 24.0, color: '#10B981' },
                { source: 'Social Media', visitors: 1456, percentage: 16.3, color: '#F59E0B' },
                { source: 'Referral', visitors: 789, percentage: 8.8, color: '#EF4444' },
                { source: 'Email', visitors: 320, percentage: 3.6, color: '#8B5CF6' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium text-gray-900">{item.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{item.visitors.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* External Analytics Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExternalAnalyticsCard
            title="Google Analytics"
            description="Xem báo cáo chi tiết về lưu lượng truy cập"
            url="https://analytics.google.com"
            icon="📊"
            stats="15.4K lượt xem hôm nay"
          />
          <ExternalAnalyticsCard
            title="Microsoft Clarity"
            description="Xem heatmap và session recordings"
            url="https://clarity.microsoft.com"
            icon="🎯"
            stats="23 sessions đang ghi"
          />
          <ExternalAnalyticsCard
            title="Google Search Console"
            description="Thống kê tìm kiếm và SEO"
            url="https://search.google.com/console"
            icon="🔍"
            stats="234 clicks từ tìm kiếm"
          />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  color 
}: {
  title: string
  value: string
  change: number
  icon: string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className={`text-sm font-medium ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? '+' : ''}{change}%
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  )
}

function ExternalAnalyticsCard({
  title,
  description,
  url,
  icon,
  stats
}: {
  title: string
  description: string
  url: string
  icon: string
  stats: string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Mở →
        </a>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
        {stats}
      </div>
    </div>
  )
} 