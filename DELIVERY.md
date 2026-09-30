# TBS Website Redesign

## Bản triển khai

- Website marketing có 24 trang trong đợt đầu: trang chủ, giới thiệu, vận hành, danh mục dịch vụ, sáu dịch vụ, danh mục ngành hàng, ba ngành hàng, quy trình, chi phí/chứng từ, kiến thức, hai bài hướng dẫn, hỏi đáp, liên hệ và ba trang nguyên tắc/chính sách.
- Có thêm sơ đồ website và chuyển hướng những URL dịch vụ/nội dung cũ phù hợp.
- Không có form chuyển đổi, đăng ký nhận tin, chatbot hoặc công cụ báo giá tự động. Liên hệ trực tiếp qua số điện thoại và Zalo đang công khai của TBS.
- Homepage dùng hình ảnh thương hiệu, GSAP chuyển động nhẹ và hành trình logistics Three.js tương tác. Có chế độ giảm chuyển động, dừng/chạy hoạt cảnh và ảnh thay thế nếu WebGL lỗi.
- Các trang nội dung được render phía server; bộ lọc kiến thức hoạt động cả khi tắt JavaScript. FAQ có liên kết riêng để sale chia sẻ đúng câu trả lời; trang liên hệ có mẫu thông tin lô hàng có thể sao chép.
- Bản này mặc định `noindex`, không cài tracking bên thứ ba, chưa thay đổi website live.

## Bảng màu theo logo TBS

- Màu nhận diện lấy từ file logo được cung cấp: xanh TBS `#0083CA`, xanh GROUP `#3D94D9`. Giữ nguyên hình logo, thay bảng màu cobalt/lime thử nghiệm trước đó.
- Xanh đậm cùng họ màu `#006FA8` cho chữ nhỏ, nút gọi và trạng thái được chọn; chữ trắng trên nền này đạt tương phản khoảng 5,47:1.
- Nền trắng/xám sáng `#F3F6F7` chiếm ưu thế; các dải tối trung tính `#182126` dùng có giới hạn, điểm nhấn xanh nhạt thay lime.
- Đồng bộ vật liệu 3D, hover, focus và liên hệ trên desktop/mobile. Không đổi bố cục, nội dung hay chức năng.
- Quy chuẩn và nguồn lấy màu: `docs/BRAND-COLORS.md`. Đây là chuẩn sRGB cho website dựa trên PNG hiện có, không thay thế bộ quy chuẩn in ấn/vector gốc.

## Mã nguồn và chạy thử

Hiệu ứng mở đầu mới: các lớp xanh TBS mở ảnh container, tên thương hiệu xuất hiện theo nhịp, ảnh chuyển động nhẹ theo chuột/cuộn trên desktop. Thời lượng khoảng 1,85 giây trên desktop và 1 giây trên thiết bị cảm ứng. Có nút xem lại, hỗ trợ giảm chuyển động và giữ nội dung/liên hệ sử dụng được khi tắt JavaScript. Không thêm thư viện, âm thanh hoặc form. Quy tắc chi tiết: `docs/MOTION.md`.

Chuyển trang: ba lớp màu logo lướt ngang, sau đó tiêu đề, mô tả và ảnh trang mới xuất hiện lệch nhịp. Hiệu ứng lướt khoảng 0,9 giây trên desktop và 0,6 giây trên mobile; menu và thanh gọi/Zalo luôn nằm trên lớp chuyển động. Có hiệu ứng đảo chiều khi dùng Back/Forward, hủy lượt cũ khi bấm liên tiếp, reduced motion và tự bỏ màn che sau 1,2 giây nếu trang chưa tải xong. Không trì hoãn hay thay thế cơ chế điều hướng của Next.js.

