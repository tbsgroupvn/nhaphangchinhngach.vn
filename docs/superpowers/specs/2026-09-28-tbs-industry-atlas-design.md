# TBS Industry Atlas Design

## Hồ sơ đặc tả

| Thuộc tính | Giá trị |
| --- | --- |
| Sản phẩm | Khu vực ngành hàng của `nhaphangchinhngach.vn` |
| Phiên bản | 1.0, ngày 28/09/2026 |
| Trạng thái | Chờ chủ dự án duyệt đặc tả trước khi lập implementation plan |
| Phạm vi | Taxonomy, URL, UX tìm kiếm/lọc, mẫu trang, CMS, SEO, kiểm duyệt và nghiệm thu |
| Nền hiện có | Next.js 14, React 18, TBS Studio/SQLite, GSAP, bộ marketing tests |

Tài liệu này mở rộng phần ngành hàng trong đặc tả website ngày 26/09/2026. Khi có mâu thuẫn, yêu cầu mới đã được chủ dự án duyệt ngày 28/09/2026 được ưu tiên: ngành hàng TBS rất nhiều và đa dạng; khu vực này phải mở rộng tốt, cao cấp và giúp sale tư vấn nhanh.

## 1. Mục tiêu

Xây **TBS Industry Atlas**, một bản đồ ngành hàng có thể tăng từ vài nhóm lên hàng trăm trang mà không biến website thành danh bạ hoặc sàn thương mại điện tử.

Hệ thống phải phục vụ đồng thời bốn việc:

1. Khách tìm thấy nhóm hàng bằng tên phổ thông, tên kỹ thuật, model hoặc công dụng.
2. Khách hiểu dữ liệu cần chuẩn bị và những điểm cần chuyên môn xác minh trước khi mua hàng.
3. Sale mở hoặc gửi đúng URL trong thời gian ngắn, tiếp tục tư vấn trên điện thoại/Zalo.
4. Marketing/XNK mở rộng taxonomy trong TBS Studio có kiểm duyệt, không cần sửa giao diện cho từng ngành hàng.

Từ khóa thành công là **dễ tìm, có chiều sâu, có bằng chứng và không kết luận quá mức**.

## 2. Những gì đã có và giới hạn hiện tại

Website hiện có một hub `/nganh-hang/` và ba trang phẳng:

- `/nganh-hang/gia-dung-khong-dien/`
- `/nganh-hang/noi-that-phu-kien/`
- `/nganh-hang/may-moc-moi/`

Schema `industry` hiện chỉ có tên, mô tả, ảnh, các đoạn chi tiết, đầu vào và dịch vụ liên quan. Hub render toàn bộ ngành hàng thành card; cách này phù hợp với ba mục nhưng không phù hợp khi có hàng chục hoặc hàng trăm mục. Route hiện là một cấp `/nganh-hang/[slug]` và chưa có category, synonym, filter, proof, reviewer hoặc ngày rà soát.

## 3. Các hướng đã cân nhắc

| Hướng | Ưu điểm | Giới hạn | Quyết định |
| --- | --- | --- | --- |
| Danh mục phẳng | Đơn giản, triển khai nhanh | Rối khi số lượng lớn, không phản ánh quan hệ | Không chọn |
| Tìm kiếm thuần túy | Gọn, hiện đại | Khách chưa biết từ khóa khó khám phá; SEO yếu | Không chọn |
| **Industry Atlas lai** | Khám phá theo nhóm, tìm kiếm nhanh, lọc theo bài toán | Cần taxonomy và CMS chặt chẽ | **Chọn** |

## 4. Kiến trúc thông tin

### 4.1 Ba lớp taxonomy

1. **Nhóm lớn:** cách khách hàng nhận diện thị trường, ví dụ máy móc và dây chuyền; điện, điện tử và tự động hóa; năng lượng và pin; ô tô và phụ tùng; dệt may và nguyên phụ liệu; gia dụng và nội thất.
2. **Ngành hàng:** trang public có nội dung đủ sâu và đã được duyệt, ví dụ máy dệt, máy chiết rót, pin năng lượng mặt trời hoặc linh kiện ô tô.
3. **Thẻ chéo:** đặc tính/rủi ro giúp tìm và lọc nhưng không tự tạo trang SEO, ví dụ có pin, cồng kềnh, cần nâng hạ, nhiều NCC, cần kiểm đếm, cần kiểm tra chuyên ngành.

