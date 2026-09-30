import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

export const KH_COOKIE_NAME = 'kh_token';
const SESSION_DAYS = 7;
export const KH_SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;

function getSecret() {
  const secret = process.env.KHACHHANG_JWT_SECRET;
  if (!secret) throw new Error('KHACHHANG_JWT_SECRET chưa được cấu hình');
  return new TextEncoder().encode(secret);
}

export type KhachHangSession = {
  username: string;
  code: string;
  name: string;
};

export async function signKhachHangSession(session: KhachHangSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifyKhachHangSession(token: string): Promise<KhachHangSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.username || !payload.code) return null;
    return {
      username: String(payload.username),
      code: String(payload.code),
      name: String(payload.name || ''),
    };
  } catch {
    return null;
  }
}

// Khớp CHÍNH XÁC công thức hash phía PHP đang dùng thật trên PROD (ajaxs/member/login.php):
// $pass = md5(hash('sha512', trim($plainPass)));
export function hashCustomerPassword(plain: string): string {
  const trimmed = plain.trim();
  const sha512Hex = crypto.createHash('sha512').update(trimmed, 'utf8').digest('hex');
  return crypto.createHash('md5').update(sha512Hex, 'utf8').digest('hex');
}
