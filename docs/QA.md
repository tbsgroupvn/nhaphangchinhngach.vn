# Verification Notes

## Current Local Acceptance (2026-09-27)

- Final build/typecheck/lint/diff check passed. Repository: **138/138**. Final Studio browser suite: **55/55 (2.4m)**. Public suite: **83/83 (3.2m)** after review fixes/mobile layout; only private AI hydration/team-focus code changed afterward. The full evidence matrix and remaining owner/provider gates are in `STUDIO-ACCEPTANCE.md`.
- Final independent reviewer Euler completed/closed. Missing built-in images poisoning historical restore and target-user stale writes were reproduced and fixed. Regressions cover preservation of legacy history, strict current-asset/managed-upload checks, monotonic account revision stamps, session/audit rollback and independent concurrent editor saves yielding exactly 200/409. No second independent review or security certification is claimed.
- Mobile role controls were 26px wide before repair. A failing geometry test preceded stacked team rows; 320/390px geometry, keyboard apply and both conflict choices now pass. A separate failing focus assertion preceded automatic focus on the comparison, making conflicts reachable from the bottom of long lists. Desktop/mobile screenshots were inspected; full-page captures start at scroll zero to avoid fixed-sidebar displacement.
- One intermediate combined run had **52/54 Studio**, not a pass. Trace showed pre-hydration AI typing was cleared before the submit handler existed. A deterministic no-JavaScript test failed, then passed after disabling request fields until client provider-state readiness. The backup lost-response fixture separately timed out before it actually dropped the response; the unchanged focused workflow passed. The fixture now awaits that bounded drop before measuring recovery. Final full run is GREEN; no fixture result is a live provider test.
- Local session response still has no real owner. No provider key/master key, paid request, external connection, deployment, indexing release, commit or push occurred. The only remaining full-goal acceptance item is the authorized live AI smoke after owner configuration. The checkpoints below are historical, not the current implementation state.

## Historical Knowledge Checkpoint

- Final production build, standalone typecheck/lint and whitespace check passed. Repository suite: **112/112**; Studio browser suite: **45/45 in 4.1m**; public suite: **83/83 in 2.9m**. Desktop/390px screenshots of the source library, draft/approved comparison and writing instructions were inspected. Public route motion, hero, contact and actual 3D/canvas regressions remain green; marketing motion code was not changed in this slice.
- Eleven knowledge repository tests cover independent draft/approval snapshots, current roles/revocation, optimistic versions, expiry at retrieval time, validation/capacity, v4-to-v5 migration, bounded verbatim/provenance retrieval, noneditable safety boundaries, transactional rollback, reopen and portable restore. Approved empty JSON and malformed approval versions are rejected before restore. Six browser workflows exercise real saves/reloads, approval/withdrawal, local retrieval, source and instruction conflicts, draft-preserving reactivation, delayed-query invalidation, origin/role denial and escaped HTML-like source content.
- Focused independent review by Huygens found three P2 issues: empty non-null approval skipped validation; local edits became stuck after remote archival; normalized offsets could omit matching evidence. All three were reproduced RED and fixed with regression coverage. No second independent review or whole-system security certification is claimed. Populated textarea labels, translated category labels and stale retrieval results were also fixed against failing browser checks. A strengthened instructions test initially reused an unchanged local value, correctly disabling Save; distinct values corrected that fixture, without weakening assertions.
- The knowledge library is manually entered plain text with provenance-only URLs. Retrieval is local lexical matching, not an external fetch, semantic index, fact checker or provider request. Only approved, active, nonexpired snapshots are eligible. Schema v5 adds knowledge; portable format v2 includes knowledge/instructions but still excludes credentials and operations. Exact older schema-v4 archives require their matching application release or a tested migration.
- Contextual AI proposals, generation history/usage, selective human-approved draft application, a real authorized-provider smoke and final requirement-by-requirement acceptance remain open. The full goal is active; no real owner/provider or external source connection was configured, and no deployment occurred.

## Previous AI Provider Checkpoint

