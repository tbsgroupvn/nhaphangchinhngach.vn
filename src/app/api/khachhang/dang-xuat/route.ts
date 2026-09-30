import { NextResponse } from 'next/server';
import { KH_COOKIE_NAME } from '@/lib/khachhang-auth';

export async function POST() {
  const response = NextResponse.json({ status: true });
  response.cookies.delete(KH_COOKIE_NAME);
  return response;
}