- Worktree: `F:/01_TBS_GROUP/11.Du_An/tbs-website-redesign`
- Nhánh: `codex/tbs-premium-redesign`, bắt đầu tại `de34870`.
- Repo gốc giữ nguyên: `C:/Users/ADMIN/nhaphangchinhngach.vn`.
- Stack giữ tương thích repo: Next.js 14.2.35, React 18, TypeScript, Tailwind 3, GSAP 3, Three.js 0.170, React Three Fiber 8, Heroicons.

```powershell
npm ci
npm run dev -- -p 4173 -H 127.0.0.1
```

Kiểm tra với server đang chạy tại `http://127.0.0.1:4173`:

```powershell
npm run typecheck
npm run lint
npm run test:marketing
```

Tạo bản production local sau khi dừng dev server:

```powershell
npm run build
npm run start -- -p 4173 -H 127.0.0.1
```

## Vị trí chỉnh sửa

| Hạng mục | File |
| --- | --- |
| Hotline, Zalo, email và dữ liệu seed ban đầu | `src/data/marketing.ts` |
| Biên tập 24 trang đã seed, bài mới và SEO | `/admin/content/`, SQLite trong thư mục dữ liệu riêng; hướng dẫn `docs/STUDIO.md` |
| Trang chủ | `src/components/marketing/HomePage.tsx` |
| Header, footer, CTA | `src/components/marketing/MarketingHeader.tsx`, `MarketingShell.tsx`, `ContactLinks.tsx` |
| Trang nội dung và SEO | `src/components/marketing/InteriorPages.tsx` |
| Hành trình 3D | `src/components/marketing/Journey.tsx`, `JourneyScene.tsx`, `journey.css` |
| Hiệu ứng mở đầu | `src/components/marketing/HeroExperience.tsx`, `docs/MOTION.md` |
| Chuyển trang | `src/components/marketing/PageTransitions.tsx`, `src/app/layout.tsx` |
| Thiết kế responsive | `src/app/marketing.css` |
| Kiểm thử trình duyệt | `tests/marketing/` |
| Nguồn hình ảnh | `docs/ASSETS.md` |

## Điều kiện trước khi công khai

1. TBS duyệt nội dung, thông tin pháp nhân, người phụ trách tư vấn và quyền sử dụng hình ảnh. Ảnh hiện tại là tư liệu minh họa được cung cấp, không chứng minh quyền sở hữu kho/xe hay khối lượng vận hành.
2. Duyệt pháp lý các trang nguyên tắc/chính sách. Nội dung hiện là khung trao đổi, không tự đặt mức bồi thường, thời hạn khiếu nại, thuế suất hay cam kết thông quan.
3. **TBS Studio đã có các luồng CMS/SEO/AI, đang nghiệm thu toàn hệ thống.** Đã có đăng nhập/phân quyền thật, biên tập/xuất bản 24 trang, SEO, media, cài đặt dùng chung và sao lưu/khôi phục. AI có cấu hình mã hóa, kho nguồn duyệt, bảy tác vụ biên tập, so sánh từng trường, duyệt áp dụng vào bản nháp và lịch sử/căn cứ/token. Chưa cấu hình chủ sở hữu/khóa thật và chưa gọi AI tính phí; kiểm thử fixture không thay cho nghiệm thu nhà cung cấp thật. Sau khi seed, chỉnh nội dung qua Studio thay vì sửa dữ liệu seed. Xem `docs/STUDIO.md`, `docs/STUDIO-ACCEPTANCE.md` và execution ledger.
4. **Chưa đưa nguyên repo lên public.** Đăng nhập mẫu và JWT dự phòng đã được thay; API demo/chẩn đoán/newsletter/AI giả đã bị đóng ở chính handler và CMS HTML cũ được chuyển hướng vào đăng nhập thật. API Studio tự kiểm tra phiên/quyền, không dựa vào middleware. Vẫn cần audit toàn repo/dependency, kiểm tra credentials cũ, HTTPS, cấu hình origin chính xác và giới hạn theo IP ở ingress trước triển khai. Không thực hiện đổi khóa bên ngoài hoặc tuyên bố audit bảo mật toàn diện. Preview chỉ bind `127.0.0.1`.
5. Kiểm tra cập nhật framework/dependency bảo mật và môi trường triển khai trước phát hành. Lần này chỉ nâng bản vá Next 14 để tương thích hệ thống sẵn có, không khẳng định đây là bản mới nhất hoặc đã audit toàn bộ dependency.
6. Đối chiếu sitemap/URL cũ với dữ liệu SEO thực tế trước chuyển domain; một số nội dung tuyển dụng cũ còn nguyên và không nằm trong 24 trang mới. Không bật lại case study/testimonial thiếu bằng chứng.
7. Khi toàn bộ điều kiện phát hành đã duyệt, mới đặt `NEXT_PUBLIC_SITE_INDEXABLE=true`, build lại và kiểm tra robots/sitemap trên domain thật. Noindex không thay thế xác thực cho staging public.
8. Chưa cấu hình analytics/CRM hay SLA phản hồi tự động. Link bấm gọi/Zalo không đồng nghĩa đã có cuộc gọi, tin nhắn hoặc khách hàng được tư vấn.

