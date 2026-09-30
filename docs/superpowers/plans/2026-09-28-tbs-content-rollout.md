# TBS Content Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Biến demo 24 trang thành website tiếp thị TBS giàu bằng chứng thật, giúp khách hiểu đúng dịch vụ và chuẩn bị đủ dữ liệu trước khi gọi/Zalo, bắt đầu bằng pilot ba trang rồi mới nhân rộng.

**Architecture:** Giữ nguyên nền Next.js 14, TBS Studio, màu logo và hệ motion đã nghiệm thu. Nội dung đi theo chuỗi nguồn gốc `video/tài liệu gốc -> transcript và claim ledger -> duyệt nghiệp vụ/quyền sử dụng -> tài sản web và bản nháp Studio -> preview -> publish`; public site không đọc trực tiếp thư mục video và không công bố claim chưa duyệt. Ba trang `/`, `/dich-vu/nhap-khau-chinh-ngach/` và `/nang-luc-van-hanh/` là pilot để khóa chuẩn trước khi cập nhật 21 trang còn lại.

**Tech Stack:** Next.js 14.2.35, React 18, TypeScript, TBS Studio/SQLite, Zod, GSAP, React Three Fiber/Three.js, Sharp/ffmpeg cho asset, Playwright cho public và Studio QA.

**Spec:** `F:/01_TBS_GROUP/docs/superpowers/specs/2026-09-26-tbs-website-design.md`, `F:/01_TBS_GROUP/docs/superpowers/specs/2026-09-26-tbs-website-content.md`, `F:/01_TBS_GROUP/docs/superpowers/specs/2026-09-26-tbs-website-sales-acceptance.md`, `F:/01_TBS_GROUP/11.Du_An/tbs-website-redesign/docs/superpowers/plans/2026-09-27-tbs-content-depth.md`.

## Global Constraints

- Không có form thu lead, popup xin số điện thoại, newsletter hoặc chatbot nghiệp vụ trên bề mặt marketing mới; CTA chính là điện thoại và Zalo.
- Không thay logo hoặc bảng màu chính thức: `#0083CA`, `#3D94D9`, `#006FA8`, `#005B8C`, trắng, `#F3F6F7` và dải trung tính hiện có.
- Giữ intro hữu hạn, page transition hiện có, `prefers-reduced-motion`, nội dung server-rendered và CTA luôn thao tác được.
- Hero dùng ảnh hoạt động thật đã duyệt; không autoplay video ở hero. Video nếu được duyệt chỉ xuất hiện dưới trang, có poster, điều khiển, mặc định tắt tiếng và không tự chạy.
- Không bịa năng lực, số liệu, khách hàng, tuyến, kho, đội xe, SLA, mức phí, mã HS, thuế, giấy phép hoặc kết luận pháp lý.
- Không công bố dữ liệu nhạy cảm, nhãn kiện, biển số, tên khách/NCC, chứng từ hoặc gương mặt chưa có quyền sử dụng.
- Không sửa SQLite trực tiếp. Nội dung đi qua TBS Studio, có bản nháp, preview, reviewer, lịch sử và rollback.
- Preview tiếp tục `noindex`; không đổi DNS, webroot, indexability, production hoặc ERP trong kế hoạch này.
- Không gọi AI trả phí, không commit/push và không thực hiện cuộc gọi/tin nhắn thật nếu chưa có yêu cầu riêng của chủ dự án.
- Không mô tả nghiên cứu 100 doanh nghiệp là hoàn thành cho đến khi có đủ 100 dòng nguồn, ngày truy cập và tiêu chí chấm.

## Review Focus

- Video có nội dung tốt nhưng quyền web hoặc nhạc không rõ: dùng transcript đã duyệt và still hợp lệ; không đưa file video lên public.
- Claim thuế/hải quan/QCVN/thông tư có thể hết hiệu lực: phải có nguồn chính thức, ngày rà soát và người duyệt trước publish.
- Media bị thiếu hoặc lỗi: nội dung, CTA và bố cục vẫn đọc được; không có ô trắng hoặc layout shift lớn.
- Khách vào bằng mobile 320/390px, zoom 200% hoặc reduced motion: không cắt chữ, cuộn ngang, che CTA hay bắt buộc animation.
- Studio/CMS tạm lỗi: bản đã publish và link gọi/Zalo vẫn hoạt động; draft không lộ ra sitemap hoặc người ẩn danh.

