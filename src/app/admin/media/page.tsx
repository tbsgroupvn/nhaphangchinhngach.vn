'use client';

import { useState } from 'react';
import { FaUpload, FaFolder, FaImage, FaFile } from 'react-icons/fa';

export default function MediaPage() {
  const [loading] = useState(false);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="h-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý tài nguyên</h1>
          <p className="text-gray-600">
            Upload, tổ chức và quản lý hình ảnh, video, tài liệu của website
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex gap-3">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl">
            <FaUpload />
            Upload file
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-12">
          <FaFolder className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500 text-lg">Quản lý tài nguyên</p>
          <p className="text-sm text-gray-400 mt-1">
            Tính năng đang được hoàn thiện...
          </p>
        </div>
      </div>
    </div>
  );
} 