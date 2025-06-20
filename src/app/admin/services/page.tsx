'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaStar, FaRegStar,
  FaCheckCircle, FaTimesCircle, FaCog, FaChartLine, FaDownload
} from 'react-icons/fa';

interface Service {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  views: number;
  createdAt: string;
  updatedAt: string;
  author: string;
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
          title: 'Dich vu nhap khau chinh ngach tu Trung Quoc',
          category: 'nhap-khau-chinh-ngach',
          status: 'active',
          views: 2840,
          createdAt: '2024-01-15',
          updatedAt: '2024-12-20',
          author: 'Admin TBS',
          price: 'Tu 50.000d/kg',
          featured: true
        },
        {
          id: '2',
          title: 'Van chuyen hang hoa duong bien',
          category: 'van-chuyen-duong-bien',
          status: 'active',
          views: 1925,
          createdAt: '2024-02-10',
          updatedAt: '2024-12-18',
          author: 'Editor Logistics',
          price: 'Lien he bao gia',
          featured: false
        },
        {
          id: '3',
          title: 'Gom hang le ghep container',
          category: 'gom-hang-le',
          status: 'draft',
          views: 756,
          createdAt: '2024-03-05',
          updatedAt: '2024-12-15',
          author: 'Editor Logistics',
          price: 'Tu 25.000d/kg',
          featured: true
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: Service['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Hoat dong</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Tam dung</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Ban nhap</span>;
      default:
        return null;
    }
  };

  const stats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    featured: services.filter(s => s.featured).length,
    totalViews: services.reduce((sum, s) => sum + s.views, 0)
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quan ly dich vu</h1>
          <p className="text-gray-600">
            Quan ly tat ca dich vu xuat nhap khau cua TBS GROUP
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex gap-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <FaDownload />
            Xuat Excel
          </button>
          
          <Link
            href="/admin/services/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
          >
            <FaPlus />
            Them dich vu moi
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tong dich vu</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCog className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dang hoat dong</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Noi bat</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaStar className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tong luot xem</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-purple-600" />
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
            placeholder="Tim kiem dich vu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900">Ten dich vu</th>
                <th className="text-left p-4 font-medium text-gray-900">Danh muc</th>
                <th className="text-left p-4 font-medium text-gray-900">Trang thai</th>
                <th className="text-left p-4 font-medium text-gray-900">Gia</th>
                <th className="text-left p-4 font-medium text-gray-900">Luot xem</th>
                <th className="text-left p-4 font-medium text-gray-900">Cap nhat</th>
                <th className="text-left p-4 font-medium text-gray-900">Thao tac</th>
              </tr>
            </thead>
            
            <tbody>
              {services
                .filter(service => 
                  service.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(service => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{service.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {service.featured && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                <FaStar className="text-xs" />
                                Noi bat
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className="text-sm text-gray-600 capitalize">
                        {service.category.replace(/-/g, ' ')}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      {getStatusBadge(service.status)}
                    </td>
                    
                    <td className="p-4">
                      <span className="font-medium text-gray-900">{service.price}</span>
                    </td>
                    
                    <td className="p-4">
                      <span className="text-gray-600">{service.views.toLocaleString()}</span>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm text-gray-600">
                        <div>{service.updatedAt}</div>
                        <div className="text-xs text-gray-500">boi {service.author}</div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Xem truoc"
                        >
                          <FaEye />
                        </button>
                        
                        <Link
                          href={`/admin/services/edit/${service.id}`}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Chinh sua"
                        >
                          <FaEdit />
                        </Link>
                        
                        <button
                          className={`p-2 rounded ${
                            service.featured 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                          }`}
                          title={service.featured ? 'Bo noi bat' : 'Danh dau noi bat'}
                        >
                          {service.featured ? <FaStar /> : <FaRegStar />}
                        </button>
                        
                        <button
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Xoa"
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
    </div>
  );
} 