## File Structure

### Nguồn nội dung và kiểm duyệt

- Create: `F:/01_TBS_GROUP/11.Du_An/tbs-content-sources/tiktok/pilot-2026/selection.json` - 25 video được chọn và ánh xạ vào trang/mục.
- Create: `F:/01_TBS_GROUP/11.Du_An/tbs-content-sources/tiktok/pilot-2026/claim-ledger.csv` - từng claim, timestamp, nguồn đối chiếu, reviewer và trạng thái.
- Create: `F:/01_TBS_GROUP/11.Du_An/tbs-content-sources/tiktok/pilot-2026/media-rights.csv` - quyền ảnh/video/nhạc/gương mặt và quyết định public.
- Create: `F:/01_TBS_GROUP/11.Du_An/tbs-content-sources/tiktok/pilot-2026/page-briefs/*.md` - brief đã duyệt cho ba trang pilot.
- Create: `F:/01_TBS_GROUP/11.Du_An/tbs-content-sources/market-benchmark-2026/companies.csv` - benchmark 100 doanh nghiệp có nguồn.
- Create: `F:/01_TBS_GROUP/11.Du_An/tbs-content-sources/market-benchmark-2026/findings.md` - mẫu nội dung, khoảng trống và khuyến nghị, không sao chép câu chữ đối thủ.

### Mã nguồn website

- Create: `src/components/marketing/EvidenceRail.tsx` - dải bằng chứng thật có ảnh, chú thích, phạm vi và liên kết nội bộ.
- Create: `src/components/marketing/RiskBrief.tsx` - khối cảnh báo/điều cần xác minh, không đưa ra kết luận tự động.
- Create: `src/components/marketing/evidence.ts` - kiểu dữ liệu và hàm ánh xạ trường Studio cho ba trang pilot.
- Modify: `src/components/marketing/HomePage.tsx` - cấu trúc nội dung mới và evidence rail.
- Modify: `src/components/marketing/InteriorPages.tsx` - module bằng chứng/rủi ro cho dịch vụ chính ngạch và năng lực vận hành.
- Modify: `src/data/fixed-page-seeds.json` - trường biên tập mới cho trang chủ và năng lực vận hành.
- Modify: `src/data/marketing.ts` - copy/service data đã duyệt cho trang nhập khẩu chính ngạch.
- Modify: `src/app/marketing.css` - layout responsive của module mới, không thay token thương hiệu.
- Modify: `src/lib/studio/fixed-page-registry.ts` - chỉ khi cần khai báo trường mới; không đổi schema DB.
- Create/Modify: `public/images/marketing/proof/*` - chỉ asset dẫn xuất đã duyệt và tối ưu.

### Kiểm thử và tài liệu bàn giao

- Create: `scripts/validate-content-sources.mjs` - kiểm tra selection, transcript, claim và quyền sử dụng.
- Create: `scripts/validate-market-benchmark.mjs` - kiểm tra đủ 100 doanh nghiệp và 20 review sâu.
- Create: `scripts/validate-marketing-assets.mjs` - kiểm tra provenance, kích thước và ngân sách asset.
- Create: `tests/marketing/content-pilot.spec.ts` - nội dung, CTA, proof, fallback, responsive và reduced motion cho ba trang.
- Modify: `tests/marketing/site.spec.ts` - không form, hotline/Zalo, URL neo và 404.
- Modify: `tests/studio-browser/fixed-pages.spec.ts` - draft/preview/publish/rollback của các trường pilot.
- Modify: `docs/ASSETS.md` - nguồn file, cách xử lý, quyền và checksum.
- Create: `docs/CONTENT-OPERATIONS.md` - quy trình source, reviewer, preview, publish và rollback.
- Create: `docs/CONTENT-ACCEPTANCE.md` - kết quả nghiệm thu nội dung, nghiệp vụ, SEO, mobile và performance.

---

### Task 1: Khóa nguồn và chọn 25 video ưu tiên

**Files:**
- Create: `../tbs-content-sources/tiktok/pilot-2026/selection.json`
- Create: `../tbs-content-sources/tiktok/pilot-2026/README.md`
- Source: `../tbs-content-sources/tiktok/creator-library-2026/manifest.json`

