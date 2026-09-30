# TBS Industry Atlas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Xây Industry Atlas có category hai cấp, tìm kiếm/lọc chia sẻ được, trang ngành hàng giàu nội dung và quy trình CMS kiểm duyệt, mở rộng an toàn tới hơn 100 ngành hàng.

**Architecture:** Category và industry tiếp tục dùng document/version/publication của TBS Studio; trait dùng một setting có optimistic version. Public Atlas được dựng từ published snapshot, search/filter chạy bằng hàm TypeScript thuần trên tối đa vài trăm mục, không có dịch vụ search ngoài. Schema v7 thêm archive và migration nguyên tử cho ba URL cũ; portable backup v4 lưu đủ taxonomy nhưng không lưu account/credential.

**Tech Stack:** Next.js 14.2.35 App Router, React 18, TypeScript 5, Zod 3, SQLite/better-sqlite3, TBS Studio, Next Image, Heroicons, Playwright 1.62.1, Node test runner qua `tsx --test`.

**Spec:** `F:/01_TBS_GROUP/11.Du_An/tbs-website-redesign/docs/superpowers/specs/2026-09-28-tbs-industry-atlas-design.md`

## Global Constraints

- Giữ Next.js 14/React 18, logo, bảng màu TBS, contact điện thoại/Zalo và page transition hiện có.
- Không form thu lead, báo giá tự động, tính HS/thuế/giấy phép, tài khoản khách hoặc dịch vụ search ngoài.
- Taxonomy/trait không được diễn giải thành xác nhận TBS nhận hàng hoặc kết luận pháp lý.
- Public chỉ đọc published snapshot; draft, dữ liệu nội bộ, transcript và claim ledger không vào search index.
- Filter URL chia sẻ được nhưng canonical về `/nganh-hang/`, không vào sitemap và render `noindex,follow`.
- Không autocomplete bằng dữ liệu khách, không gửi query thô/model/NCC/dữ liệu lô hàng vào analytics.
- Không autoplay video, không carousel tự chạy, không chiếm scroll; `prefers-reduced-motion` giữ đầy đủ nội dung.
- Dùng `next/image`, kích thước media ổn định, lazy-load dưới fold và không eager toàn bộ ảnh khi có 100 ngành hàng.
- Mọi mutation Studio giữ origin check, capability, optimistic version, audit, revision, backup và rollback như hệ hiện có.
- Không sửa SQLite trực tiếp ngoài migration versioned; migration phải nguyên tử và idempotent.
- Không deploy, bật index, đổi DNS, commit hoặc push trong khi hạn chế hiện tại chưa được chủ dự án gỡ bỏ. Thay bước commit bằng checkpoint/test evidence.
- Không publish thêm ngành hàng khi thiếu nguồn, reviewer, quyền media hoặc nội dung khác biệt; fixture kiểm thử không phải nội dung public.

## Review Focus

- Database v6 có ba industry đã được người dùng sửa: migration phải giữ nguyên copy/media/SEO, chỉ bổ sung contract mới và đổi route có redirect một bước.
- Category bị archive/unpublish trong khi có child: mutation phải trả 409 trước khi thay đổi publication, revision hoặc audit.
- Trait bị archive nhưng industry cũ còn tham chiếu: trang vẫn render nhãn lịch sử, trait không còn xuất hiện trong bộ lọc tạo mới và không làm search lỗi.
- Search nhận query không dấu, ký tự Unicode lạ, query dài hoặc filter không thuộc allowlist: chuẩn hóa có giới hạn, bỏ filter lạ và không 500/crawl trap.
- Search index hoặc JavaScript lỗi: category/featured industry server-rendered vẫn đọc và điều hướng được, snapshot public cuối vẫn hoạt động.

## File Structure

### Domain và persistence

- Create: `src/data/industry-atlas.ts` - seed category/trait và ba industry hiện có theo contract mới.
- Modify: `src/data/marketing.ts` - bỏ định nghĩa industry cũ, re-export khi cần tương thích nội bộ.
- Modify: `src/lib/studio/content-model.ts` - schema `industryCategory`, industry mở rộng và route hai cấp.
- Modify: `src/lib/studio/content-labels.ts` - nhãn kind mới.
- Create: `src/lib/studio/industry-taxonomy-model.ts` - schema trait/settings/query mutation.
- Create: `src/lib/studio/industry-taxonomy.ts` - persistence/version/audit cho trait.
- Create: `src/lib/studio/industry-migration.ts` - migration idempotent v6 -> v7 và URL cũ.
- Modify: `src/lib/studio/database.ts` - `archived_at`, user_version 7 và gọi migration nguyên tử.
- Modify: `src/lib/studio/content.ts` - relation guards, archive/reactivate, review gates và publication move.
- Modify: `src/lib/studio/runtime.ts` - expose `industryTaxonomy`.
- Modify: `src/app/api/studio/content/[id]/route.ts` - archive/reactivate actions.
- Create: `src/app/api/studio/industries/taxonomy/route.ts` - GET/PATCH taxonomy.