Danh sách nhóm lớn ban đầu là cấu hình, không phải tuyên bố TBS nhận mọi sản phẩm trong nhóm. Chỉ category và ngành hàng đã publish mới xuất hiện public.

### 4.2 URL chuẩn

```text
/nganh-hang/
/nganh-hang/{category-slug}/
/nganh-hang/{category-slug}/{industry-slug}/
```

Ví dụ:

```text
/nganh-hang/may-moc-day-chuyen/
/nganh-hang/may-moc-day-chuyen/may-det/
/nganh-hang/nang-luong-pin/pin-nang-luong-mat-troi/
```

Các URL một cấp hiện có được redirect 308 tới trang tương đương sau khi nội dung mới được publish. Không đổi URL chỉ vì đổi tên hiển thị. Chuyển ngành hàng sang category khác cần tạo redirect từ đường dẫn cũ và cảnh báo tác động SEO trong Studio.

### 4.3 Điều hướng

- Menu chính tiếp tục chỉ có một mục “Ngành hàng”, không mở mega-menu chứa hàng trăm link.
- Hub cung cấp tìm kiếm, category và nhóm nổi bật.
- Breadcrumb trang sâu: `Trang chủ > Ngành hàng > Nhóm lớn > Ngành hàng`.
- Footer chỉ hiển thị category chính và một số ngành hàng nổi bật đã chọn; không liệt kê toàn bộ taxonomy.

## 5. Trải nghiệm hub `/nganh-hang/`

### 5.1 Thứ tự nội dung

1. H1 ngắn, nhận diện đây là bản đồ ngành hàng TBS.
2. Ô tìm kiếm lớn, placeholder theo tác vụ: tên hàng, model hoặc công dụng.
3. Các category dưới dạng dải hình ảnh toàn chiều ngang, không phải lưới card dày đặc.
4. Bộ lọc chéo theo đặc tính/rủi ro.
5. Kết quả phù hợp, chia theo category và sắp theo ưu tiên biên tập.
6. Bằng chứng ngành hàng nổi bật từ nội dung TBS đã duyệt.
7. Khối “Không thấy mặt hàng?” với dữ liệu nên chuẩn bị và CTA gọi/Zalo trực tiếp.

### 5.2 Desktop

- Search nằm trong vùng đầu trang nhưng không làm hero marketing quá lớn; phần category tiếp theo phải còn được nhìn thấy ở viewport 1440x900.
- Mỗi category là một dải có ảnh thật, tên, mô tả một dòng, số trang đã publish và tối đa bốn ngành hàng tiêu biểu.
- Chọn category hoặc filter cập nhật kết quả tại chỗ; Back/Forward và URL vẫn phản ánh trạng thái đã chọn.
- Kết quả dùng hàng nội dung có ảnh thumbnail ổn định, tiêu đề, mô tả và thẻ đặc tính quan trọng; không lồng card trong card.

### 5.3 Mobile

- Search nằm ngay dưới header và trở thành thanh gọn khi cuộn; không che nội dung hoặc mobile contact dock.
- Category dùng accordion một cột với touch target tối thiểu 44x44px.
- Filter mở trong bottom sheet có tiêu đề, nút xóa, nút áp dụng và focus trap đúng. Trạng thái lọc luôn có văn bản, không chỉ dựa vào màu.
- Không dùng hàng chip kéo ngang làm điều hướng chính; các thẻ trạng thái ngắn được phép wrap nhiều dòng.

### 5.4 Tìm kiếm

Tìm kiếm không cần dịch vụ ngoài trong phiên bản đầu. Chỉ mục được dựng từ nội dung đã publish và gồm:

- Tên ngành hàng.
- Tên gọi khác và lỗi chính tả phổ biến đã được biên tập.
- Model/dòng sản phẩm khi phù hợp.
- Công dụng và vật liệu chính.
- Tên category.

So khớp không phân biệt hoa/thường và dấu tiếng Việt. Kết quả ưu tiên: exact title, synonym, model, category rồi mô tả. Không tìm trong draft, claim nội bộ hoặc dữ liệu nhạy cảm.

### 5.5 Bộ lọc và URL

- Query cho phép: `q`, `category`, `traits`.
- Giá trị phải thuộc allowlist từ taxonomy đã publish; giá trị lạ bị bỏ qua và UI hiển thị trạng thái hợp lệ còn lại.
- Filter URL dùng để sale chia sẻ nhưng canonical luôn về `/nganh-hang/`; query không nằm trong sitemap và mặc định `noindex,follow` khi render trang lọc.
- Không tạo một trang indexable cho mọi tổ hợp filter.

