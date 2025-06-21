'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  phone: string;
  productType: string;
  email?: string;
}

export default function LandingForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    productType: '',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/landing-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: result.message || 'Cảm ơn bạn! Chúng tôi sẽ liên hệ trong vòng 15 phút.'
        });
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          productType: '',
          email: ''
        });

        // Track conversion for ads
        // gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXXX/XXXXXXXX'});
        // fbq('track', 'Lead');
        
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Có lỗi xảy ra, vui lòng thử lại'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({
        type: 'error',
        text: 'Có lỗi xảy ra, vui lòng thử lại'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Họ và tên <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200"
              placeholder="Nhập họ tên của bạn"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Số điện thoại <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200"
              placeholder="0901 234 567"
            />
          </div>
        </div>

        {/* Product Type Field */}
        <div>
          <label htmlFor="productType" className="block text-sm font-medium mb-2">
            Loại hàng hóa cần nhập <span className="text-red-400">*</span>
          </label>
          <select
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200"
          >
            <option value="">Chọn loại hàng hóa</option>
            <option value="fashion">Thời trang & Phụ kiện</option>
            <option value="electronics">Điện tử & Công nghệ</option>
            <option value="homeware">Đồ gia dụng & Nội thất</option>
            <option value="beauty">Mỹ phẩm & Chăm sóc sức khỏe</option>
            <option value="sports">Thể thao & Giải trí</option>
            <option value="machinery">Máy móc & Thiết bị</option>
            <option value="materials">Nguyên liệu & Vật liệu</option>
            <option value="other">Khác (sẽ tư vấn chi tiết)</option>
          </select>
        </div>

        {/* Email Field (Optional) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email (tùy chọn)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200"
            placeholder="email@example.com"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-blue-900 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
              Đang gửi...
            </div>
          ) : (
            '📤 Gửi yêu cầu báo giá'
          )}
        </button>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 rounded-lg text-center font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? '✅ ' : '❌ '}
            {message.text}
          </div>
        )}

        {/* Trust Indicators */}
        <div className="text-center text-sm opacity-80">
          <p className="mb-2">🔒 Thông tin của bạn được bảo mật tuyệt đối</p>
          <p>⚡ Cam kết phản hồi trong vòng 15 phút</p>
        </div>
      </form>
    </div>
  );
} 