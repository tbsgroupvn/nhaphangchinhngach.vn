'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FaFileAlt, FaCog, FaUsers, FaEye, FaChartLine, 
  FaBell, FaImage, FaNewspaper, FaServicestack 
} from 'react-icons/fa';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalServices: number;
  totalViews: number;
  activePopups: number;
}

interface TrafficData {
  date: string;
  views: number;
  visitors: number;
}

interface PopularContent {
  title: string;
  views: number;
  type: 'service' | 'news' | 'guide';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalServices: 0,
    totalViews: 0,
    activePopups: 0
  });

  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [popularContent, setPopularContent] = useState<PopularContent[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with real API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalPosts: 156,
        publishedPosts: 142,
        draftPosts: 14,
        totalServices: 8,
        totalViews: 25847,
        activePopups: 2
      });

      setTrafficData([
        { date: '20/12', views: 1240, visitors: 980 },
        { date: '21/12', views: 1380, visitors: 1100 },
        { date: '22/12', views: 1180, visitors: 920 },
        { date: '23/12', views: 1520, visitors: 1200 },
        { date: '24/12', views: 1680, visitors: 1350 },
        { date: '25/12', views: 1420, visitors: 1180 },
        { date: '26/12', views: 1750, visitors: 1420 }
      ]);

      setPopularContent([
        { title: 'Dịch vụ nhập khẩu chính ngạch từ Trung Quốc', views: 2840, type: 'service' },
        { title: 'Thuế suất nhập khẩu mới 2024', views: 2156, type: 'news' },
        { title: 'Cẩm nang xuất nhập khẩu cho người mới', views: 1890, type: 'guide' },
        { title: 'Vận chuyển đường biển tiết kiệm', views: 1654, type: 'service' },
        { title: 'Thủ tục hải quan nhanh chóng', views: 1432, type: 'guide' }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const categoryData = [
    { name: 'Dịch vụ', value: 45, color: '#dc2626' },
    { name: 'Tin tức', value: 30, color: '#2563eb' },
    { name: 'Cẩm nang', value: 20, color: '#16a34a' },
    { name: 'Khách hàng', value: 15, color: '#f59e0b' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <FaChartLine className="text-white text-lg" />
                </div>
                Tổng quan Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Chào mừng trở lại! Đây là tổng quan hoạt động website của bạn.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString('vi-VN')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalPosts}</p>
                <p className="text-sm text-green-600 mt-1">
                  <span className="font-medium">{stats.publishedPosts}</span> đã đăng • 
                  <span className="font-medium text-orange-500 ml-1">{stats.draftPosts}</span> nháp
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dịch vụ</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalServices}</p>
                <p className="text-sm text-green-600 mt-1">Đang hoạt động</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FaServicestack className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">+12% so với tuần trước</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FaEye className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Popup/Thông báo</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activePopups}</p>
                <p className="text-sm text-red-600 mt-1">Đang hiển thị</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <FaBell className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Lượt truy cập 7 ngày</h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded"></div>
                  <span>Lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Người dùng</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#dc2626" strokeWidth={3} />
                <Line type="monotone" dataKey="visitors" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Phân bố nội dung theo chuyên mục</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Content & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Content */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Nội dung nổi bật</h3>
            <div className="space-y-4">
              {popularContent.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.type === 'service' ? 'bg-red-100 text-red-600' :
                      item.type === 'news' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {item.type === 'service' ? <FaServicestack /> :
                       item.type === 'news' ? <FaNewspaper /> : <FaFileAlt />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 capitalize">{
                        item.type === 'service' ? 'Dịch vụ' :
                        item.type === 'news' ? 'Tin tức' : 'Cẩm nang'
                      }</p>
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
                <FaBell />
                <span>Tạo popup/thông báo</span>
              </button>
              
              <button className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-3">
                <FaImage />
                <span>Quản lý tài nguyên</span>
              </button>
              
              <button className="w-full p-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all flex items-center gap-3">
                <FaCog />
                <span>Cài đặt website</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 