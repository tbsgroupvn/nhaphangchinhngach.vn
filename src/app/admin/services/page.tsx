'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaFilter, 
  FaSearch, FaSort, FaSortUp, FaSortDown, FaImage, FaCog
} from 'react-icons/fa';

interface Service {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'inactive';
  views: number;
  createdAt: string;
  updatedAt: string;
  author: string;
  image?: string;
  price: string;
  featured: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setServices([
        {
          id: '1',
          title: 'Dịch vụ nhập khẩu chính ngạch từ Trung Quốc',
          category: 'nhap-khau-chinh-ngach',
          status: 'active',
          views: 2840,
          createdAt: '2024-01-15',
          updatedAt: '2024-12-20',
          author: 'Admin TBS',
          image: '/images/service1.jpg',
          price: 'Liên hệ báo giá',
          featured: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý dịch vụ</h1>
          <p className="text-gray-600">
            Quản lý tất cả dịch vụ xuất nhập khẩu của TBS GROUP
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <Link
            href="/admin/services/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Thêm dịch vụ mới
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <FaCog className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500 text-lg">Trang quản lý dịch vụ</p>
          <p className="text-sm text-gray-400 mt-1">
            Tính năng đang được hoàn thiện...
          </p>
        </div>
      </div>
    </div>
  );
} 