- Final production build, standalone typecheck/lint and `git -c core.safecrlf=false diff --check` passed. Repository suite: **101/101**; Studio browser suite: **39/39 in 1.1m**; public suite: **83/83 in 1.7m**. Public motion code remains unchanged; actual route transitions, canvas pixels/movement, accessibility and contact regressions remain green.
- Fourteen provider tests cover randomized authenticated encryption, wrong/missing master keys, secret-free reads/audit, database reopen, actual ciphertext exclusion from portable exports, authorization/revocation, versions/concurrent calls, stale and expired results, persistent request/token budgets, UTC rollover, transaction failures, strict adapter request shape, malformed/refused/incomplete output, bounded bodies and whole-request timeouts.
- Four new browser workflows cover saved/reloaded configuration, actual server transport through an isolated no-network provider fixture, consent cancellation and missing/false consent rejection, secret-free HTML/GET, honest authentication failure, clearing, role-specific read/write access, unsaved navigation and both conflict resolutions. Desktop and 390px screenshots inspected; controls stay within the viewport.
- Initial RED evidence: missing provider modules and missing API (404). An accessible-name regression on the API-key input failed in the browser and was fixed by separating the descriptive status from its label. A subsequent 38/39 run failed only because a test selected Next's route announcer as well as the intended application alert; scoping to main produced the final 39/39 result.
- Independent focused review (Averroes) found no confirmed actionable issue; its budget/concurrency/consent coverage gaps were added. A dedicated delayed-poll-versus-refresh/save browser race test remains absent. This was a provider-slice review, not whole-repository security certification.
- Only OpenAI Responses is supported at this checkpoint. No real owner, encryption key, API credential, Google verification, public deployment or paid provider request was configured. Fixtures are not a live smoke test. Knowledge retrieval, contextual editorial proposals, selective human-approved draft application/history and final whole-system acceptance remain required.

## Environment

- Windows, Node 24.3.0, Next.js 14.2.35, Playwright 1.62.1 Chromium.
- Preview bound only to `127.0.0.1:4173`, default noindex. No real call or Zalo message was sent.
- Original repository remained clean on `main`; changes are isolated in `codex/tbs-premium-redesign`.

## Regression Coverage

- All 24 release routes: status, one H1, canonical, direct contact, no lead-capture inputs.
- Unknown slugs: 404. Known service aliases: correct redirect destinations.
- Mobile menu: open, focus-safe dialog, Escape dismissal and focus return.
- Hero motion: finite replay without blocking phone contact, changing image frames, desktop pointer/reset, live reduced-motion cancellation, touch mode, route cleanup and keyboard replay focus retention. Existing no-JavaScript coverage also exercises the new hero structure.
- Page transitions: actual changing layer transforms, destination restoration, keyboard and Back/Forward, fast repeated clicks, live reduced-motion cancellation, contact/anchor/modified-click exclusions, mobile menu navigation and contact stacking, bounded recovery from a delayed RSC response, and static navigation without the Web Animations API.
- Knowledge: Vietnamese accent normalization, filters, empty results, URL persistence and no-JavaScript search.
- Clipboard: success only after successful write; denied permission leaves selectable text and honest status.
- FAQ: keyboard expansion and sharable hash navigation that opens the selected answer.
- 3D: exclusive stage selection, keyboard selection, reduced motion, pause/resume, unsupported/lost WebGL fallback, canvas color variation and truck/stage pixel changes at desktop/mobile widths.
- Presentation: images load, no horizontal overflow and next-section hint at 320, 375, 390, 768, 1024, 1440 and 1920px; core homepage/contact works without JavaScript.
- Privacy: staging robots/noindex, no analytics scripts injected.
- Contrast: primary contact link remains distinct from its background; small brand labels exceed 4.5:1 on the pale scene background.
- Logo palette: exact sampled TBS/GROUP blue tokens, accessible derived shades, unchanged logo URL, opaque white header, section backgrounds and 15 representative text/surface pairs at or above 4.5:1. Primary actions have consistent normal/hover colors and visible keyboard focus across hero, footer and contact page. This is targeted contrast coverage, not a full accessibility audit. Color provenance and usage rules are in `BRAND-COLORS.md`.

## Issues Found and Fixed

