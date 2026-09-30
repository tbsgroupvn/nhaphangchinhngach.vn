import { beforeEach, afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { StudioTechnicalSeo } from '../../src/lib/studio/technical-seo'
import { StudioSeo } from '../../src/lib/studio/seo'
import { inspectHtml } from '../../src/lib/studio/seo-audit'
import { fixedTemplate } from '../../src/lib/studio/fixed-page-registry'
import {
  sitemapEntries,
  indexingAllowed,
} from '../../src/lib/studio/technical-seo-model'

let db: ReturnType<typeof openStudioDatabase>,
  auth: StudioAuth,
  content: StudioContent,
  technical: StudioTechnicalSeo,
  token: string
beforeEach(async () => {
  db = openStudioDatabase(':memory:')
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  content.seedMarketing()
  technical = new StudioTechnicalSeo(db, auth)
  const secret = 'test-technical-bootstrap-at-least-32-characters'
  await auth.setupOwner(
    {
      name: 'Owner',
      email: 'owner@example.test',
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
const target = () => content.list().find((item) => item.path === '/gioi-thieu')!
const article = () => {
  const seed = content.get(
    content.list().find((item) => item.kind === 'article')!.id,
  ).draft
  return content.create(token, {
    ...seed,
    data: { ...seed.data, slug: 'technical-old' },
  })
}

test('redirects normalize sources, resolve published targets and enforce revisions atomically', () => {
  const rule = technical.saveRedirect(token, null, 0, {
    source: '/old-about/',
    targetId: target().id,
    status: 308,
  })
  assert.equal(rule.source, '/old-about')
  assert.deepEqual(technical.resolve('/old-about/'), {
    path: '/gioi-thieu',
    status: 308,
  })
  assert.throws(
    () =>
      technical.saveRedirect(token, rule.id, 0, {
        source: rule.source,
        targetId: target().id,
        status: 307,
      }),
    { code: 'VERSION_CONFLICT' },
  )
  assert.equal(technical.redirects()[0].status, 308)
  const changed = technical.saveRedirect(token, rule.id, rule.version, {
    source: rule.source,
    targetId: target().id,
    status: 307,
  })
  assert.equal(changed.version, 2)
  assert.throws(() => technical.deleteRedirect(token, rule.id, 1), {
    code: 'VERSION_CONFLICT',
  })
  technical.deleteRedirect(token, rule.id, 2)
  assert.equal(technical.resolve(rule.source), null)
  assert.equal(
    (
      db
        .prepare(
          "SELECT COUNT(*) AS n FROM studio_audit WHERE action LIKE 'redirect.%'",
        )
        .get() as { n: number }
    ).n,
    3,
  )
})

test('redirect sources reject unsafe paths, occupied routes, aliases and self loops', () => {
  for (const source of [
    '//evil.test',
    'https://evil.test',
    '/a/../b',
    '/a%2fb',
    '/a?x=1',
    '/a#b',
    '/a\\b',
    '/admin/a',
    '/api/a',
    '/studio-preview/a',
    '/images/a',
    '/_next/a',
    '/robots.txt',
    '/tin-tuc/custom',
    '/cau-chuyen-khach-hang/custom',
    '/gioi-thieu',
    '/',
    '/dich-vu/van-chuyen-quoc-te',
  ]) {
    assert.throws(
      () =>
        technical.saveRedirect(token, null, 0, {
          source,
          targetId: target().id,
          status: 308,
        }),
      source,
    )
  }
  const draft = article()
  assert.throws(
    () =>
      technical.saveRedirect(token, null, 0, {
        source: draft.path,
        targetId: target().id,
        status: 308,
      }),
    { code: 'PATH_CONFLICT' },
  )
  assert.throws(
    () =>
      technical.saveRedirect(token, null, 0, {
        source: '/missing-target',
        targetId: draft.id,
        status: 308,
      }),
    { code: 'TARGET_UNPUBLISHED' },
  )
  const rule = technical.saveRedirect(token, null, 0, {
    source: '/old-about',
    targetId: target().id,
    status: 308,
  })
  assert.throws(
    () =>
      technical.saveRedirect(token, null, 0, {
        source: '/old-about/',
        targetId: target().id,
        status: 308,
      }),
    { code: 'PATH_CONFLICT' },
  )
  // Only document IDs are valid destinations: a redirect can never point to another redirect.
  assert.throws(
    () =>
      technical.saveRedirect(token, null, 0, {
        source: '/chain',
        targetId: rule.id,
        status: 308,
      }),
    { code: 'TARGET_UNPUBLISHED' },
  )
  assert.equal(technical.redirects().length, 1)
})

test('publication moves create single-hop redirects and protect destinations from unpublishing', () => {
  let item = article()
  item = content.publish(token, item.id, item.version)
  item = content.save(token, item.id, item.version, {
    ...item.draft,
    data: { ...item.draft.data, slug: 'technical-new' },
  })
  assert.equal(technical.resolve('/kien-thuc/technical-old'), null)
  item = content.publish(token, item.id, item.version)
  assert.deepEqual(technical.resolve('/kien-thuc/technical-old'), {
    path: '/kien-thuc/technical-new',
    status: 308,
  })
  item = content.save(token, item.id, item.version, {
    ...item.draft,
    data: { ...item.draft.data, slug: 'technical-final' },
  })
  item = content.publish(token, item.id, item.version)
  assert.deepEqual(technical.resolve('/kien-thuc/technical-old'), {
    path: '/kien-thuc/technical-final',
    status: 308,
  })
  assert.deepEqual(technical.resolve('/kien-thuc/technical-new'), {
    path: '/kien-thuc/technical-final',
    status: 308,
  })
  assert.throws(() => content.unpublish(token, item.id, item.version), {
    code: 'REDIRECT_IN_USE',
  })
  assert.throws(
    () =>
      content.save(token, item.id, item.version, {
        ...item.draft,
        data: { ...item.draft.data, slug: 'technical-old' },
      }),
    { code: 'PATH_CONFLICT' },
  )
  assert.throws(() => article(), { code: 'PATH_CONFLICT' })
  for (const rule of technical.redirects())
    technical.deleteRedirect(token, rule.id, rule.version)
  content.unpublish(token, item.id, item.version)
  assert.equal(content.publishedAt('/kien-thuc/technical-final'), null)
})

test('technical SEO writes recheck live admin authority and cannot be forged by SEO/editor users', async () => {
  const owner = auth.session(token)!
  for (const role of ['seo', 'editor', 'viewer'] as const) {
    const user = await auth.createUser(
      owner,
      {
        name: 'Restricted',
        email: `${role}@example.test`,
        password: 'Restricted-password-728!',
        role,
      },
      token,
    )
    const session = (
      await auth.login(user.email, 'Restricted-password-728!', null)
    ).token
    assert.throws(
      () =>
        technical.saveRedirect(session, null, 0, {
          source: '/forbidden',
          targetId: target().id,
          status: 308,
        }),
      { status: 403 },
    )
    assert.throws(
      () =>
        technical.saveSettings(session, 0, {
          googleVerification: [],
          blockIndexing: false,
        }),
      { status: 403 },
    )
  }
  auth.logout(token)
  assert.throws(
    () =>
      technical.saveSettings(token, 0, {
        googleVerification: [],
        blockIndexing: false,
      }),
    { status: 401 },
  )
})

test('verification settings accept only tokens, retain multiple owners and cannot bypass the release gate', () => {
  assert.deepEqual(technical.settings(), {
    version: 0,
    googleVerification: [],
    blockIndexing: false,
  })
  const input = {
    googleVerification: [
      'test-owner-one_0123456789',
      'test-owner-two_0123456789',
    ],
    blockIndexing: true,
  }
  const saved = technical.saveSettings(token, 0, input)
  assert.equal(saved.version, 1)
  assert.deepEqual(
    technical.settings().googleVerification,
    input.googleVerification,
  )
  assert.throws(() => technical.saveSettings(token, 0, input), {
    code: 'VERSION_CONFLICT',
  })
  for (const googleVerification of [
    ['<meta name="google-site-verification">'],
    ['a'.repeat(300)],
    ['token-12345', 'token-12345'],
  ]) {
    assert.throws(() =>
      technical.saveSettings(token, 1, { ...input, googleVerification }),
    )
  }
  assert.equal(indexingAllowed(false, false), false)
  assert.equal(indexingAllowed(false, true), false)
  assert.equal(indexingAllowed(true, true), false)
  assert.equal(indexingAllowed(true, false), true)
  assert.equal(technical.settings().version, 1)
})

test('sitemap contains only published indexable canonical URLs with publication timestamps', () => {
  const about = content.get(target().id)
  const saved = content.saveSeo(token, about.id, about.version, {
    ...about.draft.seo,
    noindex: true,
  })
  assert.ok(
    sitemapEntries(content.publishedList(), true).some(
      (item) => item.path === '/gioi-thieu',
    ),
  )
  content.publish(token, about.id, saved.version)
  assert.ok(
    !sitemapEntries(content.publishedList(), true).some(
      (item) => item.path === '/gioi-thieu',
    ),
  )
  let item = article()
  assert.ok(
    !sitemapEntries(content.publishedList(), true).some(
      (row) => row.path === item.path,
    ),
  )
  item = content.publish(token, item.id, item.version)
  assert.equal(
    sitemapEntries(content.publishedList(), true).find(
      (row) => row.path === item.path,
    )!.updatedAt,
    item.publishedAt,
  )
  item = content.saveSeo(token, item.id, item.version, {
    ...item.draft.seo,
    canonical: '/quy-trinh/',
  })
  content.publish(token, item.id, item.version)
  assert.ok(
    !sitemapEntries(content.publishedList(), true).some(
      (row) => row.path === item.path,
    ),
  )
  assert.deepEqual(sitemapEntries(content.publishedList(), false), [])
})

test('failed audit writes roll back technical settings, redirects and publication moves', () => {
  let item = article()
  item = content.publish(token, item.id, item.version)
  item = content.save(token, item.id, item.version, {
    ...item.draft,
    data: { ...item.draft.data, slug: 'audit-rollback' },
  })
  db.exec(
    "CREATE TRIGGER reject_technical_audit BEFORE INSERT ON studio_audit BEGIN SELECT RAISE(ABORT, 'fixture failure'); END",
  )
  assert.throws(() =>
    technical.saveSettings(token, 0, {
      googleVerification: ['fixture-token-12345'],
      blockIndexing: true,
    }),
  )
  assert.equal(technical.settings().version, 0)
  assert.throws(() =>
    technical.saveRedirect(token, null, 0, {
      source: '/rollback',
      targetId: target().id,
      status: 308,
    }),
  )
  assert.equal(technical.redirects().length, 0)
  assert.throws(() => content.publish(token, item.id, item.version))
  assert.equal(technical.redirects().length, 0)
  assert.ok(content.publishedAt('/kien-thuc/technical-old'))
  assert.equal(content.publishedAt('/kien-thuc/audit-rollback'), null)
  assert.equal(content.get(item.id).version, item.version)
})

test('SEO checks recognize configured redirects and invalidate reports when the routing inventory changes', () => {
  const seo = new StudioSeo(db, auth, content)
  let source = content.get(content.list().find((item) => item.path === '/')!.id)
  if (source.draft.kind !== 'page') throw new Error('Expected home')
  const field = fixedTemplate('home')!.fields.find(
    (item) => item.kind === 'link',
  )!.key
  source.draft.data.fields[field] = '/legacy-seo-link'
  source = content.save(token, source.id, source.version, source.draft)
  const rule = technical.saveRedirect(token, null, 0, {
    source: '/legacy-seo-link',
    targetId: target().id,
    status: 308,
  })
  assert.ok(
    !seo
      .overview()
      .find((item) => item.id === source.id)!
      .issues.some(
        (issue) =>
          issue.code === 'link-unmanaged' &&
          issue.detail === '/legacy-seo-link',
      ),
  )
  const report = inspectHtml(
    '<main><h1>Test</h1><p>Body</p><a href="/legacy-seo-link/">About</a></main>',
    {
      path: '/',
      paths: ['/'],
      redirectPaths: ['/legacy-seo-link'],
      assetExists: () => true,
    },
  )
  assert.ok(!report.issues.some((issue) => issue.code === 'link-unmanaged'))
  assert.ok(report.issues.some((issue) => issue.code === 'link-redirect'))
  seo.saveAudit(token, source.id, source.version, report)
  assert.equal(
    seo.overview().find((item) => item.id === source.id)!.live!.stale,
    false,
  )
  technical.deleteRedirect(token, rule.id, rule.version)
  assert.equal(
    seo.overview().find((item) => item.id === source.id)!.live!.stale,
    true,
  )
  assert.ok(
    seo
      .overview()
      .find((item) => item.id === source.id)!
      .issues.some(
        (issue) =>
          issue.code === 'link-unmanaged' &&
          issue.detail === '/legacy-seo-link',
      ),
  )
})

test('v2 upgrade preserves existing content and v3 redirects/settings survive reopening', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'tbs-technical-test-'))
  const filename = join(directory, 'studio.sqlite')
  let persistent = openStudioDatabase(filename)
  try {
    let localAuth = new StudioAuth(persistent)
    let localContent = new StudioContent(persistent, localAuth)
    localContent.seedMarketing()
    const ids = localContent
      .list()
      .map((item) => item.id)
      .sort()
    persistent.exec('DROP TABLE studio_redirects; PRAGMA user_version = 2;')
    persistent.close()
    persistent = openStudioDatabase(filename)
    localAuth = new StudioAuth(persistent)
    localContent = new StudioContent(persistent, localAuth)
    localContent.seedMarketing()
    assert.deepEqual(
      localContent
        .list()
        .map((item) => item.id)
        .sort(),
      ids,
    )
    const secret = 'fixture-persistent-technical-bootstrap-token'
    await localAuth.setupOwner(
      {
        name: 'Owner',
        email: 'persist@example.test',
        password: 'Persistent-password-728!',
      },
      secret,
      secret,
    )
    const session = (
      await localAuth.login(
        'persist@example.test',
        'Persistent-password-728!',
        null,
      )
    ).token
    const local = new StudioTechnicalSeo(persistent, localAuth)
    local.saveSettings(session, 0, {
      googleVerification: ['fixture-persisted-token_12345'],
      blockIndexing: true,
    })
    local.saveRedirect(session, null, 0, {
      source: '/persisted-redirect',
      targetId: localContent.list().find((item) => item.path === '/quy-trinh')!
        .id,
      status: 307,
    })
    persistent.close()
    persistent = openStudioDatabase(filename)
    const reopened = new StudioTechnicalSeo(
      persistent,
      new StudioAuth(persistent),
    )
    assert.deepEqual(reopened.resolve('/persisted-redirect'), {
      path: '/quy-trinh',
      status: 307,
    })
    assert.deepEqual(reopened.settings(), {
      version: 1,
      googleVerification: ['fixture-persisted-token_12345'],
      blockIndexing: true,
    })
    assert.equal(persistent.pragma('user_version', { simple: true }), 7)
  } finally {
    persistent.close()
    assert.ok(
      resolve(directory).startsWith(
        resolve(tmpdir()) + sep + 'tbs-technical-test-',
      ),
    )
    rmSync(directory, { recursive: true, force: true })
  }
})

test('sitemap keeps only Atlas categories with a published child and industries whose category is published', () => {
  const seo = { title: 't', description: 'd', canonical: '', noindex: false, image: '' as const }
  const category = (slug: string) => ({
    path: `/nganh-hang/${slug}`,
    updatedAt: '2026-09-29T00:00:00.000Z',
    payload: {
      kind: 'industryCategory',
      data: { slug, title: slug, summary: 's', image: '/images/marketing/containers.webp', order: 1, featuredIndustryIds: [], review: { status: 'approved', reviewer: 'r', reviewedAt: '', nextReviewAt: '' } },
      seo,
    },
  })
  const industry = (categorySlug: string, slug: string) => ({
    path: `/nganh-hang/${categorySlug}/${slug}`,
    updatedAt: '2026-09-29T00:00:00.000Z',
    payload: { kind: 'industry', data: { slug, categorySlug }, seo },
  })
  const paths = sitemapEntries(
    [
      category('co-con'),
      category('rong'),
      industry('co-con', 'nganh-a'),
      industry('mat-nhom', 'nganh-mo-coi'),
    ] as unknown as Parameters<typeof sitemapEntries>[0],
    true,
  ).map((item) => item.path)
  assert.deepEqual(paths.sort(), ['/nganh-hang/co-con', '/nganh-hang/co-con/nganh-a'])
})
