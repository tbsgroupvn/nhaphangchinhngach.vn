import { NextResponse } from 'next/server';
import { layPhien } from '@/lib/khachhang-phien';
import { doiMatKhau } from '@/lib/khachhang-erp';
import { KH_COOKIE_NAME } from '@/lib/khachhang-auth';

const RE_MK = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/;

export async function POST(req: Request) {
  const phien = await layPhien();
  if (!phien) return NextResponse.json({ status: false, msg: 'Phiên đã hết hạn.' }, { status: 401 });

  const b = await req.json().catch(() => null);
  const cu = String(b?.cu || '');
  const moi = String(b?.moi || '');

  if (!cu || !moi) return NextResponse.json({ status: false, msg: 'Vui lòng nhập đầy đủ thông tin.' });
  if (!RE_MK.test(moi)) {
    return NextResponse.json({
      status: false,
      msg: 'Mật khẩu mới phải dài 6–15 ký tự, chỉ gồm chữ và số, và phải có cả chữ thường, chữ hoa và chữ số.',
    });
  }
  if (cu === moi) {
    return NextResponse.json({ status: false, msg: 'Mật khẩu mới không được trùng mật khẩu hiện tại.' });
  }

  // username LẤY TỪ PHIÊN. Mật khẩu thô không rời khỏi tiến trình này —
  // ERP tự băm md5(sha512(...)) phía nó.
  const kq = await doiMatKhau(phien.username, cu, moi);

  const res = NextResponse.json(kq);
  if (kq.status) {
    // Đổi mật khẩu xong thì huỷ phiên, buộc đăng nhập lại.
    res.cookies.set(KH_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  }
  return res;
}
