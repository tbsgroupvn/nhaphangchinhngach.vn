'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { LOAI_GIAO_DICH } from '@/lib/khachhang-dinhdang';

const THU_TU_LOAI = ['0', '2', '1', '3', '-1', '-2', '-3'];

export default function ThanhLocVi() {
  const router = useRouter();
  const sp = useSearchParams();
  const [from, datFrom] = useState(sp.get('from') || '');
  const [to, datTo] = useState(sp.get('to') || '');
  const [loai, datLoai] = useState(sp.get('type') || '-10');

  function timKiem(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (loai !== '-10') q.set('type', loai);
    q.set('page', '1');
    router.push('/khachhang/vi-cua-toi?' + q.toString());
  }

  const lopO = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none';
  const lopNhan = 'mb-1 block text-xs font-medium text-gray-600';

  return (
    <form onSubmit={timKiem} className="grid gap-3 md:grid-cols-4">
      <div>
        <label htmlFor="vi_from" className={lopNhan}>Từ ngày</label>
        <input id="vi_from" type="date" value={from} onChange={(e) => datFrom(e.target.value)} className={lopO} />
      </div>
      <div>
        <label htmlFor="vi_to" className={lopNhan}>Đến ngày</label>
        <input id="vi_to" type="date" value={to} onChange={(e) => datTo(e.target.value)} className={lopO} />
      </div>
      <div>
        <label htmlFor="vi_loai" className={lopNhan}>Loại giao dịch</label>
        <select id="vi_loai" value={loai} onChange={(e) => datLoai(e.target.value)} className={lopO}>
          <option value="-10">Tất cả</option>
          {THU_TU_LOAI.map((k) => <option key={k} value={k}>{LOAI_GIAO_DICH[k]}</option>)}
        </select>
      </div>
      <div className="flex items-end">
        <button type="submit"
                className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
          Tìm kiếm
        </button>
      </div>
    </form>
  );
}
