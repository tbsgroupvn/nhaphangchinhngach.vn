const nfSo = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 });
const nfTe = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 });

type SoVao = number | string | null | undefined;

function veSo(n: SoVao): number {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? v : 0;
}

export function so(n: SoVao): string {
  return nfSo.format(veSo(n));
}

/**
 * Số lẻ (vd cân nặng kg): chấm ngăn nghìn, PHẨY thập phân, tối đa `soChuSo`
 * số lẻ (mặc định 2). Dùng cho các ô cân nặng/khối lượng — `so()` bo tròn
 * về số nguyên nên 5,80 kg hiện thành "6", mâu thuẫn với phí cân bên cạnh
 * (đo thật: đơn 9.140826.1725, weight=5.80, phí cân 145.000đ = 5,80×25.000,
 * nhưng cột hiện "6" khiến khách tự suy ra đơn giá 24.166đ/kg không có thật).
 */
export function soLe(n: SoVao, soChuSo = 2): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: soChuSo }).format(veSo(n));
}

/** Tiền VNĐ: chấm ngăn nghìn, không phần thập phân. */
export function tienVN(n: SoVao): string {
  return nfSo.format(veSo(n)) + ' đ';
}

/** Tiền tệ (¥): chấm ngăn nghìn, PHẨY thập phân, tối đa 2 số. */
export function tienTe(n: SoVao): string {
  return nfTe.format(veSo(n)) + ' ¥';
}

/** Dấu thời gian Unix (giây) → dd/mm/yyyy. Trả chuỗi rỗng nếu không có. */
export function ngay(ts: SoVao): string {
  const t = veSo(ts);
  if (!t) return '';
  const d = new Date(t * 1000);
  const p = (x: number) => String(x).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Dấu thời gian Unix (giây) → dd/mm/yyyy HH:mm. */
export function ngayGio(ts: SoVao): string {
  const t = veSo(ts);
  if (!t) return '';
  const d = new Date(t * 1000);
  const p = (x: number) => String(x).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export type ThongTinTrangThai = { ten: string; lop: string; mau: string };

/**
 * 10 trạng thái đơn. Tên và màu lấy đúng bản chuẩn
 * (members/modules/charts.php trên xuatnhapkhautbs.vn).
 * `lop` dùng cho nhãn Tailwind, `mau` dùng cho biểu đồ recharts.
 */
export const TRANG_THAI_DON: Record<string, ThongTinTrangThai> = {
  '0':  { ten: 'Chờ xử lý', lop: 'bg-slate-100 text-slate-700', mau: '#94a3b8' },
  '1':  { ten: 'Chờ cọc',   lop: 'bg-slate-100 text-slate-700', mau: '#a3b2c9' },
  '2':  { ten: 'Chờ phát',  lop: 'bg-slate-200 text-slate-700', mau: '#64748b' },
  '3':  { ten: 'Đang VC',   lop: 'bg-amber-100 text-amber-700', mau: '#f59e0b' },
  '4':  { ten: 'Đã về VN',  lop: 'bg-sky-100 text-sky-700',     mau: '#38bdf8' },
  '5':  { ten: 'Lưu Kho',   lop: 'bg-indigo-100 text-indigo-700', mau: '#6366f1' },
  '7':  { ten: 'Xuất Kho',  lop: 'bg-green-100 text-green-700', mau: '#22c55e' },
  '8':  { ten: 'Khiếu nại', lop: 'bg-orange-100 text-orange-700', mau: '#f97316' },
  '6':  { ten: 'Đã TT',     lop: 'bg-emerald-100 text-emerald-700', mau: '#0f9d58' },
  '-1': { ten: 'Đơn hủy',   lop: 'bg-red-100 text-red-700',     mau: '#ef4444' },
};

/** Thứ tự hiển thị tab/chú giải — đúng thứ tự bản chuẩn, KHÔNG phải thứ tự số. */
export const THU_TU_TRANG_THAI = ['0', '1', '2', '3', '4', '5', '7', '8', '6', '-1'];

export function trangThai(ma: SoVao): ThongTinTrangThai {
  const k = String(ma ?? '');
  return TRANG_THAI_DON[k] ?? { ten: `#${k}`, lop: 'bg-slate-100 text-slate-700', mau: '#94a3b8' };
}

/** 7 loại giao dịch ví, theo cột `type` của tbl_wallet_detail. */
export const LOAI_GIAO_DICH: Record<string, string> = {
  '0': 'Nạp tiền',
  '1': 'Thanh toán',
  '2': 'Đặt cọc',
  '3': 'Phí phát sinh',
  '-1': 'Hủy đơn',
  '-2': 'Hoàn tiền',
  '-3': 'Rút ví',
};

export function loaiGiaoDich(ma: SoVao, tien?: number): string {
  // type 0 (Nap tien) chi am khi la but toan dieu chinh/dao -- chua tung
  // co nap tien am that (xac nhan bang DB: 10/22007 dong type=0 am, toan
  // bo la dao but toan). Nhan "Nap tien" cho dong am se gay hieu lam.
  if (String(ma ?? '') === '0' && typeof tien === 'number' && tien < 0) {
    return 'Điều chỉnh';
  }
  return LOAI_GIAO_DICH[String(ma ?? '')] ?? 'Khác';
}