**Interfaces:**
- Consumes: manifest 140 video và 12 contact sheet đã kiểm tra.
- Produces: `selection.json` gồm `videoId`, `sourcePath`, `pageTargets`, `contentRole`, `visualRole`, `priority`, `reviewStatus`.

- [ ] **Step 1: Chọn đúng 25 video cho đợt nền**

  Bắt buộc có: 8 bằng chứng vận hành, 7 giáo dục chính ngạch, 4 cảnh báo rủi ro, 4 ngành hàng, 2 con người TBS. Mỗi video có tối đa ba `pageTargets` để tránh dùng lặp khắp site.

- [ ] **Step 2: Gắn 12 video đầu vào ba trang pilot**

  Trang chủ ưu tiên `7688137766668111111`; năng lực dùng thêm container/kho/bàn giao; dịch vụ chính ngạch ưu tiên hồ sơ, thuế, ủy thác, hóa đơn và QCVN.

- [ ] **Step 3: Kiểm tra cấu trúc và file nguồn**

  Run: `node -e "const fs=require('fs');const p=require('./../tbs-content-sources/tiktok/pilot-2026/selection.json');if(p.length!==25)throw Error('expected 25');for(const x of p){if(!fs.existsSync(x.sourcePath)||!x.videoId||!x.pageTargets?.length)throw Error(x.videoId)};console.log('25 sources OK')"`

  Expected: `25 sources OK`.

- [ ] **Step 4: Review checkpoint**

  Chủ nội dung xác nhận danh sách; không publish hay tạo asset public ở task này.

### Task 2: Tạo transcript, claim ledger và quyền sử dụng

**Files:**
- Create: `../tbs-content-sources/tiktok/pilot-2026/videos/<videoId>/transcript.*`
- Create: `../tbs-content-sources/tiktok/pilot-2026/claim-ledger.csv`
- Create: `../tbs-content-sources/tiktok/pilot-2026/media-rights.csv`
- Create: `scripts/validate-content-sources.mjs`
- Reuse: `../tbs-content-sources/transcription-tool/transcribe-tbs.mjs`

**Interfaces:**
- Consumes: 25 dòng đã khóa từ Task 1.
- Produces: transcript có timestamp; từng claim có `claim_id`, `video_id`, `start_ms`, `end_ms`, `claim_text`, `claim_type`, `official_source`, `reviewer`, `reviewed_at`, `status`; quyền có `web_still`, `web_video`, `face_release`, `music_clearance`.

- [ ] **Step 1: Chạy transcription theo từng video, không sửa file gốc**

  Mỗi thư mục phải có transcript text, segment JSON và contact sheet. Lỗi tên riêng/thuật ngữ được đánh dấu `[cần nghe lại]`, không tự đoán.

- [ ] **Step 2: Tách claim thay vì chép nguyên lời TikTok**

  Mỗi claim thuộc một trong: `operational`, `commercial`, `legal-tax`, `metric`, `customer-case`, `identity-location`. `legal-tax`, `commercial`, `metric` và `customer-case` mặc định `blocked` cho đến khi có reviewer.

- [ ] **Step 3: Ghi quyền sử dụng theo từng video**

  Không suy ra quyền web từ việc file nằm trong thư mục TBS. Nếu nhạc chưa rõ, `web_video=blocked`; still chỉ được dùng khi `web_still=approved` và cảnh không lộ dữ liệu cần che.

- [ ] **Step 4: Viết validator cho source package**

  Validator kiểm tra đủ 25 package, khóa các loại claim nhạy cảm khi thiếu nguồn/reviewer và đối chiếu `web_still`/`web_video` với bảng quyền.

- [ ] **Step 5: Kiểm tra không có claim nhạy cảm tự động được duyệt**

  Run: `node scripts/validate-content-sources.mjs --selection ../tbs-content-sources/tiktok/pilot-2026/selection.json --claims ../tbs-content-sources/tiktok/pilot-2026/claim-ledger.csv --rights ../tbs-content-sources/tiktok/pilot-2026/media-rights.csv`

  Expected: 25 transcript packages; không dòng nhạy cảm `approved` khi thiếu nguồn/reviewer; exit 0.

### Task 3: Hoàn thành benchmark 100 doanh nghiệp

