import Link from 'next/link';
import { so, tienVN, tienTe, ngay, trangThai } from '@/lib/khachhang-dinhdang';
import type { DonHang } from '@/lib/khachhang-erp';
import KhoiTrong from './KhoiTrong';

function anhSanPham(don: DonHang): string {
  try {
    const t = JSON.parse(don.pro_info || '{}');
    const u = String(t?.img || '');
    return /^https?:\/\//i.test(u) ? u : '';
  } catch { return ''; }
}

function lienKetSanPham(don: DonHang): string {
  try {
    const t = JSON.parse(don.pro_info || '{}');
    const l = String(t?.link || '');
    if (/^https?:\/\//i.test(l)) return l;
    return anhSanPham(don);
  } catch { return ''; }
}

function dsSku(don: DonHang): { name: string; idx: string }[] {
  try {
    const t = JSON.parse(don.sku || 'null');
    return Array.isArray(t) ? t : [];
  } catch { return []; }
}

export default function BangDon({
  dsDon, rutGon = false,
}: { dsDon: DonHang[] | null; rutGon?: boolean }) {
  // Đếm thực tế <th> trong <thead>: ID, Sản phẩm, SL, Giá, Ship, Thành tiền(¥),
  // Tổng(¥), Tổng(VNĐ), Trạng thái, cột thao tác rỗng = 10 cột khi rutGon
  // (4 cột Phí DV/Bảo hiểm/Tỷ giá/Phí cân nặng chỉ hiện khi !rutGon, cộng
  // thành 14) -- không suy đoán, đếm đúng theo JSX thead bên dưới.
  const soCot = rutGon ? 10 : 14;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Sản phẩm</th>
            <th className="px-3 py-2 text-center">SL</th>
            <th className="px-3 py-2 text-right">Giá</th>
            <th className="px-3 py-2 text-right">Ship</th>
            <th className="px-3 py-2 text-right">Thành tiền (¥)</th>
            {!rutGon && <th className="px-3 py-2 text-right">Phí DV</th>}
            {!rutGon && <th className="px-3 py-2 text-right">Bảo hiểm</th>}
            {!rutGon && <th className="px-3 py-2 text-right">Tỷ giá</th>}
            {!rutGon && <th className="px-3 py-2 text-right">Phí cân nặng</th>}
            <th className="px-3 py-2 text-right">Tổng (¥)</th>
            <th className="px-3 py-2 text-right">Tổng (VNĐ)</th>
            <th className="px-3 py-2 text-left">Trạng thái</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {dsDon === null && <KhoiTrong loai="loi" soCot={soCot} />}
          {dsDon?.length === 0 && (
            <KhoiTrong loai="rong" chuThich="Chưa có đơn hàng nào." soCot={soCot} />
          )}
          {dsDon?.map((d) => {
            const tt = trangThai(d.isactive);
            const thanhTien = Number(d.price_cyn) * Number(d.quan) + Number(d.fee_ship);
            const tongTe = thanhTien + Number(d.fee_service) + Number(d.fee_insurance);
            const phiCan = Number(d.weight || 0) * Number(d.fee_weight || 0);
            const anh = anhSanPham(d);
            const lienKet = lienKetSanPham(d);
            const sku = dsSku(d);
            return (
              <tr key={d.id} className="align-top hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">
                  {d.oid && (
                    <Link href={`/khachhang/don-hang/${d.oid}`} className="font-medium text-primary-700 hover:underline">
                      #{d.oid}
                    </Link>
                  )}
                  <div className="text-xs text-red-600">ID: {d.id}</div>
                  <div className="text-xs text-gray-400">{ngay(d.mdate || d.cdate)}</div>
                </td>
                <td className="px-3 py-2 max-w-xs">
                  {anh && (
                    <a href={lienKet} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={anh} alt="Ảnh sản phẩm" width={50} height={50}
                           loading="lazy" decoding="async" referrerPolicy="no-referrer"
                           className="mb-1 rounded border border-gray-200 object-cover" />
                    </a>
                  )}
                  {sku.map((s, i) => (
                    <div key={i} className="text-xs text-gray-600">
                      <span className="text-gray-400">{s.name}:</span> {s.idx}
                    </div>
                  ))}
                  {d.notes && (
                    <div className="mt-1 text-xs text-gray-500">
                      <span className="font-medium">Ghi chú:</span> {d.notes}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-center font-medium">{so(d.quan)}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">{tienTe(d.price_cyn)}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">{tienTe(d.fee_ship)}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap font-semibold text-red-600">{tienTe(thanhTien)}</td>
                {!rutGon && <td className="px-3 py-2 text-right whitespace-nowrap">{tienTe(d.fee_service)}</td>}
                {!rutGon && <td className="px-3 py-2 text-right whitespace-nowrap">{tienTe(d.fee_insurance)}</td>}
                {!rutGon && <td className="px-3 py-2 text-right whitespace-nowrap">{tienVN(d.rate_sell)}</td>}
                {!rutGon && <td className="px-3 py-2 text-right whitespace-nowrap">{tienVN(phiCan)}</td>}
                <td className="px-3 py-2 text-right whitespace-nowrap font-semibold text-red-600">{tienTe(tongTe)}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap font-semibold text-red-600">{tienVN(d.total_money)}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${tt.lop}`}>{tt.ten}</span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {d.oid && (
                    <Link href={`/khachhang/don-hang/${d.oid}`}
                          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100">
                      Chi tiết
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
