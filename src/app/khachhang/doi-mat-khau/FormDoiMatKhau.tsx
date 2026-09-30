'use client';

import { useState } from 'react';

const RE_MK = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/;

export default function FormDoiMatKhau() {
  const [cu, datCu] = useState('');
  const [moi, datMoi] = useState('');
  const [lai, datLai] = useState('');
  const [loi, datLoi] = useState('');
  const [ok, datOk] = useState('');
  const [dangLuu, datDangLuu] = useState(false);

  async function guiDi(e: React.FormEvent) {
    e.preventDefault();
    datLoi(''); datOk('');
    if (!cu || !moi || !lai) return datLoi('Vui lòng nhập đầy đủ thông tin.');
    if (!RE_MK.test(moi)) {
      return datLoi('Mật khẩu mới phải dài 6–15 ký tự, chỉ gồm chữ và số, và phải có cả chữ thường, chữ hoa và chữ số.');
    }
    if (moi !== lai) return datLoi('Mật khẩu nhập lại không khớp.');
    if (cu === moi) return datLoi('Mật khẩu mới không được trùng mật khẩu hiện tại.');

    datDangLuu(true);
    try {
      const r = await fetch('/api/khachhang/doi-mat-khau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cu, moi }),
      });
      const kq = await r.json();
      if (kq.status) {
        datOk('Đổi mật khẩu thành công. Đang đưa bạn về trang đăng nhập…');
        setTimeout(() => { window.location.href = '/khachhang/dang-nhap'; }, 1800);
      } else {
        datLoi(kq.msg || 'Không thể đổi mật khẩu.');
      }
    } catch {
      datLoi('Không kết nối được hệ thống. Vui lòng thử lại sau vài phút.');
    } finally {
      datDangLuu(false);
    }
  }

  const lopO = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none';
  const lopNhan = 'mb-1 block text-sm font-medium text-gray-700';

  return (
    <form onSubmit={guiDi} className="space-y-4 p-4">
      {ok && <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{ok}</div>}
      {loi && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{loi}</div>}

      <div>
        <label htmlFor="mk_cu" className={lopNhan}>Mật khẩu hiện tại <span className="text-red-600">*</span></label>
        <input id="mk_cu" type="password" autoComplete="current-password"
               value={cu} onChange={(e) => datCu(e.target.value)} className={lopO} required />
      </div>
      <div>
        <label htmlFor="mk_moi" className={lopNhan}>Mật khẩu mới <span className="text-red-600">*</span></label>
        <input id="mk_moi" type="password" autoComplete="new-password"
               value={moi} onChange={(e) => datMoi(e.target.value)} className={lopO} required />
        <p className="mt-1 text-xs text-gray-500">
          6–15 ký tự, chỉ gồm chữ và số, phải có cả chữ thường, chữ hoa và chữ số.
        </p>
      </div>
      <div>
        <label htmlFor="mk_lai" className={lopNhan}>Nhập lại mật khẩu mới <span className="text-red-600">*</span></label>
        <input id="mk_lai" type="password" autoComplete="new-password"
               value={lai} onChange={(e) => datLai(e.target.value)} className={lopO} required />
      </div>

      <button type="submit" disabled={dangLuu}
              className="w-full rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60">
        {dangLuu ? 'Đang xử lý…' : 'Đổi mật khẩu'}
      </button>
    </form>
  );
}
