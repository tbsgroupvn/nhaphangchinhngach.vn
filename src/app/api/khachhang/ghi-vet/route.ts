import { NextResponse } from 'next/server';
import { layPhien } from '@/lib/khachhang-phien';
import { ghiVet } from '@/lib/khachhang-erp';

const TRANG_HOP_LE = new Set([
  'dashboard', 'order', 'order_detail', 'my_wallet', 'info', 'changepass',
]);

export async function POST(req: Request) {
  const phien = await layPhien();
  if (!phien) return NextResponse.json({ status: false }, { status: 401 });

  const body = await req.json().catch(() => null);
  const trang = String(body?.trang || '');
  const loai = body?.loai === 'dwell' ? 'dwell' : 'pageview';
  if (!TRANG_HOP_LE.has(trang)) return NextResponse.json({ status: false }, { status: 400 });

  // cus_code LẤY TỪ PHIÊN, không lấy từ body.
  await ghiVet(phien.code, trang, loai, Number(body?.giay || 0));
  return NextResponse.json({ status: true });
}