### 5.6 Trạng thái không có kết quả

Không hiển thị màn hình trắng hoặc “không tìm thấy” cụt ngủn. Trạng thái gồm:

- Từ khóa/filter đang dùng.
- Hai category gần nhất nếu có thể xác định từ synonym/category.
- Danh sách thông tin khách nên chuẩn bị: ảnh/link, công dụng, vật liệu, model, số lượng/kích thước và điểm giao.
- CTA gọi/Zalo trực tiếp; không có form.

## 6. Mẫu trang category

Trang `/nganh-hang/{category}/` giúp khám phá, không lặp hub. Nội dung gồm:

1. Tên nhóm và phạm vi mô tả, kèm lưu ý đây không phải xác nhận tự động khả năng nhập.
2. Các ngành hàng đã publish trong nhóm.
3. Những đặc tính/rủi ro thường cần xác minh trong nhóm.
4. Dịch vụ TBS thường liên quan, chỉ hiển thị nội dung đã duyệt.
5. Bằng chứng và bài kiến thức liên quan.
6. CTA chuẩn bị dữ liệu rồi gọi/Zalo.

Category không có ít nhất một ngành hàng published thì không được publish public.

## 7. Mẫu trang ngành hàng

Mỗi trang chi tiết có cùng contract, không thiết kế riêng tùy ý:

1. **Nhận diện:** tên sản phẩm, phạm vi, ảnh thật và mô tả ngắn.
2. **Trước khi đặt hàng:** checklist những thông tin phải kiểm tra với NCC.
3. **Dữ liệu kỹ thuật:** model, công dụng, vật liệu, catalogue, tình trạng, kích thước, trọng lượng và dữ liệu đặc thù.
4. **Đóng gói và vận chuyển:** điều kiện đóng kiện, kiểm đếm, nâng hạ, điểm nhận/giao.
5. **Điểm cần xác minh:** nội dung liên quan thuế, HS, QCVN, giấy phép hoặc chính sách chỉ nêu câu hỏi/điều kiện và nguồn rà soát; không tự kết luận.
6. **Bằng chứng TBS:** ảnh/video/still đã duyệt, phạm vi công việc và ghi chú giới hạn áp dụng.
7. **Dịch vụ liên quan:** tối đa ba dịch vụ có lý do cụ thể.
8. **FAQ:** 4-8 câu từ tình huống sale/thực tế đã rà.
9. **Brief cho sale:** nút sao chép mẫu thông tin; báo thành công chỉ khi clipboard thực sự ghi được, có fallback.
10. **Liên hệ:** gọi/Zalo, không có form.

Không dùng giá, thuế suất, mã HS, thời gian thông quan hoặc cam kết nhận hàng chung cho toàn ngành.

## 8. Mô hình dữ liệu

### 8.1 Category

```text
id, slug, title, summary, image, imageAlt
order, featuredIndustryIds
status, seo, reviewer, reviewedAt, version
```

### 8.2 Industry

```text
id, categoryId, slug, title, shortTitle, summary
aliases[], searchTerms[], models[], uses[], materials[]
heroMedia, traits[], preparationItems[], technicalInputs[]
packingNotes[], verificationPoints[], proofItems[]
serviceIds[], articleIds[], faqs[], saleBriefItems[]
status, seo, reviewer, reviewedAt, nextReviewAt, version
```

### 8.3 Trait

```text
id, slug, label, group, description, order, active
```

`Trait.group` thuộc allowlist: `handling`, `packing`, `supplier`, `compliance`, `transport`. Trait hỗ trợ tìm/lọc, không phải kết luận pháp lý.

### 8.4 Proof item

```text
id, mediaId, title, caption, sourceRef, sourceDate
scopeNote, rightsStatus, reviewer, reviewedAt
```

Proof chỉ xuất hiện public khi `rightsStatus=approved` và media hiện hữu. TBS Studio chặn publish khi ảnh thiếu alt, reviewer hoặc nguồn.

## 9. CMS và phân quyền