### Backup và Studio UI

- Modify: `src/lib/studio/backup-model.ts` - portable format 4/schema 7 và taxonomy key.
- Modify: `src/lib/studio/backup-data.ts` - export/import `archived_at` và taxonomy.
- Modify: `src/lib/studio/backup-validation.ts` - exact schema 7, relation/taxonomy validation.
- Modify: `src/lib/studio/backups.ts` - manifest schema 7.
- Create: `src/app/admin/industries/page.tsx` - workspace quản trị Atlas.
- Create: `src/components/studio/IndustryWorkspace.tsx` - inventory category/industry/trait.
- Create: `src/components/studio/IndustryFields.tsx` - editor fields có cấu trúc.
- Modify: `src/components/studio/ContentEditor.tsx` - delegate category/industry fields.
- Modify: `src/components/studio/ContentInventory.tsx` - archived status và link workspace.
- Modify: `src/components/studio/StudioShell.tsx` - mục Ngành hàng.
- Modify: `src/app/admin/studio.css` - layout workspace responsive.

### Public Atlas

- Create: `src/lib/industries/search.ts` - normalize/index/filter/parse query thuần.
- Create: `src/lib/industries/public.ts` - đọc published snapshot, join category/trait và quản lý last-known-good search projection.
- Create: `src/components/marketing/InteriorPrimitives.tsx` - primitive layout/contact/service dùng chung, tách khỏi file page lớn.
- Create: `src/components/marketing/IndustryPages.tsx` - hub/category/detail server components.
- Create: `src/components/marketing/IndustryExplorer.tsx` - search/filter client island.
- Create: `src/components/marketing/IndustryAtlas.module.css` - layout/motion/fallback cô lập.
- Modify: `src/components/marketing/InteriorPages.tsx` - bỏ implementation industry cũ và dùng export mới khi cần.
- Modify: `src/app/nganh-hang/page.tsx` - hub mới.
- Replace: `src/app/nganh-hang/[slug]/page.tsx` -> `src/app/nganh-hang/[category]/page.tsx`.
- Create: `src/app/nganh-hang/[category]/[industry]/page.tsx` - detail hai cấp.
- Modify: `src/app/sitemap.ts` - chỉ published canonical paths.
- Modify: `src/lib/analytics.ts` - event Industry Atlas đã sanitize.

### Tests và tài liệu

- Create: `tests/studio/industry-model.test.ts`
- Create: `tests/studio/industry-migration.test.ts`
- Create: `tests/studio/industry-taxonomy.test.ts`
- Create: `tests/studio/industry-search.test.ts`
- Modify: `tests/studio/content.test.ts`
- Modify: `tests/studio/backups.test.ts`
- Modify: `tests/studio/technical-seo.test.ts`
- Create: `tests/studio-browser/industries.spec.ts`
- Create: `tests/marketing/industry-atlas.spec.ts`
- Modify: `tests/marketing/interior.spec.ts`
- Modify: `tests/marketing/page-transitions.spec.ts`
- Modify: `tests/marketing/site.spec.ts`
- Create: `docs/INDUSTRY-ATLAS.md`
- Modify: `docs/STUDIO.md`
- Modify: `docs/STUDIO-ACCEPTANCE.md`
- Modify: `DELIVERY.md`

---

### Task 1: Domain contracts và seed tương thích

**Files:**
- Create: `src/data/industry-atlas.ts`
- Modify: `src/data/marketing.ts`
- Modify: `src/lib/studio/content-model.ts`
- Modify: `src/lib/studio/content-labels.ts`
- Create: `tests/studio/industry-model.test.ts`

**Interfaces:**
- Produces: content kind `industryCategory`.
- Produces: `IndustryCategory`, `Industry`, `IndustryReview`, `IndustryProofItem` inferred từ Zod.
- Produces: `contentPath(industryCategory) -> /nganh-hang/{categorySlug}` và `contentPath(industry) -> /nganh-hang/{categorySlug}/{slug}`.
- Produces: seed hai category `gia-dung-noi-that`, `may-moc-day-chuyen` và ba industry hiện có; đây là migration compatibility, không phải toàn bộ danh mục TBS.