**Files:**
- Create: `../tbs-content-sources/market-benchmark-2026/companies.csv`
- Create: `../tbs-content-sources/market-benchmark-2026/findings.md`
- Create: `../tbs-content-sources/market-benchmark-2026/rubric.md`
- Create: `scripts/validate-market-benchmark.mjs`

**Interfaces:**
- Consumes: website công khai của 100 doanh nghiệp nhập khẩu/logistics Việt Nam - Trung Quốc.
- Produces: dữ liệu có `company`, `url`, `accessed_at`, `service_scope`, `proof_type`, `direct_contact`, `content_depth`, `industry_pages`, `risk_content`, `notes`; 20 doanh nghiệp được review sâu.

- [ ] **Step 1: Khóa rubric trước khi thu thập**

  Rubric chỉ ghi điều quan sát được trên nguồn công khai; không tự xác nhận năng lực, doanh thu, quy mô hay chất lượng doanh nghiệp.

- [ ] **Step 2: Thu đủ 100 dòng có URL và ngày truy cập**

  Tách nguồn lỗi/không truy cập được; không thay bằng suy đoán. Chọn 20 mẫu sâu theo độ đầy đủ và sự khác biệt, không chỉ theo thứ hạng tìm kiếm.

- [ ] **Step 3: Viết phát hiện phục vụ TBS**

  Kết quả phải nêu: mô hình phổ biến, khoảng trống, pattern liên hệ, bằng chứng thường dùng và cơ hội cho TBS. Không sao chép headline/copy của đối thủ.

- [ ] **Step 4: Viết validator benchmark**

  Validator kiểm tra URL hợp lệ, ngày ISO, khóa công ty trùng, đủ trường bắt buộc và đúng 20 dòng review sâu.

- [ ] **Step 5: Kiểm tra dữ liệu**

  Run: `node scripts/validate-market-benchmark.mjs ../tbs-content-sources/market-benchmark-2026/companies.csv`

  Expected: 100 công ty duy nhất, 100 URL, 100 ngày truy cập, 20 dòng `deep_review=true`, không trường bắt buộc trống.

### Task 4: Viết và duyệt brief ba trang pilot

**Files:**
- Create: `../tbs-content-sources/tiktok/pilot-2026/page-briefs/home.md`
- Create: `../tbs-content-sources/tiktok/pilot-2026/page-briefs/nhap-khau-chinh-ngach.md`
- Create: `../tbs-content-sources/tiktok/pilot-2026/page-briefs/nang-luc-van-hanh.md`

**Interfaces:**
- Consumes: transcript/claim đã duyệt từ Task 2 và phát hiện benchmark từ Task 3.
- Produces: copy theo từng section, asset ID, claim ID, reviewer, CTA và URL neo.

- [ ] **Step 1: Soạn trang chủ theo hành trình 10 khối**

  H1 nhận diện TBS và dịch vụ; bốn lối vào nhu cầu; ba proof; sáu dịch vụ; hành trình; ngành hàng; chi phí/chứng từ; kiến thức; brief khách cần chuẩn bị; CTA gọi/Zalo.

- [ ] **Step 2: Soạn trang nhập khẩu chính ngạch**

  Phải có đối tượng phù hợp, phạm vi, đầu vào, quy trình, giới hạn, bằng chứng và 6 FAQ sale dùng được. Các câu trả lời pháp lý luôn có điều kiện và nguồn rà soát.

- [ ] **Step 3: Soạn trang năng lực vận hành**

  Trình bày theo dòng công việc trước khi hàng đi -> tiếp nhận/kho -> sang tải/kiểm đếm -> bàn giao. Phân biệt hoạt động trực tiếp và đối tác; không biến hình ảnh thành claim sở hữu.

- [ ] **Step 4: Duyệt chéo**

  Marketing duyệt giọng; XNK duyệt nghiệp vụ; kế toán duyệt phần phí/chứng từ; vận hành duyệt hình/địa điểm; sale duyệt FAQ và brief. Mỗi section chỉ chuyển sang `approved` khi có đủ reviewer cần thiết.

### Task 5: Chuẩn bị asset web có provenance

**Files:**
- Create/Modify: `public/images/marketing/proof/*.webp`
- Modify: `docs/ASSETS.md`
- Create: `../tbs-content-sources/tiktok/pilot-2026/web-assets.json`
- Create: `scripts/validate-marketing-assets.mjs`

