import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { KH_COOKIE_NAME, verifyKhachHangSession, type KhachHangSession } from './khachhang-auth';

/**
 * Lấy phiên khách hàng. Không có phiên hợp lệ thì đá về trang đăng nhập.
 * MỌI màn trong /khachhang phải lấy code/username qua đây, không lấy từ URL.
 */
export async function layPhienBatBuoc(): Promise<KhachHangSession> {
  const token = cookies().get(KH_COOKIE_NAME)?.value;
  const phien = token ? await verifyKhachHangSession(token) : null;
  if (!phien) redirect('/khachhang/dang-nhap');
  return phien;
}

export async function layPhien(): Promise<KhachHangSession | null> {
  const token = cookies().get(KH_COOKIE_NAME)?.value;
  return token ? await verifyKhachHangSession(token) : null;
}
