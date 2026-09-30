import Link from 'next/link';
import { layPhienBatBuoc } from '@/lib/khachhang-phien';
import { kpiTongQuan, thongKeDon, layDon, viTongQuan } from '@/lib/khachhang-erp';
import { so, ngay } from '@/lib/khachhang-dinhdang';
import GhiVetLuotXem from '@/components/khachhang/GhiVetLuotXem';
import BieuDoThang from '@/components/khachhang/BieuDoThang';
import BieuDoTrangThai from '@/components/khachhang/BieuDoTrangThai';
import BangDon from '@/components/khachhang/BangDon';
import TheVi from '@/components/khachhang/TheVi';
import KhoiTrong from '@/components/khachhang/KhoiTrong';

export const dynamic = 'force-dynamic';

export default async function TrangDashboard() {
  const phien = await layPhienBatBuoc();
  const { code, name } = phien;

  const [kpi, thongKe, dsDon, vi] = await Promise.all([
    kpiTongQuan(code),
    thongKeDon(code, 12),
    layDon(code, {}, 1, 10),
    viTongQuan(code),
  ]);

  // thongKe === null nghĩa GỌI HỎNG THẬT (lỗi mạng/HTTP/JSON) -- khác hẳn
  // "gọi được nhưng rỗng" (thongKe tồn tại, by_month/by_status không có
  // dòng nào). Gộp hai trạng thái này lại thì khi ERP đang lỗi, khách thấy
  // "Chưa có dữ liệu" y hệt khách thật sự chưa có đơn nào -- sai một cách
  // rất đáng tin, đúng loại lỗi đợt vá này đã xử lý ở erp.ts (Mục 1).
  const thongKeLoi = thongKe === null;
  const coDuLieuThang = !!thongKe && thongKe.by_month.some((m) => m.count > 0);
  const coDuLieuTrangThai = !!thongKe && Object.keys(thongKe.by_status).length > 0;

  const KPI = [
    { nhan: 'Đơn hàng tháng này', gt: kpi?.month },
    { nhan: 'Đơn hàng năm nay', gt: kpi?.year },
    { nhan: 'Đơn đã hoàn thành', gt: kpi?.completed },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <GhiVetLuotXem trang="dashboard" />

      <div className="rounded-lg bg-gradient-to-r from-primary-700 to-primary-500 px-6 py-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Xin chào, {name || code}!</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/20 px-3 py-1">Mã KH: <b>{code}</b></span>
              <span className="rounded-full bg-white/20 px-3 py-1">
                Hôm nay {ngay(Math.floor(Date.now() / 1000))}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/khachhang/don-hang"
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50">
              Đơn hàng của tôi
            </Link>
            <Link href="/khachhang/vi-cua-toi"
                  className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-300">
              Ví của tôi
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-3 min-w-0">
          <div className="grid gap-3 sm:grid-cols-3">
            {KPI.map((k) => (
              <div key={k.nhan} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="text-xs text-gray-500">{k.nhan}</div>
                <div className="mt-1 text-2xl font-bold text-gray-900">
                  {k.gt === undefined ? '—' : so(k.gt)}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4 xl:col-span-2">
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold text-gray-700">Đơn hàng &amp; giá trị theo tháng</h2>
                <span className="text-xs text-gray-400">12 tháng gần nhất</span>
              </div>
              {coDuLieuThang ? (
                <BieuDoThang moc={thongKe!.by_month} />
              ) : thongKeLoi ? (
                <KhoiTrong loai="loi" />
              ) : (
                <KhoiTrong loai="rong" chuThich="Chưa có dữ liệu đơn hàng để thống kê." />
              )}
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h2 className="mb-2 text-sm font-semibold text-gray-700">Đơn theo trạng thái</h2>
              {coDuLieuTrangThai ? (
                <BieuDoTrangThai theoTrangThai={thongKe!.by_status} />
              ) : thongKeLoi ? (
                <KhoiTrong loai="loi" />
              ) : (
                <KhoiTrong loai="rong" chuThich="Chưa có dữ liệu." />
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Đơn hàng mới nhất</h2>
              <Link href="/khachhang/don-hang" className="text-xs text-primary-700 hover:underline">
                Xem tất cả ›
              </Link>
            </div>
            <BangDon dsDon={dsDon} rutGon />
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <TheVi vi={vi} />
        </div>
      </div>
    </div>
  );
}