- [x] **Step 1: Viết test đỏ cho schema và path**

  Test category hợp lệ; industry bắt buộc `categorySlug`, review, mảng search/technical/proof; path hai cấp; slug/filter quá dài bị từ chối; proof thiếu quyền/reviewer không đạt schema publish-ready.

- [x] **Step 2: Chạy test để xác nhận đỏ**

  Run: `npx tsx --test tests/studio/industry-model.test.ts`

  Expected: FAIL vì kind/schema/path mới chưa tồn tại.

- [x] **Step 3: Implement schema và type**

  `IndustryReview.status` là `pending | approved | legacy`; `legacy` chỉ dành cho migration và không được publish lại. Mảng giới hạn: aliases/searchTerms/models/uses/materials tối đa 50; traits tối đa 30; proof tối đa 20; FAQ tối đa 50.

- [x] **Step 4: Chuyển seed cũ sang `src/data/industry-atlas.ts`**

  Giữ nguyên copy/image/serviceSlugs của ba industry. Bổ sung category và field mới bằng dữ liệu trung tính; review dùng `legacy`, không bịa reviewer.

- [x] **Step 5: Chạy test xanh**

  Run: `npx tsx --test tests/studio/industry-model.test.ts`

  Expected: PASS.

- [x] **Step 6: Checkpoint**

  Ghi kết quả test; không commit/push theo Global Constraints.

### Task 2: Database v7, migration nguyên tử và archive

**Files:**
- Create: `src/lib/studio/industry-migration.ts`
- Modify: `src/lib/studio/database.ts`
- Modify: `src/lib/studio/content-model.ts`
- Create: `tests/studio/industry-migration.test.ts`

**Interfaces:**
- Produces: `migrateIndustryAtlas(db: StudioDatabase): void`.
- Produces: cột `studio_documents.archived_at TEXT NULL`, `PRAGMA user_version=7`.
- Produces: `ContentDocument.archivedAt: string | null` và status `archived`.

- [x] **Step 1: Viết test đỏ cho database v6 đã tùy biến**

  Tạo fixture v6 với ba industry, sửa title/summary/SEO/media; chạy reopen; assert dữ liệu người dùng còn nguyên, hai category được tạo, industry có field mới, published path hai cấp và ba URL cũ resolve 308 một bước.

- [x] **Step 2: Viết test đỏ cho atomicity/idempotence**

  Chèn trigger làm migration fail; assert user_version vẫn 6 và không có category/redirect nửa chừng. Gỡ trigger, chạy hai lần; assert không duplicate document/revision/redirect/audit.

- [x] **Step 3: Chạy test để xác nhận đỏ**

  Run: `npx tsx --test tests/studio/industry-migration.test.ts`

  Expected: FAIL vì migration chưa tồn tại.

- [x] **Step 4: Implement migration**

  Migration chạy trong transaction của `openStudioDatabase`; đọc JSON cũ, preserve field hiện hữu, thêm default mới, tăng version/revision, cập nhật draft/published/path, tạo category và redirect 308. Đặt user_version 7 ở cuối transaction.

- [x] **Step 5: Implement archive column decode**

  Mọi SELECT/backup model đọc `archived_at`; database mới và cũ đều mở được; database version >7 vẫn bị từ chối.

- [x] **Step 6: Chạy test xanh**

  Run: `npx tsx --test tests/studio/industry-migration.test.ts`

  Expected: PASS.

- [x] **Step 7: Checkpoint**

  Ghi schema/migration evidence; không commit/push.

### Task 3: Content relation, review gate và archive/reactivate

**Files:**
- Modify: `src/lib/studio/content.ts`
- Modify: `src/app/api/studio/content/[id]/route.ts`
- Modify: `tests/studio/content.test.ts`

**Interfaces:**
- Produces: `StudioContent.archive(token, id, expected): ContentDocument`.
- Produces: `StudioContent.reactivate(token, id, expected): ContentDocument`.
- Produces: category/industry relation guards trong create/save/publish/unpublish.

- [x] **Step 1: Viết test đỏ cho relation và review**

  Assert industry save cần category tồn tại; publish cần category published/not archived, review `approved`, reviewer/timestamp và proof rights approved. Review `legacy` đọc được sau migration nhưng publish lại trả 409.

- [x] **Step 2: Viết test đỏ cho archive/unpublish**

  Assert category có child active không archive; category có child published không unpublish; industry archive unpublish atomically; reactivate chỉ đổi archive state, không tự publish; conflict version không tạo revision/audit.

- [x] **Step 3: Viết test đỏ cho move URL**

  Admin đổi slug/category của industry rồi publish; assert old published path redirect 308 tới path mới, không chain và seeded industry được phép move trong loại `industry` nhưng fixed page/service vẫn giữ rule cũ.

