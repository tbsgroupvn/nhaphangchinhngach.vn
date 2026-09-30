import { beforeEach, afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import sharp from 'sharp'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { openStudioDatabase } from '../../src/lib/studio/database'
import { StudioAuth } from '../../src/lib/studio/auth'
import { StudioContent } from '../../src/lib/studio/content'
import { StudioMedia } from '../../src/lib/studio/media'

let db: ReturnType<typeof openStudioDatabase>,
  auth: StudioAuth,
  content: StudioContent,
  media: StudioMedia,
  token: string,
  png: Buffer
beforeEach(async () => {
  db = openStudioDatabase(':memory:')
  auth = new StudioAuth(db)
  content = new StudioContent(db, auth)
  content.seedMarketing()
  media = new StudioMedia(db, auth)
  const secret = 'fixture-media-bootstrap-longer-than-32-characters'
  await auth.setupOwner(
    {
      name: 'Owner',
      email: 'media@example.test',
      password: 'Media-test-password-728!',
    },
    secret,
    secret,
  )
  token = (
    await auth.login('media@example.test', 'Media-test-password-728!', null)
  ).token
  png = await sharp({
    create: { width: 120, height: 80, channels: 3, background: '#0083ca' },
  })
    .png()
    .toBuffer()
})
afterEach(() => db.close())
const upload = () => media.upload(token, png, 'image/png', 'hang-hoa.png')

test('missing built-in content, fixed-slot and SEO images never create revisions', () => {
  const doc = content.get(content.list().find((row) => row.path === '/')!.id)
  if (doc.draft.kind !== 'page') throw new Error('Expected fixed page')
  const fields = doc.draft.data.fields
  const missing = '/images/marketing/nonexistent-review-regression.webp'
  const history = content.revisions(doc.id)
  const attempts = [
    () =>
      content.save(token, doc.id, doc.version, {
        ...doc.draft,
        data: { ...doc.draft.data, image: missing },
      }),
    () =>
      content.save(token, doc.id, doc.version, {
        ...doc.draft,
        data: {
          ...doc.draft.data,
          fields: { ...fields, 'copy-30': missing },
        },
      }),
    () =>
      content.saveSeo(token, doc.id, doc.version, {
        ...doc.draft.seo,
        image: missing,
      }),
  ]
  for (const attempt of attempts) {
    assert.throws(attempt, { code: 'MEDIA_NOT_FOUND' })
    assert.deepEqual(content.get(doc.id), doc)
    assert.deepEqual(content.revisions(doc.id), history)
  }
})

test('normalized media pixels, descriptions and publication references survive a database reopen', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'tbs-media-persistence-'))
  const filename = join(directory, 'studio.sqlite')
  let persistent = openStudioDatabase(filename)
  try {
    const secret = 'media-persistence-bootstrap-longer-than-32-characters'
    let access = new StudioAuth(persistent)
    await access.setupOwner(
      {
        name: 'Owner',
        email: 'persistent-media@example.test',
        password: 'Persistent-media-password-729!',
      },
      secret,
      secret,
    )
    const session = (
      await access.login(
        'persistent-media@example.test',
        'Persistent-media-password-729!',
        null,
      )
    ).token
    const library = new StudioMedia(persistent, access)
    let item = await library.upload(session, png, 'image/png', 'persistent.png')
    item = library.update(session, item.id, item.version, {
      title: 'Ảnh bền vững',
      alt: 'Thùng hàng',
      source: 'TBS',
    })
    const expectedPixels = library.read(item.id, session).data
    const contents = new StudioContent(persistent, access)
    contents.seedMarketing()
    let document = contents.get(
      contents.list().find((row) => row.path === '/gioi-thieu')!.id,
    )
    document = contents.save(session, document.id, document.version, {
      ...document.draft,
      data: { ...document.draft.data, image: item.url },
    })
    contents.publish(session, document.id, document.version)
    persistent.close()
    persistent = openStudioDatabase(filename)
    access = new StudioAuth(persistent)
    const restored = new StudioMedia(persistent, access)
    assert.equal(persistent.pragma('user_version', { simple: true }), 7)
    assert.equal(restored.get(item.id).alt, 'Thùng hàng')
    assert.deepEqual(restored.read(item.id).data, expectedPixels)
    assert.equal(restored.usage(item.id)[0].documentId, document.id)
    assert.throws(() => restored.remove(session, item.id, item.version), {
      code: 'MEDIA_IN_USE',
    })
  } finally {
    persistent.close()
    rmSync(directory, { recursive: true, force: true })
  }
})