Khảo sát có kiểm chứng đủ 100 doanh nghiệp vẫn chưa được hoàn thành; không coi bản giao diện này là bằng chứng cho một nghiên cứu thị trường 100 doanh nghiệp.

## Kiểm tra

- `npm run build`: thành công; các trang marketing được prerender khi phù hợp. Hai API chẩn đoán/realtime không còn nằm trong prerender manifest.
- `npm run typecheck`: thành công.
- `npm run lint`: không có lỗi hoặc cảnh báo ESLint.
- `npm run test:marketing` trên production preview sau cập nhật chuyển trang: **70/70 pass ở lượt cuối** (2,6 phút).
- Đã xem ảnh desktop/mobile, kiểm tra chiều rộng 320–1920px, ảnh tải đúng, canvas có nội dung và thay đổi theo tương tác, pause/resume, reduced motion và mất WebGL.
- Reviewer độc lập đã kiểm tra lại và đóng hai phát hiện về tương phản nút gọi và permalink FAQ.
- Reviewer riêng cho hiệu ứng mở đầu phát hiện nút xem lại mất tiêu điểm bàn phím; đã tái hiện, sửa và thêm kiểm thử. Hiệu ứng giữ nội dung/liên hệ dùng được khi tắt JavaScript, hỗ trợ reduced motion, cảm ứng và chuyển trang.
- Reviewer chuyển trang phát hiện lớp màu che thanh gọi/Zalo mobile; đã tái hiện, sửa thứ tự hiển thị và thêm kiểm thử. Bộ kiểm tra mới bao gồm điều hướng nhanh, Back/Forward, reduced motion, trường hợp thiếu API animation và phản hồi mạng bị giữ lại. Các lần chạy trước có một phép đo khung hình 3D không ổn định và một fixture mạng chậm cần sửa; lịch sử đầy đủ trong `docs/QA.md`.
- Lighthouse chưa chạy được vì lỗi cài dependency từ registry. Không có cam kết điểm Lighthouse hay Core Web Vitals thực tế; chi tiết ở `docs/QA.md`.
- Preview đang chạy tại **http://127.0.0.1:4173**; không deploy, không commit/push, repo gốc vẫn sạch.

Báo cáo HTML: `artifacts/test-report/index.html`. Ảnh mới theo màu logo: `artifacts/screenshots/` và `artifacts/brand-*.png`; `artifacts/palette-*.png` là vòng màu thử nghiệm trước đó. Những artifact này không đưa vào Git. Build còn thông báo dữ liệu Browserslist cũ; không ảnh hưởng kết quả build nhưng cần cập nhật/test trước phát hành.

## Cập nhật TBS Studio

