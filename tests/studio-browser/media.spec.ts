import { test, expect } from '@playwright/test'
import sharp from 'sharp'
import type { MediaItem } from '../../src/lib/studio/media-model'

const headers = { Origin: 'http://127.0.0.1:4174' }
const owner = {
  email: 'owner@example.test',
  password: 'Owner-test-password-728!',
  name: 'Chủ website',
}

test('media conflicts preserve edits, allow explicit reconciliation and warn before discarding unsaved metadata', async ({
  page,
  context,
}) => {
  const png = await sharp({
    create: { width: 120, height: 80, channels: 3, background: '#fff' },
  })
    .png()
    .toBuffer()
  const uploaded = await context.request.post('/api/studio/media/', {
    headers: {
      ...headers,
      'Content-Type': 'image/png',
      'x-file-name': 'conflict.png',
    },
    data: png,
  })
  expect(uploaded.status()).toBe(201)
  const item: MediaItem = (await uploaded.json()).item
  await page.goto('/admin/media/')
  await page.getByRole('button', { name: 'Chỉnh sửa conflict.png' }).click()
  await page.getByLabel('Tên ảnh', { exact: true }).fill('Tên đang sửa')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('button', { name: 'Đóng thông tin ảnh' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(
    (
      await context.request.patch(item.url, {
        headers,
        data: {
          version: 1,
          payload: {
            title: 'Tên từ người khác',
            alt: 'Mô tả khác',
            source: '',
          },
        },
      })
    ).status(),
  ).toBe(200)
  await page.getByRole('button', { name: 'Lưu thông tin ảnh' }).click()
  await expect(
    page.getByRole('region', { name: 'Bản trên máy chủ' }),
  ).toContainText('Tên từ người khác')
  await expect(page.getByLabel('Tên ảnh', { exact: true })).toHaveValue(
    'Tên đang sửa',
  )
  await page.getByRole('button', { name: 'Giữ bản của tôi' }).click()
  await page.getByRole('button', { name: 'Lưu thông tin ảnh' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(
    (
      await (
        await context.request.get(`/api/studio/media/?id=${item.id}`)
      ).json()
    ).item.title,
  ).toBe('Tên đang sửa')
  await page.getByRole('button', { name: 'Chỉnh sửa Tên đang sửa' }).click()
  await page
    .getByLabel('Mô tả thay thế', { exact: true })
    .fill('Bản nháp cục bộ')
  expect(
    (
      await context.request.patch(item.url, {
        headers,
        data: {
          version: 3,
          payload: {
            title: 'Tên mới trên máy chủ',
            alt: 'Mô tả mới',
            source: 'Nguồn mới',
          },
        },
      })
    ).status(),
  ).toBe(200)
  await page.getByRole('button', { name: 'Lưu thông tin ảnh' }).click()
  await page.getByRole('button', { name: 'Dùng bản trên máy chủ' }).click()
  await expect(
    page.getByRole('textbox', { name: 'Mô tả thay thế', exact: true }),
  ).toHaveValue('Mô tả mới')
  await page.getByRole('button', { name: 'Đóng thông tin ảnh' }).click()
  await page.getByLabel('Lọc ảnh').selectOption('missing-alt')
  await expect(page.getByRole('button', { name: /Chỉnh sửa Tên/ })).toHaveCount(
    0,
  )
  await page.getByLabel('Lọc ảnh').selectOption('all')
  await page
    .getByRole('button', { name: 'Chỉnh sửa Tên mới trên máy chủ' })
    .click()
  await expect(
    page.getByRole('textbox', { name: 'Mô tả thay thế', exact: true }),
  ).toHaveValue('Mô tả mới')
  await expect(page.getByRole('dialog')).toContainText('v4')
  await expect(page.getByLabel('Mô tả thay thế', { exact: true })).toHaveValue(
    'Mô tả mới',
  )
  await page.setViewportSize({ width: 390, height: 844 })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-media-dialog-mobile.png',
    fullPage: true,
  })
})

test('media HTTP writes enforce origin, live roles and revoked sessions', async ({
  context,
  playwright,
}) => {
  const png = await sharp({
    create: { width: 120, height: 80, channels: 3, background: '#fff' },
  })
    .png()
    .toBuffer()
  const uploadHeaders = {
    ...headers,
    'Content-Type': 'image/png',
    'x-file-name': 'permissions.png',
  }
  expect(
    (
      await context.request.post('/api/studio/media/', {
        headers: { ...uploadHeaders, Origin: 'https://foreign.test' },
        data: png,
      })
    ).status(),
  ).toBe(403)
  const upload = await context.request.post('/api/studio/media/', {
    headers: uploadHeaders,
    data: png,
  })
  expect(upload.status()).toBe(201)
  const { item } = await upload.json()
  const userInput = {
    name: 'Media Editor',
    email: 'media-editor@example.test',
    password: 'Media-editor-password-729!',
    role: 'editor',
  }
  const userResponse = await context.request.post('/api/studio/users/', {
    headers,
    data: userInput,
  })
  expect(userResponse.status()).toBe(201)
  let { user } = await userResponse.json()
  const client = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  try {
    expect(
      (
        await client.post('/api/studio/session/', { headers, data: userInput })
      ).status(),
    ).toBe(200)
    expect((await client.get(item.url)).status()).toBe(200)
    for (const role of ['seo', 'viewer']) {
      const changed = await context.request.patch('/api/studio/users/', {
        headers,
        data: { id: user.id, revision: user.revision, changes: { role } },
      })
      expect(changed.status()).toBe(200)
      user = (await changed.json()).user
      expect((await client.get('/api/studio/media/')).status()).toBe(401)
      expect(
        (
          await client.post('/api/studio/session/', {
            headers,
            data: userInput,
          })
        ).status(),
      ).toBe(200)
      expect(
        (
          await client.post('/api/studio/media/', {
            headers: { ...uploadHeaders, 'x-role': 'admin' },
            data: png,
          })
        ).status(),
      ).toBe(403)
      expect(
        (
          await client.patch(item.url, {
            headers,
            data: {
              version: 1,
              payload: { title: 'Forged', alt: '', source: '' },
            },
          })
        ).status(),
      ).toBe(403)
      expect(
        (
          await client.delete(item.url, { headers, data: { version: 1 } })
        ).status(),
      ).toBe(403)
    }
    expect(
      (
        await context.request.patch('/api/studio/users/', {
          headers,
          data: {
            id: user.id,
            revision: user.revision,
            changes: { status: 'disabled' },
          },
        })
      ).status(),
    ).toBe(200)
    expect((await client.get('/api/studio/media/')).status()).toBe(401)
    expect((await client.get(item.url)).status()).toBe(404)
  } finally {
    await client.dispose()
  }
})
test.beforeEach(async ({ context }) => {
  if (
    (await (await context.request.get('/api/studio/session/')).json())
      .setupRequired
  )
    expect(
      (
        await context.request.post('/api/studio/setup/', {
          headers,
          data: {
            ...owner,
            token: 'isolated-test-bootstrap-token-at-least-32-characters',
          },
        })
      ).status(),
    ).toBe(201)
  expect(
    (
      await context.request.post('/api/studio/session/', {
        headers,
        data: owner,
      })
    ).status(),
  ).toBe(200)
})

test('media library uploads actual images, persists metadata, protects private images and deletes unused binaries', async ({
  page,
  context,
  playwright,
}) => {
  expect((await context.request.get('/api/studio/media/')).status()).toBe(200)
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  try {
    expect((await anonymous.get('/api/studio/media/')).status()).toBe(401)
    await page.goto('/admin/media/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Thư viện ảnh',
    )
    const png = await sharp({
      create: { width: 160, height: 120, channels: 3, background: '#0083ca' },
    })
      .png()
      .toBuffer()
    await page.getByLabel('Tải ảnh lên').setInputFiles({
      name: 'media-test.png',
      mimeType: 'image/png',
      buffer: png,
    })
    await expect(page.getByRole('status')).toContainText('Đã tải ảnh')
    const uploaded = (
      await (await context.request.get('/api/studio/media/')).json()
    ).items.find(
      (item: { filename: string }) => item.filename === 'media-test.png',
    )
    expect((await anonymous.get(uploaded.url)).status()).toBe(404)
    const image = await context.request.get(uploaded.url)
    expect(image.status()).toBe(200)
    expect(image.headers()['content-type']).toContain('image/webp')
    expect(image.headers()['x-content-type-options']).toBe('nosniff')
    expect((await sharp(await image.body()).metadata()).width).toBe(160)
    await page.getByRole('button', { name: 'Chỉnh sửa media-test.png' }).click()
    await page.getByLabel('Tên ảnh', { exact: true }).fill('Ảnh kiểm đếm TBS')
    await page
      .getByLabel('Mô tả thay thế', { exact: true })
      .fill('Thùng hàng được kiểm đếm')
    await page.getByLabel('Nguồn ảnh', { exact: true }).fill('TBS cung cấp')
    await page.getByRole('button', { name: 'Lưu thông tin ảnh' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.reload()
    await page.getByLabel('Tìm ảnh').fill('kiểm đếm')
    await expect(
      page.getByRole('button', { name: 'Chỉnh sửa Ảnh kiểm đếm TBS' }),
    ).toBeVisible()
    await page.screenshot({
      path: 'artifacts/screenshots/studio-media-desktop.png',
      fullPage: true,
    })
    await page.setViewportSize({ width: 390, height: 844 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390)
    await page.screenshot({
      path: 'artifacts/screenshots/studio-media-mobile.png',
      fullPage: true,
    })
    await page
      .getByRole('button', { name: 'Chỉnh sửa Ảnh kiểm đếm TBS' })
      .click()
    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Xóa ảnh' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    expect((await context.request.get(uploaded.url)).status()).toBe(404)
    const bad = await context.request.post('/api/studio/media/', {
      headers: {
        ...headers,
        'Content-Type': 'image/png',
        'x-file-name': 'fake.png',
      },
      data: Buffer.from('<svg><script>alert(1)</script></svg>'),
    })
    expect(bad.status()).toBe(415)
  } finally {
    await anonymous.dispose()
  }
})

test('editor selects library images, previews actual alt text and publishes an isolated media snapshot', async ({
  page,
  context,
  playwright,
}) => {
  const png = await sharp({
    create: { width: 160, height: 120, channels: 3, background: '#3d94d9' },
  })
    .png()
    .toBuffer()
  const upload = await context.request.post('/api/studio/media/', {
    headers: {
      ...headers,
      'Content-Type': 'image/png',
      'x-file-name': 'editor-image.png',
    },
    data: png,
  })
  expect(upload.status()).toBe(201)
  const { item } = await upload.json()
  expect(
    (
      await context.request.patch(item.url, {
        headers,
        data: {
          version: 1,
          payload: {
            title: 'Ảnh biên tập',
            alt: 'Mô tả xuất bản đã duyệt',
            source: 'TBS',
          },
        },
      })
    ).status(),
  ).toBe(200)
  const documents = (
    await (await context.request.get('/api/studio/content/')).json()
  ).documents
  const id = documents.find(
    (row: { path: string }) => row.path === '/gioi-thieu',
  ).id
  const endpoint = `/api/studio/content/${id}/`
  await page.goto(`/admin/content/${id}/`)
  await page
    .getByRole('button', { name: 'Chọn ảnh: Ảnh đại diện', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByLabel('Tìm ảnh').fill('biên tập')
  await page
    .getByRole('button', { name: 'Chọn Ảnh biên tập', exact: true })
    .click()
  await expect(page.getByLabel('Ảnh đại diện', { exact: true })).toHaveValue(
    item.url,
  )
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  await page.goto(`/studio-preview/${id}/`)
  await expect(page.locator(`img[src="${item.url}"]`)).toHaveAttribute(
    'alt',
    'Mô tả xuất bản đã duyệt',
  )
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  try {
    expect((await anonymous.get(item.url)).status()).toBe(404)
    expect(await (await anonymous.get('/gioi-thieu/')).text()).not.toContain(
      item.url,
    )
    let document = (await (await context.request.get(endpoint)).json()).document
    expect(
      (
        await context.request.patch(endpoint, {
          headers,
          data: { action: 'publish', version: document.version },
        })
      ).status(),
    ).toBe(200)
    expect((await anonymous.get(item.url)).status()).toBe(200)
    await page.goto('/gioi-thieu/')
    await expect(page.locator(`img[src="${item.url}"]`)).toHaveAttribute(
      'alt',
      'Mô tả xuất bản đã duyệt',
    )
    expect(
      (
        await context.request.patch(item.url, {
          headers,
          data: {
            version: 2,
            payload: {
              title: 'Ảnh biên tập',
              alt: 'Mô tả đang biên tập',
              source: 'TBS',
            },
          },
        })
      ).status(),
    ).toBe(200)
    await page.reload()
    await expect(page.locator(`img[src="${item.url}"]`)).toHaveAttribute(
      'alt',
      'Mô tả xuất bản đã duyệt',
    )
    const audit = await context.request.post('/api/studio/seo/audit/', {
      headers,
      data: { id },
    })
    expect(audit.status()).toBe(200)
    expect(
      (await audit.json()).report.issues.filter(
        (issue: { code: string }) => issue.code === 'image-missing',
      ),
    ).toEqual([])
    expect(
      (
        await context.request.delete(item.url, {
          headers,
          data: { version: 3 },
        })
      ).status(),
    ).toBe(409)
    await page.goto('/admin/media/')
    await page.getByRole('button', { name: 'Chỉnh sửa Ảnh biên tập' }).click()
    await expect(
      page.getByRole('region', { name: 'Nơi sử dụng ảnh' }),
    ).toContainText('Đã xuất bản')
    await expect(
      page.getByRole('button', { name: 'Xóa ảnh', exact: true }),
    ).toBeDisabled()
    document = (await (await context.request.get(endpoint)).json()).document
    expect(
      (
        await context.request.patch(endpoint, {
          headers,
          data: { action: 'publish', version: document.version },
        })
      ).status(),
    ).toBe(200)
    await page.goto('/gioi-thieu/')
    await expect(page.locator(`img[src="${item.url}"]`)).toHaveAttribute(
      'alt',
      'Mô tả đang biên tập',
    )
  } finally {
    await anonymous.dispose()
  }
})

test('mobile image picker reaches fixed slots and SEO fields, with keyboard-safe unsaved dialogs', async ({
  page,
  context,
}) => {
  const png = await sharp({
    create: { width: 120, height: 80, channels: 3, background: '#0083ca' },
  })
    .png()
    .toBuffer()
  const response = await context.request.post('/api/studio/media/', {
    headers: {
      ...headers,
      'Content-Type': 'image/png',
      'x-file-name': 'keyboard.png',
    },
    data: png,
  })
  expect(response.status()).toBe(201)
  await page.goto('/admin/dashboard/')
  await page
    .getByRole('navigation', { name: 'Quản trị website' })
    .getByRole('link', { name: 'Thư viện ảnh' })
    .click()
  await page.getByRole('button', { name: 'Chỉnh sửa keyboard.png' }).click()
  await page.getByLabel('Tên ảnh', { exact: true }).fill('Chưa lưu')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.goBack()
  await expect(page).toHaveURL(/\/admin\/media\/?$/)
  await expect(page.getByLabel('Tên ảnh', { exact: true })).toHaveValue(
    'Chưa lưu',
  )
  page.once('dialog', (dialog) => dialog.accept())
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Chỉnh sửa keyboard.png' }),
  ).toBeFocused()
  const documents = (
    await (await context.request.get('/api/studio/content/')).json()
  ).documents
  const id = documents.find((row: { path: string }) => row.path === '/').id
  await page.goto(`/admin/content/${id}/`)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByLabel('Tìm trường nội dung').fill('copy-30')
  const imageSlot = page.locator('[data-copy-key="copy-30"]')
  await imageSlot.locator('..').getByRole('button').click()
  await page.getByRole('button', { name: 'Ảnh website', exact: true }).click()
  await expect(
    page.getByRole('button', { name: 'Chọn Nguồn hàng TBS' }).locator('img'),
  ).toHaveJSProperty('naturalWidth', 1200)
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-media-picker-mobile.png',
  })
  await page.getByRole('button', { name: 'Chọn Nguồn hàng TBS' }).click()
  await expect(imageSlot).toHaveValue('/images/marketing/sourcing.webp')
  await page.getByRole('tab', { name: 'SEO', exact: true }).click()
  await page.getByRole('button', { name: 'Chọn ảnh: Ảnh Open Graph' }).click()
  await page.getByRole('button', { name: 'Ảnh website', exact: true }).click()
  await page.getByRole('button', { name: 'Chọn Vận chuyển TBS' }).click()
  await expect(page.getByLabel('Ảnh Open Graph', { exact: true })).toHaveValue(
    '/images/marketing/transport.webp',
  )
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  const saved = (
    await (await context.request.get(`/api/studio/content/${id}/`)).json()
  ).document
  expect(saved.draft.data.fields['copy-30']).toBe(
    '/images/marketing/sourcing.webp',
  )
  expect(saved.draft.seo.image).toBe('/images/marketing/transport.webp')
})