test('uploads decode and re-encode actual pixels, strip metadata and stay private before publication', async () => {
  const input = await sharp(png).withMetadata().png().toBuffer()
  const item = await media.upload(token, input, 'image/png', 'hang-hoa.png')
  assert.equal(item.width, 120)
  assert.equal(item.height, 80)
  assert.equal(item.mime, 'image/webp')
  assert.match(item.url, /^\/api\/studio\/media\/[a-f0-9-]{36}\/$/)
  assert.throws(() => media.read(item.id), { status: 404 })
  const actual = media.read(item.id, token)
  const decoded = await sharp(actual.data).metadata()
  assert.equal(decoded.format, 'webp')
  assert.equal(decoded.exif, undefined)
  assert.equal(decoded.icc, undefined)
  assert.equal(media.list().length, 1)
  assert.ok(!('data' in media.list()[0]))
})

test('uploads reject active, malformed, disguised, oversized, animated and traversal inputs without writes', async () => {
  for (const [bytes, type, name] of [
    [
      Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
      ),
      'image/png',
      'active.png',
    ],
    [png, 'text/html', 'image.png'],
    [png, 'image/jpeg', 'wrong.jpg'],
    [png.subarray(0, 35), 'image/png', 'truncated.png'],
    [png, 'image/png', '../escape.png'],
    [png, 'image/png', 'bad\\name.png'],
    [Buffer.alloc(8 * 1024 * 1024 + 1), 'image/png', 'large.png'],
  ] as const)
    await assert.rejects(media.upload(token, bytes, type, name))
  const huge = await sharp({
    create: { width: 5000, height: 5000, channels: 3, background: '#fff' },
  })
    .png()
    .toBuffer()
  await assert.rejects(media.upload(token, huge, 'image/png', 'pixels.png'))
  const other = await sharp({
    create: { width: 120, height: 80, channels: 3, background: '#fff' },
  })
    .png()
    .toBuffer()
  const animated = await sharp([png, other], { join: { animated: true } })
    .webp({ loop: 0 })
    .toBuffer()
  assert.equal((await sharp(animated).metadata()).pages, 2)
  await assert.rejects(
    media.upload(token, animated, 'image/webp', 'animated.webp'),
  )
  assert.equal(media.list().length, 0)
})

test('supported raster formats decode while upload capacity and quotas recover after rejected work', async () => {
  const attempts = [upload(), upload(), upload()]
  const results = await Promise.allSettled(attempts)
  assert.equal(
    results.filter((result) => result.status === 'fulfilled').length,
    2,
  )
  assert.equal(
    (
      results.find(
        (result) => result.status === 'rejected',
      ) as PromiseRejectedResult
    ).reason.code,
    'UPLOAD_BUSY',
  )
  for (const format of ['jpeg', 'webp', 'avif'] as const) {
    const encoded = await sharp(png).toFormat(format).toBuffer()
    const item = await media.upload(
      token,
      encoded,
      `image/${format}`,
      `actual.${format}`,
    )
    assert.equal(
      (await sharp(media.read(item.id, token).data).metadata()).format,
      'webp',
    )
  }
  const count = media.list().length
  const id = media.list()[0].id
  db.prepare('UPDATE studio_media SET bytes = ? WHERE id = ?').run(
    512 * 1024 * 1024,
    id,
  )
  await assert.rejects(upload(), { code: 'MEDIA_QUOTA' })
  assert.equal(media.list().length, count)
  db.prepare('UPDATE studio_media SET bytes = length(data) WHERE id = ?').run(
    id,
  )
  const recovered = await upload()
  db.transaction(() => {
    const insert = db.prepare(
      'INSERT INTO studio_media SELECT ?,title,alt,source,filename,width,height,bytes,data,version,created_at,updated_at FROM studio_media WHERE id = ?',
    )
    for (let index = media.list().length; index < 2000; index += 1)
      insert.run(randomUUID(), recovered.id)
  })()
  await assert.rejects(upload(), { code: 'MEDIA_QUOTA' })
  media.remove(token, recovered.id, 1)
  await upload()
  assert.equal(media.list().length, 2000)
})

