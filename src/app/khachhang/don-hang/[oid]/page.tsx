import Link from 'next/link';
import { layPhienBatBuoc } from '@/lib/khachhang-phien';
import { chiTietDon } from '@/lib/khachhang-erp';
import { so, soLe, tienVN, tienTe, ngay, trangThai } from '@/lib/khachhang-dinhdang';
import GhiVetLuotXem from '@/components/khachhang/GhiVetLuotXem';

export const dynamic = 'force-dynamic';

function anh(don: { pro_info: string }): string {
  try {
    const t = JSON.parse(don.pro_info || '{}');
    const u = String(t?.img || '');
    return /^https?:\/\//i.test(u) ? u : '';
  } catch { return ''; }
}

function lienKet(don: { pro_info: string }): string {
  try {
    const t = JSON.parse(don.pro_info || '{}');
    const l = String(t?.link || '');
    return /^https?:\/\//i.test(l) ? l : anh(don);
  } catch { return ''; }
}

export default async function TrangChiTietDon({ params }: { params: { oid: string } }) {
  const phien = await layPhienBatBuoc();
  // oid từ URL là an toàn: ERP lọc WHERE cus_id='code' AND oid='oid',
  // code lấy từ phiên nên oid của khách khác trả về rỗng.
  const dong = await chiTietDon(phien.code, params.oid);

  if (dong === null) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center text-sm text-red-600">
        Không thể hiển thị dữ liệu. Vui lòng thử lại sau vài phút.
      </div>
    );
  }
  if (dong.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-sm text-gray-500">Không tìm thấy đơn hàng này.</p>
        <Link href="/khachhang/don-hang" className="mt-3 inline-block text-sm text-primary-700 hover:underline">
          ‹ Quay lại danh sách đơn hàng
        </Link>
      </div>
    );
  }

  let tongTe = 0, tongCan = 0, tongPhiCan = 0, tongVnd = 0, tongCoc = 0, daTra = 0;
  for (const d of dong) {
    // Đối chiếu bản chuẩn (components/com_order/task/tinh_tien.php trên
    // 180.93.136.224, đo thật 03/09/2026): dòng đã HỦY (isactive=-1) bị
    // `continue` — loại hẳn khỏi mọi tổng tiền/cân, chỉ còn hiện trong danh
    // sách sản phẩm (vẫn hiện với nhãn "Đơn hủy", không loại khỏi bảng).
    // Không lọc chỗ này thì tiền hàng đã hủy vẫn cộng vào TỔNG ĐƠN HÀNG,
    // đẩy CẦN THANH TOÁN lên sai (đã đo thấy lệch 509.551đ trên đơn TBS9
    // 9.120824.1407 khi chưa lọc).
    if (Number(d.isactive) === -1) continue;
    tongTe += Number(d.price_cyn) * Number(d.quan) + Number(d.fee_ship)
            + Number(d.fee_service) + Number(d.fee_insurance);
    tongCan += Number(d.weight || 0);
    tongPhiCan += Number(d.weight || 0) * Number(d.fee_weight || 0);
    tongVnd += Number(d.total_money || 0);
    tongCoc += Number(d.deposit || 0);
    // Bản chuẩn CHỈ cộng total_paid khi isactive==6 ("Đã TT") — dòng PHP
    // `if($row['isactive']==6) $total_paid+=$objw->TotalPaid($cusid,$id);`.
    // Backend getOrderView.php lại trả total_paid cho MỌI dòng không điều
    // kiện, nên phải tự chốt lại đúng bản chuẩn ở đây — không được cộng
    // total_paid của các dòng isactive khác 6 (0,1,2,3,4,5,7,8), dù thực tế
    // hiện tại backend luôn trả 0 cho các dòng đó (đã kiểm CSDL, không có
    // bút toán ví gắn dòng nào isactive ngoài {-1,6}). Đây là quy ước dữ
    // liệu ngầm, không phải ràng buộc trong mã — nếu sau này có luồng ghi
    // ví trước khi dòng chuyển sang 6 thì không chốt lại sẽ báo ĐÃ THANH
    // TOÁN cao hơn thật và CẦN THANH TOÁN thấp hơn thật.
    if (Number(d.isactive) === 6) daTra += Number(d.total_paid || 0);
  }
  tongVnd += tongPhiCan;
  const daTraDuong = Math.abs(daTra);
  const canThanhToan = tongVnd - tongCoc - daTraDuong;
  const ngayDat = ngay(dong[0].cdate);

  const hangTongHop: [string, string, boolean][] = [
    ['Tiền đơn hàng (¥)', tienTe(tongTe), false],
    ['Cân nặng đơn hàng (kg)', soLe(tongCan), false],
    ['Tổng phí cân nặng', tienVN(tongPhiCan), false],
    ['TỔNG ĐƠN HÀNG (đ)', tienVN(tongVnd), true],
    ['TIỀN CỌC (đ)', tienVN(tongCoc), true],
  ];
  if (daTraDuong > 0) hangTongHop.push(['ĐÃ THANH TOÁN (đ)', tienVN(daTraDuong), true]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <GhiVetLuotXem trang="order_detail" />

      <Link href="/khachhang/don-hang" className="text-sm text-primary-700 hover:underline">
        ‹ Quay lại danh sách đơn hàng
      </Link>

      <div className="mt-3 grid gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white lg:col-span-3 min-w-0">
          <div className="border-b border-gray-200 px-4 py-3">
            <h1 className="text-base font-semibold text-gray-800">Mã đơn tổng #{params.oid}</h1>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Sản phẩm</th>
                  <th className="px-3 py-2 text-center">SL</th>
                  <th className="px-3 py-2 text-right">Giá</th>
                  <th className="px-3 py-2 text-right">Ship</th>
                  <th className="px-3 py-2 text-right">Phí DV</th>
                  <th className="px-3 py-2 text-right">Bảo hiểm</th>
                  <th className="px-3 py-2 text-right">Tổng (VNĐ)</th>
                  <th className="px-3 py-2 text-left">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dong.map((d) => {
                  const tt = trangThai(d.isactive);
                  const a = anh(d);
                  let sku: { name: string; idx: string }[] = [];
                  try { const t = JSON.parse(d.sku || 'null'); if (Array.isArray(t)) sku = t; } catch {}
                  return (
                    <tr key={d.id} className="align-top">
                      <td className="px-3 py-2 text-xs text-red-600 whitespace-nowrap">{d.id}</td>
                      <td className="px-3 py-2 max-w-xs">
                        {a && (
                          <a href={lienKet(d)} target="_blank" rel="noopener noreferrer">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={a} alt="Ảnh sản phẩm" width={60} height={60}
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
                      <td className="px-3 py-2 text-center">{so(d.quan)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{tienTe(d.price_cyn)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{tienTe(d.fee_ship)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{tienTe(d.fee_service)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{tienTe(d.fee_insurance)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap font-semibold text-red-600">
                        {tienVN(d.total_money)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium ${tt.lop}`}>{tt.ten}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Mã đơn tổng #{params.oid}</h2>
            </div>
            <dl className="divide-y divide-gray-100 text-sm">
              <div className="flex justify-between px-4 py-2">
                <dt className="text-gray-500">Ngày đặt hàng</dt>
                <dd className="font-medium text-gray-900">{ngayDat}</dd>
              </div>
              <div className="flex justify-between px-4 py-2">
                {/* "Số sản phẩm đặt" đếm MỌI dòng kể cả dòng hủy — KHÔNG khớp
                    dem_don của bản chuẩn PHP (bản chuẩn chỉ đếm dòng isactive
                    == -1 hoặc == 6). Brief Task 9 không yêu cầu khớp dem_don,
                    và "số sản phẩm đã đặt" đếm toàn bộ vẫn hợp nghĩa — giữ
                    nguyên, chỉ ghi chú lại cho đúng để task sau không hiểu
                    nhầm là đã đối chiếu dem_don. */}
                <dt className="text-gray-500">Số sản phẩm đặt</dt>
                <dd className="font-medium text-gray-900">{so(dong.length)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Bảng tổng hợp</h2>
            </div>
            <dl className="divide-y divide-gray-100 text-sm">
              {hangTongHop.map(([nhan, gt, dam]) => (
                <div key={nhan} className="flex justify-between px-4 py-2">
                  <dt className={dam ? 'font-semibold text-gray-700' : 'text-gray-500'}>{nhan}</dt>
                  <dd className="font-medium text-gray-900">{gt}</dd>
                </div>
              ))}
              <div className="flex justify-between bg-red-50 px-4 py-3">
                <dt className="font-bold text-red-700">CẦN THANH TOÁN (đ)</dt>
                <dd className="font-bold text-red-700">{tienVN(canThanhToan)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
