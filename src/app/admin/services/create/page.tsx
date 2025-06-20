'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FaSave, FaArrowLeft, FaImage, FaFileAlt, FaDollarSign, 
  FaClock, FaUsers, FaTags, FaGlobe, FaEye, FaPlus, FaTimes
} from 'react-icons/fa'
import AdminHeader from '../../../../components/admin/AdminHeader'

interface ServiceForm {
  title: string
  slug: string
  description: string
  content: string
  category: string
  icon: string
  priceFrom: string
  duration: string
  tags: string[]
  status: 'active' | 'inactive' | 'draft'
  featured: boolean
  order: number
  featuredImage?: File
  gallery: File[]
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  pricing: {
    basic: { name: string; price: string; features: string[] }
    standard: { name: string; price: string; features: string[] }
    premium: { name: string; price: string; features: string[] }
  }
  faqs: { question: string; answer: string }[]
}

export default function CreateServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' })
  
  const [form, setForm] = useState<ServiceForm>({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '',
    icon: '🚢',
    priceFrom: '',
    duration: '',
    tags: [],
    status: 'draft',
    featured: false,
    order: 0,
    gallery: [],
    seo: {
      title: '',
      description: '',
      keywords: []
    },
    pricing: {
      basic: { name: 'Cơ bản', price: '', features: [] },
      standard: { name: 'Tiêu chuẩn', price: '', features: [] },
      premium: { name: 'Cao cấp', price: '', features: [] }
    },
    faqs: []
  })

  const categories = [
    { value: 'nhap-khau-chinh-ngach', label: '📦 Nhập khẩu chính ngạch', icon: '📦' },
    { value: 'van-chuyen-duong-bo', label: '🚚 Vận chuyển đường bộ', icon: '🚚' },
    { value: 'van-chuyen-duong-bien', label: '🚢 Vận chuyển đường biển', icon: '🚢' },
    { value: 'van-chuyen-duong-sat', label: '🚄 Vận chuyển đường sắt', icon: '🚄' },
    { value: 'gom-hang-le', label: '📦 Gom hàng lẻ', icon: '📦' },
    { value: 'uy-thac-xnk', label: '📄 Ủy thác xuất nhập khẩu', icon: '📄' },
    { value: 'tu-van-phap-ly', label: '⚖️ Tư vấn pháp lý', icon: '⚖️' },
    { value: 'thong-quan-hai-quan', label: '📋 Thông quan hải quan', icon: '📋' }
  ]

  const icons = ['🚢', '📦', '🚚', '🚄', '📄', '⚖️', '📋', '🎯', '🔒', '💼', '🌐', '⚡']

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      seo: {
        ...prev.seo,
        title: title.length > 0 ? title : prev.seo.title
      }
    }))
  }

  const handleAddTag = () => {
    if (newTag && !form.tags.includes(newTag)) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      setForm(prev => ({
        ...prev,
        faqs: [...prev.faqs, newFAQ]
      }))
      setNewFAQ({ question: '', answer: '' })
    }
  }

  const handleRemoveFAQ = (index: number) => {
    setForm(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async (status: 'draft' | 'active') => {
    setLoading(true)
    try {
      // Validate required fields
      if (!form.title || !form.description || !form.category) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const serviceData = {
        ...form,
        status,
        createdAt: new Date().toISOString()
      }

      console.log('Saving service:', serviceData)
      
      // Redirect back to services list
      router.push('/admin/services')
    } catch (error) {
      console.error('Save error:', error)
      alert('Có lỗi xảy ra khi lưu dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Tạo dịch vụ mới" 
        subtitle="Thêm dịch vụ xuất nhập khẩu mới vào hệ thống"
      />
      
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft />
            Quay lại
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => handleSave('draft')}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Lưu nháp
            </button>
            
            <button
              onClick={() => handleSave('active')}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              <FaSave />
              {loading ? 'Đang lưu...' : 'Xuất bản'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên dịch vụ *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Nhập tên dịch vụ..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  {form.slug && (
                    <p className="text-sm text-gray-500 mt-1">
                      URL: <span className="text-blue-600">/dich-vu/{form.slug}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả ngắn *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả ngắn gọn về dịch vụ (150-200 ký tự)..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {form.description.length}/200 ký tự
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá từ
                    </label>
                    <input
                      type="text"
                      value={form.priceFrom}
                      onChange={(e) => setForm(prev => ({ ...prev, priceFrom: e.target.value }))}
                      placeholder="VD: 50.000đ/kg, Liên hệ báo giá"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian thực hiện
                    </label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setForm(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="VD: 5-14 ngày, 2-3 tuần"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung chi tiết
                  </label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Mô tả chi tiết về dịch vụ, quy trình thực hiện..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảng giá dịch vụ</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(form.pricing).map(([key, plan]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => setForm(prev => ({
                        ...prev,
                        pricing: {
                          ...prev.pricing,
                          [key]: { ...plan, name: e.target.value }
                        }
                      }))}
                      placeholder="Tên gói dịch vụ"
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3 text-sm"
                    />
                    
                    <input
                      type="text"
                      value={plan.price}
                      onChange={(e) => setForm(prev => ({
                        ...prev,
                        pricing: {
                          ...prev.pricing,
                          [key]: { ...plan, price: e.target.value }
                        }
                      }))}
                      placeholder="Giá (VD: 2,000,000đ)"
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-3 text-sm"
                    />
                    
                    <textarea
                      value={plan.features.join('\n')}
                      onChange={(e) => setForm(prev => ({
                        ...prev,
                        pricing: {
                          ...prev.pricing,
                          [key]: { ...plan, features: e.target.value.split('\n').filter(f => f.trim()) }
                        }
                      }))}
                      placeholder="Tính năng (mỗi dòng một tính năng)"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Câu hỏi thường gặp</h3>
              
              <div className="space-y-4 mb-4">
                {form.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{faq.question}</h4>
                      <button
                        onClick={() => handleRemoveFAQ(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Câu hỏi..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Câu trả lời..."
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={handleAddFAQ}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <FaPlus />
                  Thêm FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cài đặt dịch vụ</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon dịch vụ
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {icons.map(icon => (
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
                    Trạng thái
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="draft">📝 Bản nháp</option>
                    <option value="active">✅ Hoạt động</option>
                    <option value="inactive">⏸️ Tạm dừng</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Dịch vụ nổi bật
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thẻ tags</h3>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Thêm tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  <FaPlus />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    <FaTags className="text-xs" />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Hình ảnh</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Chọn ảnh đại diện
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setForm(prev => ({ ...prev, featuredImage: e.target.files![0] }))
                        }
                      }}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, WebP tối đa 2MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 