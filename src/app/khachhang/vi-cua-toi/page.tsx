import { layPhienBatBuoc } from '@/lib/khachhang-phien';
import { viChiTiet, viTongQuan } from '@/lib/khachhang-erp';
import { tienVN, ngayGio, loaiGiaoDich } from '@/lib/khachhang-dinhdang';
import GhiVetLuotXem from '@/components/khachhang/GhiVetLuotXem';
import ThanhLocVi from '@/components/khachhang/ThanhLocVi';
import TheVi from '@/components/khachhang/TheVi';
import PhanTrang from '@/components/khachhang/PhanTrang';
import KhoiTrong from '@/components/khachhang/KhoiTrong';

export const dynamic = 'force-dynamic';

const SO_DONG = 50;
// Trần an toàn cho tham số page -- đồng bộ với don-hang/page.tsx (Task 8/10).
const TRANG_TOI_DA = 100000;

export default async function TrangViCuaToi({
  searchParams,
}: { searchParams: Record<string, string | string[] | undefined> }) {
  const phien = await layPhienBatBuoc();

  const lay = (k: string) => {
    const v = searchParams[k];
    return typeof v === 'string' ? v : '';
  };
  const loc = { from: lay('from'), to: lay('to'), type: lay('type') || '-10' };
  // page dị dạng (chữ, âm, 0, thập phân, rỗng...) phải rơi về 1 -- không được ra NaN
  // (Number('abc') = NaN, và Math.max(1, NaN) = NaN -- vỡ PhanTrang + gửi page:NaN
  // xuống ERP). Đúng cách đã dùng ở don-hang/page.tsx (Task 8), Task 10 trước đó
  // chưa thừa hưởng -- vá lại đây, kèm kẹp trần TRANG_TOI_DA cùng lý do.
  const trangTho = Number(lay('page'));
  const trang = Number.isFinite(trangTho) && trangTho >= 1
    ? Math.min(Math.floor(trangTho), TRANG_TOI_DA)
    : 1;

  const [chiTiet, tongQuan] = await Promise.all([
    viChiTiet(phien.code, loc, trang, SO_DONG),
    viTongQuan(phien.code),
  ]);

  const dong = chiTiet?.data ?? null;
  const tongTrang = dong ? dong.reduce((t, r) => t + Number(r.money || 0), 0) : 0;

  const query: Record<string, string> = {};
  if (loc.from) query.from = loc.from;
  if (loc.to) query.to = loc.to;
  if (loc.type !== '-10') query.type = loc.type;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <GhiVetLuotXem trang="my_wallet" />

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-3 min-w-0">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <ThanhLocVi />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <h1 className="text-base font-semibold text-gray-800">Lịch sử giao dịch ví</h1>
              {chiTiet && (
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  {new Intl.NumberFormat('vi-VN').format(chiTiet.total)} giao dịch
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Ngày giao dịch</th>
                    <th className="px-3 py-2 text-left">Mã giao dịch</th>
                    <th className="px-3 py-2 text-left">Loại giao dịch</th>
                    <th className="px-3 py-2 text-center">Thay đổi</th>
                    <th className="px-3 py-2 text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dong === null && <KhoiTrong loai="loi" soCot={5} />}
                  {dong?.length === 0 && (
                    <KhoiTrong loai="rong" chuThich="Chưa có giao dịch nào." soCot={5} />
                  )}
                  {dong?.map((r) => {
                    const tien = Number(r.money || 0);
                    const duong = tien >= 0;
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">{ngayGio(r.cdate)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">#{r.id}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                            {loaiGiaoDich(r.type, tien)}
                          </span>
                        </td>
                        <td className={`px-3 py-2 text-center font-bold ${duong ? 'text-green-600' : 'text-red-600'}`}>
                          {duong ? '+' : '−'}
                        </td>
                        <td className={`px-3 py-2 text-right font-semibold whitespace-nowrap ${duong ? 'text-green-600' : 'text-red-600'}`}>
                          {tienVN(Math.abs(tien))}
                        </td>
                      </tr>
                    );
                  })}
                  {dong && dong.length > 0 && (
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-3 py-2" colSpan={3}></td>
                      <td className="px-3 py-2 text-center text-gray-700">TỔNG TRANG</td>
                      <td className={`px-3 py-2 text-right whitespace-nowrap ${tongTrang >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {tongTrang >= 0 ? '+' : '−'} {tienVN(Math.abs(tongTrang))}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <PhanTrang trang={trang} tongDong={chiTiet?.total ?? 0} soDongMoiTrang={SO_DONG} query={query} />
          </div>
        </div>

        <div className="min-w-0">
          <TheVi vi={tongQuan} />
        </div>
      </div>
    </div>
  );
}