test('fixed-image slots and SEO-only images participate in publication and historical deletion guards', async () => {
  const fixedImage = await upload(),
    seoImage = await upload()
  media.update(token, fixedImage.id, 1, {
    title: 'Ảnh nội dung',
    alt: 'Ảnh phụ trang chủ',
    source: '',
  })
  media.update(token, seoImage.id, 1, {
    title: 'Ảnh SEO',
    alt: 'Ảnh chia sẻ',
    source: '',
  })
  let document = content.get(content.list().find((row) => row.path === '/')!.id)
  assert.equal(document.draft.kind, 'page')
  if (document.draft.kind !== 'page') return
  document = content.save(token, document.id, document.version, {
    ...document.draft,
    data: {
      ...document.draft.data,
      fields: { ...document.draft.data.fields, 'copy-30': fixedImage.url },
    },
  })
  document = content.saveSeo(token, document.id, document.version, {
    ...document.draft.seo,
    image: seoImage.url,
  })
  assert.throws(() => media.read(fixedImage.id), { status: 404 })
  assert.throws(() => media.read(seoImage.id), { status: 404 })
  assert.equal(
    content.preview(document.id).data.imageAlts?.[fixedImage.url],
    'Ảnh phụ trang chủ',
  )
  document = content.publish(token, document.id, document.version)
  for (const item of [fixedImage, seoImage]) {
    assert.ok(media.read(item.id).data.length)
    assert.throws(() => media.remove(token, item.id, 2), {
      code: 'MEDIA_IN_USE',
    })
  }
  assert.equal(
    document.published?.data.imageAlts?.[seoImage.url],
    'Ảnh chia sẻ',
  )
  document = content.unpublish(token, document.id, document.version)
  assert.throws(() => media.read(fixedImage.id), { status: 404 })
  assert.throws(() => media.read(seoImage.id), { status: 404 })
})

test('metadata uses expected revisions and failed audit commits leave binary/metadata untouched', async () => {
  const item = await upload()
  const saved = media.update(token, item.id, item.version, {
    title: 'Kiểm đếm hàng',
    alt: 'Nhân viên kiểm đếm thùng hàng',
    source: 'Ảnh TBS cung cấp',
  })
  assert.equal(saved.version, 2)
  assert.throws(
    () =>
      media.update(token, item.id, 1, { title: 'Stale', alt: '', source: '' }),
    { code: 'VERSION_CONFLICT' },
  )
  assert.throws(() => media.remove(token, item.id, 1), {
    code: 'VERSION_CONFLICT',
  })
  db.exec(
    "CREATE TRIGGER media_audit_abort BEFORE INSERT ON studio_audit BEGIN SELECT RAISE(ABORT, 'fixture'); END",
  )
  await assert.rejects(upload())
  assert.throws(() => media.remove(token, item.id, 2))
  assert.equal(media.list().length, 1)
  assert.equal(media.get(item.id).alt, saved.alt)
  assert.ok(media.read(item.id, token).data.length)
})

