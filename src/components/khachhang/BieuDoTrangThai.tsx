'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TRANG_THAI_DON, THU_TU_TRANG_THAI } from '@/lib/khachhang-dinhdang';

const nf = new Intl.NumberFormat('vi-VN');

export default function BieuDoTrangThai({
  theoTrangThai,
}: { theoTrangThai: Record<string, number> }) {
  const duLieu = THU_TU_TRANG_THAI
    .filter((k) => (theoTrangThai[k] || 0) > 0)
    .map((k) => ({ ten: TRANG_THAI_DON[k].ten, soDon: theoTrangThai[k], mau: TRANG_THAI_DON[k].mau }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={duLieu} dataKey="soDon" nameKey="ten" innerRadius="55%" outerRadius="80%"
               stroke="#fff" strokeWidth={2}>
            {duLieu.map((d) => <Cell key={d.ten} fill={d.mau} />)}
          </Pie>
          <Tooltip formatter={(v: number) => nf.format(v) + ' đơn'} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
