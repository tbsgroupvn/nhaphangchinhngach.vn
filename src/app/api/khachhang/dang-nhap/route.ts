import { NextRequest, NextResponse } from 'next/server';
import { erpPost } from '@/lib/erp';
import {
  hashCustomerPassword,
  signKhachHangSession,
  KH_COOKIE_NAME,
  KH_SESSION_MAX_AGE,
} from '@/lib/khachhang-auth';

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: false, msg: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!username || !password) {
    return NextResponse.json(
      { status: false, msg: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.' },
      { status: 400 }
    );
  }

  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '';
  const clientUa = request.headers.get('user-agent') || '';

  let erpRes: any;
  try {
    erpRes = await erpPost('login', {
      username,
      password: hashCustomerPassword(password),
      client_ip: clientIp,
      client_ua: clientUa,
    });
  } catch {
    return NextResponse.json(
      { status: false, msg: 'Hệ thống đăng nhập đang bận, vui lòng thử lại sau.' },
      { status: 502 }
    );
  }

  if (!erpRes || !erpRes.status || !erpRes.data) {
    return NextResponse.json(
      { status: false, msg: erpRes?.msg || 'Tài khoản hoặc mật khẩu không chính xác.' },
      { status: 401 }
    );
  }

  const customer = erpRes.data;
  const session = {
    username: String(customer.username || username),
    code: String(customer.code || username),
    name: String(customer.name || ''),
  };
  const token = await signKhachHangSession(session);

  const response = NextResponse.json({ status: true, data: { name: session.name, code: session.code } });
  response.cookies.set(KH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: KH_SESSION_MAX_AGE,
  });
  return response;
}
