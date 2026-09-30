import { test, expect, type APIRequestContext } from '@playwright/test'
const headers = { Origin: 'http://127.0.0.1:4174' }
async function loginOwner(request: APIRequestContext) {
  const owner = {
    name: 'Chủ website',
    email: 'owner@example.test',
    password: 'Owner-test-password-728!',
  }
  if ((await (await request.get('/api/studio/session/')).json()).setupRequired)
    expect(
      (
        await request.post('/api/studio/setup/', {
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
      await request.post('/api/studio/session/', { headers, data: owner })
    ).status(),
  ).toBe(200)
}
test.beforeEach(async ({ context }) => {
  await loginOwner(context.request)
  const { jobs } = await (
    await context.request.get('/api/studio/backups/')
  ).json()
  for (const job of jobs)
    expect(
      (
        await context.request.delete('/api/studio/backups/', {
          headers,
          data: { id: job.id },
        })
      ).status(),
    ).toBe(200)
})
test('backup administration downloads a sanitized archive and explicitly restores its public/draft snapshots', async ({
  page,
  context,
}) => {
  test.setTimeout(90000)
  const owner = {
    name: 'Chủ website',
    email: 'owner@example.test',
    password: 'Owner-test-password-728!',
  }
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
  expect((await context.request.get('/api/studio/backups/')).status()).toBe(200)
  await page.goto('/admin/backups/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Sao lưu & khôi phục',
  )
  await page.getByRole('button', { name: 'Tạo bản sao', exact: true }).click()
  const download = page
    .getByRole('link', { name: 'Tải bản sao', exact: true })
    .first()
  await expect(download).toBeVisible()
  const file = await context.request.get((await download.getAttribute('href'))!)
  expect(file.status()).toBe(200)
  const bytes = await file.body()
  expect(bytes.subarray(0, 16).toString()).toBe('SQLite format 3\u0000')
  const { documents } = await (
    await context.request.get('/api/studio/content/')
  ).json()
  const id = documents.find(
    (item: { path: string }) => item.path === '/gioi-thieu',
  ).id
  const { document } = await (
    await context.request.get(`/api/studio/content/${id}/`)
  ).json()
  const changed = structuredClone(document.draft)
  changed.data.title = 'Nội dung sau bản sao'
  expect(
    (
      await context.request.patch(`/api/studio/content/${id}/`, {
        headers,
        data: { action: 'save', version: document.version, payload: changed },
      })
    ).status(),
  ).toBe(200)
  await page.getByLabel('Tệp sao lưu').setInputFiles({
    name: 'tbs-backup.sqlite',
    mimeType: 'application/vnd.sqlite3',
    buffer: bytes,
  })
  await page
    .getByRole('button', { name: 'Kiểm tra bản sao', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Bản sao đã kiểm tra' }),
  ).toBeVisible()
  await page.screenshot({
    path: 'artifacts/screenshots/studio-backup-review-desktop.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({
    path: 'artifacts/screenshots/studio-backup-review-mobile.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page
    .getByLabel('Xác nhận khôi phục', { exact: true })
    .fill('KHOI PHUC WEBSITE')
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Khôi phục website', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã khôi phục')
  expect(
    (await (await context.request.get(`/api/studio/content/${id}/`)).json())
      .document.draft.data.title,
  ).toBe(document.draft.data.title)
  await page.reload()
  await page.screenshot({
    path: 'artifacts/screenshots/studio-backups-desktop.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 390, height: 844 })
  const downloadBounds = await page
    .getByRole('link', { name: 'Tải bản sao', exact: true })
    .first()
    .boundingBox()
  expect(downloadBounds!.x + downloadBounds!.width).toBeLessThanOrEqual(390)
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-backups-mobile.png',
    fullPage: true,
  })
})

test('a lost restore response is reconciled to its recorded successful result', async ({
  page,
  context,
}) => {
  await loginOwner(context.request)
  const { job } = await (
    await context.request.post('/api/studio/backups/', {
      headers,
      data: { action: 'export' },
    })
  ).json()
  const bytes = await (
    await context.request.get(`/api/studio/backups/${job.id}/`)
  ).body()
  await page.goto('/admin/backups/')
  await page.getByLabel('Tệp sao lưu').setInputFiles({
    name: 'backup.sqlite',
    mimeType: 'application/vnd.sqlite3',
    buffer: bytes,
  })
  await page
    .getByRole('button', { name: 'Kiểm tra bản sao', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Bản sao đã kiểm tra' }),
  ).toBeVisible()
  let markDropped!: () => void
  let failDrop!: (error: unknown) => void
  const responseDropped = new Promise<void>((resolve, reject) => {
    markDropped = resolve
    failDrop = reject
  })
  await page.route('**/api/studio/backups/', async (route) => {
    if (
      route.request().method() === 'POST' &&
      route.request().postDataJSON()?.action === 'restore'
    ) {
      try {
        const response = await route.fetch({ timeout: 20000 })
        expect(response.status()).toBe(200)
        await route.abort('failed')
        markDropped()
      } catch (error) {
        failDrop(error)
      }
    } else await route.continue()
  })
  await page
    .getByLabel('Xác nhận khôi phục', { exact: true })
    .fill('KHOI PHUC WEBSITE')
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Khôi phục website', exact: true })
    .click()
  // Recovery is measured after the fixture actually drops the committed response.
  await responseDropped
  await expect(page.getByRole('status')).toContainText('Đã khôi phục')
  await expect(
    page
      .getByRole('link', { name: 'Bản sao trước khôi phục', exact: true })
      .first(),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Khôi phục website', exact: true }),
  ).toHaveCount(0)
})

test('backup HTTP rejects unauthorized, cross-origin and corrupt requests and blocks a stale restore review', async ({
  page,
  context,
  browser,
}) => {
  const anonymous = await browser.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  expect((await anonymous.request.get('/api/studio/backups/')).status()).toBe(
    401,
  )
  expect(
    (
      await anonymous.request.post('/api/studio/backups/', {
        headers,
        data: { action: 'export' },
      })
    ).status(),
  ).toBe(401)
  await anonymous.close()
  expect(
    (
      await context.request.post('/api/studio/backups/', {
        headers: { Origin: 'https://outside.invalid' },
        data: { action: 'export' },
      })
    ).status(),
  ).toBe(403)
  expect(
    (
      await context.request.post('/api/studio/backups/', {
        headers: { ...headers, 'Content-Type': 'application/vnd.sqlite3' },
        data: Buffer.from('bad'),
      })
    ).status(),
  ).toBe(400)
  const { job } = await (
    await context.request.post('/api/studio/backups/', {
      headers,
      data: { action: 'export' },
    })
  ).json()
  const archive = await context.request.get(`/api/studio/backups/${job.id}/`)
  expect(archive.headers()['cache-control']).toBe('private, no-store')
  const bytes = await archive.body()
  await page.goto('/admin/backups/')
  await page.getByLabel('Tệp sao lưu').setInputFiles({
    name: 'backup.sqlite',
    mimeType: 'application/vnd.sqlite3',
    buffer: bytes,
  })
  await page
    .getByRole('button', { name: 'Kiểm tra bản sao', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Bản sao đã kiểm tra' }),
  ).toBeVisible()
  const { documents } = await (
    await context.request.get('/api/studio/content/')
  ).json()
  const id = documents.find(
    (item: { path: string }) => item.path === '/gioi-thieu',
  ).id
  const { document } = await (
    await context.request.get(`/api/studio/content/${id}/`)
  ).json()
  const changed = structuredClone(document.draft)
  changed.data.title = 'Thay đổi sau kiểm tra bản sao'
  expect(
    (
      await context.request.patch(`/api/studio/content/${id}/`, {
        headers,
        data: { action: 'save', version: document.version, payload: changed },
      })
    ).status(),
  ).toBe(200)
  await page
    .getByLabel('Xác nhận khôi phục', { exact: true })
    .fill('KHOI PHUC WEBSITE')
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Khôi phục website', exact: true })
    .click()
  await expect(page.locator('.studio-error[role=alert]')).toContainText(
    'Website đã thay đổi',
  )
  await expect(
    page.getByRole('button', { name: 'Khôi phục website', exact: true }),
  ).toBeDisabled()
  expect(
    (await (await context.request.get(`/api/studio/content/${id}/`)).json())
      .document.draft.data.title,
  ).toBe(changed.data.title)
  const email = `backup-editor-${Date.now()}@example.test`,
    password = 'Editor-password-782!'
  expect(
    (
      await context.request.post('/api/studio/users/', {
        headers,
        data: { name: 'Backup editor', email, password, role: 'editor' },
      })
    ).status(),
  ).toBe(201)
  const editor = await browser.newContext({ baseURL: 'http://127.0.0.1:4174' })
  expect(
    (
      await editor.request.post('/api/studio/session/', {
        headers,
        data: { email, password },
      })
    ).status(),
  ).toBe(200)
  expect((await editor.request.get('/api/studio/backups/')).status()).toBe(403)
  expect(
    (await editor.request.get(`/api/studio/backups/${job.id}/`)).status(),
  ).toBe(403)
  expect(
    (
      await editor.request.post('/api/studio/backups/', {
        headers,
        data: { action: 'export', role: 'admin' },
      })
    ).status(),
  ).toBe(403)
  expect(
    (
      await editor.request.delete('/api/studio/backups/', {
        headers,
        data: { id: job.id },
      })
    ).status(),
  ).toBe(403)
  await editor.close()
  const current = (
    await (await context.request.get(`/api/studio/content/${id}/`)).json()
  ).document
  expect(
    (
      await context.request.patch(`/api/studio/content/${id}/`, {
        headers,
        data: {
          action: 'save',
          version: current.version,
          payload: document.draft,
        },
      })
    ).status(),
  ).toBe(200)
})

test('every current administration menu destination opens a real authorized workspace', async ({
  page,
}) => {
  await page.goto('/admin/backups/')
  const links = await page
    .getByRole('navigation', { name: 'Quản trị website' })
    .locator('a')
    .evaluateAll((items) => items.map((item) => item.getAttribute('href')!))
  expect(links).toContain('/admin/backups/')
  expect(links.length).toBeGreaterThanOrEqual(9)
  for (const href of links) {
    expect((await page.goto(href))!.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('.studio-login')).toHaveCount(0)
  }
})