**Interfaces:**
- Consumes: `media-rights.csv` đã duyệt và frame/timestamp từ Task 4.
- Produces: ảnh WebP/AVIF đúng kích thước, alt text, checksum, source timestamp và mục đích sử dụng.

- [ ] **Step 1: Xuất ảnh từ timestamp đã duyệt**

  Hero desktop tối thiểu 1920px; ảnh section tối thiểu 1280px; không crop mất đối tượng chính hoặc che dữ liệu bằng CSS.

- [ ] **Step 2: Che dữ liệu trực tiếp trong file dẫn xuất**

  Nhãn, biển số, tên khách/NCC và chứng từ phải được rasterize sau khi che; xóa metadata không cần thiết.

- [ ] **Step 3: Tối ưu ngân sách**

  Hero mục tiêu <= 300KB; ảnh section <= 220KB; ảnh thumbnail <= 120KB. Giữ bản gốc ngoài `public/`.

- [ ] **Step 4: Viết validator asset**

  Validator đối chiếu manifest với file public, kích thước pixel/byte, checksum, alt text và trạng thái quyền.

- [ ] **Step 5: Kiểm tra asset**

  Run: `node scripts/validate-marketing-assets.mjs --manifest ../tbs-content-sources/tiktok/pilot-2026/web-assets.json --public public/images/marketing/proof`

  Expected: mọi file có nguồn, alt, checksum, quyền `approved`, kích thước pixel hợp lệ và không vượt ngân sách nếu không có ngoại lệ ghi rõ.

### Task 6: Thêm module bằng chứng và cảnh báo theo TDD

**Files:**
- Create: `src/components/marketing/EvidenceRail.tsx`
- Create: `src/components/marketing/RiskBrief.tsx`
- Create: `src/components/marketing/evidence.ts`
- Modify: `src/app/marketing.css`
- Create: `tests/marketing/content-pilot.spec.ts`

**Interfaces:**
- Produces: `EvidenceItem = { id: string; eyebrow: string; title: string; body: string; image: string; imageAlt: string; sourceLabel: string; sourceDate: string; scopeNote: string; href?: string }`.
- Produces: `RiskItem = { id: string; title: string; body: string; sourceHref?: string; reviewedAt?: string }`.
- Produces: `<EvidenceRail heading items />` và `<RiskBrief heading items />`; cả hai render server-safe, không phụ thuộc animation để đọc.

- [ ] **Step 1: Viết test đỏ**

  Test ba proof có ảnh/alt/chú thích; risk brief không chứa CTA giả; media lỗi vẫn còn text; 320/390px không cuộn ngang; reduced motion không ẩn nội dung.

- [ ] **Step 2: Chạy test để xác nhận đỏ**

  Run: `npx playwright test tests/marketing/content-pilot.spec.ts`

  Expected: FAIL vì component/chọn lọc chưa tồn tại.

- [ ] **Step 3: Implement component tối thiểu**

  Dùng `next/image`, liên kết nội bộ và CSS token hiện có. Motion chỉ là reveal hữu hạn; không carousel tự chạy, không card lồng card, không thay page transition.

- [ ] **Step 4: Chạy test component**

  Run: `npx playwright test tests/marketing/content-pilot.spec.ts`

  Expected: PASS.

### Task 7: Tích hợp ba trang pilot và TBS Studio

**Files:**
- Modify: `src/components/marketing/HomePage.tsx`
- Modify: `src/components/marketing/InteriorPages.tsx`
- Modify: `src/data/fixed-page-seeds.json`
- Modify: `src/data/marketing.ts`
- Modify: `tests/studio-browser/fixed-pages.spec.ts`
- Modify: `tests/marketing/site.spec.ts`

**Interfaces:**
- Consumes: `EvidenceItem[]`, `RiskItem[]`, brief và asset từ Task 4-5.
- Produces: ba route pilot đầy đủ; tất cả copy/ảnh quan trọng vẫn draft/preview/publish/rollback được trong Studio.

- [ ] **Step 1: Viết test đỏ cho ba route**

  Assert H1, CTA phone/Zalo, bốn lối vào nhu cầu, proof có provenance, FAQ, URL neo, không form và không claim blocked.

