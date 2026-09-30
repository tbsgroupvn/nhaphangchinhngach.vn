import Link from 'next/link';
import { layPhienBatBuoc } from '@/lib/khachhang-phien';
import { demDonTheoTrangThai, layDon } from '@/lib/khachhang-erp';
import { so, TRANG_THAI_DON, THU_TU_TRANG_THAI } from '@/lib/khachhang-dinhdang';
import GhiVetLuotXem from '@/components/khachhang/GhiVetLuotXem';
import ThanhLocDon from '@/components/khachhang/ThanhLocDon';
import BangDon from '@/components/khachhang/BangDon';
import PhanTrang from '@/components/khachhang/PhanTrang';

export const dynamic = 'force-dynamic';

const SO_DONG = 20;
// Trần an toàn cho tham số page: đủ lớn để không đụng khách thật nào (69 trang
// là nhiều nhất đã đo), đủ nhỏ để offset gửi ERP không tràn số nguyên SQL.
const TRANG_TOI_DA = 100000;

export default async function TrangDonHang({
  searchParams,
}: { searchParams: Record<string, string | string[] | undefined> }) {
  const phien = await layPhienBatBuoc();

  const lay = (k: string) => {
    const v = searchParams[k];
    return typeof v === 'string' ? v : '';
  };
  const loc = { from: lay('from'), to: lay('to'), id: lay('id'), oid: lay('oid'), tab: lay('tab') || 'all' };
  // page dị dạng (chữ, âm, 0, thập phân, rỗng...) phải rơi về 1 -- không được ra NaN
  // (Number('abc') = NaN, Math.max(1, NaN) = NaN -- vỡ PhanTrang + gửi page:NaN xuống ERP).
  // Kẹp trần TRANG_TOI_DA: page cực lớn (vd 99999999999999999999) không NaN
  // nhưng gửi thẳng xuống ERP làm SQL OFFSET tràn số, đẻ dòng lỗi vào
  // tests/sql_loi.log mỗi lần dính -- kẹp lại trước khi gọi ERP.
  const trangTho = Number(lay('page'));
  const trang = Number.isFinite(trangTho) && trangTho >= 1
    ? Math.min(Math.floor(trangTho), TRANG_TOI_DA)
    : 1;

  // code LẤY TỪ PHIÊN — không bao giờ từ searchParams.
  const [dem, dsDon] = await Promise.all([
    demDonTheoTrangThai(phien.code, loc),
    layDon(phien.code, loc, trang, SO_DONG),
  ]);

  // demDonTheoTrangThai(): null = ĐẾM HỎNG THẬT (lỗi mạng/JSON không parse được),
  // {} = RỖNG THẬT (khách chưa có đơn nào khớp bộ lọc). Hai trạng thái này KHÔNG
  // được gộp làm một -- gộp lại thì khi ERP đang lỗi, khách thấy "0 đơn" giả y
  // hệt khách chưa từng có đơn, trong khi bảng bên dưới lại báo đúng "Không thể
  // hiển thị dữ liệu" -- hai thông điệp mâu thuẫn, và cái sai lại dễ tin hơn.
  const demLoi = dem === null;
  const demAn = dem || {};
  const tongTatCa = demLoi ? null : Number(demAn.all || 0);

  const dsDonAn = dsDon ?? [];
  // Đếm hỏng thì không có cơ sở để biết tổng số dòng thật của tab đang xem --
  // dùng đúng số dòng ĐÃ NHẬN ĐƯỢC ở trang hiện tại (layDon là lời gọi ERP khác,
  // độc lập với đếm) để PhanTrang không vẽ ra một dải số trang bịa đặt.
  const tongDong = demLoi
    ? dsDonAn.length
    : (loc.tab === 'all' ? (tongTatCa ?? 0) : Number(demAn[loc.tab] || 0));

  const queryGoc: Record<string, string> = {};
  for (const k of ['from', 'to', 'id', 'oid', 'tab'] as const) if (loc[k]) queryGoc[k] = loc[k]!;

  const duongTab = (tab: string) => {
    const q = new URLSearchParams(queryGoc);
    q.set('tab', tab);
    q.set('page', '1');
    return '/khachhang/don-hang?' + q.toString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <GhiVetLuotXem trang="order" />

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ThanhLocDon />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h1 className="text-base font-semibold text-gray-800">Danh sách đơn hàng</h1>
          {demLoi ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
              Không lấy được số đếm
            </span>
          ) : (
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
              {so(tongTatCa)} đơn
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 border-b border-gray-200 px-3 py-2">
          <Link href={duongTab('all')}
                className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                  loc.tab === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
            Tất cả ({demLoi ? '—' : so(tongTatCa)})
          </Link>
          {THU_TU_TRANG_THAI.map((k) => (
            <Link key={k} href={duongTab(k)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    loc.tab === k ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
              {TRANG_THAI_DON[k].ten} ({demLoi ? '—' : so(demAn[k] || 0)})
            </Link>
          ))}
        </div>

        <BangDon dsDon={dsDon} />
        <PhanTrang trang={trang} tongDong={tongDong} soDongMoiTrang={SO_DONG}
                   query={{ ...queryGoc }} />
      </div>
    </div>
  );
}
