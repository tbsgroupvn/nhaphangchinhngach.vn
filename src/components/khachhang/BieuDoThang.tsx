'use client';

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { MocThang } from '@/lib/khachhang-erp';

const nf = new Intl.NumberFormat('vi-VN');

function gonTien(v: number): string {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + ' tỷ';
  if (v >= 1e6) return Math.round(v / 1e6) + ' tr';
  return nf.format(v);
}

export default function BieuDoThang({ moc }: { moc: MocThang[] }) {
  const duLieu = moc.map((m) => ({ thang: m.label, soDon: m.count, giaTri: Math.round(m.value) }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={duLieu} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#eef2f8" vertical={false} />
          <XAxis dataKey="thang" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis yAxisId="trai" tick={{ fontSize: 10 }} allowDecimals={false}
                 tickLine={false} axisLine={false} />
          <YAxis yAxisId="phai" orientation="right" tick={{ fontSize: 10 }}
                 tickLine={false} axisLine={false} tickFormatter={gonTien} />
          <Tooltip
            formatter={(v: number, ten: string) =>
              ten === 'Giá trị' ? nf.format(v) + ' đ' : nf.format(v) + ' đơn'
            }
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          <Bar yAxisId="trai" dataKey="soDon" name="Số đơn" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={26} />
          <Line yAxisId="phai" dataKey="giaTri" name="Giá trị" stroke="#f59e0b"
                strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} type="monotone" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