- [ ] **Step 2: Chạy test để xác nhận đỏ**

  Run: `npx playwright test tests/marketing/content-pilot.spec.ts tests/marketing/site.spec.ts`

  Expected: FAIL ở section/copy pilot chưa tích hợp.

- [ ] **Step 3: Tích hợp trang chủ**

  Giữ hero motion và Journey; thay ảnh minh họa bằng still đã duyệt; thêm need routes và EvidenceRail; CTA không thay endpoint.

- [ ] **Step 4: Tích hợp dịch vụ chính ngạch và năng lực vận hành**

  Dùng dữ liệu service hiện có cho scope/inputs/boundaries/FAQ; chèn risk/proof theo đúng brief. Không thêm schema DB nếu cấu trúc flat field hiện tại đủ đáp ứng.

- [ ] **Step 5: Kiểm tra Studio**

  Run: `npx playwright test -c playwright.studio.config.ts tests/studio-browser/fixed-pages.spec.ts`

  Expected: draft không lộ ẩn danh; preview no-store/noindex; publish hiển thị; rollback khôi phục đúng; PASS.

- [ ] **Step 6: Kiểm tra public pilot**

  Run: `npx playwright test tests/marketing/content-pilot.spec.ts tests/marketing/site.spec.ts tests/marketing/hero-motion.spec.ts tests/marketing/page-transitions.spec.ts`

  Expected: PASS; intro/transition/CTA cũ không hồi quy.

### Task 8: Cổng duyệt pilot trước khi nhân rộng

**Files:**
- Create: `docs/CONTENT-ACCEPTANCE.md`
- Create: `artifacts/content-pilot/*`

**Interfaces:**
- Consumes: preview ba trang từ Task 7.
- Produces: quyết định `approved`, `changes_requested` hoặc `blocked` cho từng lớp nội dung, media, UX, sale.

- [ ] **Step 1: Chụp desktop/mobile**

  Viewport bắt buộc: 320x800, 390x844, 768x1024, 1440x900, 1920x1080 và desktop zoom 200%.

- [ ] **Step 2: Chạy ba kịch bản sale**

  Khách đã có NCC; khách cần ủy thác; khách nhập máy móc. Sale phải tìm được đúng URL/mục và nêu được bộ thông tin cần hỏi trong tối đa 60 giây, nhưng không biến đây thành SLA phản hồi khách.

- [ ] **Step 3: Duyệt nghiệp vụ và quyền**

  Không còn claim `blocked`/`pending` trên nội dung dự kiến publish; ảnh public có dòng tương ứng trong `web-assets.json` và `docs/ASSETS.md`.

- [ ] **Step 4: Gate**

  Chỉ bắt đầu Task 9 khi ba trang được chủ dự án, XNK/vận hành và sale chấp thuận. Nếu không, sửa đúng pilot rồi chạy lại Task 7-8.

### Task 9: Nhân chuẩn sang 21 trang còn lại

**Files:**
- Modify qua TBS Studio: 11 fixed pages còn lại, 5 service còn lại, 3 industry và 2 article hiện có; số lượng thực tế đối chiếu inventory tại thời điểm chạy.
- Create: `../tbs-content-sources/tiktok/pilot-2026/page-briefs/<slug>.md`
- Modify: `tests/marketing/content-pilot.spec.ts` hoặc create `tests/marketing/content-rollout.spec.ts`

**Interfaces:**
- Consumes: chuẩn page brief, component, review gate đã duyệt.
- Produces: đủ 24 URL đợt nền, mỗi trang có mục tiêu, nguồn, reviewer, CTA và link nội bộ hợp lý.

- [ ] **Step 1: Làm P1 trước**

  Dịch vụ, quy trình, chi phí/chứng từ, FAQ, liên hệ và hai bài sale gửi khách. Không chờ trang chính sách hoặc ngành hàng để hoàn thiện luồng tư vấn chính.

- [ ] **Step 2: Làm P2**

  Giới thiệu, ngành hàng, kiến thức hub và ba chính sách. Nội dung chính sách phải phản ánh công cụ/luồng dữ liệu thật, không dùng mẫu chung để lấp chỗ trống.

- [ ] **Step 3: Kiểm tra từng batch 5-7 trang**

  Mỗi batch chạy render, link, CTA, metadata, mobile, no-form, Studio preview/publish/rollback trước khi sang batch tiếp theo.