- [x] **Step 4: Chạy test để xác nhận đỏ**

  Run: `npx tsx --test tests/studio/content.test.ts`

  Expected: các case Industry Atlas FAIL.

- [x] **Step 5: Implement guard và lifecycle**

  Archive/reactivate yêu cầu `content.publish`; archive category/industry ghi revision/audit, giữ draft/history và không xóa document. Chỉ category/industry được publication move theo contract mới.

- [x] **Step 6: Mở API actions**

  Thêm strict action payload `archive`/`reactivate` có `version`; giữ same-origin, session, error mapping và revalidate layout.

- [x] **Step 7: Chạy test xanh**

  Run: `npx tsx --test tests/studio/content.test.ts`

  Expected: PASS toàn file.

- [x] **Step 8: Checkpoint**

  Ghi test count và hành vi 409; không commit/push.

### Task 4: Trait taxonomy service và API

**Files:**
- Create: `src/lib/studio/industry-taxonomy-model.ts`
- Create: `src/lib/studio/industry-taxonomy.ts`
- Modify: `src/lib/studio/runtime.ts`
- Create: `src/app/api/studio/industries/taxonomy/route.ts`
- Create: `tests/studio/industry-taxonomy.test.ts`

**Interfaces:**
- Produces: `traitGroups = ['handling','packing','supplier','compliance','transport'] as const`.
- Produces: `IndustryTrait = { id; slug; label; group; description; order; active }`.
- Produces: `IndustryTaxonomy = { version: number; traits: IndustryTrait[] }`.
- Produces: `StudioIndustryTaxonomy.read()` và `.save(token, expectedVersion, input)`.

- [x] **Step 1: Viết test đỏ cho validate/version/audit**

  Assert slug duy nhất, order hữu hạn, group allowlist, không hard-delete trait, archive giữ label, version conflict 409 trước mutation/audit, editor được save và viewer/SEO bị từ chối.

- [x] **Step 2: Viết test đỏ cho referenced archived trait**

  Industry đã publish với trait sau đó archived vẫn parse/render được; trait inactive bị loại khỏi lựa chọn mới và filter active nhưng không làm content hiện hữu lỗi.

- [x] **Step 3: Chạy test để xác nhận đỏ**

  Run: `npx tsx --test tests/studio/industry-taxonomy.test.ts`

  Expected: FAIL vì service chưa tồn tại.

- [x] **Step 4: Implement model/service**

  Lưu tại `studio_settings` key `industries.taxonomy.v1`; optimistic version và audit action `industry-taxonomy.saved`; seed trait trung tính từ `src/data/industry-atlas.ts`.

- [x] **Step 5: Implement GET/PATCH API**

  GET yêu cầu `content.read`; PATCH yêu cầu same-origin và gọi service với session token. Không cho client ghi trực tiếp `version` kết quả.

- [x] **Step 6: Chạy test xanh**

  Run: `npx tsx --test tests/studio/industry-taxonomy.test.ts`

  Expected: PASS.

- [x] **Step 7: Checkpoint**

  Ghi API/capability evidence; không commit/push.

### Task 5: Portable backup v4/schema 7

**Files:**
- Modify: `src/lib/studio/backup-model.ts`
- Modify: `src/lib/studio/backup-data.ts`
- Modify: `src/lib/studio/backup-validation.ts`
- Modify: `src/lib/studio/backups.ts`
- Modify: `tests/studio/backups.test.ts`

**Interfaces:**
- Produces: manifest `{ format:'tbs-studio', version:4, schemaVersion:7 }`.
- Produces: backup allowlist có `industries.taxonomy.v1` và `archived_at`; vẫn loại account/session/credentials/ops receipts.

- [x] **Step 1: Viết test đỏ round-trip**

  Export database có category, industry, trait active/inactive, archive, review, redirect; restore sang destination; assert dữ liệu, ordering, versions và publication paths giữ nguyên.

- [x] **Step 2: Viết test đỏ tamper/invariant**

  Backup bị sửa categoryId, trait slug, review/proof rights, archived/published contradiction hoặc path hai cấp sai phải bị reject trước restore.

- [x] **Step 3: Chạy test để xác nhận đỏ**

  Run: `npx tsx --test tests/studio/backups.test.ts`

  Expected: case v4/schema7 FAIL.

- [x] **Step 4: Implement format v4**

  Bump exact format/schema; update columns, summary/fingerprint/validation và backup settings. Không thêm credential/provider key vào allowlist.

- [x] **Step 5: Chạy test xanh**

  Run: `npx tsx --test tests/studio/backups.test.ts`

  Expected: PASS toàn file.

- [x] **Step 6: Checkpoint**

  Ghi backup format và old-release compatibility note; không commit/push.

