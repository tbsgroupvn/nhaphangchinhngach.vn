# TBS Premium Website Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for coordinated implementation; bounded independent components may use superpowers:dispatching-parallel-agents. Checkboxes record execution.

**Goal:** Build the approved TBS marketing redesign with direct phone/Zalo contact, complete first-release content routes, cinematic imagery, GSAP motion and an interactive Three.js logistics journey.

**Architecture:** Extend the existing Next.js App Router project in an isolated worktree. Preserve existing admin/API routes. Public marketing pages share one scoped design system and structured content. Heavy 3D loads independently from server-rendered content.

**Tech Stack:** Existing React 18 / Next.js 14 / TypeScript / Tailwind 3; GSAP; Three.js + React Three Fiber compatible with React 18; existing Heroicons; Playwright.

**Spec:** F:/01_TBS_GROUP/docs/superpowers/specs/2026-09-26-tbs-website-design.md and its content/acceptance appendices. User approved the enhanced cinematic/3D direction and implementation on 2026-09-26.

## Global Constraints

- No lead forms, newsletter capture, fake testimonials, fabricated case studies or business statistics.
- Public phone/Zalo contact uses the existing published TBS endpoint, configurable in one place.
- Do not touch ERP, production DNS, shared main branch or deploy credentials.
- Keep original CMS/admin available. Do not claim existing CMS placeholder methods have become production-ready.
- Existing source is C:/Users/ADMIN/nhaphangchinhngach.vn, clean at de34870. Worktree is F:/01_TBS_GROUP/11.Du_An/tbs-website-redesign on codex/tbs-premium-redesign.
- Sites does not apply: this is development within an existing non-Sites website repository.
- Use supplied brand/marketing assets as illustrative material where provenance is not verified. Do not label composited branding images as documentary proof.
- Scope is a runnable first-release website. Verified customer cases, final legal publication, CMS production persistence and live domain migration require actual business/infrastructure inputs and remain explicitly documented release conditions.
- Use a local preview with noindex; never silently connect analytics or services to production during verification.

## Review Focus

1. Direct contact links must remain usable without JavaScript; no hidden data collection.
2. Mobile navigation, text, 3D controls and fixed contact bar must not overlap at 320–1920px.
3. Missing WebGL/reduced-motion must leave readable content and a usable journey fallback.
4. Service routes must reject unknown slugs and preserve known legacy URLs with intentional mappings.
5. New metadata and structured data must not repeat fictitious old addresses, guarantees or social links.

## Task 1: Shell, assets and acceptance baseline

Files: src/components/marketing/MarketingShell.tsx, ContactLinks.tsx, MarketingMotion.tsx; src/app/marketing.css; src/app/layout.tsx; tests/marketing/; playwright.config.ts; public/images/marketing/*.

- [x] Add browser acceptance tests for branded home, direct CTA/no form, mobile menu, 3D interaction/fallback and important routes.
- [x] Run baseline to observe old design/no new routes and record failures.
- [x] Build scoped public shell, focus-safe mobile dialog and fixed mobile contact bar. Preserve admin styling and isolate marketing styles.
- [x] Copy/optimize supplied assets and record provenance.
- [x] Replace root fake schema and global chatbot/QR injection with accurate minimal metadata and no preview analytics injection.

Interfaces: MarketingShell({children}); ContactLinks({variant?, placement?}); PageIntro({eyebrow,title,description,image?}); Breadcrumb({items:{label,href?}[]}). All public classes start tbs-.

## Task 2: Structured content and first-release routes

Files: src/data/marketing.ts; src/components/marketing/InteriorPages.tsx; public routes listed in the approved content matrix; src/app/sitemap.ts; src/app/robots.ts.

- [x] Implement six services, three industries and two practical guides without unsupported legal claims.
- [x] Replace home-adjacent service/about/contact routes and add operations/process/cost/knowledge/FAQ/policy routes.
- [x] Implement knowledge filtering, FAQ, preparation brief copy and unknown-slug 404.
- [x] Preserve existing routes through explicit legacy aliases where appropriate; preserve original admin/API modules.
- [x] Run route/canonical/link checks, typecheck and targeted UI tests.

Interfaces: services[{slug,title,shortTitle,summary,image,scope,inputs,boundaries,faqs:{q,a}[]}]; industries[{slug,title,summary,image,details:string[]}]; articles[{slug,title,summary,category,sections:{heading,body:string[]}[]}]; site{phone,phoneDisplay,zalo,email}.

## Task 3: Interactive logistics journey

Files: src/components/marketing/Journey.tsx; JourneyScene.tsx; journey.css.

- [x] Implement a responsive full-width unframed Three.js logistics scene with warehouse/container/road/truck geometry, deliberate lighting and stage transitions.
- [x] Export default Journey(); own all section text, controls and fallback within these files.
- [x] Four stages: reception, inspection, cross-border coordination, delivery. No live tracking claims.
- [x] Lazy initialization, reduced-motion behavior, WebGL error fallback, pause offscreen and low-DPR mobile settings.
- [x] Test stage selection and screenshot/canvas pixel variation on desktop/mobile.

## Task 4: Premium homepage and responsive finish

Files: src/app/page.tsx; src/components/marketing/HomePage.tsx; marketing.css additions.

- [x] Build cinematic full-width hero with prominent TBS identity, visible contact buttons and a hint of next section.
- [x] Add intent navigation, six services, journey, operating principles, industries, costs/documents, articles and contact close.
- [x] GSAP motion adds polish but never gates content reading or normal scroll.
- [x] Verify genuine assets render, mobile text fits and no dark-blue/gradient-dominated theme remains.

## Task 5: Verification and handoff

- [x] Run TypeScript, lint, production build and Playwright route/interaction checks.
- [x] Inspect desktop/mobile screenshots, canvas nonblank/motion evidence and network/console errors.
- [x] Fresh-context code review; fix material findings and rerun affected checks.
- [x] Record outstanding business/CMS/production requirements honestly in DELIVERY.md.
- [x] Start persistent local preview on unused port; share URL and modified repository/worktree.

## Execution Ledger

- Setup: original repository found and clean; isolated worktree created. Native worktree tool cannot select this repository because task cwd is a non-git workspace, so git -C was used on the verified source repository.
- Authorization: user approved implementation; no repeated plan approval required. Existing specs are refined by the latest cinematic/3D request.
- Baseline dependency installation started. Existing CMS contains incomplete write methods and production read-only behavior; preserve it, avoid presenting it as a newly finished CMS.
- Final verification: optimized production build, TypeScript and lint passed; 51/51 Playwright tests passed against production preview. Fresh review findings fixed and rechecked. Desktop/mobile screenshots and WebGL pixel tests inspected.
- Narrow build-safety addition: newsletter-info and analytics/realtime GET handlers marked force-dynamic after original static build invoked them. Their preexisting API authentication risks remain documented release blockers.
- Preview: http://127.0.0.1:4173, loopback-only, noindex. No commit, push, production deployment or ERP modifications. Lighthouse attempt blocked by registry dependency resolution; no score claimed.
