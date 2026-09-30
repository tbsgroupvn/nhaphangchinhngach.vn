import { beforeEach, afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import {
  articles,
  industries,
  services,
  publicPages,
} from '../../src/data/marketing'
import { contentSchema } from '../../src/lib/studio/content-model'
import {
  fixedTemplates,
  copyCollection,
} from '../../src/lib/studio/fixed-page-registry'

let db: ReturnType<typeof openStudioDatabase>
let auth: StudioAuth
let content: StudioContent
let token: string
let directory: string
const initial = {
  kind: 'article' as const,
  data: articles[0],
  seo: {
    title: articles[0].title,
    description: articles[0].summary,
    canonical: '',
    noindex: false,
    image: articles[0].image,
  },
}
beforeEach(async () => {
  directory = mkdtempSync(join(tmpdir(), 'tbs-content-test-'))
  db = openStudioDatabase(join(directory, 'studio.sqlite'))
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  const secret = 'test-setup-token-with-more-than-thirty-two-characters'
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
afterEach(() => {
  db.close()
  rmSync(directory, { recursive: true, force: true })
})

test('every release page is represented by exactly one persistent document', () => {
  content.seedMarketing()
  assert.deepEqual(
    content
      .list()
      .map((item) => item.path)
      .sort(),
    publicPages.map((item) => item.path).sort(),
  )
  assert.ok(content.publishedAt('/'))
})

test('draft, live snapshot and seed marker survive reopening the persistent database', () => {
  content.seedMarketing()
  const item = content.list().find((item) => item.kind === 'article')!
  const original = content.get(item.id).draft
  content.save(token, item.id, item.version, {
    ...original,
    data: { ...original.data, title: 'Draft after restart' },
  })
  db.close()
  db = openStudioDatabase(join(directory, 'studio.sqlite'))
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  content.seedMarketing()
  assert.equal(content.get(item.id).draft.data.title, 'Draft after restart')
  assert.equal(content.publishedAt(item.path)?.data.title, original.data.title)
  assert.equal(content.list().length, publicPages.length)
  assert.ok(auth.session(token))
})

test('seeding is idempotent and never resurrects an unpublished item', () => {
  content.seedMarketing()
  assert.equal(content.list().length, publicPages.length)
  const item = content.list().find((item) => item.kind === 'article')!
  content.unpublish(token, item.id, item.version)
  content.seedMarketing()
  assert.equal(content.publishedAt(item.path), null)
})

test('draft creation and saving do not publish; publication keeps a separate snapshot', () => {
  const item = content.create(token, initial)
  assert.equal(content.publishedAt(item.path), null)
  const live = content.publish(token, item.id, item.version)
  const saved = content.save(token, item.id, live.version, {
    ...initial,
    data: { ...initial.data, title: 'Bản nháp chưa duyệt' },
  })
  assert.equal(content.get(item.id).draft.data.title, 'Bản nháp chưa duyệt')
  assert.equal(content.publishedAt(item.path)?.data.title, initial.data.title)
  content.publish(token, item.id, saved.version)
  assert.equal(
    content.publishedAt(item.path)?.data.title,
    'Bản nháp chưa duyệt',
  )
})

test('stale revisions return conflict without modifying draft, audit or history', () => {
  const item = content.create(token, initial)
  content.save(token, item.id, 1, {
    ...initial,
    data: { ...initial.data, title: 'First writer' },
  })
  const auditCount = (
    db.prepare('SELECT COUNT(*) AS n FROM studio_audit').get() as { n: number }
  ).n
  assert.throws(() => content.save(token, item.id, 1, initial), {
    code: 'VERSION_CONFLICT',
  })
  assert.equal(content.get(item.id).draft.data.title, 'First writer')
  assert.equal(content.revisions(item.id).length, 2)
  assert.equal(
    (
      db.prepare('SELECT COUNT(*) AS n FROM studio_audit').get() as {
        n: number
      }
    ).n,
    auditCount,
  )
})

test('restore writes a new draft revision without altering the live snapshot', () => {
  const item = content.create(token, initial)
  const saved = content.save(token, item.id, 1, {
    ...initial,
    data: { ...initial.data, title: 'Published title' },
  })
  const live = content.publish(token, item.id, saved.version)
  const restored = content.restore(token, item.id, live.version, 1)
  assert.equal(restored.version, 4)
  assert.equal(restored.draft.data.title, initial.data.title)
  assert.equal(content.publishedAt(item.path)?.data.title, 'Published title')
})

test('draft route moves reserve both paths until publication and cannot overwrite another document', () => {
  const item = content.create(token, initial)
  const live = content.publish(token, item.id, 1)
  const moved = content.save(token, item.id, live.version, {
    ...initial,
    data: { ...initial.data, slug: 'new-article-path' },
  })
  assert.equal(content.publishedAt(moved.path), null)
  assert.ok(content.publishedAt(item.path))
  assert.throws(() => content.create(token, initial), {
    code: 'PATH_CONFLICT',
  })
  content.publish(token, item.id, moved.version)
  assert.equal(content.publishedAt(item.path), null)
  assert.ok(content.publishedAt(moved.path))
})

test('revoked sessions and editors cannot publish even when they can save drafts', async () => {
  const editor = await auth.createUser(
    auth.session(token)!,
    {
      email: 'editor@example.test',
      name: 'Editor',
      password: 'Editor-password-test-728!',
      role: 'editor',
    },
    token,
  )
  const editorToken = (
    await auth.login(editor.email, 'Editor-password-test-728!', null)
  ).token
  const item = content.create(editorToken, initial)
  assert.throws(() => content.publish(editorToken, item.id, 1), {
    code: 'FORBIDDEN',
  })
  auth.logout(editorToken)
  assert.throws(() => content.save(editorToken, item.id, 1, initial), {
    code: 'UNAUTHENTICATED',
  })
})

test('invalid slugs, active media and document-kind changes are rejected', () => {
  for (const slug of [
    '../admin',
    '%2e%2e',
    'article?x=1',
    'bad/path',
    '__proto__',
  ]) {
    assert.throws(() =>
      content.create(token, { ...initial, data: { ...initial.data, slug } }),
    )
  }
  assert.throws(() =>
    content.create(token, {
      ...initial,
      data: { ...initial.data, image: 'javascript:alert(1)' },
    }),
  )
  assert.throws(() =>
    content.create(token, {
      ...initial,
      seo: { ...initial.seo, canonical: 'https://other.example/' },
    }),
  )
  const item = content.create(token, initial)
  assert.throws(
    () =>
      content.save(token, item.id, 1, {
        kind: 'service',
        data: services[0],
        seo: initial.seo,
      }),
    { code: 'KIND_CONFLICT' },
  )
})

test('publication and audit roll back together when recording the event fails', () => {
  const item = content.create(token, initial)
  db.exec(
    "CREATE TRIGGER fail_publish BEFORE INSERT ON studio_audit WHEN NEW.action = 'content.published' BEGIN SELECT RAISE(ABORT, 'audit failure'); END",
  )
  assert.throws(() => content.publish(token, item.id, 1), /audit failure/)
  assert.equal(content.publishedAt(item.path), null)
  assert.equal(content.get(item.id).version, 1)
  assert.equal(content.revisions(item.id).length, 1)
})

test('fixed templates validate all fields and reject unsafe or invented fields', () => {
  content.seedMarketing()
  for (const template of fixedTemplates) {
    const payload = content.publishedAt(template.path)!
    assert.equal(payload.kind, 'page')
    if (payload.kind !== 'page') throw new Error('Expected fixed page')
    assert.ok(contentSchema.safeParse(payload).success)
    for (const field of template.fields) {
      const fields: Record<string, string> = { ...payload.data.fields }
      delete fields[field.key]
      assert.equal(
        contentSchema.safeParse({
          ...payload,
          data: { ...payload.data, fields },
        }).success,
        false,
        `${template.slug}/${field.key} required`,
      )
      if (field.kind === 'link' || field.kind === 'image') {
        for (const value of [
          'javascript:alert(1)',
          '//outside.test',
          '/admin/../secret',
        ]) {
          fields[field.key] = value
          assert.equal(
            contentSchema.safeParse({
              ...payload,
              data: { ...payload.data, fields },
            }).success,
            false,
          )
        }
      }
    }
    assert.equal(
      contentSchema.safeParse({
        ...payload,
        data: {
          ...payload.data,
          fields: { ...payload.data.fields, invented: 'No slot' },
        },
      }).success,
      false,
    )
  }
  assert.throws(
    () => copyCollection({ title: 'Default' }, {}, 'section'),
    /Missing fixed-page copy/,
  )
})

test('homepage requires a usable hero image while image-free interior templates remain valid', () => {
  content.seedMarketing()
  const home = content.publishedAt('/')!
  assert.equal(
    contentSchema.safeParse({ ...home, data: { ...home.data, image: '' } })
      .success,
    false,
  )
  const faq = content.publishedAt('/hoi-dap')!
  assert.ok(
    contentSchema.safeParse({ ...faq, data: { ...faq.data, image: '' } })
      .success,
  )
})

test('seeded service and article URLs cannot orphan existing links or template behavior', () => {
  content.seedMarketing()
  for (const kind of ['service', 'article']) {
    const item = content.get(
      content.list().find((item) => item.kind === kind)!.id,
    )
    assert.throws(
      () =>
        content.save(token, item.id, item.version, {
          ...item.draft,
          data: { ...item.draft.data, slug: 'moved-seeded-route' },
        }),
      { code: 'FIXED_ROUTE' },
    )
    assert.equal(content.get(item.id).version, item.version)
    assert.ok(content.publishedAt(item.path))
  }
})

test('all fixed pages isolate drafts, publish, restore and remain unpublished after reseeding', () => {
  content.seedMarketing()
  for (const item of content.list().filter((item) => item.kind === 'page')) {
    const original = content.get(item.id).draft
    const saved = content.save(token, item.id, item.version, {
      ...original,
      data: { ...original.data, title: `Draft ${item.path}` },
    })
    assert.equal(
      content.publishedAt(item.path)?.data.title,
      original.data.title,
    )
    const live = content.publish(token, item.id, saved.version)
    assert.equal(
      content.publishedAt(item.path)?.data.title,
      `Draft ${item.path}`,
    )
    const restored = content.restore(token, item.id, live.version, 1)
    assert.equal(restored.draft.data.title, original.data.title)
    assert.equal(
      content.publishedAt(item.path)?.data.title,
      `Draft ${item.path}`,
    )
    content.unpublish(token, item.id, restored.version)
    content.seedMarketing()
    assert.equal(content.publishedAt(item.path), null)
  }
})

test('fixed-page migration runs for an existing v1 content database and template paths are immutable', () => {
  db.prepare(
    'INSERT INTO studio_settings (key, value, updated_at) VALUES (?, ?, ?)',
  ).run('content.seed.v1', 'true', new Date().toISOString())
  content.seedMarketing()
  const pages = content.list().filter((item) => item.kind === 'page')
  assert.equal(pages.length, 13)
  const item = content.get(pages[0].id)
  assert.throws(() => content.create(token, item.draft), {
    code: 'FIXED_PAGE',
  })
  const other = content.get(pages[1].id).draft
  assert.throws(() => content.save(token, item.id, item.version, other), {
    code: 'FIXED_PAGE',
  })
})

test('SEO specialists can revise metadata only, with conflicts and publication boundaries enforced', async () => {
  const specialist = await auth.createUser(
    auth.session(token)!,
    {
      email: 'seo@example.test',
      name: 'SEO specialist',
      password: 'Seo-password-test-728!',
      role: 'seo',
    },
    token,
  )
  const seoToken = (
    await auth.login(specialist.email, 'Seo-password-test-728!', null)
  ).token
  const created = content.create(token, initial)
  const published = content.publish(token, created.id, created.version)
  const seo = {
    ...initial.seo,
    title: 'SEO pending approval',
    description: 'A new search description',
    canonical: '/kien-thuc',
    noindex: true,
  }
  const saved = content.saveSeo(seoToken, created.id, published.version, seo)
  assert.deepEqual(saved.draft.data, published.draft.data)
  assert.deepEqual(saved.draft.seo, seo)
  assert.deepEqual(content.publishedAt(saved.path)?.seo, initial.seo)
  assert.throws(
    () => content.saveSeo(seoToken, created.id, published.version, initial.seo),
    { code: 'VERSION_CONFLICT' },
  )
  assert.throws(
    () => content.save(seoToken, created.id, saved.version, initial),
    { code: 'FORBIDDEN' },
  )
  assert.throws(() => content.publish(seoToken, created.id, saved.version), {
    code: 'FORBIDDEN',
  })
  assert.throws(() =>
    content.saveSeo(seoToken, created.id, saved.version, {
      ...seo,
      data: { title: 'Unauthorized body' },
    }),
  )
  content.publish(token, created.id, saved.version)
  assert.deepEqual(content.publishedAt(saved.path)?.seo, seo)
  auth.updateUser(
    auth.session(token)!,
    specialist.id,
    { role: 'viewer' },
    specialist.revision,
    token,
  )
  assert.throws(() =>
    content.saveSeo(seoToken, created.id, saved.version + 1, initial.seo),
  )
  const viewerToken = (
    await auth.login(specialist.email, 'Seo-password-test-728!', null)
  ).token
  assert.throws(
    () =>
      content.saveSeo(viewerToken, created.id, saved.version + 1, initial.seo),
    { code: 'FORBIDDEN' },
  )
  auth.logout(seoToken)
  assert.throws(
    () => content.saveSeo(seoToken, created.id, saved.version + 1, initial.seo),
    { code: 'UNAUTHENTICATED' },
  )
})

test('industry relations and review gates reject unowned categories and legacy publication', () => {
  content.seedMarketing()
  const seeded = content.list().find((item) => item.kind === 'industry')!
  const document = content.get(seeded.id)

  assert.throws(
    () =>
      content.create(token, {
        ...document.draft,
        data: {
          ...document.draft.data,
          slug: 'industry-without-category',
          categorySlug: 'missing-category',
        },
      }),
    { code: 'INDUSTRY_CATEGORY_NOT_FOUND' },
  )
  assert.throws(
    () => content.publish(token, document.id, document.version),
    { code: 'INDUSTRY_REVIEW_REQUIRED' },
  )

  const approved = content.save(token, document.id, document.version, {
    ...document.draft,
    data: {
      ...document.draft.data,
      review: {
        status: 'approved',
        reviewer: 'Bộ phận Xuất nhập khẩu TBS',
        reviewedAt: '2026-09-28T08:00:00.000Z',
        nextReviewAt: '2027-03-28T08:00:00.000Z',
      },
    },
  })
  assert.equal(content.publish(token, approved.id, approved.version).published?.kind, 'industry')
})

test('a new category can publish after its first active industry draft breaks the bootstrap cycle', () => {
  content.seedMarketing()
  const categorySeed = content.get(
    content.list().find((item) => item.kind === 'industryCategory')!.id,
  )
  const industrySeed = content.get(
    content.list().find((item) => item.kind === 'industry')!.id,
  )
  assert.equal(categorySeed.draft.kind, 'industryCategory')
  assert.equal(industrySeed.draft.kind, 'industry')
  const category = content.create(token, {
    ...categorySeed.draft,
    data: {
      ...categorySeed.draft.data,
      slug: 'nhom-khoi-tao-moi',
      title: 'Nhóm khởi tạo mới',
      featuredIndustryIds: [],
    },
  })
  const industry = content.create(token, {
    ...industrySeed.draft,
    data: {
      ...industrySeed.draft.data,
      slug: 'nganh-khoi-tao-moi',
      title: 'Ngành khởi tạo mới',
      categorySlug: 'nhom-khoi-tao-moi',
      review: {
        status: 'approved',
        reviewer: 'Bộ phận Xuất nhập khẩu TBS',
        reviewedAt: '2026-09-29T08:00:00.000Z',
        nextReviewAt: '2027-03-29T08:00:00.000Z',
      },
    },
  })
  const publishedCategory = content.publish(
    token,
    category.id,
    category.version,
  )
  assert.equal(publishedCategory.publishedPath, '/nganh-hang/nhom-khoi-tao-moi')
  assert.equal(
    content.publish(token, industry.id, industry.version).publishedPath,
    '/nganh-hang/nhom-khoi-tao-moi/nganh-khoi-tao-moi',
  )
})

test('archive and unpublish guard category children before any revision or audit write', () => {
  content.seedMarketing()
  const category = content
    .list()
    .find((item) => item.kind === 'industryCategory')!
  const before = {
    revision: (
      db
        .prepare('SELECT COUNT(*) count FROM studio_revisions WHERE document_id=?')
        .get(category.id) as { count: number }
    ).count,
    audit: (
      db.prepare('SELECT COUNT(*) count FROM studio_audit').get() as {
        count: number
      }
    ).count,
  }
  assert.throws(
    () => content.archive(token, category.id, category.version),
    { code: 'CATEGORY_HAS_CHILDREN' },
  )
  assert.throws(
    () => content.unpublish(token, category.id, category.version),
    { code: 'CATEGORY_HAS_PUBLISHED_CHILDREN' },
  )
  assert.deepEqual(
    {
      revision: (
        db
          .prepare('SELECT COUNT(*) count FROM studio_revisions WHERE document_id=?')
          .get(category.id) as { count: number }
      ).count,
      audit: (
        db.prepare('SELECT COUNT(*) count FROM studio_audit').get() as {
          count: number
        }
      ).count,
    },
    before,
  )
})

test('industry archive is atomic and reactivate never republishes', () => {
  content.seedMarketing()
  const item = content.list().find((entry) => entry.kind === 'industry')!
  const original = content.get(item.id)
  assert.throws(() => content.archive(token, item.id, item.version - 1), {
    code: 'VERSION_CONFLICT',
  })
  const archived = content.archive(token, item.id, item.version)
  assert.ok(archived.archivedAt)
  assert.equal(archived.published, null)
  assert.deepEqual(archived.draft, original.draft)
  assert.equal(content.list().find((entry) => entry.id === item.id)?.status, 'archived')

  const active = content.reactivate(token, item.id, archived.version)
  assert.equal(active.archivedAt, null)
  assert.equal(active.published, null)
  assert.deepEqual(active.draft, original.draft)
})

test('approved industries can move category and slug with a one-hop redirect while fixed services stay fixed', () => {
  content.seedMarketing()
  const item = content.list().find((entry) => entry.kind === 'industry')!
  const original = content.get(item.id)
  const targetCategory = content
    .list()
    .find(
      (entry) =>
        entry.kind === 'industryCategory' &&
        entry.path.endsWith('/may-moc-day-chuyen'),
    )!
  assert.ok(targetCategory)
  const saved = content.save(token, item.id, item.version, {
    ...original.draft,
    data: {
      ...original.draft.data,
      slug: 'gia-dung-kiem-tra',
      categorySlug: 'may-moc-day-chuyen',
      review: {
        status: 'approved',
        reviewer: 'Bộ phận Xuất nhập khẩu TBS',
        reviewedAt: '2026-09-28T08:00:00.000Z',
        nextReviewAt: '2027-03-28T08:00:00.000Z',
      },
    },
  })
  const published = content.publish(token, item.id, saved.version)
  assert.equal(
    published.publishedPath,
    '/nganh-hang/may-moc-day-chuyen/gia-dung-kiem-tra',
  )
  const redirect = db
    .prepare('SELECT source,target_id,status FROM studio_redirects WHERE source=?')
    .get(original.publishedPath) as {
    source: string
    target_id: string
    status: number
  }
  assert.deepEqual(redirect, {
    source: original.publishedPath,
    target_id: item.id,
    status: 308,
  })

  const service = content.list().find((entry) => entry.kind === 'service')!
  const serviceDocument = content.get(service.id)
  assert.throws(
    () =>
      content.save(token, service.id, service.version, {
        ...serviceDocument.draft,
        data: { ...serviceDocument.draft.data, slug: 'service-moved' },
      }),
    { code: 'FIXED_ROUTE' },
  )
  assert.equal(industries.length, 3)
})