### Task 6: Studio Industry Workspace và editor có cấu trúc

**Files:**
- Create: `src/app/admin/industries/page.tsx`
- Create: `src/components/studio/IndustryWorkspace.tsx`
- Create: `src/components/studio/IndustryFields.tsx`
- Modify: `src/components/studio/ContentEditor.tsx`
- Modify: `src/components/studio/ContentInventory.tsx`
- Modify: `src/components/studio/StudioShell.tsx`
- Modify: `src/app/admin/studio.css`
- Create: `tests/studio-browser/industries.spec.ts`

**Interfaces:**
- Consumes: content API Tasks 1-3 và taxonomy API Task 4.
- Produces: `/admin/industries/` với category/industry/trait inventory; editor links vẫn dùng `/admin/content/{id}/`.

- [x] **Step 1: Viết browser test đỏ cho quyền và CRUD**

  Admin/editor tạo draft category/industry, sửa trait; viewer đọc nhưng không mutation; SEO chỉ sửa SEO qua editor hiện có; admin archive/reactivate/publish. Assert labels và error 409 hiển thị gần thao tác.

- [x] **Step 2: Viết browser test đỏ cho review/media**

  Publish bị chặn khi thiếu reviewer, alt, category hoặc proof rights; sau khi sửa đúng thì preview noindex/no-store và publish thành công.

- [x] **Step 3: Chạy test để xác nhận đỏ**

  Run: `npx playwright test -c playwright.studio.config.ts tests/studio-browser/industries.spec.ts`

  Expected: FAIL vì workspace/editor chưa tồn tại.

- [x] **Step 4: Implement workspace**

  Ba tab Category/Ngành hàng/Đặc tính; tìm kiếm và status filter; nút icon có tooltip; không nested cards. Create action dựng payload nháp tối thiểu rồi chuyển tới editor.

- [x] **Step 5: Implement structured fields**

  Dùng list editor riêng cho aliases/models/technical/proof/FAQ/sale brief; category và trait dùng select/checkbox có label; không dùng chuỗi phân cách dấu phẩy cho dữ liệu có cấu trúc.

- [x] **Step 6: Implement responsive/accessibility**

  390px không cuộn ngang; touch target 44px; focus/error/status; confirm rõ cho archive nhưng không dùng browser `alert` thô.

- [x] **Step 7: Chạy test xanh**

  Run: `npx playwright test -c playwright.studio.config.ts tests/studio-browser/industries.spec.ts`

  Expected: PASS.

- [x] **Step 8: Checkpoint**

  Lưu screenshots desktop/mobile vào artifacts; không commit/push.

### Task 7: Published snapshot và search engine thuần

**Files:**
- Create: `src/lib/industries/search.ts`
- Create: `src/lib/industries/public.ts`
- Modify: `src/app/admin/industries/page.tsx`
- Modify: `src/components/studio/IndustryWorkspace.tsx`
- Create: `tests/studio/industry-search.test.ts`
- Modify: `tests/studio-browser/industries.spec.ts`

**Interfaces:**
- Produces: `PublicIndustryAtlas = { version; categories; industries; traits; featured }`.
- Produces: `IndustrySearchProjection = { index; sourceVersion; generatedAt; stale; unavailable; diagnostic }`.
- Produces: `readPublicIndustryAtlas(): PublicIndustryAtlas`, `readIndustrySearchProjection(atlas): IndustrySearchProjection` và `getIndustryProjectionStatus()`.
- Produces: `normalizeIndustryQuery(value: string): string`.
- Produces: `buildIndustrySearchIndex(atlas: PublicIndustryAtlas): IndustrySearchEntry[]`.
- Produces: `parseIndustrySearchState(input: URLSearchParams | Record<string,string|string[]|undefined>, atlas): IndustrySearchState`.
- Produces: `filterIndustries(index, state): IndustrySearchResult[]`.

- [x] **Step 1: Viết test đỏ cho normalize/ranking**

  Exact title > alias > model > category > body; “máy dệt” khớp “may det”; Unicode combining marks/ký tự lạ không crash; query trim và giới hạn 120 ký tự.

- [x] **Step 2: Viết test đỏ cho allowlist/filter**

  `q/category/traits` hợp lệ được giữ; category/trait lạ bị bỏ; duplicate trait dedupe; archived/draft không vào index; inactive trait vẫn có nhãn lịch sử nhưng không là filter active.

