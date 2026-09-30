# TBS Industry Atlas — Runbook

Khu vực ngành hàng `/nganh-hang/` gồm ba lớp: **nhóm ngành** (category), **ngành hàng** (industry) và **đặc tính** (trait). Nội dung do TBS Studio quản lý tại `/admin/industries/`. Đặc tả: `docs/superpowers/specs/2026-09-28-tbs-industry-atlas-design.md`.

## URL

| Trang | Đường dẫn | Ghi chú |
| --- | --- | --- |
| Hub | `/nganh-hang/` | Tìm kiếm, lọc, dải nhóm ngành, khối "Không thấy mặt hàng?" |
| Nhóm ngành | `/nganh-hang/{category}/` | 404 nếu nhóm chưa xuất bản, đã lưu trữ hoặc không có ngành con đã xuất bản |
| Ngành hàng | `/nganh-hang/{category}/{industry}/` | 404 nếu ngành chưa xuất bản hoặc sai nhóm |
| URL cũ một cấp | `/nganh-hang/{industry}/` | 308 một bước tới URL hai cấp (tạo bởi migration v7) |

Tham số lọc chỉ gồm `q`, `category`, `traits` (lặp lại được). Giá trị ngoài allowlist bị bỏ qua. Trang có tham số lọc render `noindex,follow` và canonical về `/nganh-hang/`; sitemap không chứa URL lọc, nhóm rỗng hay ngành mồ côi.

## Quy trình biên tập

1. **Đặc tính:** tab "Đặc tính" → sửa nhãn, nhóm, thứ tự, mô tả → "Lưu đặc tính". Slug cố định sau khi tạo. Muốn bỏ một đặc tính, tắt "Đang sử dụng": trang cũ vẫn hiện nhãn lịch sử, bộ lọc public không còn đặc tính đó.
2. **Nhóm ngành:** tab "Nhóm ngành" → "Tạo nhóm ngành" → điền tên, đường dẫn, mô tả → trình biên tập mở bản nháp. Nhóm chỉ xuất bản được khi có ít nhất một ngành hàng đang hoạt động.
3. **Ngành hàng:** tab "Ngành hàng" → "Tạo ngành hàng" → chọn nhóm → hoàn thiện các danh sách có cấu trúc (tên gọi khác, model, dữ liệu kỹ thuật, đóng gói, điểm cần xác minh, bằng chứng, FAQ, brief cho sale).
4. **Duyệt nghiệp vụ:** ghi "Người duyệt nghiệp vụ" và "Ngày duyệt". Bằng chứng cần ảnh có alt, quyền sử dụng `approved`, người duyệt và nguồn. Thiếu một điều kiện → nút Xuất bản trả lỗi 409 ngay trong trình biên tập.
5. **Xem trước:** biểu tượng con mắt mở bản nháp đã lưu (`no-store`, `noindex`).
6. **Xuất bản:** nhóm trước, ngành sau. Chỉ Admin (quyền `content.publish`) thấy nút.

Không ghi mã HS, thuế suất, thời gian thông quan hay cam kết nhận hàng chung cho cả ngành. Đặc tính là công cụ tìm/lọc, không phải kết luận pháp lý.

## Chuyển nhóm, lưu trữ, khôi phục

- **Chuyển ngành sang nhóm khác:** đổi "Nhóm ngành" trong trình biên tập, lưu, xuất bản. URL mới được tạo; URL cũ cần redirect trong Technical SEO nếu trang đã được chia sẻ.
- **Lưu trữ:** biểu tượng hộp lưu trữ ở dòng tương ứng → xác nhận. Nội dung bị gỡ khỏi website. Nhóm còn ngành con đang hoạt động sẽ bị chặn (409, hiện ngay dưới dòng) — chuyển hoặc lưu trữ ngành con trước.
- **Khôi phục:** biểu tượng mũi tên vòng → nội dung trở về bản nháp, cần xuất bản lại.
- Xung đột phiên bản (người khác vừa lưu) trả 409; tải lại rồi sửa tiếp, không ghi đè.

## Chỉ mục tìm kiếm

- Dựng từ nội dung **đã xuất bản**, không dùng dịch vụ ngoài. Lưu bản tốt gần nhất ở setting vận hành `industries.search-snapshot.v1` (không nằm trong portable backup).
- Dòng trạng thái đầu trang Atlas trong Studio:
  - "Chỉ mục tìm kiếm sẵn sàng." — bình thường.
  - "…đang dùng bản tốt gần nhất…" — lần dựng mới lỗi; website vẫn tìm bằng chỉ mục cũ. Kiểm tra nội dung vừa xuất bản, sửa rồi mở lại trang Atlas để dựng lại.
  - "…tạm chưa sẵn sàng…" — chưa từng dựng thành công; website tắt ô tìm kiếm (không giả vờ "0 kết quả"), dải nhóm ngành và liên hệ vẫn dùng được.
- Setting taxonomy hỏng: trang public rơi về nhãn đặc tính gốc, không trả 500; Studio báo lỗi khi mở tab Đặc tính để admin sửa.

## Sao lưu và khôi phục

Portable backup v4/schema 7 chứa nhóm ngành, ngành hàng, đặc tính, metadata duyệt và redirect; không chứa tài khoản, phiên đăng nhập hay credential. Khôi phục theo quy trình tại `docs/STUDIO.md` → "Portable Website Backups".

## Analytics

Chỉ gửi khi người dùng đã đồng ý (`analytics_consent=true`):

| Sự kiện | Tham số |
| --- | --- |
| `industry_search` | `length_bucket` (`0`, `1-3`, `4-10`, `11-30`, `31+`), `result_count` |
| `industry_filter_apply` | `filter_ids` (slug trong allowlist), `result_count` |
| `industry_open` | `industry_id`, `placement` |
| `brief_copy` | `industry_id` |

Không gửi từ khóa gốc, model, tiêu đề, nội dung clipboard, số điện thoại hay URL có query.

## Content gate

Hạ tầng Atlas hoàn thành với **3 ngành hàng đã migrate** trong 2 nhóm. Việc xuất bản 6–8 nhóm và 12–20 ngành hàng là **công việc nội dung**, chỉ thực hiện khi brief, nguồn, người duyệt nghiệp vụ và quyền sử dụng media đã được duyệt theo `docs/superpowers/plans/2026-09-28-tbs-content-rollout.md`. Dữ liệu 100 ngành trong bộ test quy mô là fixture cách ly (`tests/support/atlas-scale-fixture.ts`), không phải nội dung public.

## Kiểm thử

```bash
npm run test:studio
```

```bash
npm run test:studio:browser
```

```bash
npx playwright test -c playwright.atlas-scale.config.ts
```

Bộ `npm run test:marketing` cần server production cục bộ ở cổng 4173 (xem `DELIVERY.md`). Bộ quy mô tự dựng ba server cách ly (4175 bình thường, 4176 chỉ mục cũ, 4177 chưa có chỉ mục) bằng biến `STUDIO_FAULT_INDUSTRY_INDEX=fail` — chỉ dùng cho kiểm thử, không đặt biến này ở môi trường thật.
