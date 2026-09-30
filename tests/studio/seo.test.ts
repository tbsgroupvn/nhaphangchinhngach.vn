import { beforeEach, afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { StudioSeo } from '../../src/lib/studio/seo'
import { StudioSiteSettings } from '../../src/lib/studio/site-settings'
import {
  inspectHtml,
  auditDrafts,
  suggestLinks,
} from '../../src/lib/studio/seo-audit'
import { searchTitle } from '../../src/lib/studio/seo-model'
import { fixedTemplate } from '../../src/lib/studio/fixed-page-registry'

let db: ReturnType<typeof openStudioDatabase>,
  auth: StudioAuth,
  content: StudioContent,
  seo: StudioSeo,
  token: string
beforeEach(async () => {
  db = openStudioDatabase(':memory:')
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  content.seedMarketing()
  seo = new StudioSeo(db, auth, content)
  const secret = 'fixture-seo-bootstrap-more-than-32-characters'
  await auth.setupOwner(
    {
      email: 'owner@example.test',
      name: 'Owner',
      password: 'Owner-password-test-728!',
    },
    secret,
    secret,
  )
  token = (
    await auth.login('owner@example.test', 'Owner-password-test-728!', null)
  ).token
})
afterEach(() => db.close())
const docs = () => content.list().map((item) => content.get(item.id))

test('draft audit detects real duplicate metadata without changing the public snapshot', () => {
  const before = docs()
  const [one, two] = before
  content.saveSeo(token, two.id, two.version, {
    ...two.draft.seo,
    title: one.draft.seo.title,
    description: '',
  })
  const report = auditDrafts(docs())
  assert.ok(
    report
      .find((row) => row.id === one.id)!
      .issues.some((issue) => issue.code === 'duplicate-title'),
  )
  assert.ok(
    report
      .find((row) => row.id === two.id)!
      .issues.some((issue) => issue.code === 'missing-description'),
  )
  assert.equal(
    content.publishedAt(two.path)!.seo.description,
    two.published!.seo.description,
  )
})

test('SERP title matches home absolute title and interior title template', () => {
  const home = content.publishedAt('/')!
  assert.equal(searchTitle(home), home.seo.title)
  const item = content.publishedAt('/quy-trinh')!
  assert.equal(searchTitle(item), `${item.seo.title} | TBS GROUP`)
  assert.equal(searchTitle(item, 'TBS TEST'), `${item.seo.title} | TBS TEST`)
})

test('applying shared public settings invalidates stored and in-flight HTML audits', () => {
  const item = docs()[0]
  const report = inspectHtml(
    '<main><h1>One</h1><p>Published page content.</p></main>',
    { path: item.path, paths: [item.path], assetExists: () => true },
  )
  seo.saveAudit(token, item.id, item.version, report)
  const before = seo.publicationKey()
  const settings = new StudioSiteSettings(db, auth)
  const next = settings.get().payload
  next.identity.name = 'TBS '.repeat(14).trim()
  settings.apply(token, 0, next)
  assert.notEqual(seo.publicationKey(), before)
  assert.equal(
    seo.overview().find((row) => row.id === item.id)!.live!.stale,
    true,
  )
  assert.throws(
    () => seo.saveAudit(token, item.id, item.version, report, before),
    { code: 'VERSION_CONFLICT' },
  )
  const about = docs().find((row) => row.path === '/gioi-thieu')!
  content.saveSeo(token, about.id, about.version, {
    ...about.draft.seo,
    title: 'Giới thiệu TBS GROUP Việt Nam',
  })
  assert.ok(
    seo
      .overview()
      .find((row) => row.id === about.id)!
      .issues.some((issue) => issue.code === 'long-title'),
  )
})

test('draft audit distinguishes live URLs from pending slug changes and unpublished targets', () => {
  const seed = docs().find((item) => item.kind === 'article')!.draft
  const created = content.create(token, {
    ...seed,
    data: { ...seed.data, slug: 'seo-old-route' },
  })
  const live = content.publish(token, created.id, created.version)
  const moved = content.save(token, created.id, live.version, {
    ...live.draft,
    data: { ...live.draft.data, slug: 'seo-new-route' },
  })
  const source = docs().find((item) => item.path === '/')!
  if (source.draft.kind !== 'page') throw new Error('Expected home')
  const key = fixedTemplate('home')!.fields.find(
    (field) => field.kind === 'link',
  )!.key
  source.draft.data.fields[key] = live.path
  assert.ok(
    !auditDrafts([source, moved])[0].issues.some(
      (issue) => issue.detail === live.path,
    ),
  )
  source.draft.data.fields[key] = moved.path
  assert.ok(
    auditDrafts([source, moved])[0].issues.some(
      (issue) =>
        issue.code === 'link-unpublished' && issue.detail === moved.path,
    ),
  )
  content.unpublish(token, created.id, moved.version)
  assert.ok(
    auditDrafts([source, content.get(created.id)])[0].issues.some(
      (issue) => issue.code === 'link-unpublished',
    ),
  )
})

test('rendered HTML audit reports headings, image alt/assets, missing links and empty content accurately', () => {
  const report = inspectHtml(
    '<html><head><title>Test</title></head><body><main><h1>One</h1><h1>Two</h1><h3>Skipped</h3><img src="/images/marketing/missing.webp"><img src="/images/marketing/logo-color.png" alt="" role="presentation"><a href="/not-published/">Missing</a><a href="#missing">Anchor</a><a href="tel:+8412345">Call</a><script>fake body words</script></main></body></html>',
    {
      path: '/gioi-thieu',
      paths: ['/', '/gioi-thieu'],
      assetExists: (path) => path.endsWith('logo-color.png'),
    },
  )
  const codes = report.issues.map((issue) => issue.code)
  for (const code of [
    'h1-count',
    'heading-order',
    'image-alt',
    'image-missing',
    'link-unmanaged',
    'anchor-missing',
    'missing-main-copy',
  ])
    assert.ok(codes.includes(code), code)
  assert.equal(report.images, 2)
  assert.equal(report.headings, 3)
  assert.equal(
    report.issues.filter((issue) => issue.code === 'image-alt').length,
    1,
  )
  assert.ok(!report.issues.some((issue) => issue.detail?.includes('tel:')))
})

test('rendered HTML treats decorative images and valid internal anchors as intentional', () => {
  const report = inspectHtml(
    '<main><h1>TBS GROUP</h1><h2 id="scope">Scope</h2><p>A complete paragraph that is visible in the page.</p><img src="/images/marketing/logo-color.png" alt="TBS"><img src="/images/marketing/logo-color.png" alt="" aria-hidden="true"><a href="#scope">Scope</a><a href="/">Home</a></main>',
    {
      path: '/gioi-thieu',
      paths: ['/', '/gioi-thieu'],
      assetExists: () => true,
    },
  )
  assert.deepEqual(report.issues, [])
})

test('saved audit is version-bound, persistent and refuses stale or revoked writes', () => {
  const item = docs()[0]
  const report = inspectHtml(
    '<main><h1>One</h1><p>A complete visible paragraph for a clean page.</p></main>',
    { path: item.path, paths: [item.path], assetExists: () => true },
  )
  seo.saveAudit(token, item.id, item.version, report)
  assert.equal(
    new StudioSeo(db, auth, content)
      .overview()
      .find((row) => row.id === item.id)!.live!.stale,
    false,
  )
  content.saveSeo(token, item.id, item.version, {
    ...item.draft.seo,
    title: 'Updated draft title',
  })
  assert.equal(
    seo.overview().find((row) => row.id === item.id)!.live!.stale,
    true,
  )
  assert.throws(() => seo.saveAudit(token, item.id, item.version, report), {
    code: 'VERSION_CONFLICT',
  })
  auth.logout(token)
  assert.throws(() => seo.saveAudit(token, item.id, item.version + 1, report), {
    code: 'UNAUTHENTICATED',
  })
})

test('publication elsewhere invalidates cached HTML checks that depend on links and related content', () => {
  const [source, target] = docs()
  const report = inspectHtml(
    '<main><h1>One</h1><p>Public content.</p></main>',
    { path: source.path, paths: [source.path], assetExists: () => true },
  )
  seo.saveAudit(token, source.id, source.version, report)
  const publicationKey = seo.publicationKey()
  content.unpublish(token, target.id, target.version)
  assert.equal(
    seo.overview().find((row) => row.id === source.id)!.live!.stale,
    true,
  )
  assert.throws(
    () =>
      seo.saveAudit(token, source.id, source.version, report, publicationKey),
    { code: 'VERSION_CONFLICT' },
  )
})

test('planner saves actual keyword, owner, due date and status with conflicts and audit rollback', () => {
  const document = docs()[0]
  const input = {
    keyword: 'nhập khẩu chính ngạch',
    title: 'Chuẩn bị bài hướng dẫn',
    documentId: document.id,
    assigneeId: auth.session(token)!.id,
    dueDate: '2026-10-15',
    status: 'planned',
    notes: 'Nguồn: tài liệu đã duyệt',
  }
  const created = seo.saveTask(token, null, 0, input)
  assert.equal(created.version, 1)
  assert.equal(created.keyword, input.keyword)
  const updated = seo.saveTask(token, created.id, 1, {
    ...input,
    status: 'review',
  })
  assert.equal(updated.status, 'review')
  assert.throws(() => seo.saveTask(token, created.id, 1, input), {
    code: 'VERSION_CONFLICT',
  })
  assert.throws(() =>
    seo.saveTask(token, null, 0, { ...input, dueDate: '2026-02-30' }),
  )
  assert.throws(
    () =>
      seo.saveTask(token, null, 0, {
        ...input,
        documentId: '00000000-0000-0000-0000-000000000000',
      }),
    { code: 'NOT_FOUND' },
  )
  db.exec(
    "CREATE TRIGGER fail_seo_audit BEFORE INSERT ON studio_audit WHEN NEW.action = 'seo.task-saved' BEGIN SELECT RAISE(ABORT, 'audit failure'); END",
  )
  assert.throws(
    () => seo.saveTask(token, created.id, 2, { ...input, status: 'done' }),
    /audit failure/,
  )
  assert.equal(seo.tasks()[0].status, 'review')
  db.exec('DROP TRIGGER fail_seo_audit')
  seo.deleteTask(token, created.id, 2)
  assert.equal(seo.tasks().length, 0)
})

test('planner allows editor and SEO roles but denies viewer, stale sessions and forged fields', async () => {
  const input = {
    keyword: 'nhập khẩu',
    title: 'Bài viết',
    documentId: null,
    assigneeId: null,
    dueDate: '',
    status: 'planned',
    notes: '',
  }
  for (const role of ['editor', 'seo', 'viewer'] as const) {
    await auth.createUser(
      auth.session(token)!,
      {
        email: `${role}@example.test`,
        name: role,
        role,
        password: 'Team-password-test-728!',
      },
      token,
    )
    const actor = (
      await auth.login(`${role}@example.test`, 'Team-password-test-728!', null)
    ).token
    if (role === 'viewer')
      assert.throws(() => seo.saveTask(actor, null, 0, input), {
        code: 'FORBIDDEN',
      })
    else assert.equal(seo.saveTask(actor, null, 0, input).title, input.title)
    auth.logout(actor)
    assert.throws(() => seo.saveTask(actor, null, 0, input), {
      code: 'UNAUTHENTICATED',
    })
  }
  assert.throws(() => seo.saveTask(token, null, 0, { ...input, role: 'admin' }))
})

test('link suggestions use matching Vietnamese terms and only published target documents', () => {
  const all = docs()
  const source = all.find((item) => item.path === '/quy-trinh')!
  const target = all.find((item) => item.kind === 'article')!
  const unrelated = all.find((item) => item.kind === 'industry')!
  source.draft = {
    ...source.draft,
    data: {
      ...source.draft.data,
      title: 'Kiểm tra chứng từ nhập khẩu',
      summary: 'Hồ sơ chứng từ cho doanh nghiệp',
    },
  } as typeof source.draft
  target.published = {
    ...target.published!,
    data: {
      ...target.published!.data,
      title: 'Chứng từ nhập khẩu',
      summary: 'Kiểm tra hồ sơ',
    },
  } as typeof target.published
  unrelated.published = null
  const suggestions = suggestLinks(source, [source, target, unrelated])
  assert.equal(suggestions[0].id, target.id)
  assert.ok(suggestions[0].terms.includes('chung'))
  assert.ok(
    !suggestions.some(
      (item) => item.id === source.id || item.id === unrelated.id,
    ),
  )
})

test('v1 database migration preserves content and v2 planner/audit data survive reopening', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'tbs-seo-test-')),
    filename = join(directory, 'studio.sqlite')
  let persistent = openStudioDatabase(filename)
  try {
    persistent.exec(
      'DROP TABLE studio_seo_audits; DROP TABLE studio_seo_tasks; PRAGMA user_version=1',
    )
    const legacyContent = new StudioContent(
      persistent,
      new StudioAuth(persistent),
    )
    legacyContent.seedMarketing()
    const legacyIds = legacyContent
      .list()
      .map((item) => item.id)
      .sort()
    persistent.close()
    persistent = openStudioDatabase(filename)
    const auth = new StudioAuth(persistent),
      content = new StudioContent(persistent, auth),
      seo = new StudioSeo(persistent, auth, content)
    const secret = 'fixture-seo-bootstrap-more-than-32-characters'
    await auth.setupOwner(
      {
        email: 'persistent@example.test',
        name: 'Owner',
        password: 'Persistent-password-test-728!',
      },
      secret,
      secret,
    )
    const session = (
      await auth.login(
        'persistent@example.test',
        'Persistent-password-test-728!',
        null,
      )
    ).token
    content.seedMarketing()
    assert.deepEqual(
      content
        .list()
        .map((item) => item.id)
        .sort(),
      legacyIds,
    )
    const item = content.list()[0]
    seo.saveTask(session, null, 0, {
      keyword: 'Chứng từ',
      title: 'Duyệt bài',
      documentId: item.id,
      assigneeId: null,
      dueDate: '',
      status: 'review',
      notes: '',
    })
    seo.saveAudit(
      session,
      item.id,
      item.version,
      inspectHtml('<main><h1>TBS</h1><p>Content</p></main>', {
        path: item.path,
        paths: [item.path],
        assetExists: () => true,
      }),
    )
    persistent.close()
    persistent = openStudioDatabase(filename)
    const reopenedAuth = new StudioAuth(persistent),
      reopenedContent = new StudioContent(persistent, reopenedAuth),
      reopened = new StudioSeo(persistent, reopenedAuth, reopenedContent)
    assert.equal(reopenedContent.list().length, 26)
    assert.equal(reopened.tasks()[0].status, 'review')
    assert.equal(reopened.tasks()[0].keyword, 'Chứng từ')
    assert.equal(
      reopened.overview().find((row) => row.id === item.id)!.live!.stale,
      false,
    )
    assert.equal(persistent.pragma('user_version', { simple: true }), 7)
  } finally {
    persistent.close()
    assert.ok(
      resolve(directory).startsWith(resolve(tmpdir()) + '\\tbs-seo-test-') ||
        resolve(directory).startsWith(resolve(tmpdir()) + '/tbs-seo-test-'),
    )
    rmSync(directory, { recursive: true, force: true })
  }
})
