import Link from 'next/link';
import { tienVN } from '@/lib/khachhang-dinhdang';
import type { ViTongQuan } from '@/lib/khachhang-erp';

export default function TheVi({ vi }: { vi: ViTongQuan | null }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between bg-primary-700 px-4 py-3 text-white">
        <span className="font-semibold text-sm">Ví của tôi</span>
        <Link href="/khachhang/vi-cua-toi" className="text-xs text-primary-100 hover:text-white">
          Chi tiết ›
        </Link>
      </div>

      {!vi ? (
        <div className="px-4 py-4 text-sm text-red-600">
          Không thể hiển thị số dư ví hiện tại. Vui lòng thử lại sau vài phút.
        </div>
      ) : (
        <>
          <div className="px-4 py-4 bg-primary-50 border-b border-gray-200">
            <div className="text-xs text-gray-500">Số dư hiện tại</div>
            <div className="text-2xl font-bold text-primary-800">{tienVN(vi.sodu)}</div>
          </div>
          <dl className="divide-y divide-gray-100 text-sm">
            <div className="flex justify-between px-4 py-2">
              <dt className="text-gray-500">Tổng nạp</dt>
              <dd className="font-medium text-gray-900">{tienVN(vi.tongthu)}</dd>
            </div>
            <div className="flex justify-between px-4 py-2">
              <dt className="text-gray-500">Đã chi</dt>
              <dd className="font-medium text-gray-900">{tienVN(vi.tongchi * -1)}</dd>
            </div>
            {vi.tongrut !== 0 && (
              <div className="flex justify-between px-4 py-2">
                <dt className="text-gray-500">Đã rút</dt>
                <dd className="font-medium text-gray-900">{tienVN(vi.tongrut * -1)}</dd>
              </div>
            )}
            <div className="flex justify-between px-4 py-2">
              <dt className="text-gray-500">Tiền hàng còn</dt>
              <dd className="font-medium text-gray-900">{tienVN(vi.tongtiencon)}</dd>
            </div>
          </dl>
          <div
            className={`flex justify-between px-4 py-3 text-sm font-semibold ${
              vi.cannap > 0 ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            <span>Cần nạp thêm</span>
            <span>{tienVN(vi.cannap)}</span>
          </div>
        </>
      )}
    </div>
  );
}