1. Old homepage baseline lacked prominent TBS identity and contained unsupported metrics, testimonials and lead capture. Replaced in the new marketing experience.
2. Mobile dialog root had zero layout height because all children were fixed; changed dialog root to fixed inset positioning.
3. Mobile table and article grid intrinsic minimums caused overflow at 320px; constrained the responsible grid children.
4. Prose link color overrode primary phone button foreground; excluded `.tbs-button` from prose hyperlink styling.
5. FAQs lacked sharable answer anchors; added explicit permalink controls and hash handling.
6. Blue labels on the pale background were below the 4.5:1 text contrast target; darkened the shared brand UI token, without changing supplied logo artwork.
7. Two old GET API routes fetched data during static build; marked only these routes `force-dynamic`. Existing API authentication remains a release blocker, not a solved security audit.
8. The requested logo-based palette replaced the experimental cobalt/lime palette. The raw sampled blue gives only 4.12:1 against white, so small text and white-text controls use an explicitly documented darker derivative. Selected-stage small numbers use white rather than low-contrast light blue.
9. A dedicated hero reviewer found that native `disabled` dropped keyboard focus on Replay. Reproduced against the actual preview, replaced it with `aria-disabled` and guarded replay, and verified focus retention across consecutive keyboard replays. The footer hover test now scrolls its target into view before focus to avoid racing native smooth focus scrolling.
10. The route-transition reviewer identified equal overlay/mobile-dock stacking levels. The curtain visually covered contact controls although clicks passed through. Reproduced in the mobile screenshot and a failing active-layer assertion; lowered the curtain to z-index 30 below the dock at 35 and header at 40.

## Review Scope

A fresh read-only reviewer examined the working changes against `de34870`, checked browser behavior and raised the contact contrast and FAQ permalink issues above. Both have regression tests. Source CMS persistence, old admin/API authorization, recruitment content, legal approval, asset rights and real phone/Zalo handoffs remain explicitly outside the marketing acceptance claim.

## Performance Limits

Next's optimized build reports approximately 136 KB first-load JavaScript for the homepage after the hero motion addition (previously 135 KB). No new dependency was added. The heavy Three.js scene is loaded separately near its viewport; it does not block the server-rendered hero or contact links.

The page-transition build remains approximately 136 KB at the same displayed precision. It uses native transform/opacity animations and does not load Three.js earlier. These bundle figures are not a real-device performance benchmark.

Lighthouse 12.8.2 was attempted but could not be installed because the package registry returned `ETARGET` for transitive `tldts-core@^7.4.15`. No Lighthouse score, field Core Web Vitals result, SEO ranking or guaranteed mobile performance score is claimed. Run Lighthouse and real-device profiling again before public release.

## Final Run

The page-transition update passed type checking, ESLint through the optimized production build, and all 70 browser tests on the final production-preview run (2.6 minutes as reported by Playwright). The eight new route-motion tests passed alongside the existing 62 tests. Desktop/mobile wipe frames were visually inspected, including the corrected mobile contact stacking; the full suite rechecked the existing hero, 3D canvas pixels, interactions and 320-1920px layouts. Build retains the existing outdated Browserslist data notice.

Final production build and full-suite results are recorded in `DELIVERY.md`. Browser screenshots and HTML test report are under `artifacts/`.

During the page-transition update, the first full run reported 69 passes and one failure in the preexisting `journey motion can be paused and resumed without blocking stage selection` frame-sampling assertion (one distinct frame instead of multiple). The unchanged focused rerun passed. The trace showed a slow frame-collection interval; no 3D product code or assertion was weakened. This intermittent sampling result remains a test-stability observation, not proof of a diagnosed rendering cause.

A subsequent full run passed the 3D assertion but timed out waiting for the delayed contact route in `a slow route cannot leave the current page covered indefinitely`; its curtain deadline assertions had passed. The initial fixture delayed every matching RSC request by a fixed sleep. It now waits for the actual Link prefetch, holds the real server response behind an explicit gate, verifies that the old route is uncovered while the response is still held, and then releases it to verify arrival. This stronger deterministic fixture passed three consecutive focused runs without changing production navigation or animation code.

## Studio Foundation And Connected Content

This is a progress checkpoint for the broader Studio goal, not full CMS/SEO/AI acceptance. See the complete spec and execution ledger under `superpowers/`.

