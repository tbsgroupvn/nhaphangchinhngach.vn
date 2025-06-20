'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FaSave, FaCog, FaGlobe, FaShare, FaShieldAlt, FaEnvelope,
  FaSearch, FaPalette, FaBell, FaDatabase, FaCode, FaUsers,
  FaImage, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram,
  FaYoutube, FaLinkedin, FaTimes, FaCheck, FaExclamationTriangle,
  FaUndo, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    logo: string;
    favicon: string;
    timezone: string;
    language: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
    analyticsId: string;
    searchConsoleId: string;
    enableSitemap: boolean;
    enableRobots: boolean;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    zalo: string;
    tiktok: string;
    enableSocialLogin: boolean;
    enableSocialShare: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableNotifications: boolean;
  };
  security: {
    enableTwoFactor: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
    enableCaptcha: boolean;
    allowedDomains: string[];
    blockedIPs: string[];
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    enableDarkMode: boolean;
    customCSS: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    newUserRegistration: boolean;
    newOrderNotification: boolean;
    systemUpdates: boolean;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'TBS GROUP - Nhập hàng chính ngạch',
      siteDescription: 'Dịch vụ xuất nhập khẩu chuyên nghiệp từ Trung Quốc về Việt Nam',
      contactEmail: 'info@nhaphangchinhngach.vn',
      contactPhone: '+84 123 456 789',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      logo: '/images/tbs-logo.png',
      favicon: '/favicon.ico',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi'
    },
    seo: {
      metaTitle: 'TBS GROUP - Dịch vụ nhập hàng chính ngạch từ Trung Quốc',
      metaDescription: 'Chuyên cung cấp dịch vụ xuất nhập khẩu, vận chuyển, kho bãi từ Trung Quốc về Việt Nam. Uy tín - Nhanh chóng - Tiết kiệm chi phí.',
      metaKeywords: 'nhập khẩu, xuất khẩu, vận chuyển, logistics, Trung Quốc, Việt Nam',
      ogImage: '/images/og-image.jpg',
      analyticsId: 'G-XXXXXXXXXX',
      searchConsoleId: '',
      enableSitemap: true,
      enableRobots: true
    },
    social: {
      facebook: 'https://facebook.com/tbsgroup',
      instagram: 'https://instagram.com/tbsgroup',
      youtube: 'https://youtube.com/tbsgroup',
      linkedin: 'https://linkedin.com/company/tbsgroup',
      zalo: '+84123456789',
      tiktok: 'https://tiktok.com/@tbsgroup',
      enableSocialLogin: false,
      enableSocialShare: true
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@nhaphangchinhngach.vn',
      fromName: 'TBS GROUP',
      enableNotifications: true
    },
    security: {
      enableTwoFactor: false,
      passwordMinLength: 8,
      sessionTimeout: 30,
      enableCaptcha: true,
      allowedDomains: [],
      blockedIPs: []
    },
    appearance: {
      primaryColor: '#DC2626',
      secondaryColor: '#1D4ED8',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
      enableDarkMode: false,
      customCSS: ''
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      newUserRegistration: true,
      newOrderNotification: true,
      systemUpdates: true
    }
  });

  const [activeTab, setActiveTab] = useState<keyof Settings>('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const tabs = [
    { id: 'general', label: 'Tổng quan', icon: FaCog },
    { id: 'seo', label: 'SEO', icon: FaSearch },
    { id: 'social', label: 'Mạng xã hội', icon: FaShare },
    { id: 'email', label: 'Email', icon: FaEnvelope },
    { id: 'security', label: 'Bảo mật', icon: FaShieldAlt },
    { id: 'appearance', label: 'Giao diện', icon: FaPalette },
    { id: 'notifications', label: 'Thông báo', icon: FaBell }
  ];

  const updateSettings = (section: keyof Settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically send data to your API
      console.log('Saving settings:', settings);
      
      setSaved(true);
      setUnsavedChanges(false);
      
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Bạn có chắc muốn reset về cài đặt mặc định? Thao tác này không thể hoàn tác.')) {
      // Reset logic here
      setUnsavedChanges(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt website</h1>
          <p className="text-gray-600 mt-1">Quản lý cấu hình và tùy chỉnh website</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Reset mặc định
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading || !unsavedChanges}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaSave />
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Save Status */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <FaCheckCircle className="text-green-600" />
          <span className="text-green-800">Đã lưu thành công!</span>
        </div>
      )}

      {unsavedChanges && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <FaExclamationTriangle className="text-yellow-600" />
          <span className="text-yellow-800">Có thay đổi chưa được lưu</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as keyof Settings)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên website *
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email liên hệ *
                    </label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSettings('general', 'contactEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={settings.general.contactPhone}
                      onChange={(e) => updateSettings('general', 'contactPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Múi giờ
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                      <option value="Asia/Shanghai">Trung Quốc (GMT+8)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả website
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    value={settings.general.address}
                    onChange={(e) => updateSettings('general', 'address', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Logo & Favicon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo chính
                    </label>
                    <div className="flex items-center gap-4">
                      <Image src={settings.general.logo} alt="Logo" className="w-16 h-16 object-contain border rounded" width={64} height={64} />
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Đổi logo
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon
                    </label>
                    <div className="flex items-center gap-4">
                      <Image src={settings.general.favicon} alt="Favicon" className="w-8 h-8 object-contain border rounded" width={32} height={32} />
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Đổi favicon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Cài đặt SEO</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title *
                    </label>
                    <input
                      type="text"
                      value={settings.seo.metaTitle}
                      onChange={(e) => updateSettings('seo', 'metaTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {settings.seo.metaTitle.length}/60 ký tự
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description *
                    </label>
                    <textarea
                      value={settings.seo.metaDescription}
                      onChange={(e) => updateSettings('seo', 'metaDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {settings.seo.metaDescription.length}/160 ký tự
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={settings.seo.metaKeywords}
                      onChange={(e) => updateSettings('seo', 'metaKeywords', e.target.value)}
                      placeholder="Từ khóa 1, từ khóa 2, từ khóa 3..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        value={settings.seo.analyticsId}
                        onChange={(e) => updateSettings('seo', 'analyticsId', e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Console ID
                      </label>
                      <input
                        type="text"
                        value={settings.seo.searchConsoleId}
                        onChange={(e) => updateSettings('seo', 'searchConsoleId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.seo.enableSitemap}
                        onChange={(e) => updateSettings('seo', 'enableSitemap', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Tự động tạo sitemap.xml</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.seo.enableRobots}
                        onChange={(e) => updateSettings('seo', 'enableRobots', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Tự động tạo robots.txt</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Mẹo SEO</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Meta title nên có 50-60 ký tự</li>
                  <li>• Meta description nên có 150-160 ký tự</li>
                  <li>• Sử dụng từ khóa chính trong title và description</li>
                  <li>• Cập nhật thường xuyên để theo dõi hiệu suất</li>
                </ul>
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Mạng xã hội</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaFacebook className="inline text-blue-600 mr-2" />
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={settings.social.facebook}
                      onChange={(e) => updateSettings('social', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaInstagram className="inline text-pink-600 mr-2" />
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={settings.social.instagram}
                      onChange={(e) => updateSettings('social', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/yourpage"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaYoutube className="inline text-red-600 mr-2" />
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={settings.social.youtube}
                      onChange={(e) => updateSettings('social', 'youtube', e.target.value)}
                      placeholder="https://youtube.com/yourchannel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaLinkedin className="inline text-blue-800 mr-2" />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={settings.social.linkedin}
                      onChange={(e) => updateSettings('social', 'linkedin', e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📱 Zalo
                    </label>
                    <input
                      type="text"
                      value={settings.social.zalo}
                      onChange={(e) => updateSettings('social', 'zalo', e.target.value)}
                      placeholder="+84123456789"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎵 TikTok
                    </label>
                    <input
                      type="url"
                      value={settings.social.tiktok}
                      onChange={(e) => updateSettings('social', 'tiktok', e.target.value)}
                      placeholder="https://tiktok.com/@yourpage"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.social.enableSocialShare}
                      onChange={(e) => updateSettings('social', 'enableSocialShare', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Bật nút chia sẻ mạng xã hội</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.social.enableSocialLogin}
                      onChange={(e) => updateSettings('social', 'enableSocialLogin', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Cho phép đăng nhập bằng mạng xã hội</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly... */}
          {activeTab === 'email' && (
            <div className="text-center py-8">
              <FaEnvelope className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500">Cài đặt Email đang được phát triển...</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="text-center py-8">
              <FaShieldAlt className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500">Cài đặt Bảo mật đang được phát triển...</p>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tùy chỉnh giao diện</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu chính
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu phụ
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => updateSettings('appearance', 'secondaryColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => updateSettings('appearance', 'secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Màu nhấn
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.appearance.accentColor}
                        onChange={(e) => updateSettings('appearance', 'accentColor', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.appearance.accentColor}
                        onChange={(e) => updateSettings('appearance', 'accentColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font chữ
                  </label>
                  <select
                    value={settings.appearance.fontFamily}
                    onChange={(e) => updateSettings('appearance', 'fontFamily', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Nunito">Nunito</option>
                  </select>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSS tùy chỉnh
                  </label>
                  <textarea
                    value={settings.appearance.customCSS}
                    onChange={(e) => updateSettings('appearance', 'customCSS', e.target.value)}
                    rows={6}
                    placeholder="/* Thêm CSS tùy chỉnh tại đây */"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="text-center py-8">
              <FaBell className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500">Cài đặt Thông báo đang được phát triển...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 