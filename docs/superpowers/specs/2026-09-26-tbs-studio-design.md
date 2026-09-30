# TBS Studio: CMS, SEO And AI

## Objective

Deliver a polished, fully working website management experience for TBS, with real content persistence, website-connected SEO and deeply integrated AI. This is not satisfied by a dashboard mockup, a chatbot disconnected from content, or buttons that pretend to save. Preserve the approved public design and direct phone/Zalo model with no lead forms.

## Architecture

Extend the existing Next 14 / React 18 worktree. Server-side SQLite (better-sqlite3, transactions, WAL, persistent volume) owns users, opaque sessions, content versions, publication snapshots, media metadata, redirects, settings, audit events, AI knowledge and generation history. Keep storage outside `public` and Git. A persistent Node host is required; ephemeral serverless storage is not an approved deployment target. Public rendering consumes published snapshots only. Retain existing marketing defaults until explicitly replaced through the CMS.

No public deployment, commits, credential rotation or external account changes are implied. Replace insecure legacy demo authentication and block retired APIs. Existing external credentials are not reused implicitly.

## Required Capabilities

1. **Secure access:** first-owner setup using a deployment bootstrap token; salted password hashing; HttpOnly opaque sessions; revocation, expiration, rate limiting and same-origin mutation checks. Admin/editor/SEO/viewer capabilities enforced on the server. Real login/logout and user administration. No demo credentials, client-localStorage authorization or JWT fallback secrets. Secure login/settings on mobile.
2. **Content:** searchable, filterable content inventory for pages/services/industries/articles/policies. Draft editor, preview, explicit publish/unpublish, optimistic version conflict detection, revision history and restore-to-draft. Structured fields preserve the existing public presentation. Article creation/editing publishes to actual routes. All existing first-release marketing content must be represented and manageable, not just new articles.
3. **SEO:** editable title/description/canonical/robots/OG image, search-result preview, heading/image/link checks, duplicate metadata and missing-content checks. Persisted keyword/content planning, internal-link suggestions, redirects with loop/conflict validation, dynamic sitemap/robots using published state. Site-wide indexing defaults remain off until explicit release approval. Search Console verification/configuration and clear connection state; never fabricate ranking/traffic data.
4. **Media:** real upload, type/size validation, alt text and metadata editing, searchable library, selection from the editor, safe delivery and deletion guards when in use. No SVG/script/HTML executable uploads. Persistent files and metadata included in backup guidance.
5. **AI in workflow:** configurable server-side provider credentials and model, tested connection, explicit unavailable/error states when not configured. Knowledge library with source provenance and TBS writing instructions. Contextual tasks for brief/outline/draft/rewrite/SEO metadata/FAQ/internal links; retrieve approved context and record sources, provider/model, status and usage. Show proposals and review/apply selected changes to drafts, never silently publish. Reject invalid structured output, bound input/output/time/cost and avoid fabricated legal/tax/operational claims. Show generation history and failure/retry controls without fake success.
6. **Operations:** real dashboard counts, tasks/recent changes, team permissions, site identity/contact settings, audit log, backup/export and documented restore. No fake graphs, invented visitors, broken menu destinations, placeholder save actions or silently discarded edits.
7. **Experience:** logo-derived blue + white/neutral operational UI, compact navigation, dense tables, stable editor panels, familiar icons/tooltips, clear unsaved/loading/error/empty states, keyboard support, mobile reflow. Do not copy the public cinematic transitions into everyday admin workflows.

## Data And Safety Contracts

- Draft saves must survive process restart and must not change the live snapshot.
- Publish is an explicit, authorized transaction; publication data and audit event commit together.
- Every update includes the expected revision; concurrent edits return 409, never overwrite silently.
- All privileged endpoints authenticate independently of middleware and never trust client role headers.
- AI secrets never appear in API GET responses, rendered HTML, logs or exports. Encrypt stored credentials with a separately supplied server key; no fallback key.
- Treat imported documents and AI outputs as untrusted data. AI has no arbitrary network/file execution tools or publication authority.
- Images/body rendering must not permit stored XSS; use structured rendering or a proven sanitizer.
- Backups exclude secrets/session tokens by default. Restore requires explicit admin action and validation.

## Acceptance Evidence

Unit/integration tests against isolated temporary databases: auth failures/revocation/roles, setup race, session expiry, CSRF, schema validation, transactions, draft/public separation, revision conflicts/restoration, safe paths, redirect validation and provider failure/output validation. Browser tests: first setup/login/logout, real save/reload/publish/public verification, keyboard/mobile editor, media operations, SEO edits in rendered head/sitemap, AI proposal approval with controlled provider plus a real configured-provider smoke test when credentials are available. Production build, typecheck, lint, full public regression suite and reviewed desktop/mobile screenshots. A final requirement-by-requirement audit is necessary before declaring the goal complete.

## Sources

- [better-sqlite3 documentation](https://github.com/WiseLibs/better-sqlite3): transactions and WAL-backed local database behavior.
- [Next.js 14 caching](https://nextjs.org/docs/14/app/building-your-application/caching): publication invalidation must reach both route and data caches.
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide): metadata, crawlability and useful content; no ranking guarantee.