- [x] **Step 3: Viết test đỏ cho snapshot failure**

  Dữ liệu published có child thiếu category bị loại và ghi diagnostic server-side. Sau một lần build thành công, inject lỗi build với source version mới; assert trả index tốt gần nhất với `stale=true`, diagnostic không chứa payload nhạy cảm và browser spec thấy banner Studio. Nếu chưa từng có index tốt, trả `unavailable=true` để UI tắt search nhưng vẫn dùng Atlas server-rendered, không giả vờ “0 kết quả”.

- [x] **Step 4: Chạy test để xác nhận đỏ**

  Run: `npx tsx --test tests/studio/industry-search.test.ts`

  Run: `npx playwright test -c playwright.studio.config.ts tests/studio-browser/industries.spec.ts`

  Expected: FAIL vì module/banner trạng thái chưa tồn tại.

- [x] **Step 5: Implement pure functions**

  Không dependency search ngoài; index field đã normalize; stable sort theo score, category order, industry title. Public reader lấy `getStudio().content.publishedList()` và taxonomy read-only; projection dùng source version hash, lưu last-known-good tại setting vận hành `industries.search-snapshot.v1`, không đưa setting này vào portable backup. Admin workspace hiển thị stale/unavailable diagnostic không chứa raw content.

- [x] **Step 6: Chạy test xanh**

  Run: `npx tsx --test tests/studio/industry-search.test.ts`

  Run: `npx playwright test -c playwright.studio.config.ts tests/studio-browser/industries.spec.ts`

  Expected: PASS.

- [x] **Step 7: Checkpoint**

  Ghi fixture/ranking evidence; không commit/push.

### Task 8: Route hai cấp, metadata và server fallback

**Files:**
- Create: `src/components/marketing/InteriorPrimitives.tsx`
- Create: `src/components/marketing/IndustryPages.tsx`
- Modify: `src/components/marketing/InteriorPages.tsx`
- Modify: `src/app/nganh-hang/page.tsx`
- Replace: `src/app/nganh-hang/[slug]/page.tsx` -> `src/app/nganh-hang/[category]/page.tsx`
- Create: `src/app/nganh-hang/[category]/[industry]/page.tsx`
- Modify: `tests/marketing/interior.spec.ts`
- Modify: `tests/marketing/site.spec.ts`

**Interfaces:**
- Consumes: `readPublicIndustryAtlas()` và search types Task 7.
- Produces: `PageFrame`, `TextSection`, `BulletList`, `MoreLink`, `Sidebar`, `ServiceCards` từ `InteriorPrimitives.tsx` cho các interior page và Atlas.
- Produces: `IndustryHubPage`, `IndustryCategoryPage`, `IndustryDetailPage` server components.

- [x] **Step 1: Viết route test đỏ**

  Assert hub/category/detail 200; breadcrumb đúng; category rỗng/draft/archived và industry sai category trả 404; ba URL cũ 308 một bước; JS-disabled vẫn thấy category/featured/contact.

- [x] **Step 2: Viết metadata test đỏ**

  Canonical category/detail hai cấp; filter query hub `noindex,follow` và canonical hub; route không sinh query link ngoài allowlist.

- [x] **Step 3: Chạy test để xác nhận đỏ**

  Run: `npx playwright test tests/marketing/interior.spec.ts tests/marketing/site.spec.ts`

  Expected: route mới FAIL.

- [x] **Step 4: Implement route/server pages**

  Resolve theo published snapshot, validate category-child relation, render headings/category bands/featured list/contact server-side trước khi client explorer hydrate.

- [x] **Step 5: Extract primitive dùng chung và remove industry block cũ**

  Chuyển đúng sáu primitive trong Interfaces sang `InteriorPrimitives.tsx`, cập nhật `InteriorPages.tsx` và `IndustryPages.tsx` cùng import từ đó; không nhân đôi component hoặc CSS.

- [x] **Step 6: Chạy test xanh**

  Run: `npx playwright test tests/marketing/interior.spec.ts tests/marketing/site.spec.ts`

  Expected: PASS.

- [x] **Step 7: Checkpoint**

  Ghi route/redirect evidence; không commit/push.

### Task 9: Industry Explorer và giao diện editorial

**Files:**
- Create: `src/components/marketing/IndustryExplorer.tsx`
- Create: `src/components/marketing/IndustryAtlas.module.css`
- Modify: `src/components/marketing/IndustryPages.tsx`
- Create: `tests/marketing/industry-atlas.spec.ts`

**Interfaces:**
- Consumes: `IndustrySearchState`, index và result Task 7.
- Produces: search, category bands, desktop filters, mobile accordion/bottom sheet, results/no-result.

- [x] **Step 1: Viết browser test đỏ cho tìm/lọc/URL**

  Search có/không dấu, alias/model; filter AND theo traits, category; URL update không reload; Back/Forward restore; link copy giữ allowlist; filter lạ bị bỏ.

