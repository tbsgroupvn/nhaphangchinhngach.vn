import { erpPost } from './erp';

/* ---------- Kiểu dữ liệu (đầu ra — sau khi đã chuyển đổi số) ---------- */

export type MocThang = { ym: string; label: string; count: number; value: number };

export type KpiTongQuan = { all: number; month: number; year: number; completed: number };

export type ThongKeDon = { by_month: MocThang[]; by_status: Record<string, number> };

export type DonHang = {
  id: number; oid: string; isactive: number | string;
  cdate: number; mdate: number;
  quan: number; price_cyn: number; rate_sell: number;
  fee_ship: number; fee_service: number; fee_insurance: number; fee_weight: number;
  weight: number; total_money: number;
  pro_info: string; sku: string; notes: string;
  total_paid?: number; deposit?: number;
};

export type ViTongQuan = {
  tongthu: number; tongchi: number; tongrut: number;
  sodu: number; tongtiencon: number; cannap: number;
  list: GiaoDichVi[];
};

export type GiaoDichVi = {
  id: number; cus_id: string; money: number; type: number | string;
  note: string; cdate: number;
};

export type HoSoKhach = {
  username: string; code: string; name: string;
  phone: string; email: string; address: string; cdate: number;
};

export type LocDon = { from?: string; to?: string; id?: string; oid?: string; tab?: string };
export type LocVi = { from?: string; to?: string; type?: string };

/* ---------- Kieu THO -- hinh dang JSON THAT do ERP tra ve ----------
   Xac minh bang goi that (vong sua 1, 03/09/2026), KHONG suy doan:
   - getOrder.php / getOrderView.php: MOI truong so deu la CHUOI
     (vd id la "48309", total_money la "386653", cdate la "1786703188").
   - getWallet.php: 5/6 truong tong (tongthu/tongchi/tongrut/tongtiencon/cannap)
     la SO THAT, nhung sodu LAI LA CHUOI (sodu la "-146782963") -- lech ngay
     trong cung mot object, khong dong nhat. list[] ben trong toan CHUOI.
   - getWalletDetail.php: data[] toan CHUOI (cung hinh dang list o tren),
     con total/page/max_rows la SO THAT.
   - getCountOrder.php (da va Task 2) va getOrderStats.php: SO THAT, ca hai
     che do (dashboard=1 va dem theo trang thai).
   Vi ERP khong dong nhat giua cac endpoint (va doi khi NGAY TRONG mot
   endpoint), khai rieng tung kieu tho theo dung bang chung do duoc -- khong
   dung chung mot khuon "moi so la chuoi" hay "moi so la number".            */

type ChuoiSo = string | number;

interface RawGetCountOrderDashboard {
  status: boolean;
  data?: { all: number; month: number; year: number; completed: number };
}

interface RawGetCountOrderByStatus {
  status: boolean;
  data?: Record<string, number>;
}

interface RawGetOrderStats {
  status: boolean;
  by_month?: MocThang[];
  by_status?: Record<string, number>;
}

interface RawDonHang {
  id: ChuoiSo; oid: string; isactive: ChuoiSo;
  cdate: ChuoiSo; mdate: ChuoiSo;
  quan: ChuoiSo; price_cyn: ChuoiSo; rate_sell: ChuoiSo;
  fee_ship: ChuoiSo; fee_service: ChuoiSo; fee_insurance: ChuoiSo; fee_weight: ChuoiSo;
  weight: ChuoiSo; total_money: ChuoiSo;
  pro_info: string; sku: string; notes: string;
  total_paid?: ChuoiSo; deposit?: ChuoiSo;
}

interface RawGetOrder { status: boolean; data?: RawDonHang[]; }
interface RawGetOrderView { status: boolean; data?: RawDonHang[]; }

interface RawGiaoDichVi {
  id: ChuoiSo; cus_id: string; money: ChuoiSo; type: ChuoiSo;
  note: string; cdate: ChuoiSo;
}

interface RawGetWallet {
  status: boolean;
  data?: Record<string, {
    tongthu: number; tongchi: number; tongrut: number;
    sodu: ChuoiSo; tongtiencon: number; cannap: number;
    list?: RawGiaoDichVi[];
  }>;
}

