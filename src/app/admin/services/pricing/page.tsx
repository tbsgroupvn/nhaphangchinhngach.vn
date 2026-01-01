'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaPlus, FaEdit, FaTrash, FaTags, FaPercentage, FaCalculator,
  FaSave, FaChartLine, FaDownload, FaUpload, FaSearch, FaCopy
} from 'react-icons/fa'

interface PricingRule {
  id: string
  name: string
  serviceId: string
  serviceName: string
  basePrice: number
  currency: 'VND' | 'USD'
  unit: 'kg' | 'cbm' | 'm3' | 'container' | 'shipment'
  minOrder: number
  maxOrder: number
  discountTiers: DiscountTier[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface DiscountTier {
  minQuantity: number
  maxQuantity: number
  discountPercent: number
  discountType: 'percentage' | 'fixed'
}

export default function ServicesPricingPage() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

  // Fetch pricing data from services API
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/admin/content/services');
        const data = await response.json();

        if (data.success && data.data) {
          // Map services to pricing rules
          const mappedRules = data.data.map((service: any) => ({
            id: service.id,
            name: service.title,
            serviceId: service.id,
            serviceName: service.title,
            basePrice: service.price_from || 50000,
            currency: 'VND' as const,
            unit: 'kg' as const,
            minOrder: 10,
            maxOrder: 1000,
            discountTiers: [
              { minQuantity: 100, maxQuantity: 500, discountPercent: 5, discountType: 'percentage' as const },
              { minQuantity: 500, maxQuantity: 1000, discountPercent: 10, discountType: 'percentage' as const }
            ],
            isActive: service.status === 'active',
            createdAt: service.created_at ? new Date(service.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            updatedAt: service.updated_at ? new Date(service.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          setPricingRules(mappedRules);
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
    }
    return '$' + new Intl.NumberFormat('en-US').format(price)
  }

  const getUnitLabel = (unit: string) => {
    const units = {
      'kg': 'Kilogram',
      'cbm': 'Khối (CBM)',
      'm3': 'Mét khối',
      'container': 'Container',
      'shipment': 'Lô hàng'
    }
    return units[unit as keyof typeof units] || unit
  }

  const filteredRules = pricingRules.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: pricingRules.length,
    active: pricingRules.filter(r => r.isActive).length,
    inactive: pricingRules.filter(r => !r.isActive).length,
    avgDiscount: pricingRules.length > 0
      ? pricingRules.reduce((sum, r) => sum + (r.discountTiers[0]?.discountPercent || 0), 0) / pricingRules.length
      : 0
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý bảng giá dịch vụ</h1>
          <p className="text-gray-600">
            Thiết lập giá cả và chính sách ưu đãi cho các dịch vụ logistics
          </p>
        </div>

        <div className="mt-4 lg:mt-0 flex gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <FaUpload />
            Import bảng giá
          </button>

          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <FaDownload />
            Xuất Excel
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Thêm bảng giá mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng bảng giá</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaTags className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang áp dụng</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tạm dừng</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FaPercentage className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Giảm giá TB</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgDiscount.toFixed(1)}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaCalculator className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bảng giá..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {/* Pricing Rules Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Tên bảng giá</th>
                <th className="text-left p-4 font-medium text-gray-900">Dịch vụ</th>
                <th className="text-left p-4 font-medium text-gray-900">Giá cơ bản</th>
                <th className="text-left p-4 font-medium text-gray-900">Đơn vị</th>
                <th className="text-left p-4 font-medium text-gray-900">Số lượng</th>
                <th className="text-left p-4 font-medium text-gray-900">Giảm giá</th>
                <th className="text-left p-4 font-medium text-gray-900">Trạng thái</th>
                <th className="text-left p-4 font-medium text-gray-900">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredRules.map(rule => (
                <tr key={rule.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-500">Cập nhật: {rule.updatedAt}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="text-sm text-gray-600">{rule.serviceName}</p>
                  </td>

                  <td className="p-4">
                    <span className="font-medium text-gray-900">
                      {formatPrice(rule.basePrice, rule.currency)}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="text-sm text-gray-600">{getUnitLabel(rule.unit)}</span>
                  </td>

                  <td className="p-4">
                    <div className="text-sm text-gray-600">
                      <div>Tối thiểu: {rule.minOrder}</div>
                      <div>Tối đa: {rule.maxOrder}</div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      {rule.discountTiers.slice(0, 2).map((tier, index) => (
                        <div key={index} className="text-xs">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {tier.minQuantity}+: -{tier.discountPercent}%
                          </span>
                        </div>
                      ))}
                      {rule.discountTiers.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{rule.discountTiers.length - 2} tier khác
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    {rule.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Tạm dừng
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // Copy pricing info to clipboard
                          const info = `${rule.name}: ${formatPrice(rule.basePrice, rule.currency)}/${getUnitLabel(rule.unit)}`
                          navigator.clipboard.writeText(info)
                          alert('Đã copy thông tin giá!')
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Copy thông tin giá"
                      >
                        <FaCopy />
                      </button>

                      <button
                        onClick={() => setEditingRule(rule)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => {
                          setPricingRules(prev =>
                            prev.map(r =>
                              r.id === rule.id ? { ...r, isActive: !r.isActive } : r
                            )
                          )
                        }}
                        className={`p-2 rounded ${
                          rule.isActive
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={rule.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                      >
                        {rule.isActive ? <FaPercentage /> : <FaChartLine />}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn xóa bảng giá này?')) {
                            setPricingRules(prev => prev.filter(r => r.id !== rule.id))
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Công cụ quản lý giá</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/services"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <FaTags className="text-blue-600 text-xl" />
              <div>
                <h4 className="font-medium text-gray-900">Quản lý dịch vụ</h4>
                <p className="text-sm text-gray-600">Xem và chỉnh sửa các dịch vụ</p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => alert('Tính năng đang phát triển!')}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <FaCalculator className="text-green-600 text-xl" />
              <div>
                <h4 className="font-medium text-gray-900">Máy tính giá</h4>
                <p className="text-sm text-gray-600">Tính toán giá dịch vụ</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => alert('Báo cáo revenue đang phát triển!')}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <FaChartLine className="text-purple-600 text-xl" />
              <div>
                <h4 className="font-medium text-gray-900">Báo cáo doanh thu</h4>
                <p className="text-sm text-gray-600">Phân tích hiệu quả giá</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
