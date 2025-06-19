'use client'

import React, { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  EyeIcon, 
  UserGroupIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  pageViews: {
    total: number
    change: number
    data: { date: string, views: number }[]
  }
  uniqueVisitors: {
    total: number
    change: number
    data: { date: string, visitors: number }[]
  }
  averageTime: {
    total: string
    change: number
  }
  bounceRate: {
    total: number
    change: number
  }
  topPages: {
    page: string
    views: number
    change: number
  }[]
  trafficSources: {
    source: string
    visitors: number
    percentage: number
  }[]
  deviceStats: {
    desktop: number
    mobile: number
    tablet: number
  }
  realTimeUsers: number
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [error, setError] = useState<string | null>(null)

  // Mock data for demo - In production, this would fetch from Google Analytics API
  const mockData: AnalyticsData = {
    pageViews: {
      total: 15427,
      change: 12.5,
      data: [
        { date: '2024-11-25', views: 1245 },
        { date: '2024-11-26', views: 1567 },
        { date: '2024-11-27', views: 2134 },
        { date: '2024-11-28', views: 1876 },
        { date: '2024-11-29', views: 2456 },
        { date: '2024-11-30', views: 3145 },
        { date: '2024-12-01', views: 3004 }
      ]
    },
    uniqueVisitors: {
      total: 8945,
      change: 8.7,
      data: [
        { date: '2024-11-25', visitors: 823 },
        { date: '2024-11-26', visitors: 1024 },
        { date: '2024-11-27', visitors: 1345 },
        { date: '2024-11-28', visitors: 1156 },
        { date: '2024-11-29', visitors: 1489 },
        { date: '2024-11-30', visitors: 1678 },
        { date: '2024-12-01', visitors: 1430 }
      ]
    },
    averageTime: {
      total: '2m 34s',
      change: 15.2
    },
    bounceRate: {
      total: 42.3,
      change: -5.8
    },
    topPages: [
      { page: '/dich-vu', views: 3456, change: 23.4 },
      { page: '/', views: 2890, change: 12.1 },
      { page: '/dich-vu/nhap-khau-chinh-ngach', views: 2134, change: 34.5 },
      { page: '/tin-tuc', views: 1876, change: -2.3 },
      { page: '/lien-he', views: 1654, change: 18.7 }
    ],
    trafficSources: [
      { source: 'Organic Search', visitors: 4235, percentage: 47.3 },
      { source: 'Direct', visitors: 2145, percentage: 24.0 },
      { source: 'Social Media', visitors: 1456, percentage: 16.3 },
      { source: 'Referral', visitors: 789, percentage: 8.8 },
      { source: 'Email', visitors: 320, percentage: 3.6 }
    ],
    deviceStats: {
      desktop: 52.4,
      mobile: 41.2,
      tablet: 6.4
    },
    realTimeUsers: 23
  }

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        // In production, this would be:
        // const response = await fetch(`/api/analytics?range=${timeRange}`)
        // const data = await response.json()
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setAnalyticsData(mockData)
      } catch (err) {
        setError('Không thể tải dữ liệu analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]) // mockData is a constant object that doesn't change, so excluding it is safe

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-center text-red-600">
          <ChartBarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📊 Thống kê Website</h2>
          <p className="text-gray-600">Dữ liệu từ Google Analytics và Microsoft Clarity</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {[
            { key: '1d', label: '24h' },
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

      {/* Real-time Users */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">👥 Người dùng trực tuyến</h3>
            <p className="text-green-100">Đang truy cập website</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{analyticsData.realTimeUsers}</div>
            <div className="flex items-center gap-1 text-green-100">
              <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Lượt xem trang"
          value={analyticsData.pageViews.total.toLocaleString()}
          change={analyticsData.pageViews.change}
          icon={<EyeIcon className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Người dùng duy nhất"
          value={analyticsData.uniqueVisitors.total.toLocaleString()}
          change={analyticsData.uniqueVisitors.change}
          icon={<UserGroupIcon className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Thời gian trung bình"
          value={analyticsData.averageTime.total}
          change={analyticsData.averageTime.change}
          icon={<ClockIcon className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Tỷ lệ thoát"
          value={`${analyticsData.bounceRate.total}%`}
          change={analyticsData.bounceRate.change}
          icon={<ChartBarIcon className="w-6 h-6" />}
          color="orange"
          reverseColor={true}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📄 Trang phổ biến nhất
          </h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{page.page}</div>
                    <div className="text-sm text-gray-500">{page.views.toLocaleString()} lượt xem</div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  page.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {page.change >= 0 ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  )}
                  {Math.abs(page.change)}%
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
            {analyticsData.trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{
                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]
                  }}></div>
                  <span className="font-medium text-gray-900">{source.source}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{source.visitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{source.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📱 Thiết bị truy cập
          </h3>
          <div className="space-y-4">
            <DeviceBar label="Desktop" percentage={analyticsData.deviceStats.desktop} color="blue" />
            <DeviceBar label="Mobile" percentage={analyticsData.deviceStats.mobile} color="green" />
            <DeviceBar label="Tablet" percentage={analyticsData.deviceStats.tablet} color="purple" />
          </div>
        </div>

        {/* External Analytics Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔗 Liên kết ngoài
          </h3>
          <div className="space-y-3">
            <ExternalLink
              title="Google Analytics"
              description="Xem báo cáo chi tiết"
              url="https://analytics.google.com"
              icon="📊"
            />
            <ExternalLink
              title="Microsoft Clarity"
              description="Xem heatmap và session recordings"
              url="https://clarity.microsoft.com"
              icon="🎯"
            />
            <ExternalLink
              title="Google Search Console"
              description="Thống kê tìm kiếm và SEO"
              url="https://search.google.com/console"
              icon="🔍"
            />
          </div>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📈 Lượt xem 7 ngày qua
        </h3>
        <div className="h-64">
          <SimpleLineChart data={analyticsData.pageViews.data} />
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  reverseColor = false 
}: {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: string
  reverseColor?: boolean
}) {
  const isPositive = reverseColor ? change < 0 : change > 0
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <ArrowTrendingUpIcon className="w-4 h-4" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  )
}

// Device Bar Component
function DeviceBar({ label, percentage, color }: {
  label: string
  percentage: number
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  }

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-900">{label}</span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color as keyof typeof colorClasses]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

// External Link Component
function ExternalLink({ title, description, url, icon }: {
  title: string
  description: string
  url: string
  icon: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="font-medium text-gray-900 group-hover:text-primary-600">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <GlobeAltIcon className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
    </a>
  )
}

// Simple Line Chart Component (using CSS)
function SimpleLineChart({ data }: { data: { date: string, views: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.views))
  
  return (
    <div className="h-full flex items-end justify-between gap-2 px-4">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="w-full bg-primary-200 rounded-t-sm hover:bg-primary-300 transition-colors relative group"
            style={{ height: `${(item.views / maxValue) * 200}px` }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {item.views.toLocaleString()}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {new Date(item.date).getDate()}/{new Date(item.date).getMonth() + 1}
          </div>
        </div>
      ))}
    </div>
  )
} 