- [x] **Step 2: Viết browser test đỏ cho no-result/failure**

  No-result có query hiện tại, gợi ý category, brief và phone/Zalo; chặn hydrate/disable JS vẫn có server content; ảnh lỗi giữ ratio/text.

- [x] **Step 3: Viết browser test đỏ cho mobile/a11y/motion**

  320/390/768/1440/1920 không cuộn ngang; bottom sheet focus/Escape/44px; `aria-live` số kết quả; reduced motion tắt transition; contact dock không bị che.

- [x] **Step 4: Chạy test để xác nhận đỏ**

  Run: `npx playwright test tests/marketing/industry-atlas.spec.ts`

  Expected: FAIL vì explorer chưa tồn tại.

- [x] **Step 5: Implement client island**

  Chỉ state/search/filter ở client; nội dung/CTA cốt lõi server-rendered. Debounce URL replace ngắn nhưng không trì hoãn kết quả; không smooth-scroll hoặc animation >300ms.

- [x] **Step 6: Implement visual system**

  Category là dải ảnh editorial; results là hàng thông tin ổn định, không nested cards. Dùng token TBS hiện có, Heroicons, focus visible, `next/image`; không gradient/orb/AI-purple.

- [x] **Step 7: Implement detail contract**

  Render đủ 10 section từ spec, ẩn section không có approved content mà không tạo heading rỗng; sale brief copy có fallback khi Clipboard API bị từ chối.

- [x] **Step 8: Chạy test xanh**

  Run: `npx playwright test tests/marketing/industry-atlas.spec.ts`

  Expected: PASS.

- [x] **Step 9: Checkpoint**

  Chụp hub/category/detail desktop/mobile/reduced-motion; không commit/push.

