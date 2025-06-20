'use client'

import { useState, useEffect } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  FaUsers, FaEye, FaMousePointer, FaClock, FaMobile, FaDesktop,
  FaArrowUp, FaArrowDown, FaCalendar, FaDownload, FaShare,
  FaGlobe, FaSearch, FaChartLine, FaFilter, FaSync
} from 'react-icons/fa'

interface AnalyticsData {
  overview: {
    totalVisitors: number;
    totalPageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    newUsers: number;
    returningUsers: number;
    totalSessions: number;
  };
  trends: {
    visitors: { change: number; period: string };
    pageViews: { change: number; period: string };
    sessionDuration: { change: number; period: string };
    bounceRate: { change: number; period: string };
  };
  traffic: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    sessions: number;
    bounceRate: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    uniqueViews: number;
    avgTime: string;
    bounceRate: number;
  }>;
  devices: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  sources: Array<{
    source: string;
    visitors: number;
    percentage: number;
    conversionRate: number;
  }>;
  locations: Array<{
    country: string;
    city: string;
    visitors: number;
    percentage: number;
  }>;
  keywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
  goals: Array<{
    name: string;
    completions: number;
    value: number;
    conversionRate: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7days')
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'content' | 'audience' | 'acquisition'>('overview')

  // Mock data - Replace with real Analytics API
  useEffect(() => {
    setTimeout(() => {
      setData({
        overview: {
          totalVisitors: 12547,
          totalPageViews: 45623,
          avgSessionDuration: 245, // seconds
          bounceRate: 34.5,
          conversionRate: 3.2,
          newUsers: 8934,
          returningUsers: 3613,
          totalSessions: 15847
        },
        trends: {
          visitors: { change: 12.5, period: '7 ngày qua' },
          pageViews: { change: 8.3, period: '7 ngày qua' },
          sessionDuration: { change: -2.1, period: '7 ngày qua' },
          bounceRate: { change: -5.7, period: '7 ngày qua' }
        },
        traffic: [
          { date: '2024-12-14', visitors: 1234, pageViews: 3456, sessions: 1456, bounceRate: 32.1 },
          { date: '2024-12-15', visitors: 1567, pageViews: 4123, sessions: 1789, bounceRate: 29.8 },
          { date: '2024-12-16', visitors: 1890, pageViews: 5234, sessions: 2145, bounceRate: 31.5 },
          { date: '2024-12-17', visitors: 2345, pageViews: 6789, sessions: 2678, bounceRate: 28.9 },
          { date: '2024-12-18', visitors: 2134, pageViews: 5896, sessions: 2356, bounceRate: 33.2 },
          { date: '2024-12-19', visitors: 1876, pageViews: 4567, sessions: 2012, bounceRate: 35.7 },
          { date: '2024-12-20', visitors: 2456, pageViews: 7234, sessions: 2789, bounceRate: 27.3 }
        ],
        topPages: [
          { path: '/', title: 'Trang chủ', views: 8945, uniqueViews: 6234, avgTime: '2:45', bounceRate: 28.5 },
          { path: '/dich-vu', title: 'Dịch vụ', views: 5467, uniqueViews: 4123, avgTime: '3:12', bounceRate: 22.1 },
          { path: '/tin-tuc', title: 'Tin tức', views: 3456, uniqueViews: 2890, avgTime: '4:23', bounceRate: 18.9 },
          { path: '/lien-he', title: 'Liên hệ', views: 2345, uniqueViews: 2156, avgTime: '1:56', bounceRate: 45.2 },
          { path: '/gioi-thieu', title: 'Giới thiệu', views: 1890, uniqueViews: 1567, avgTime: '2:34', bounceRate: 32.7 }
        ],
        devices: [
          { name: 'Desktop', value: 6234, percentage: 49.7 },
          { name: 'Mobile', value: 5456, percentage: 43.5 },
          { name: 'Tablet', value: 857, percentage: 6.8 }
        ],
        sources: [
          { source: 'Google', visitors: 7456, percentage: 59.4, conversionRate: 4.2 },
          { source: 'Direct', visitors: 2345, percentage: 18.7, conversionRate: 5.8 },
          { source: 'Facebook', visitors: 1567, percentage: 12.5, conversionRate: 2.1 },
          { source: 'LinkedIn', visitors: 789, percentage: 6.3, conversionRate: 6.7 },
          { source: 'Others', visitors: 390, percentage: 3.1, conversionRate: 1.9 }
        ],
        locations: [
          { country: 'Việt Nam', city: 'TP.HCM', visitors: 8945, percentage: 71.3 },
          { country: 'Việt Nam', city: 'Hà Nội', visitors: 2134, percentage: 17.0 },
          { country: 'USA', city: 'California', visitors: 567, percentage: 4.5 },
          { country: 'Singapore', city: 'Singapore', visitors: 456, percentage: 3.6 },
          { country: 'Malaysia', city: 'Kuala Lumpur', visitors: 445, percentage: 3.6 }
        ],
        keywords: [
          { keyword: 'nhập khẩu từ trung quốc', impressions: 15467, clicks: 1234, ctr: 7.98, position: 3.2 },
          { keyword: 'dịch vụ logistics', impressions: 12356, clicks: 987, ctr: 7.99, position: 4.1 },
          { keyword: 'vận chuyển hàng hóa', impressions: 9876, clicks: 756, ctr: 7.65, position: 5.3 },
          { keyword: 'xuất nhập khẩu', impressions: 8234, clicks: 623, ctr: 7.57, position: 2.8 },
          { keyword: 'thủ tục hải quan', impressions: 6789, clicks: 445, ctr: 6.56, position: 6.7 }
        ],
        goals: [
          { name: 'Liên hệ tư vấn', completions: 234, value: 15600000, conversionRate: 1.86 },
          { name: 'Đăng ký newsletter', completions: 567, value: 0, conversionRate: 4.52 },
          { name: 'Tải brochure', completions: 123, value: 0, conversionRate: 0.98 },
          { name: 'Gọi điện', completions: 89, value: 8900000, conversionRate: 0.71 }
        ]
      })
      setLoading(false)
    }, 1200)
  }, [dateRange])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getTrendIcon = (change: number) => {
    return change >= 0 ? (
      <FaArrowUp className="text-green-500" />
    ) : (
      <FaArrowDown className="text-red-500" />
    )
  }

  const getTrendColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const COLORS = ['#DC2626', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Báo cáo</h1>
          <p className="text-gray-600">
            Phân tích chi tiết lưu lượng truy cập và hiệu suất website
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="today">Hôm nay</option>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="custom">Tùy chỉnh</option>
          </select>
          
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <FaDownload />
            Xuất báo cáo
          </button>
          
          <button 
            onClick={() => setLoading(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <FaSync />
            Làm mới
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Tổng quan', icon: FaChartLine },
            { id: 'traffic', label: 'Lưu lượng', icon: FaUsers },
            { id: 'content', label: 'Nội dung', icon: FaEye },
            { id: 'audience', label: 'Đối tượng', icon: FaGlobe },
            { id: 'acquisition', label: 'Nguồn truy cập', icon: FaSearch }
          ].map((tab) => (
              <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon />
              {tab.label}
              </button>
            ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng lượt truy cập</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(data.overview.totalVisitors)}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(data.trends.visitors.change)}`}>
                    {getTrendIcon(data.trends.visitors.change)}
                    {Math.abs(data.trends.visitors.change)}% {data.trends.visitors.period}
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lượt xem trang</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(data.overview.totalPageViews)}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(data.trends.pageViews.change)}`}>
                    {getTrendIcon(data.trends.pageViews.change)}
                    {Math.abs(data.trends.pageViews.change)}% {data.trends.pageViews.period}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaEye className="text-green-600 text-xl" />
                </div>
          </div>
        </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
                  <p className="text-sm text-gray-600">Thời gian TB</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDuration(data.overview.avgSessionDuration)}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(data.trends.sessionDuration.change)}`}>
                    {getTrendIcon(data.trends.sessionDuration.change)}
                    {Math.abs(data.trends.sessionDuration.change)}% {data.trends.sessionDuration.period}
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaClock className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ thoát</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.overview.bounceRate}%
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(data.trends.bounceRate.change)}`}>
                    {getTrendIcon(data.trends.bounceRate.change)}
                    {Math.abs(data.trends.bounceRate.change)}% {data.trends.bounceRate.period}
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaMousePointer className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Lưu lượng truy cập</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Lượt truy cập</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Lượt xem</span>
            </div>
          </div>
        </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.traffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString('vi-VN')}
                  formatter={(value, name) => [formatNumber(Number(value)), name === 'visitors' ? 'Lượt truy cập' : 'Lượt xem']}
                />
                <Area type="monotone" dataKey="visitors" stroke="#DC2626" fill="#FEE2E2" />
                <Area type="monotone" dataKey="pageViews" stroke="#3B82F6" fill="#DBEAFE" />
              </AreaChart>
            </ResponsiveContainer>
        </div>

          {/* Device & User Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thiết bị truy cập</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4 space-y-2">
                {data.devices.map((device, index) => (
                  <div key={device.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-gray-600">{device.name}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {formatNumber(device.value)} ({device.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Loại người dùng</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Người dùng mới</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatNumber(data.overview.newUsers)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tỷ lệ</p>
                    <p className="text-lg font-medium text-blue-600">
                      {((data.overview.newUsers / data.overview.totalVisitors) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Người dùng quay lại</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatNumber(data.overview.returningUsers)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Tỷ lệ</p>
                    <p className="text-lg font-medium text-green-600">
                      {((data.overview.returningUsers / data.overview.totalVisitors) * 100).toFixed(1)}%
                    </p>
            </div>
          </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Tỷ lệ chuyển đổi</span>
                    <span className="text-lg font-bold text-purple-600">
                      {data.overview.conversionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${data.overview.conversionRate * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content would be implemented here... */}
      {activeTab !== 'overview' && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'traffic' && 'Phân tích Lưu lượng'}
            {activeTab === 'content' && 'Phân tích Nội dung'}
            {activeTab === 'audience' && 'Phân tích Đối tượng'}
            {activeTab === 'acquisition' && 'Phân tích Nguồn truy cập'}
          </h3>
          <p className="text-gray-600">Tính năng này đang được phát triển...</p>
        </div>
      )}
    </div>
  )
} 