- Authentication uses actual database users, scrypt passwords and opaque revocable sessions. The first owner requires a private deployment bootstrap token. No real owner account was created on the local preview.
- A fresh security reviewer identified stale actor authorization and a globally shared anonymous login-client limit. Three regression tests reproduced the problems, then passed after transaction-time session/role validation and removal of the shared bucket. The reviewer accepted the fixes on read-only inspection; it did not independently run tests.
- The original static `/admin/index.html` route returned 200 in the RED test. Removing it and redirecting to the protected Studio entry point produced the required 307. Retired demo/diagnostic/lead/fake-AI handlers return 410 directly.
- Twenty isolated Node tests pass: setup/passwords/sessions/roles/throttling/CSRF/body limits, content seed idempotence, restart persistence, draft/public isolation, revision conflicts, restore-to-draft, safe paths, publication permissions and transaction rollback with audit failure.
- The full Studio browser flow passes (8.5 seconds): first setup, bad/good credentials, reload persistence, content save, stale-version 409, SEO publication in actual public HTML, public listings, revision restore, new article creation, authenticated preview, publish/unpublish, team creation, permission denial, session revocation, mobile editor/menu and logout replay rejection.
- An initial browser fixture read the URL before Next had finished navigating and requested `/api/studio/content/content/`. Trace confirmed the 404 while actual editor saves returned 200. The fixture now waits for the UUID route and explicitly checks the GET response before using it.
- Desktop and 390px editor screenshots were inspected. No page overflow or overlapping toolbar controls was found in those views. Public content now reads persistent publication snapshots for the eleven service/industry/article documents. The thirteen fixed-page documents and remaining advanced modules are still pending.

During the post-CMS public regression, 69/70 tests passed. The route-wipe frame assertion failed because trace timestamps show the first layer sample began more than 1.1 seconds after the navigation click, after the short wipe had reset; it repeatedly sampled the resting matrix. The test now starts `requestAnimationFrame` sampling in the browser on the real click, records only active-transition transforms and requires multiple distinct values. Production motion timing and assertions about navigation/contact availability are unchanged. Three focused repeat runs passed in 12.7 seconds. The final full-run result is recorded in the execution ledger and delivery notes.

Final post-CMS regression: **70/70 passed in 3.6 minutes**, alongside **20/20 Studio unit tests**, the passing **full Studio browser workflow**, typecheck, lint and optimized production build. The local preview responds 200, has no real owner configured yet and has no preview-server errors in its current log. These results do not satisfy the remaining fixed-page, advanced SEO, media, operations and AI requirements.

## Fixed Pages And SEO Permissions

The next checkpoint adds thirteen fixed-page documents with strict copy-slot schemas, independently seeded into existing databases, immutable public routes and exact-layout authenticated previews. The original public text, links and titles were captured before migration; all thirteen baseline comparisons passed. Repository tests now cover all 24 release paths, invalid/missing slots, unsafe paths, fixed-template immutability and publication/restoration/unpublish for every fixed page.

The SEO role now saves only the SEO object. Direct attempts to save body content, publish or attach extra content fields to the metadata mutation fail; the saved metadata remains private until an administrator publishes. Browser assertions check real published title, description, canonical, Open Graph image and noindex. This is permissioned metadata editing, not yet the advanced SEO audit/planner/redirect module.

Screenshots of the grouped fixed editor, desktop/390px layouts and full-layout draft preview were inspected. A search-label inline formatting issue displaced its icon by 11.8px; a geometry regression failed before the block-layout correction and passed afterward.

The first public regression in this checkpoint passed 82/83. The 3D pause/resume fixture attempted its moving-frame sample several seconds after the click: trace shows the click ending at 120537ms and the sample selector resolving at 126719ms. The finite stage transition had already settled. Sampling now starts at the actual browser click, before protocol round-trip delays, and still requires distinct rendered frames. No 3D animation code or pause/reduced-motion requirement was weakened. Final rerun outcomes are recorded below when complete.

## Fixed-Page Acceptance Results