- Editor/Marketing tạo category, industry và draft; chỉnh synonym, copy, liên kết, ảnh đã có trong media library.
- SEO chỉnh metadata, canonical đề xuất và search terms nhưng không duyệt claim nghiệp vụ.
- XNK/Vận hành được ghi nhận là reviewer của nội dung nghiệp vụ và bằng chứng; việc ghi nhận reviewer không tự publish.
- Admin publish, unpublish, chuyển category và quản lý redirect.
- Xóa category có ngành hàng hoặc xóa trait đang được tham chiếu bị chặn; dùng archive trước.
- Mọi thay đổi dùng optimistic version như Studio hiện có; conflict trả 409 và không ghi đè draft người khác.
- Backup portable phải bao gồm category, industry, trait, review metadata và redirect; không chứa account, session hoặc credential.

## 10. Luồng dữ liệu

```text
TBS Studio draft
  -> schema validation
  -> reviewer/rights checks
  -> explicit publish
  -> public content snapshot
  -> search index generated from published snapshot
  -> hub/category/detail render
```

Public render không truy cập file video nguồn, transcript nội bộ hoặc draft. Search index được tái tạo theo publication transaction hoặc snapshot mới nhất; nếu rebuild lỗi, public tiếp tục dùng snapshot cũ và Studio báo lỗi cho admin.

## 11. Hình ảnh và chuyển động

- Phong cách: editorial công nghiệp cao cấp, nền sáng chủ đạo, graphite làm dải đối trọng, xanh logo làm hướng dẫn hành động.
- Category dùng ảnh hàng/hoạt động thật; không dùng ảnh stock mơ hồ hoặc hình AI như bằng chứng TBS.
- Hover desktop chỉ thay opacity, màu viền và dịch ảnh có giới hạn; không phóng card làm layout nhảy.
- Filter transition dùng transform/opacity 200-300ms.
- Không carousel tự chạy, không autoplay video, không âm thanh, không smooth-scroll chiếm quyền điều khiển.
- Page transition hiện có giữ nguyên; Industry Atlas không sở hữu cùng thuộc tính animation với controller toàn site.
- `prefers-reduced-motion` tắt mọi chuyển động trang trí và giữ đầy đủ nội dung/chức năng.

## 12. SEO

- Chỉ hub, category và industry published có canonical/indexable.
- Sitemap chứa URL published, không chứa query filter, archive, draft hoặc category rỗng.
- Metadata ngành hàng dùng tên thật và lợi ích thông tin; không nhồi từ khóa “nhập khẩu chính ngạch” vào mọi tiêu đề.
- Category/industry có breadcrumb structured data; FAQ structured data chỉ dùng khi FAQ hiển thị đúng trên trang và không chứa claim chưa duyệt.
- URL cũ có redirect 308 một bước; không tạo chain hoặc redirect về hub khi có trang tương đương tốt hơn.
- Search nội bộ không được tạo crawl trap qua liên kết query vô hạn.

## 13. Analytics và riêng tư

Sự kiện cho phép:

- `industry_search`: chỉ gửi bucket độ dài và số kết quả, không gửi nguyên văn từ khóa.
- `industry_filter_apply`: gửi ID filter thuộc allowlist và số kết quả.
- `industry_open`: gửi industry ID và placement.
- `brief_copy`: gửi industry ID, không gửi nội dung clipboard.
- `contact_click`: dùng contract hiện có với placement `industry_hub`, `industry_category` hoặc `industry_detail`.

Không gửi model, tên khách, nhà cung cấp, nội dung chat, query thô hoặc dữ liệu lô hàng vào analytics.

## 14. Error handling và fallback

- Search JS lỗi: category và danh sách featured server-rendered vẫn dùng được.
- Ảnh lỗi/không có: giữ khung tỷ lệ ổn định và hiển thị fallback trung tính; không ẩn tiêu đề/copy.
- Search index lỗi: dùng snapshot cuối; không trả danh sách rỗng giả.
- Industry draft/unpublished: 404 thật cho public; redirect chỉ khi admin đã cấu hình URL thay thế.
- Category archive: ngành hàng con phải được chuyển hoặc archive trước.
- Filter/query lạ: bỏ giá trị không hợp lệ, không throw 500.
- Không có kết quả: dùng trạng thái hướng dẫn và CTA trực tiếp đã định nghĩa ở mục 5.6.

## 15. Accessibility và performance

