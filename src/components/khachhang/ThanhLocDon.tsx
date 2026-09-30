'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ThanhLocDon() {
  const router = useRouter();
  const sp = useSearchParams();
  const [from, datFrom] = useState(sp.get('from') || '');
  const [to, datTo] = useState(sp.get('to') || '');
  const [ma, datMa] = useState(sp.get('id') || '');
  const [oid, datOid] = useState(sp.get('oid') || '');

  function timKiem(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (ma) q.set('id', ma);
    if (oid) q.set('oid', oid);
    const tab = sp.get('tab');
    if (tab) q.set('tab', tab);
    q.set('page', '1');
    router.push('/khachhang/don-hang?' + q.toString());
  }

  const lopO = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none';
  const lopNhan = 'mb-1 block text-xs font-medium text-gray-600';

  return (
    <form onSubmit={timKiem} className="grid gap-3 md:grid-cols-5">
      <div>
        <label htmlFor="loc_from" className={lopNhan}>Từ ngày</label>
        <input id="loc_from" type="date" value={from} onChange={(e) => datFrom(e.target.value)} className={lopO} />
      </div>
      <div>
        <label htmlFor="loc_to" className={lopNhan}>Đến ngày</label>
        <input id="loc_to" type="date" value={to} onChange={(e) => datTo(e.target.value)} className={lopO} />
      </div>
      <div>
        <label htmlFor="loc_id" className={lopNhan}>Mã đơn (ID)</label>
        <input id="loc_id" type="number" value={ma} onChange={(e) => datMa(e.target.value)} className={lopO} />
      </div>
      <div>
        <label htmlFor="loc_oid" className={lopNhan}>Mã đơn tổng (#)</label>
        <input id="loc_oid" type="text" value={oid} onChange={(e) => datOid(e.target.value)} className={lopO} />
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