- Final optimized build, standalone typecheck and lint passed. The final isolated Node suite passed 27/27; five Studio browser workflows passed in 33.2 seconds; the complete marketing suite passed 83/83 in 2.3 minutes. The focused 3D pause/resume test passed three consecutive repetitions before the full run.
- Browser coverage changes every one of the 317 fixed-template slots and verifies its actual rendered text/attribute in both the protected draft preview and published page. Top-level title/summary/image and SEO title are also changed; image visibility is asserted. The thirteen immutable pre-migration text/link/title baselines still pass.
- A fresh read-only reviewer found three issues: original release URLs could be renamed without preserving dependent links, browser Back could lose unsaved edits, and the homepage accepted an empty hero image. Each was reproduced RED and fixed with GREEN regression coverage. All 24 seeded routes now remain fixed; new articles retain editable slugs. Blank homepage images fail validation. Back/logout cancel retains edits and the session; accepted Back discards only the unsaved draft and Forward loads persisted content.
- SEO specialists save metadata only; direct body/publication requests and extra mutation fields are denied. Added demotion and fresh viewer-session coverage. These results do not constitute a full repository security audit or completion of advanced SEO workflows.
- Restart acceptance used the completed browser-test database on a fresh server process at 4175. Existing owner login succeeded; the 24 seed documents plus one test article remained; the about-page saved draft was retained and absent from public HTML; anonymous preview was denied; published title/canonical/OG/noindex remained correct. The temporary server was stopped. The real preview data and credentials were not touched.
- Inspected fixed-editor desktop/mobile, exact-layout preview and SEO-specialist screenshots. The final public suite rechecked all layouts, assets, 3D pixels and page-transition behaviors after mounting the inactive navigation guard at the root. This is automated Chromium coverage, not real-device performance certification.

Task 2 is now accepted. The full Studio goal remains active for advanced SEO, media, shared site/template settings, backup/restore and contextual AI. There is no real provider configuration or live AI test, and no public deployment. The 4173 preview still requires the owner to complete private setup.

## SEO Audit And Planning

The SEO workspace now reads actual saved metadata and scans server-rendered published HTML. It includes persisted keyword/content tasks, per-document findings, real dashboard counts and related-link suggestions. Redirects, Search Console verification and remaining indexing/sitemap work are not included in this acceptance claim.

- New repository and HTTP-fetch tests cover duplicate/missing metadata, draft/live destination distinctions, heading order, alt/decorative images, missing local images, internal anchors, main copy, publication-set invalidation, stale/revoked writes, task versions/roles/assignees/dates, audit rollback and v1-to-v2 persistence. Fetch tests use a real isolated HTTP server to prove redirect refusal, private-path rejection, absent forwarded cookies, timeout, media type and response-size limits.
- The browser test initially failed at the missing SEO API (404). It now verifies findings from a saved draft, direct editor/SEO-tab navigation, actual published HTML checks, creation/edit/reload of a keyword task, anonymous/viewer/foreign-origin/stale-version denial and usable mobile task editing.
- Feynman's read-only review found three P2 issues: planner conflicts had no edit-preserving recovery, refreshing did not invalidate link suggestions, and draft paths were treated as live destinations. Regression tests reproduced all three; current behavior retains local edits while comparing the latest task, refetches suggestions on refresh and distinguishes unpublished URLs from still-live URLs. The reviewer did not run tests or conduct a second review; the fix verification is the recorded regression evidence.
- Exact select-name matching exposed labels containing option text; explicit accessible labels fixed that. A second mobile failure reported document width 716 at viewport 390. A geometry probe located the absolutely positioned screen-reader header at x715.8 and showed width 390 when its scrolling wrapper became positioned. The final scoped CSS fix retains horizontal table scrolling without hiding page overflow.
- Final results: **39/39 Studio unit tests**, **9/9 Studio browser workflows in 34.0s**, production build, standalone typecheck and lint passed. A focused final screenshot run also passed. **83/83 marketing tests passed in 2.4m** before the last admin-only table positioning change; no public code changed after that run. Desktop/390px SEO, loaded suggestions and task modal screenshots were inspected.
- Startup/configuration boundary: the environment-assignment launch was policy-rejected; plain Next preview startup was allowed. The 4173 preview therefore honestly reports HTML scanning unconfigured until STUDIO_ORIGIN is supplied through an authorized setup. The separate 4174 browser-test server is configured and demonstrates real HTML scanning. No real owner/provider credentials were created or read.

There is still no live AI-provider test, real-device performance certification, public deployment or full-goal completion claim.
# Technical SEO Acceptance (2026-09-26)

