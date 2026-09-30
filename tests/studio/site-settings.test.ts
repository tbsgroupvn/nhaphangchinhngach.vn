import { beforeEach, afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve, sep } from 'node:path'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { StudioMedia } from '../../src/lib/studio/media'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioSiteSettings } from '../../src/lib/studio/site-settings'

let db: ReturnType<typeof openStudioDatabase>,
  auth: StudioAuth,
  content: StudioContent,
  settings: StudioSiteSettings,
  token: string
beforeEach(async () => {
  db = openStudioDatabase(':memory:')
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  content.seedMarketing()
  settings = new StudioSiteSettings(db, auth)
  const secret = 'site-settings-bootstrap-token-longer-than-32-chars'
  await auth.setupOwner(
    {
      name: 'Owner',
      email: 'site@example.test',
      password: 'Site-settings-password-729!',
    },
    secret,
    secret,
  )
  token = (
    await auth.login('site@example.test', 'Site-settings-password-729!', null)
  ).token
})
afterEach(() => db.close())

test('applied identity and navigation survive a fresh database connection', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'tbs-site-settings-'))
  const path = join(directory, 'studio.sqlite')
  try {
    const payload = settings.get().payload
    payload.identity.email = 'retained@example.test'
    payload.navigation.reverse()
    settings.apply(token, 0, payload)
    await db.backup(path)
    const reopened = openStudioDatabase(path)
    try {
      const restored = new StudioSiteSettings(
        reopened,
        new StudioAuth(reopened),
      )
      assert.equal(restored.get().version, 1)
      assert.equal(restored.public().identity.email, 'retained@example.test')
      assert.equal(restored.public().navigation[0].href, '/lien-he/')
    } finally {
      reopened.close()
    }
  } finally {
    if (
      !resolve(directory).startsWith(resolve(tmpdir()) + sep) ||
      !basename(directory).startsWith('tbs-site-settings-')
    )
      throw new Error('Unsafe fixture cleanup')
    rmSync(directory, { recursive: true, force: true })
  }
})

test('site settings preserve approved defaults and apply a versioned public configuration', () => {
  const initial = settings.get()
  assert.equal(initial.version, 0)
  assert.equal(initial.payload.identity.phone, '+84976005335')
  assert.equal(initial.payload.navigation[0].label, 'Về TBS')
  const next = structuredClone(initial.payload)
  next.identity.phone = '+84912345678'
  next.identity.phoneDisplay = '0912 345 678'
  next.footer.headline = 'Kết nối cùng TBS'
  const saved = settings.apply(token, 0, next)
  assert.equal(saved.version, 1)
  assert.equal(
    new StudioSiteSettings(db, auth).get().payload.identity.phone,
    '+84912345678',
  )
  assert.equal(settings.public().footer.headline, 'Kết nối cùng TBS')
  assert.throws(() => settings.apply(token, 0, initial.payload), {
    code: 'VERSION_CONFLICT',
  })
  assert.equal(
    (
      db
        .prepare(
          "SELECT count(*) AS n FROM studio_audit WHERE action='site.applied'",
        )
        .get() as { n: number }
    ).n,
    1,
  )
  db.exec(
    "CREATE TRIGGER site_audit_abort BEFORE INSERT ON studio_audit BEGIN SELECT RAISE(ABORT, 'fixture'); END",
  )
  assert.throws(() => settings.apply(token, 1, initial.payload))
  assert.equal(settings.get().version, 1)
})

test('unsafe contact, media and unpublished/system navigation targets are rejected', () => {
  const initial = settings.get().payload
  for (const change of [
    { phone: 'javascript:alert(1)' },
    { phoneDisplay: '0999 111 222' },
    { zalo: 'https://zalo.me.evil.test/0123456789' },
    { zalo: 'javascript:alert(1)' },
    { email: 'a@example.test\r\nBcc:other@example.test' },
    { logo: '/images/marketing/../bad.svg' },
  ])
    assert.throws(() =>
      settings.apply(token, 0, {
        ...initial,
        identity: { ...initial.identity, ...change },
      }),
    )
  for (const href of [
    '/admin/',
    '/api/studio/users/',
    '//evil.test',
    '/missing/',
    '/studio-preview/123/',
  ])
    assert.throws(() =>
      settings.apply(token, 0, {
        ...initial,
        navigation: [{ label: 'Link', href }],
      }),
    )
  assert.equal(settings.get().version, 0)
})

test('public navigation hides unpublished destinations while saved settings remain recoverable', () => {
  const initial = settings.get()
  settings.apply(token, 0, initial.payload)
  const about = content.get(
    content.list().find((row) => row.path === '/gioi-thieu')!.id,
  )
  content.unpublish(token, about.id, about.version)
  assert.ok(
    !settings.public().navigation.some((link) => link.href === '/gioi-thieu/'),
  )
  assert.ok(
    settings
      .get()
      .payload.navigation.some((link) => link.href === '/gioi-thieu/'),
  )
})

test('shared branding images get public delivery and deletion protection only while configured', async () => {
  const media = new StudioMedia(db, auth)
  const png = await sharp({
    create: { width: 120, height: 80, channels: 3, background: '#0083ca' },
  })
    .png()
    .toBuffer()
  const item = await media.upload(token, png, 'image/png', 'logo.png')
  assert.throws(() => media.read(item.id), { status: 404 })
  const initial = settings.get()
  const payload = structuredClone(initial.payload)
  payload.identity.logo = item.url
  settings.apply(token, 0, payload)
  assert.ok(media.read(item.id).data.length)
  assert.equal(media.usage(item.id)[0].editorPath, '/admin/settings/')
  assert.throws(() => media.remove(token, item.id, 1), { code: 'MEDIA_IN_USE' })
  settings.apply(token, 1, initial.payload)
  media.remove(token, item.id, 1)
  assert.throws(() => media.read(item.id), { status: 404 })
})

test('only a currently authorized administrator can apply shared public settings', async () => {
  const owner = auth.session(token)!
  const editor = await auth.createUser(
    owner,
    {
      name: 'Editor',
      email: 'site-editor@example.test',
      password: 'Site-editor-password-729!',
      role: 'editor',
    },
    token,
  )
  const session = (
    await auth.login(editor.email, 'Site-editor-password-729!', null)
  ).token
  assert.throws(() => settings.apply(session, 0, settings.get().payload), {
    status: 403,
  })
  auth.logout(token)
  assert.throws(() => settings.apply(token, 0, settings.get().payload), {
    status: 401,
  })
})