### Task 10: SEO structured data và analytics riêng tư

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/analytics.ts`
- Modify: `src/components/marketing/IndustryExplorer.tsx`
- Modify: `src/components/marketing/IndustryPages.tsx`
- Modify: `tests/marketing/industry-atlas.spec.ts`
- Modify: `tests/studio/technical-seo.test.ts`

**Interfaces:**
- Produces: `trackIndustrySearch(lengthBucket, resultCount)`, `trackIndustryFilter(filterIds, resultCount)`, `trackIndustryOpen(industryId, placement)`, `trackIndustryBriefCopy(industryId)`.
- Produces: breadcrumb JSON-LD cho category/detail; FAQ JSON-LD chỉ từ FAQ hiển thị/approved.

- [x] **Step 1: Viết test đỏ cho payload analytics**

  Intercept tracker; assert không có raw query, model, title, clipboard, phone khách hoặc URL query; consent denied không tải/phát event không thiết yếu.

- [x] **Step 2: Viết test đỏ cho SEO inventory**

  Sitemap chỉ có hub/category/industry published; filter URL absent; canonical/noindex đúng; JSON-LD khớp nội dung visible; redirect không chain.

- [x] **Step 3: Chạy test để xác nhận đỏ**

  Run: `npx playwright test tests/marketing/industry-atlas.spec.ts`

  Run: `npx tsx --test tests/studio/technical-seo.test.ts`

  Expected: case analytics/Atlas SEO FAIL.

- [x] **Step 4: Implement safe events và structured data**

  Không gọi helper `trackSearch(searchTerm, ...)` cũ vì gửi raw query; event mới chỉ dùng bucket/ID allowlist.

- [x] **Step 5: Chạy test xanh**

  Run hai command Step 3.

  Expected: PASS.

- [x] **Step 6: Checkpoint**

  Ghi sample payload đã sanitize; không commit/push.

### Task 11: Scale, failure modes và whole-surface browser QA

**Files:**
- Modify: `tests/marketing/industry-atlas.spec.ts`
- Modify: `tests/studio-browser/industries.spec.ts`
- Modify: `tests/studio-browser/templates.spec.ts`
- Modify: `tests/marketing/page-transitions.spec.ts`

**Interfaces:**
- Consumes: toàn bộ Atlas Tasks 1-10.
- Produces: evidence cho 100-industry fixture, fallback và no-regression.

- [x] **Step 1: Thêm fixture 100 industry trong isolated test database**

  Không ghi fixture vào seed/public. Assert hub render server phần đầu, ảnh dưới fold lazy, search/filter stable, thao tác phản hồi trong ngưỡng test và DOM không chứa 100 ảnh eager.

- [x] **Step 2: Thêm failure injection**

  Search hydrate fail, search projection rebuild fail sau snapshot tốt, animation API unavailable, taxonomy setting corrupt/recoverable, image 404 và slow route; assert public dùng index cũ/stale, Studio hiện cảnh báo, content/contact vẫn dùng và không màn che vô hạn hoặc 500.

- [x] **Step 3: Chạy marketing Atlas suite**

  Run: `npx playwright test tests/marketing/industry-atlas.spec.ts tests/marketing/interior.spec.ts tests/marketing/page-transitions.spec.ts`

  Expected: PASS.

- [x] **Step 4: Chạy Studio Atlas suite**

  Run: `npx playwright test -c playwright.studio.config.ts tests/studio-browser/industries.spec.ts tests/studio-browser/templates.spec.ts`

  Expected: PASS.

- [x] **Step 5: Inspect screenshots manually**

  Hub/category/detail ở 320, 390, 768, 1440, 1920 và zoom 200%; Studio 390/1440; no overlap/cutoff/horizontal scroll, ảnh thật rõ, typography không quá cỡ trong panel.

- [x] **Step 6: Checkpoint**

  Ghi test counts, timing và screenshot paths; không commit/push.

### Task 12: Documentation, full verification và release gate

**Files:**
- Create: `docs/INDUSTRY-ATLAS.md`
- Modify: `docs/STUDIO.md`
- Modify: `docs/STUDIO-ACCEPTANCE.md`
- Modify: `DELIVERY.md`

**Interfaces:**
- Produces: hướng dẫn taxonomy/review/search/redirect/archive/backup và acceptance evidence.
- Produces: release checklist; không tự deploy/index.

- [x] **Step 1: Viết runbook**

  Hướng dẫn tạo category/trait/industry, review/publish, chuyển category, archive, URL redirect, backup/restore và xử lý search snapshot lỗi.

- [x] **Step 2: Ghi content gate**

  Hạ tầng hoàn thành với ba trang migrated; publish 6-8 category và 12-20 industry là công việc nội dung chỉ thực hiện khi brief/source/reviewer/media rights đã approved theo content rollout plan.

- [x] **Step 3: Chạy repository unit/integration suite**

  Run: `npm run test:studio`

  Expected: PASS toàn suite, báo số test chính xác.

- [x] **Step 4: Chạy toàn bộ browser suites**

  Run: `npm run test:studio:browser`

  Run: `npm run test:marketing`

  Expected: PASS toàn suite, báo số test chính xác.

- [x] **Step 5: Chạy static/build gates**

  Run: `npm run typecheck`

  Run: `npm run lint`

  Run: `npm run build`

  Expected: exit 0 cho cả ba.

- [x] **Step 6: Kiểm tra targeted diff và release restrictions**

  Xác nhận chỉ file trong plan thay đổi cho Atlas, không có secret/credential/video nguồn; preview vẫn noindex; không DNS/deploy/commit/push.

- [x] **Step 7: Cập nhật acceptance**

  Ghi chronology, environment, test counts, screenshot review, giới hạn chưa kiểm tra thực tế và content gate còn lại. Dừng ở local release gate chờ chủ dự án duyệt.

## Execution Order

```text
1 Domain -> 2 Migration -> 3 Content lifecycle -> 4 Taxonomy -> 5 Backup
                                                   |
                                                   v
6 Studio UI -> 7 Search snapshot -> 8 Routes -> 9 Public UX -> 10 SEO/Analytics
                                                                    |
                                                                    v
                                                   11 Full QA -> 12 Release gate
```

Task 1-5 thay đổi contract/persistence nên phải tuần tự. Task 6 chỉ bắt đầu sau API ổn định. Task 7-10 dùng cùng type và route nên thực hiện tuần tự để tránh drift. Task 11-12 là gate toàn hệ thống.

## Definition Of Done

- Ba ngành hàng cũ được migrate không mất nội dung, có URL hai cấp và redirect 308 một bước.
- Category/industry/trait có draft, review, preview, publish, archive, restore, version conflict, audit và portable backup.
- Hub tìm được ngành hàng bằng title/alias/model/công dụng; filter allowlist chia sẻ được và không tạo duplicate SEO.
- Hub/category/detail hoạt động khi JS/search animation/media lỗi; phone/Zalo luôn truy cập được.
- Giao diện đáp ứng 320-1920px, zoom 200%, keyboard và reduced motion; không cuộn ngang hoặc nội dung bị che.
- Fixture 100 industry không eager toàn bộ ảnh và không làm search/filter sai hoặc mất ổn định.
- Analytics không gửi query/model/clipboard/PII; sitemap/canonical/robots/JSON-LD đúng publication state.
- Studio/marketing browser suites, unit suite, typecheck, lint và production build đều được chạy mới và ghi số liệu thật.
- Không có production deployment/indexing/commit/push; mở rộng 12-20 industry chờ content approval riêng.
