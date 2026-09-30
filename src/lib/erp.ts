const ERP_API_BASE = process.env.ERP_API_BASE || 'https://erp.nhaphangchinhngach.vn/api/';

export async function erpPost<T = any>(path: string, body: Record<string, any>): Promise<T | null> {
  const apiKey = process.env.TBS_MEMBER_API_KEY;
  if (!apiKey) throw new Error('TBS_MEMBER_API_KEY chưa được cấu hình');
  const res = await fetch(ERP_API_BASE + path.replace(/^\//, ''), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-TBS-Member-Key': apiKey,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  // HTTP không OK (vd 401 khoá sai) phải trả null NGAY, TRƯỚC khi đọc thân
  // phản hồi — dù thân đó là JSON hợp lệ (ERP trả {"status":false,"msg":
  // "unauthorized"} kèm 401). Nếu đọc tiếp, JSON đó parse được, hàm trả về
  // một object có status:false y hệt "rỗng thật" (status:false + HTTP 200),
  // và mọi hàm gọi erpPost() không còn cách nào phân biệt "gọi hỏng" với
  // "khách không có dữ liệu" — khách thấy "Chưa có đơn hàng nào" trong khi
  // ERP đang từ chối khoá. status:false kèm HTTP 200 (vd getOrder.php báo
  // khách không có đơn) vẫn phải giữ nguyên nghĩa "rỗng thật" — không đụng.
  if (!res.ok) return null;
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
