import { beforeEach, afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve, sep } from 'node:path'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { StudioMedia } from '../../src/lib/studio/media'
import { StudioSeo } from '../../src/lib/studio/seo'
import { StudioTechnicalSeo } from '../../src/lib/studio/technical-seo'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioTemplates } from '../../src/lib/studio/templates'
import {
  templateCopy,
  templateFields,
} from '../../src/lib/studio/template-model'

let db: ReturnType<typeof openStudioDatabase>,
  auth: StudioAuth,
  content: StudioContent,
  templates: StudioTemplates,
  token: string
beforeEach(async () => {
  db = openStudioDatabase(':memory:')
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  content.seedMarketing()
  templates = new StudioTemplates(db, auth)
  const secret = 'template-fixture-bootstrap-more-than-32-characters'
  await auth.setupOwner(
    {
      name: 'Owner',
      email: 'templates@example.test',
      password: 'Templates-owner-password-729!',
    },
    secret,
    secret,
  )
  token = (
    await auth.login(
      'templates@example.test',
      'Templates-owner-password-729!',
      null,
    )
  ).token
})
afterEach(() => db.close())

test('public template links follow publication and redirect removal without erasing saved values', () => {
  const initial = templates.get().values
  const page = content.list().find((item) => item.path === '/quy-trinh')!
  const technical = new StudioTechnicalSeo(db, auth)
  const redirect = technical.saveRedirect(token, null, 0, {
    source: '/template-route',
    targetId: page.id,
    status: 308,
  })
  templates.apply(token, 0, {
    ...initial,
    'sidebar.href': '/template-route#step',
  })
  assert.equal(templates.public()['sidebar.href'], '/template-route#step')
  technical.deleteRedirect(token, redirect.id, redirect.version)
  assert.equal(templates.public()['sidebar.href'], '')
  assert.equal(templates.get().values['sidebar.href'], '/template-route#step')
  templates.apply(token, 1, { ...initial, 'sidebar.href': '/quy-trinh#step' })
  content.unpublish(token, page.id, page.version)
  assert.equal(templates.public()['sidebar.href'], '')
  assert.equal(templates.public()['services.processHref'], '')
  assert.equal(templates.get().values['sidebar.href'], '/quy-trinh#step')
  assert.equal(
    templates.public()['services.costsHref'],
    initial['services.costsHref'],
  )
})

test('template application is versioned, durable, audited and invalidates dependent SEO reports', () => {
  const initial = templates.get()
  const next = {
    ...initial.values,
    'sidebar.heading': 'Trao đổi chính xác',
    'journey.stages.2.title': 'Chứng từ theo lô hàng',
  }
  const seo = new StudioSeo(db, auth, content),
    fingerprint = seo.publicationKey()
  const saved = templates.apply(token, initial.version, next)
  assert.equal(saved.version, 1)
  assert.equal(
    new StudioTemplates(db, auth).get().values['sidebar.heading'],
    'Trao đổi chính xác',
  )
  assert.equal(
    templateCopy(saved.values).journey.stages[2].title,
    'Chứng từ theo lô hàng',
  )
  assert.notEqual(seo.publicationKey(), fingerprint)
  assert.throws(() => templates.apply(token, 0, initial.values), {
    code: 'VERSION_CONFLICT',
  })
  db.exec(
    "CREATE TRIGGER template_audit_abort BEFORE INSERT ON studio_audit BEGIN SELECT RAISE(ABORT, 'fixture'); END",
  )
  assert.throws(() => templates.apply(token, 1, initial.values))
  assert.equal(templates.get().version, 1)
  assert.deepEqual(templates.get().values, next)
})

test('template values and image bytes survive closing and reopening a persistent database', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'tbs-templates-'))
  const path = join(directory, 'studio.sqlite')
  try {
    const media = new StudioMedia(db, auth)
    const image = await media.upload(
      token,
      await sharp({
        create: { width: 32, height: 32, channels: 3, background: '#0083ca' },
      })
        .png()
        .toBuffer(),
      'image/png',
      'retained.png',
    )
    const applied = templates.apply(token, 0, {
      ...templates.get().values,
      'journey.image': image.url,
      'sidebar.heading': 'Nội dung lưu bền vững',
    })
    await db.backup(path)
    const disk = openStudioDatabase(path)
    disk.close()
    const reopened = openStudioDatabase(path)
    try {
      const liveAuth = new StudioAuth(reopened)
      assert.deepEqual(new StudioTemplates(reopened, liveAuth).get(), applied)
      assert.ok(
        new StudioMedia(reopened, liveAuth).read(image.id).data.length > 0,
      )
    } finally {
      reopened.close()
    }
  } finally {
    if (
      !resolve(directory).startsWith(resolve(tmpdir()) + sep) ||
      !basename(directory).startsWith('tbs-templates-')
    )
      throw new Error('Unsafe fixture cleanup')
    rmSync(directory, { recursive: true, force: true })
  }
})

test('unpublished targets and missing local or uploaded images cannot become shared templates', () => {
  const initial = templates.get()
  for (const values of [
    { ...initial.values, 'sidebar.href': '/does-not-exist' },
    {
      ...initial.values,
      'journey.image': '/images/marketing/missing-file.webp',
    },
    {
      ...initial.values,
      'journey.image':
        '/api/studio/media/00000000-0000-0000-0000-000000000000/',
    },
  ])
    assert.throws(() => templates.apply(token, 0, values), { status: 409 })
  assert.deepEqual(templates.get(), initial)
})

test('template validation rejects missing/unknown fields, invalid links/media and unauthorized writes', async () => {
  const initial = templates.get().values
  for (const values of [
    { ...initial, invented: 'x' },
    { ...initial, 'sidebar.href': 'javascript:alert(1)' },
    { ...initial, 'sidebar.href': '/admin/' },
    { ...initial, 'journey.image': '/images/marketing/../../bad.svg' },
    { ...initial, 'sidebar.heading': '' },
    { ...initial, 'sidebar.heading': 'x'.repeat(301) },
  ])
    assert.throws(() => templates.apply(token, 0, values))
  const missing = { ...initial }
  delete missing[templateFields[0].key]
  assert.throws(() => templates.apply(token, 0, missing))
  for (const role of ['editor', 'seo', 'viewer'] as const) {
    const editor = await auth.createUser(
      auth.session(token)!,
      {
        name: role,
        email: `${role}@example.test`,
        password: 'Templates-editor-password-729!',
        role,
      },
      token,
    )
    const session = (
      await auth.login(editor.email, 'Templates-editor-password-729!', null)
    ).token
    assert.throws(() => templates.apply(session, 0, initial), { status: 403 })
  }
  auth.logout(token)
  assert.throws(() => templates.apply(token, 0, initial), { status: 401 })
})

test('template images participate in public access and deletion guards', async () => {
  const media = new StudioMedia(db, auth)
  const image = await media.upload(
    token,
    await sharp({
      create: { width: 80, height: 60, channels: 3, background: '#0083ca' },
    })
      .png()
      .toBuffer(),
    'image/png',
    'journey.png',
  )
  assert.throws(() => media.read(image.id), { status: 404 })
  const initial = templates.get()
  templates.apply(token, 0, { ...initial.values, 'journey.image': image.url })
  assert.ok(media.read(image.id).data.length)
  assert.equal(media.usage(image.id)[0].editorPath, '/admin/templates/')
  assert.throws(() => media.remove(token, image.id, 1), {
    code: 'MEDIA_IN_USE',
  })
  templates.apply(token, 1, initial.values)
  media.remove(token, image.id, 1)
})
