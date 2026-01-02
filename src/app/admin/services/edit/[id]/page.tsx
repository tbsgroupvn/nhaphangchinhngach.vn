'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FaSave, FaArrowLeft } from 'react-icons/fa'

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '',
    icon: '🚢',
    priceFrom: '',
    tags: [] as string[]
  })

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch('/api/admin/content/services')
        const data = await response.json()

        if (data.success && data.data) {
          const service = data.data.find((s: any) => s.id === serviceId)
          if (service) {
            setForm({
              title: service.title,
              slug: service.slug,
              description: service.description,
              content: service.benefits?.join('\n') || '',
              category: service.category,
              icon: service.icon,
              priceFrom: service.ctaText || '',
              tags: service.features || []
            })
          }
        }
      } catch (error) {
        console.error('Error fetching service:', error)
      }
    }

    if (serviceId) {
      fetchService()
    }
  }, [serviceId])

  const handleSave = async () => {
    setLoading(true)
    try {
      if (!form.title || !form.description) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }

      const serviceData = {
        id: serviceId,
        title: form.title,
        slug: form.slug,
        icon: form.icon,
        description: form.description,
        shortDescription: form.description.substring(0, 150),
        benefits: form.content.split('\n').filter(line => line.trim()),
        process: [form.content],
        commitment: [],
        features: form.tags,
        ctaText: form.priceFrom || 'Liên hệ báo giá',
        category: form.category
      }

      const response = await fetch('/api/admin/content/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      })

      const result = await response.json()

      if (result.success) {
        alert('Dịch vụ đã được cập nhật thành công!')
        router.push('/admin/services')
      } else {
        alert(`Lỗi: ${result.error || 'Không thể cập nhật dịch vụ'}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Có lỗi xảy ra khi lưu dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft />
              Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa dịch vụ</h1>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <FaSave />
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên dịch vụ *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung chi tiết
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex gap-2">
              {['🚢', '📦', '🚚', '🚄', '📄', '⚖️', '📋', '🎯'].map(icon => (
                <button
                  key={icon}
                  onClick={() => setForm(prev => ({ ...prev, icon }))}
                  className={`p-2 rounded-lg border-2 text-xl hover:bg-gray-50 ${
                    form.icon === icon ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá từ / CTA
            </label>
            <input
              type="text"
              value={form.priceFrom}
              onChange={(e) => setForm(prev => ({ ...prev, priceFrom: e.target.value }))}
              placeholder="VD: 50.000đ/kg, Liên hệ báo giá"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