test('draft, published and history references guard deletion and publication controls anonymous delivery', async () => {
  const item = await upload()
  let document = content.get(
    content.list().find((row) => row.path === '/gioi-thieu')!.id,
  )
  const original = structuredClone(document.draft)
  document = content.save(token, document.id, document.version, {
    ...document.draft,
    data: { ...document.draft.data, image: item.url },
  })
  assert.deepEqual(media.usage(item.id)[0].locations.sort(), [
    'draft',
    'history',
  ])
  assert.throws(() => media.remove(token, item.id, item.version), {
    code: 'MEDIA_IN_USE',
  })
  assert.throws(() => media.read(item.id), { status: 404 })
  document = content.publish(token, document.id, document.version)
  assert.ok(media.read(item.id).data.length)
  document = content.save(token, document.id, document.version, original)
  document = content.publish(token, document.id, document.version)
  assert.throws(() => media.read(item.id), { status: 404 })
  assert.deepEqual(media.usage(item.id)[0].locations, ['history'])
  assert.throws(() => media.remove(token, item.id, item.version), {
    code: 'MEDIA_IN_USE',
  })
})

test('missing managed media is rejected by content and SEO writes instead of publishing broken images', () => {
  const document = content.get(content.list()[0].id)
  const url = '/api/studio/media/00000000-0000-4000-8000-000000000000/'
  assert.throws(
    () =>
      content.save(token, document.id, document.version, {
        ...document.draft,
        data: { ...document.draft.data, image: url },
      }),
    { code: 'MEDIA_NOT_FOUND' },
  )
  assert.throws(
    () =>
      content.saveSeo(token, document.id, document.version, {
        ...document.draft.seo,
        image: url,
      }),
    { code: 'MEDIA_NOT_FOUND' },
  )
})

test('publication snapshots image descriptions without leaking later library edits', async () => {
  const item = await upload()
  const first = media.update(token, item.id, 1, {
    title: 'TBS',
    alt: 'Mô tả đã duyệt',
    source: '',
  })
  let document = content.get(
    content.list().find((row) => row.path === '/gioi-thieu')!.id,
  )
  document = content.save(token, document.id, document.version, {
    ...document.draft,
    data: { ...document.draft.data, image: item.url },
  })
  document = content.publish(token, document.id, document.version)
  assert.equal(document.published?.data.imageAlts?.[item.url], first.alt)
  assert.deepEqual(document.draft, document.published)
  media.update(token, item.id, first.version, {
    title: 'TBS',
    alt: 'Mô tả mới chưa xuất bản',
    source: '',
  })
  assert.equal(
    content.publishedAt('/gioi-thieu')?.data.imageAlts?.[item.url],
    first.alt,
  )
  document = content.publish(token, document.id, document.version)
  assert.equal(
    document.published?.data.imageAlts?.[item.url],
    'Mô tả mới chưa xuất bản',
  )
  assert.equal(
    content.list().find((row) => row.id === document.id)?.status,
    'published',
  )
})

test('unused media is actually deleted and viewer or revoked sessions cannot mutate it', async () => {
  const item = await upload()
  const owner = auth.session(token)!
  const user = await auth.createUser(
    owner,
    {
      name: 'Viewer',
      email: 'viewer-media@example.test',
      password: 'Viewer-media-password-728!',
      role: 'viewer',
    },
    token,
  )
  const viewer = (
    await auth.login(user.email, 'Viewer-media-password-728!', null)
  ).token
  await assert.rejects(media.upload(viewer, png, 'image/png', 'denied.png'), {
    status: 403,
  })
  assert.throws(() => media.remove(viewer, item.id, item.version), {
    status: 403,
  })
  media.remove(token, item.id, item.version)
  assert.equal(media.list().length, 0)
  assert.throws(() => media.read(item.id, token), { status: 404 })
  const pending = upload()
  auth.logout(token)
  await assert.rejects(pending, { status: 401 })
  assert.equal(media.list().length, 0)
})
