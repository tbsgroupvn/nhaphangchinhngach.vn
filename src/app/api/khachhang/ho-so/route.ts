import { NextResponse } from 'next/server';
import { layPhien } from '@/lib/khachhang-phien';
import { capNhatHoSo } from '@/lib/khachhang-erp';

const RE_SDT = /^(0(?:3|5|7|8|9))[0-9]{8}$/;
const RE_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
  const phien = await layPhien();
  if (!phien) return NextResponse.json({ status: false, msg: 'Phiên đã hết hạn.' }, { status: 401 });

  const b = await req.json().catch(() => null);
  const fullname = String(b?.fullname || '').trim();
  const phone = String(b?.phone || '').trim();
  const address = String(b?.address || '').trim();
  const email = String(b?.email || '').trim();

  if (!fullname) return NextResponse.json({ status: false, msg: 'Vui lòng nhập họ và tên.' });
  if (!RE_SDT.test(phone)) {
    return NextResponse.json({
      status: false,
      msg: 'Số điện thoại chưa đúng. Vui lòng nhập 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.',
    });
  }
  if (email && !RE_EMAIL.test(email)) {
    return NextResponse.json({ status: false, msg: 'Email không hợp lệ. Vui lòng kiểm tra lại địa chỉ Email.' });
  }

  // username LẤY TỪ PHIÊN — không lấy từ body.
  const kq = await capNhatHoSo(phien.username, { fullname, phone, address, email });
  return NextResponse.json(kq);
}
