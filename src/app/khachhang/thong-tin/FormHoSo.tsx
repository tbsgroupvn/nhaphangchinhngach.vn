'use client';

import { useState } from 'react';
import type { HoSoKhach } from '@/lib/khachhang-erp';

const RE_SDT = /^(0(?:3|5|7|8|9))[0-9]{8}$/;
const RE_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function FormHoSo({ ban: banDau }: { ban: HoSoKhach }) {
  const [fullname, datFullname] = useState(banDau.name || '');
  const [phone, datPhone] = useState(banDau.phone || '');
  const [address, datAddress] = useState(banDau.address || '');
  const [email, datEmail] = useState(banDau.email || '');
  const [loi, datLoi] = useState('');
  const [ok, datOk] = useState('');
  const [dangLuu, datDangLuu] = useState(false);

  async function luu(e: React.FormEvent) {
    e.preventDefault();
    datLoi(''); datOk('');
    if (!fullname.trim()) return datLoi('Vui lòng nhập họ và tên.');
    if (!RE_SDT.test(phone.trim())) {
      return datLoi('Số điện thoại chưa đúng. Vui lòng nhập 10 chữ số, bắt đầu bằng 03, 05, 07, 08 hoặc 09.');
    }
    if (email.trim() && !RE_EMAIL.test(email.trim())) {
      return datLoi('Email không hợp lệ. Vui lòng kiểm tra lại địa chỉ Email.');
    }

    datDangLuu(true);
    try {
      const r = await fetch('/api/khachhang/ho-so', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, phone, address, email }),
      });
      const kq = await r.json();
      if (kq.status) datOk(kq.msg || 'Cập nhật thông tin thành công.');
      else datLoi(kq.msg || 'Không thể cập nhật thông tin.');
    } catch {
      datLoi('Không kết nối được hệ thống. Vui lòng thử lại sau vài phút.');
    } finally {
      datDangLuu(false);
    }
  }

  const lopO = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none';
  const lopNhan = 'mb-1 block text-sm font-medium text-gray-700';

  return (
    <form onSubmit={luu} className="space-y-4 p-4">
      {ok && <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</div>}
      {loi && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{loi}</div>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="hs_ten" className={lopNhan}>Họ và tên <span className="text-red-600">*</span></label>
          <input id="hs_ten" value={fullname} onChange={(e) => datFullname(e.target.value)} className={lopO} required />
        </div>
        <div>
          <label htmlFor="hs_sdt" className={lopNhan}>Số điện thoại <span className="text-red-600">*</span></label>
          <input id="hs_sdt" type="tel" value={phone} onChange={(e) => datPhone(e.target.value)} className={lopO} required />
        </div>
        <div>
          <label htmlFor="hs_dc" className={lopNhan}>Địa chỉ</label>
          <input id="hs_dc" value={address} onChange={(e) => datAddress(e.target.value)} className={lopO} />
        </div>
        <div>
          <label htmlFor="hs_email" className={lopNhan}>Email</label>
          <input id="hs_email" type="email" autoComplete="email" value={email}
                 onChange={(e) => datEmail(e.target.value)} className={lopO} />
        </div>
      </div>

      <button type="submit" disabled={dangLuu}
              className="w-full rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
        {dangLuu ? 'Đang lưu…' : 'Lưu'}
      </button>
    </form>
  );
}