- Search có label truy cập được, nút xóa riêng và thông báo số kết quả bằng vùng `aria-live` không gây spam.
- Category/industry dùng heading hierarchy tuần tự; breadcrumb có nhãn.
- Accordion và bottom sheet dùng keyboard/Escape/focus đúng; target tối thiểu 44x44px.
- Mọi ảnh có alt theo ngữ cảnh; ảnh trang trí alt rỗng.
- Text contrast tối thiểu 4.5:1; trạng thái chọn không chỉ dùng màu.
- Không cuộn ngang ở 320, 390, 768, 1024, 1440 và 1920px; dùng được ở zoom 200%.
- Hub với 100 ngành hàng không tải eager toàn bộ ảnh. Ảnh đầu viewport ưu tiên có chọn lọc; phần còn lại lazy load với kích thước ổn định.
- Filter/search client bundle được tách khỏi nội dung server-rendered; không đưa thư viện search lớn vào nếu chỉ mục hiện tại xử lý được bằng code nội bộ.

## 16. Nghiệm thu

### Tìm và điều hướng

- Khách tìm một ngành hàng đã biết trong tối đa hai thao tác từ hub.
- Tìm kiếm khớp tên có/không dấu, synonym và model đã biên tập.
- Back/Forward khôi phục query/filter; URL chia sẻ mở đúng trạng thái.
- Sale sao chép được URL category, industry hoặc trạng thái lọc hợp lệ.

### Nội dung và an toàn

- Không draft/unapproved proof nào xuất hiện public hoặc search.
- Không trang nào khẳng định khả năng nhập, HS/thuế/giấy phép chỉ từ taxonomy/trait.
- Industry thiếu reviewer, alt, category hoặc media được tham chiếu không thể publish.
- Không có form thu lead; gọi/Zalo dùng cấu hình contact hiện có.

### CMS

- Tạo category/industry/trait, preview, publish, archive và rollback có test.
- Xóa quan hệ đang dùng bị chặn; conflict version không ghi đè.
- Backup/restore giữ taxonomy, review và redirect; không phục hồi credential/account.

### UX và kỹ thuật

- Hub với fixture 100 industry vẫn đáp ứng filter/search nhanh và không layout shift đáng kể.
- Mobile 320/390px, desktop, keyboard, reduced motion và zoom 200% qua kiểm tra.
- JS/search index/media lỗi có fallback như mục 14.
- Sitemap/canonical/robots/redirect không tạo duplicate hoặc crawl trap.

## 17. Phát hành theo đợt

### Đợt A: Nền tảng

- Category, trait, search/filter, route hai cấp và CMS workflow.
- Migrate ba trang hiện có, giữ redirect.
- Publish 6-8 category và 12-20 ngành hàng có nguồn tốt nhất từ thư viện TBS.

### Đợt B: Mở rộng có kiểm duyệt

- Tăng lên 30-50 industry theo dữ liệu sale, TikTok và bằng chứng vận hành.
- Thêm proof/FAQ/bài kiến thức sau khi reviewer xác nhận.

### Đợt C: Long-tail

- Chỉ tạo trang sản phẩm hẹp khi có nhu cầu tìm kiếm, nội dung khác biệt và chuyên môn chịu trách nhiệm.
- Không sinh hàng loạt trang mỏng từ keyword hoặc danh sách sản phẩm NCC.

Mỗi đợt dừng ở demo/staging và cần release gate riêng trước production/indexing.

## 18. Ngoài phạm vi

- Công cụ tự tính HS, thuế, giấy phép, cước hoặc khả năng nhập.
- Marketplace, giỏ hàng, báo giá tự động, tài khoản khách hoặc form thu lead.
- Tự crawl catalogue NCC hoặc tự tạo ngành hàng bằng AI rồi publish.
- Semantic/vector search, external search SaaS và personalization trong phiên bản đầu.
- Public toàn bộ 140 video; video chỉ dùng khi có quyền và đặc tả media riêng.
- Thay đổi ERP, CRM, DNS, production hoặc indexability trong implementation của subsystem này.

## 19. Quyết định đã khóa

- Dùng mô hình lai: category sản phẩm + search + trait/risk filter.
- Dùng URL hai cấp cho category và industry.
- Thiết kế hub theo dải editorial công nghiệp, không dùng lưới card dày đặc.
- Mobile dùng accordion và bottom sheet, không dùng chip carousel làm điều hướng chính.
- Search phiên bản đầu chạy trên published snapshot, không cần dịch vụ ngoài.
- Filter URL có thể chia sẻ nhưng không index.
- Nội dung chuyên môn, proof và quyền sử dụng phải qua review trước publish.
- Giữ màu logo, contact trực tiếp, motion/reduced-motion và TBS Studio hiện có.