**Mốc mới nhất (27/09):** 138/138 kiểm thử repository, 55/55 luồng quản trị, 83/83 kiểm thử website; build/typecheck/lint và diff check đều đạt. Đã hoàn tất rà soát độc lập, sửa hai lỗi về ảnh/lịch sử sao lưu và ghi đè quyền tài khoản, đối chiếu đủ yêu cầu triển khai. Giao diện đội ngũ dùng được ở 320/390px; xung đột đưa tiêu điểm tới phần đối chiếu. Ô nhập AI chờ khởi tạo xong để không mất yêu cầu đang gõ.

Tab AI trong từng nội dung hỗ trợ brief, dàn ý, soạn nháp, viết lại, SEO, FAQ và liên kết nội bộ; lưu nguồn đã duyệt, model, trạng thái và token. Người biên tập so sánh rồi chọn từng thay đổi để lưu nháp, không tự xuất bản. `/admin/ai/generations/` quản lý lịch sử. Có chống gửi yêu cầu tính phí trùng, phục hồi phản hồi mạng thất lạc và bảo vệ đoạn văn khi nội dung bị sắp xếp lại. Kiểm tra khởi động lại bằng hai tiến trình riêng đã đạt. Sao lưu v3/schema v6 có cả lịch sử AI nhưng không chứa khóa bí mật.

**Còn chờ nghiệm thu AI thật:** anh khởi tạo chủ sở hữu, cấu hình origin/khóa mã hóa trên máy chủ và khóa OpenAI/model trong Studio, rồi cho phép lần thử có thể tính phí. Không gửi khóa qua chat. Chưa tạo owner thật, chưa gọi API tính phí, chưa triển khai công khai. Các số liệu/mô tả bên dưới là lịch sử; `docs/STUDIO-ACCEPTANCE.md` ghi rõ thời điểm/phạm vi từng lượt kiểm thử và điều kiện phát hành còn lại.

Đã thay nền quản trị mẫu bằng đăng nhập thật, cơ sở dữ liệu, phân quyền và nhật ký. Khu `/admin/content/` quản lý bản nháp, lịch sử, khôi phục, metadata SEO và xuất bản cho 24 trang. Các trang cố định có trường nội dung theo nhóm, tìm nhanh và xem trước bằng bố cục website thật. Trang công khai và danh sách liên quan đọc bản xuất bản; sửa nháp không làm đổi nội dung đang hiển thị. Có thể tạo bài mới và gỡ xuất bản. Chuyên viên SEO có luồng lưu metadata riêng, không được thay thân bài hay tự xuất bản.

Kiểm tra mới nhất: build/typecheck/lint đạt; **27/27 kiểm thử Studio**, **5/5 luồng quản trị end-to-end đạt**, **83/83 kiểm thử website đạt trong 2,3 phút**. Đã đối chiếu đủ 317 trường của các trang cố định trên bản nháp và bản xuất bản, kiểm tra ảnh editor desktop/390px, cảnh báo khi Back/đăng xuất và quyền sửa SEO riêng. Kiểm tra HTTP sau khi khởi động lại bằng dữ liệu thử độc lập cũng đạt: bản nháp không lộ, nội dung/SEO đã xuất bản vẫn giữ nguyên. Lỗi lấy mẫu chuyển động 3D trong fixture đã được đối chiếu trace và sửa cách đo; mã hiệu ứng thực tế không đổi. Chi tiết và lịch sử lần chạy nằm trong `docs/QA.md`.

Khu `/admin/seo/` đã có kiểm tra metadata bản nháp, quét HTML đã xuất bản, kế hoạch từ khóa/công việc và gợi ý liên kết nội bộ từ nội dung thực tế. Dashboard hiển thị số liệu nội dung/công việc thật. Lưu kế hoạch có kiểm tra phiên bản; khi xung đột có thể đối chiếu bản mới mà vẫn giữ phần đang nhập. Kết quả quét được đánh dấu cũ khi dữ liệu xuất bản thay đổi. Không có số liệu thứ hạng/traffic giả hoặc kết quả AI giả.