- New `/admin/seo/technical/` manages persistent admin-authorized redirects and Google URL-prefix verification tokens. Schema v3 preserves existing content/tasks/audits. Root and retired dynamic public URLs return actual 307/308 responses, not merely a client-side destination change.
- RED evidence: absent technical API returned 404. Reviewer regressions then reproduced an empty selected destination after remote retargeting and stale verification counts after accepting server settings. Both fixes are GREEN in the final browser run. The SEO audit integration regression also reproduced redirect URLs incorrectly classified as unmanaged before the routing-aware fix.
- Final production build, standalone TypeScript check and Next lint passed. Existing Browserslist data warning remains; no new ESLint errors/warnings. Formatting used a temporary pinned Prettier executable, with no project dependency change. An initial npm/PowerShell argument-parsing attempt printed formatted output without writing files; the direct Node CLI formatting command completed successfully.
- **48/48 Studio repository tests passed**, including exact source validation, route conflicts, cycle/chain prevention, publication moves, unpublish guards, current permissions, stale revisions, settings validation, canonical/noindex sitemap eligibility, audit invalidation, rollback and v2-to-v3 persistence.
- **15/15 admin browser workflows passed (2.3m)**. Actual HTTP assertions cover redirect creation/edit/deletion, unchanged old/new URLs before publication, single-hop redirects after two slug moves, verification tokens in rendered metadata, noindex/robots/empty sitemap, unauthorized/forged/revoked/disabled sessions, origin rejection, simultaneous revision conflicts, unsaved-navigation cancellation and both reviewer fixes. The runner remained alive briefly during teardown; its original handle was polled to terminal exit 0 without restarting it or terminating its server.
- **83/83 public marketing tests passed on the final build (2.4m)**, including all 24 release routes, thirteen fixed-copy baselines, mobile layouts, direct contact, no-JavaScript behavior, motion, actual 3D pixels and legacy URL handling.
- Inspected `artifacts/screenshots/studio-technical-desktop.png`, `studio-technical-mobile.png` and `studio-redirect-mobile.png`. The table scrolls within its container on mobile; page width stays 390px. Dialog controls remain reachable and do not overlap.
- Residual boundary: actual HTTP tests keep the deployment release gate closed. Index-enabled filtering/suspension is verified through production repository helpers, not a released public domain. No Google owner verification, ranking/traffic connection, public deployment or live AI-provider call occurred. Media/shared settings/backup and contextual AI remain incomplete under the full goal.

## Contextual AI Acceptance (2026-09-27)

This supersedes the earlier AI-incomplete implementation checkpoints, not the live-provider or deployment gates. Current evidence is consolidated in `STUDIO-ACCEPTANCE.md`; the full goal remains active pending final review and authorized live AI verification.

- Production build/typecheck/lint/whitespace checks passed. Final repository run: **135/135**, including two independent Node processes proving retained AI draft/public isolation, history, usage and nonreusable request receipts. Studio browser run: **52/52 (3.3m)**. Public browser run: **83/83 (2.9m)**. Tests use isolated accounts and a guarded provider fixture; no paid network call occurred.
- Twenty-two generation repository tests and seven new AI browser workflows cover all seven tasks, approved provenance, typed fixed/paragraph/list/FAQ fields, selective applications, current permissions, origin/consent, invalid output, expired/changed sources, provider configuration changes, shared budgets, history capacity, concurrent edits, atomic audit rollback, restore/tampering and lost-response recovery.
- Focused reviewer Ramanujan found logical request-ID reuse after deletion/expiry and incorrect positional application after section reordering. Three separate RED reproductions preceded receipts, fresh dispatch lease nonces and collection-digest guards. GREEN coverage verifies own earlier partial applications remain usable while independent collection edits are rejected. Reviewer completed/closed; no second pass claimed.
- UI regressions were observed RED for option text contaminating accessible select names and for losing an AI brief after changing editor tabs. Explicit accessible names and retaining the lazy AI panel after first visit fixed both. Full-suite evidence includes the unchanged assertions.
- An added source-expiry test initially injected a numeric timestamp where the knowledge repository requires a Date-returning clock. Corrected the fixture, then reran the full repository suite; no production change was needed for that error.
- Reviewed desktop/390px proposal and global-history screenshots. Diff columns reflow, controls stay contained, history tables scroll within their wrapper and selected changes are explicit. Capture starts at scroll zero to avoid a misleading mid-page fixed/sticky screenshot artifact.
- Backups are now format3/exact schema6 and include AI context/results as read-only imported history. Running imported jobs become interrupted. Provider secrets, operational receipts/budgets and destination accounts remain excluded/preserved as documented in `STUDIO.md`.
- Final independent whole-branch review is in progress. Real preview requires owner setup and authorized provider/encryption/origin configuration; no live Google or OpenAI acceptance is claimed. No deployment, indexing release, commit or push.