interface RawGetWalletDetail {
  status: boolean;
  data?: RawGiaoDichVi[];
  total?: number;
}

interface RawHoSo {
  username: string; code: string; name: string;
  phone: string; email: string; address: string; cdate: ChuoiSo;
}
interface RawXnkInfo { status: boolean; data?: RawHoSo; }
interface RawXnkMsg { status: boolean; msg?: string; }

function soAn(n: ChuoiSo | null | undefined): number {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? v : 0;
}

function chuyenDonHang(d: RawDonHang): DonHang {
  return {
    id: soAn(d.id), oid: d.oid, isactive: d.isactive,
    cdate: soAn(d.cdate), mdate: soAn(d.mdate),
    quan: soAn(d.quan), price_cyn: soAn(d.price_cyn), rate_sell: soAn(d.rate_sell),
    fee_ship: soAn(d.fee_ship), fee_service: soAn(d.fee_service),
    fee_insurance: soAn(d.fee_insurance), fee_weight: soAn(d.fee_weight),
    weight: soAn(d.weight), total_money: soAn(d.total_money),
    pro_info: d.pro_info, sku: d.sku, notes: d.notes,
    total_paid: d.total_paid !== undefined ? soAn(d.total_paid) : undefined,
    deposit: d.deposit !== undefined ? soAn(d.deposit) : undefined,
  };
}

function chuyenGiaoDich(g: RawGiaoDichVi): GiaoDichVi {
  return {
    id: soAn(g.id), cus_id: g.cus_id, money: soAn(g.money), type: g.type,
    note: g.note, cdate: soAn(g.cdate),
  };
}

/* ---------- KHÔNG BAO GIỜ nhận code/username từ trình duyệt ----------
   Khoá X-TBS-Member-Key là khoá vạn năng: ERP tin bất kỳ `code` nào được gửi.
   Mọi hàm dưới đây phải được gọi với định danh lấy từ JWT phía server
   (xem src/lib/khachhang-phien.ts). Truyền thẳng searchParams vào đây
   là mở toang ví và đơn hàng của mọi khách.                                */

export async function kpiTongQuan(code: string): Promise<KpiTongQuan | null> {
  const r = await erpPost<RawGetCountOrderDashboard>('getCountOrder.php', { code, dashboard: 1 }).catch(() => null);
  if (!r?.status || !r.data) return null;
  return {
    all: Number(r.data.all || 0), month: Number(r.data.month || 0),
    year: Number(r.data.year || 0), completed: Number(r.data.completed || 0),
  };
}

export async function thongKeDon(code: string, soThang = 12): Promise<ThongKeDon | null> {
  const r = await erpPost<RawGetOrderStats>('getOrderStats.php', { code, months: soThang }).catch(() => null);
  if (!r?.status) return null;
  return { by_month: r.by_month || [], by_status: r.by_status || {} };
}

export async function demDonTheoTrangThai(
  code: string, loc: LocDon = {}
): Promise<Record<string, number> | null> {
  const r = await erpPost<RawGetCountOrderByStatus>('getCountOrder.php', { code, ...thamSoLocDon(loc) }).catch(() => null);
  // Đo thật (vòng sửa 1, 03/09/2026): getCountOrder.php trả status:false CHỈ
  // khi `code` rỗng/không hợp lệ. Khách chưa có đơn nào vẫn trả status:true,
  // data:{all:0,...} — KHÔNG rơi vào nhánh dưới. Nhánh dưới vẫn giữ vì an
  // toàn (không có định danh hợp lệ thì không có gì để đếm), nhưng đừng đọc
  // nó là "khách rỗng" — với endpoint NÀY, status:false = lỗi định danh.
  if (r === null) return null;
  if (!r.status) return {};
  return r.data || {};
}

export async function layDon(
  code: string, loc: LocDon = {}, trang = 1, soDong = 20
): Promise<DonHang[] | null> {
  const r = await erpPost<RawGetOrder>('getOrder.php', {
    code, ...thamSoLocDon(loc), page: trang, max_rows: soDong,
  }).catch(() => null);
  if (r === null) return null;
  if (!r.status) return [];
  return (r.data || []).map(chuyenDonHang);
}

