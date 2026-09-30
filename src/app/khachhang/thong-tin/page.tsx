import { layPhienBatBuoc } from '@/lib/khachhang-phien';
import { hoSo } from '@/lib/khachhang-erp';
import GhiVetLuotXem from '@/components/khachhang/GhiVetLuotXem';
import FormHoSo from './FormHoSo';

export const dynamic = 'force-dynamic';

export default async function TrangHoSo() {
  const phien = await layPhienBatBuoc();
  const ban = await hoSo(phien.username);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <GhiVetLuotXem trang="info" />
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h1 className="text-base font-semibold text-gray-800">Hồ sơ cá nhân</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Mã khách hàng: <b>{phien.code}</b> · Tài khoản: <b>{phien.username}</b>
          </p>
        </div>
        {ban ? (
          <FormHoSo ban={ban} />
        ) : (
          <div className="px-4 py-6 text-center text-sm text-red-600">
            Không thể hiển thị dữ liệu. Vui lòng thử lại sau vài phút.
          </div>
        )}
      </div>
    </div>
  );
}