- [ ] **Step 4: Không mở rộng route chưa đủ bằng chứng**

  `/lo-hang-thuc-te/`, download PDF và video public chỉ sang đợt 2 khi có hồ sơ thật/quyền/đặc tả riêng.

### Task 10: QA toàn bộ và chuẩn bị phát hành

**Files:**
- Modify: `docs/CONTENT-ACCEPTANCE.md`
- Create: `docs/CONTENT-OPERATIONS.md`
- Modify: `DELIVERY.md`

**Interfaces:**
- Consumes: 24 trang đã duyệt.
- Produces: build kiểm chứng, báo cáo QA, danh sách ngoại lệ, runbook phát hành/rollback; không tự phát hành production.

- [ ] **Step 1: Chạy kiểm tra tĩnh và repository tests**

  Run: `npm run typecheck`

  Run: `npm run lint`

  Run: `npm run test:studio`

  Expected: tất cả exit 0.

- [ ] **Step 2: Chạy browser tests**

  Run: `npm run test:marketing`

  Run: `npm run test:studio:browser`

  Expected: tất cả PASS; nếu có baseline ngoài phạm vi phải ghi chính xác, không gọi cả suite xanh.

- [ ] **Step 3: Build production cục bộ**

  Run: `npm run build`

  Expected: exit 0; 24 URL public render đúng; preview/admin không vào sitemap.

- [ ] **Step 4: Kiểm tra hiệu năng và accessibility**

  Hero LCP không bị video chặn; không CLS đáng kể từ ảnh; không lỗi accessibility nghiêm trọng; CTA và nội dung dùng được khi animation/API ngoài lỗi.

- [ ] **Step 5: Diễn tập rollback trên local/staging**

  Xuất backup portable, publish một thay đổi test, rollback về snapshot, xác nhận content/asset/URL đúng và credential không nằm trong backup.

- [ ] **Step 6: Bàn giao và dừng ở release gate**

  Ghi người duyệt, timestamp, test evidence, ngoại lệ và checklist production. Chỉ deploy/index khi chủ dự án ra lệnh riêng sau khi xem bản demo cuối.

## Timeline And Ownership

| Giai đoạn | Thời lượng dự kiến | Kết quả | Người chính |
| --- | ---: | --- | --- |
| Chọn nguồn, transcript, claim/right ledger | 3-4 ngày làm việc | 25 source package, 12 nguồn pilot | Content research + XNK/vận hành |
| Benchmark 100 doanh nghiệp | 3-4 ngày, chạy song song | 100 dòng + 20 review sâu | Research/Marketing |
| Viết, duyệt và chuẩn bị asset 3 pilot | 3 ngày | 3 brief và asset đã duyệt | Content + reviewer TBS |
| Implement và QA pilot | 2-3 ngày | 3 trang mẫu trên demo | Dev + QA |
| Nhân 21 trang còn lại | 5-7 ngày | 24 trang đợt nền | Content + Dev + reviewer |
| QA tổng, runbook và release gate | 2 ngày | Bản demo sẵn sàng duyệt phát hành | QA + Tech + chủ dự án |

Tổng dự kiến: **15-20 ngày làm việc**, nếu đầu mối TBS phản hồi đều. Thời gian chờ quyền sử dụng, hồ sơ pháp lý/nghiệp vụ hoặc phê duyệt ảnh không tính trong ước lượng.

## Definition Of Done

- 24 URL đợt nền có nội dung được duyệt, không trang rỗng, không form thu lead, không claim không có căn cứ.
- Ba trang trọng tâm dùng bằng chứng thật có provenance; ảnh minh họa cũ không bị mô tả như năng lực TBS.
- Sale có thư viện link theo ít nhất ba tình huống và mẫu brief khách cần chuẩn bị.
- Hotline/Zalo nhất quán, đúng cấu hình và dùng được trên desktop/mobile mà không phụ thuộc analytics.
- Studio duy trì draft/preview/publish/rollback, phân quyền và backup; nháp không lộ public.
- Motion, reduced motion, responsive, accessibility, SEO metadata, sitemap/robots và performance qua gate đã ghi.
- Có báo cáo benchmark 100 doanh nghiệp thật sự, tách rõ quan sát công khai và kết luận đề xuất.
- Có runbook release/rollback; production vẫn chờ lệnh phát hành riêng.