export async function chiTietDon(code: string, oid: string): Promise<DonHang[] | null> {
  const r = await erpPost<RawGetOrderView>('getOrderView.php', { code, oid }).catch(() => null);
  if (r === null) return null;
  if (!r.status) return [];
  return (r.data || []).map(chuyenDonHang);
}

export async function viTongQuan(code: string): Promise<ViTongQuan | null> {
  const r = await erpPost<RawGetWallet>('getWallet.php', { code }).catch(() => null);
  const v = r?.status ? r.data?.[code] : null;
  if (!v) return null;
  return {
    tongthu: Number(v.tongthu || 0), tongchi: Number(v.tongchi || 0),
    tongrut: Number(v.tongrut || 0), sodu: Number(v.sodu || 0),
    tongtiencon: Number(v.tongtiencon || 0), cannap: Number(v.cannap || 0),
    list: (v.list || []).map(chuyenGiaoDich),
  };
}

export async function viChiTiet(
  code: string, loc: LocVi = {}, trang = 1, soDong = 50
): Promise<{ data: GiaoDichVi[]; total: number } | null> {
  const body: Record<string, unknown> = { code, page: trang, max_rows: soDong };
  if (loc.from) body.from = loc.from;
  if (loc.to) body.to = loc.to;
  if (loc.type !== undefined && loc.type !== '' && loc.type !== '-10') body.type = Number(loc.type);
  const r = await erpPost<RawGetWalletDetail>('getWalletDetail.php', body).catch(() => null);
  if (r === null) return null;
  if (!r.status) return { data: [], total: 0 };
  return { data: (r.data || []).map(chuyenGiaoDich), total: Number(r.total || 0) };
}

export async function hoSo(username: string): Promise<HoSoKhach | null> {
  const r = await erpPost<RawXnkInfo>('xnk/info.php', { username }).catch(() => null);
  if (!r?.status || !r.data) return null;
  const d = r.data;
  return {
    username: d.username, code: d.code, name: d.name,
    phone: d.phone, email: d.email, address: d.address,
    cdate: soAn(d.cdate),
  };
}

export async function capNhatHoSo(
  username: string,
  d: { fullname: string; phone: string; address: string; email: string }
): Promise<{ status: boolean; msg: string }> {
  const r = await erpPost<RawXnkMsg>('xnk/update_info.php', { username, ...d }).catch(() => null);
  if (!r) return { status: false, msg: 'Không kết nối được hệ thống. Vui lòng thử lại sau vài phút.' };
  return { status: !!r.status, msg: String(r.msg || '') };
}

export async function doiMatKhau(
  username: string, matKhauCu: string, matKhauMoi: string
): Promise<{ status: boolean; msg: string }> {
  const r = await erpPost<RawXnkMsg>('xnk/change_pass.php', {
    username, password_old: matKhauCu, password: matKhauMoi,
  }).catch(() => null);
  if (!r) return { status: false, msg: 'Không kết nối được hệ thống. Vui lòng thử lại sau vài phút.' };
  return { status: !!r.status, msg: String(r.msg || '') };
}

/** Ghi vết lượt xem. Hỏng thì im lặng — không được ảnh hưởng màn hình. */
export async function ghiVet(
  code: string, trang: string, loai: 'pageview' | 'dwell', giay?: number
): Promise<void> {
  const body: Record<string, unknown> = { type: loai, cus_code: code, page: trang };
  if (loai === 'dwell') body.seconds = Math.max(1, Math.min(3600, Math.round(giay || 0)));
  await erpPost<RawXnkMsg>('xnk/track.php', body).catch(() => null);
}

function thamSoLocDon(loc: LocDon): Record<string, unknown> {
  const p: Record<string, unknown> = {};
  if (loc.from) p.from = loc.from;
  if (loc.to) p.to = loc.to;
  if (loc.id) p.id = Number(loc.id);
  if (loc.oid) p.oid = loc.oid;
  if (loc.tab && loc.tab !== 'all') p.type = loc.tab;
  return p;
}
