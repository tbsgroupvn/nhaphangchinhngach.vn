import { layPhienBatBuoc } from '@/lib/khachhang-phien';
import GhiVetLuotXem from '@/components/khachhang/GhiVetLuotXem';
import FormDoiMatKhau from './FormDoiMatKhau';

export const dynamic = 'force-dynamic';

export default async function TrangDoiMatKhau() {
  const phien = await layPhienBatBuoc();

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <GhiVetLuotXem trang="changepass" />
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h1 className="text-base font-semibold text-gray-800">Đổi mật khẩu</h1>
          <p className="mt-0.5 text-xs text-gray-500">Tài khoản: <b>{phien.username}</b></p>
        </div>
        <FormDoiMatKhau />
      </div>
    </div>
  );
}