Kiểm tra bổ sung cho khu SEO: **39/39 kiểm thử Studio**, **9/9 luồng trình duyệt**, build/typecheck/lint đạt; đã xem desktop/mobile và hộp chỉnh công việc. Bộ website **83/83 đạt** trước sửa CSS cuối chỉ ảnh hưởng bảng quản trị. Cấu hình `STUDIO_ORIGIN` qua lệnh khởi động bị chính sách máy chặn, nên preview 4173 chưa bật quét HTML; chức năng này đã chạy thật trên server kiểm thử 4174 có cấu hình origin. Hướng dẫn và giới hạn ở `docs/STUDIO.md`.

Khu `/admin/seo/technical/` đã có chuyển hướng 307/308, chống vòng lặp/xung đột URL, giữ URL cũ khi xuất bản bài có slug mới, sitemap theo bản xuất bản và cấu hình nhiều mã xác minh Google. Khi hai quản trị viên cùng sửa, giao diện đối chiếu bản mới và giữ dữ liệu đang nhập. Chỉ admin được thay đổi cấu hình ảnh hưởng ngay tới website. Trạng thái Search Console chỉ ghi nhận mã đã cấu hình, không tự nhận Google đã xác minh; chưa có kết nối lấy traffic/thứ hạng. Noindex của preview vẫn giữ nguyên.

Kiểm tra SEO kỹ thuật ở bản cuối: **48/48 kiểm thử Studio, 15/15 luồng quản trị, 83/83 kiểm thử website**, build/typecheck/lint đều đạt. Đã xem ảnh desktop/mobile và tái hiện-sửa hai lỗi xung đột do reviewer độc lập phát hiện. Chi tiết về mã HTTP, canonical, bảo vệ dữ liệu, phạm vi kiểm thử và cấu hình nằm trong `docs/STUDIO.md` và `docs/QA.md`.

Tài khoản chủ sở hữu trên preview chưa được tạo; khởi tạo tại `/admin/` bằng mã riêng trên máy theo `docs/STUDIO.md`, không có mật khẩu mặc định. **Các luồng CMS/SEO/AI đã được triển khai**, gồm đề xuất theo ngữ cảnh, lịch sử và duyệt từng thay đổi vào bản nháp. Nghiệm thu nhà cung cấp thật còn chờ chủ sở hữu cấu hình riêng và cho phép lần gọi có thể tính phí; không gửi khóa bí mật qua chat. Chưa công khai website hay bật lập chỉ mục. Xem trạng thái kiểm chứng hiện hành trong `docs/STUDIO-ACCEPTANCE.md`.

## Cập nhật Industry Atlas (29/09)

Khu ngành hàng chuyển sang cấu trúc hai cấp `/nganh-hang/{nhóm}/{ngành}/`. Ba URL cũ chuyển hướng 308 một bước. Hub có ô tìm kiếm không phân biệt dấu, lọc theo nhóm và đặc tính (chia sẻ được qua URL nhưng không index), dải nhóm ngành có ảnh thật, trạng thái "không có kết quả" kèm gọi/Zalo, và bộ lọc dạng bottom sheet trên mobile. Trang ngành hàng có đủ các mục theo đặc tả: đặc điểm, trước khi đặt hàng, dữ liệu kỹ thuật, đóng gói, điểm cần xác minh, bằng chứng, dịch vụ, FAQ, brief sao chép và liên hệ. Mục nào chưa có nội dung đã duyệt thì ẩn. Quản trị tại `/admin/industries/`; hướng dẫn ở `docs/INDUSTRY-ATLAS.md`.

Kiểm tra 29/09: build/typecheck/lint đạt; **159/159** kiểm thử repository, **57/57** luồng quản trị, **103/103** kiểm thử website, **9/9** kiểm thử quy mô 100 ngành và tiêm lỗi. Chưa xuất bản thêm nhóm/ngành mới: việc này chờ nội dung, người duyệt và quyền ảnh được duyệt. Chưa deploy, chưa bật index, chưa commit/push.
