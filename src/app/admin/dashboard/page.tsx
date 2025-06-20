'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FaFileAlt, FaCog, FaUsers, FaEye, FaChartLine, 
  FaBell, FaImage, FaNewspaper, FaServicestack, FaSync, FaClock, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';
import SyncStatus from './sync-status';
import { analyticsService, AnalyticsData, RealTimeMetrics } from '../../../lib/analytics-service';

interface DashboardStats {
  totalServices: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCustomerStories: number;
  totalJobs: number;
  totalPages: number;
  totalContent: number;
  contentByCategory: {
    services: number;
    news: number;
    guides: number;
    customerStories: number;
    jobs: number;
    pages: number;
  };
  recentActivity: Array<{
    title: string;
    date: string;
    type: string;
  }>;
  popularContent: Array<{
    title: string;
    type: string;
    slug: string;
    views: number;
  }>;
  websiteHealth: {
    totalFiles: number;
    lastUpdated: string;
    contentStatus: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trafficData, setTrafficData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [dataSource, setDataSource] = useState<{ isRealData: boolean; message: string } | null>(null);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoRefresh) {
        refreshStats();
        loadRealTimeMetrics();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchRealStats();
    loadRealisticTrafficData();
    loadRealTimeMetrics();
    checkDataSource();
  }, []);

  const fetchRealStats = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/stats', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
        setLastUpdated(new Date(result.timestamp));
      } else {
        setError('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadRealisticTrafficData = async () => {
    try {
      console.log('🔄 Loading traffic data...');
      const data = await analyticsService.getTrafficData(7);
      setTrafficData(data);
      console.log('✅ Traffic data loaded:', data.length, 'days');
    } catch (error) {
      console.error('Error loading traffic data:', error);
    }
  };

  const loadRealTimeMetrics = async () => {
    try {
      console.log('🔄 Loading real-time metrics...');
      const metrics = await analyticsService.getRealTimeMetrics();
      setRealTimeMetrics(metrics);
      console.log('✅ Real-time metrics loaded. Active users:', metrics.activeUsers);
    } catch (error) {
      console.error('Error loading real-time metrics:', error);
    }
  };

  const checkDataSource = async () => {
    try {
      const source = await analyticsService.checkDataSource();
      setDataSource(source);
      console.log('📊 Data source:', source.message);
    } catch (error) {
      console.error('Error checking data source:', error);
    }
  };

  const refreshStats = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchRealStats(),
      loadRealisticTrafficData(),
      loadRealTimeMetrics(),
      checkDataSource()
    ]);
    setRefreshing(false);
  }, []);

  const getCategoryData = () => {
    if (!stats) return [];
    
    return [
      { 
        name: 'Dịch vụ', 
        value: stats.contentByCategory.services,
        color: '#dc2626',
        count: stats.contentByCategory.services
      },
      { 
        name: 'Tin tức', 
        value: stats.contentByCategory.news,
        color: '#2563eb',
        count: stats.contentByCategory.news
      },
      { 
        name: 'Khách hàng', 
        value: stats.contentByCategory.customerStories,
        color: '#16a34a',
        count: stats.contentByCategory.customerStories
      },
      { 
        name: 'Tuyển dụng', 
        value: stats.contentByCategory.jobs,
        color: '#f59e0b',
        count: stats.contentByCategory.jobs
      },
      { 
        name: 'Trang tĩnh', 
        value: stats.contentByCategory.pages,
        color: '#8b5cf6',
        count: stats.contentByCategory.pages
      }
    ].filter(item => item.count > 0);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return <FaServicestack className="text-red-600" />;
      case 'post': return <FaNewspaper className="text-blue-600" />;
      case 'story': return <FaUsers className="text-green-600" />;
      default: return <FaFileAlt className="text-gray-600" />;
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'service': return 'Dịch vụ';
      case 'post': return 'Bài viết';
      case 'story': return 'Câu chuyện KH';
      default: return 'Nội dung';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  // Calculate total traffic for summary
  const getTotalTrafficToday = () => {
    if (trafficData.length === 0) return 0;
    const today = trafficData[trafficData.length - 1];
    return today ? today.views : 0;
  };

  const getTotalVisitorsToday = () => {
    if (trafficData.length === 0) return 0;
    const today = trafficData[trafficData.length - 1];
    return today ? today.visitors : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thống kê Google Analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refreshStats}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Real-time Indicators */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-white text-lg" />
                </div>
                Google Analytics Dashboard
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">REALTIME</span>
                </div>
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-600">
                  TBS GROUP Analytics • {realTimeMetrics && `${realTimeMetrics.activeUsers} người đang online`}
                </p>
                {lastUpdated && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaClock className="w-3 h-3" />
                    <span>Cập nhật: {formatTimeAgo(lastUpdated)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Auto-refresh Toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Auto-refresh</span>
              </label>
              
              {/* Manual Refresh Button */}
              <button
                onClick={refreshStats}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                <FaSync className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              {/* Total Content Counter */}
              <div className="text-right">
                <p className="text-sm text-gray-500">Tổng nội dung</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalContent}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Google Analytics Status */}
        {dataSource && (
          <div className={`mb-6 p-4 rounded-lg border ${
            dataSource.isRealData 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-2">
              {dataSource.isRealData ? (
                <FaCheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <FaExclamationTriangle className="w-5 h-5 text-yellow-600" />
              )}
              <span className={`font-medium ${
                dataSource.isRealData ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {dataSource.message}
              </span>
              {realTimeMetrics?.isRealData && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  LIVE DATA
                </span>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Stats Cards with Real GA Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${refreshing ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lượt xem hôm nay</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900 mt-1">{getTotalTrafficToday().toLocaleString('vi-VN')}</p>
                  {refreshing && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {dataSource?.isRealData ? 'Google Analytics' : 'Dữ liệu mô phỏng'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaEye className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${refreshing ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visitors hôm nay</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900 mt-1">{getTotalVisitorsToday().toLocaleString('vi-VN')}</p>
                  {refreshing && <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <p className="text-sm text-green-600 mt-1">Unique visitors</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FaUsers className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${refreshing ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dịch vụ</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalServices}</p>
                  {refreshing && <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <p className="text-sm text-green-600 mt-1">Đang hoạt động</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <FaServicestack className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${refreshing ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bài viết</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPosts}</p>
                  {refreshing && <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">{stats.publishedPosts}</span> đã đăng • 
                  <span className="font-medium text-orange-500 ml-1">{stats.draftPosts}</span> nháp
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FaNewspaper className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${refreshing ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online ngay bây giờ</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {realTimeMetrics ? realTimeMetrics.activeUsers : 0}
                  </p>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  {realTimeMetrics?.isRealData ? 'Real-time GA' : 'Mô phỏng'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <FaBell className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Sync Status Component */}
        <div className="mb-8">
          <SyncStatus />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Real Google Analytics Traffic Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Google Analytics Traffic (7 ngày)
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded"></div>
                  <span>Lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Visitors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600">
                    {dataSource?.isRealData ? 'REAL GA DATA' : 'SIMULATION'}
                  </span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    value.toLocaleString('vi-VN'),
                    name === 'views' ? 'Lượt xem' : 'Visitors'
                  ]}
                />
                <Line type="monotone" dataKey="views" stroke="#dc2626" strokeWidth={3} />
                <Line type="monotone" dataKey="visitors" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Real Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Phân bố nội dung</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">CONTENT DATA</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {getCategoryData().map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900 ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Content & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Real Popular Content */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Nội dung nổi bật</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600">CONTENT STATS</span>
              </div>
            </div>
            <div className="space-y-4">
              {stats.popularContent.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white">
                      {getContentTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{getContentTypeLabel(item.type)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.views.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">lượt xem</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button className="w-full p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-3">
                <FaFileAlt />
                <span>Tạo bài viết mới</span>
              </button>
              
              <button className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-3">
                <FaServicestack />
                <span>Thêm dịch vụ mới</span>
              </button>
              
              <button className="w-full p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center gap-3">
                <FaUsers />
                <span>Thêm câu chuyện KH</span>
              </button>
              
              <button className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-3">
                <FaBell />
                <span>Đăng tin tuyển dụng</span>
              </button>
              
              <button className="w-full p-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all flex items-center gap-3">
                <FaCog />
                <span>Cài đặt website</span>
              </button>
            </div>
          </div>
        </div>

        {/* Website Health Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tình trạng website</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Health Monitor</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.websiteHealth.totalFiles}</div>
              <div className="text-sm text-green-800">Tổng file nội dung</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalServices}</div>
              <div className="text-sm text-blue-800">Dịch vụ hoạt động</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.publishedPosts}</div>
              <div className="text-sm text-purple-800">Bài viết đã đăng</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.websiteHealth.contentStatus}</div>
              <div className="text-sm text-gray-800">Trạng thái hệ thống</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 