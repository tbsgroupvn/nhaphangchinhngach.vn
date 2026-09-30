import { test, expect } from '@playwright/test'
import { fixedTemplates } from '../../src/lib/studio/fixed-page-registry'
import type { ContentDocument } from '../../src/lib/studio/content-model'

const origin = { Origin: 'http://127.0.0.1:4174' }
const owner = {
  email: 'owner@example.test',
  password: 'Owner-test-password-728!',
  name: 'Chủ website',
}

test.beforeEach(async ({ context }) => {
  const session = await (
    await context.request.get('/api/studio/session/')
  ).json()
  if (session.setupRequired) {
    const setup = await context.request.post('/api/studio/setup/', {
      headers: origin,
      data: {
        ...owner,
        token: 'isolated-test-bootstrap-token-at-least-32-characters',
      },
    })
    expect(setup.status()).toBe(201)
  }
  const login = await context.request.post('/api/studio/session/', {
    headers: origin,
    data: owner,
  })
  expect(login.status()).toBe(200)
})

test('every fixed template uses private draft preview and explicit publication on its real route', async ({
  page,
  context,
  playwright,
}) => {
  test.setTimeout(120000)
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  const inventory = await (
    await context.request.get('/api/studio/content/')
  ).json()
  const pages = inventory.documents.filter(
    (item: { kind: string }) => item.kind === 'page',
  )
  expect(pages).toHaveLength(13)
  for (const template of fixedTemplates) {
    const item = pages.find(
      (item: { path: string }) => item.path === template.path,
    )
    const endpoint = `/api/studio/content/${item.id}/`
    const original: ContentDocument = (
      await (await context.request.get(endpoint)).json()
    ).document
    if (original.draft.kind !== 'page') throw new Error('Expected fixed page')
    const marker = `Biên tập được ${template.slug}`
    const fields = Object.fromEntries(
      template.fields.map((field, index) => [
        field.key,
        field.kind === 'image'
          ? '/images/marketing/sourcing.webp'
          : field.kind === 'link'
            ? `/lien-he/#cms-${template.slug}-${index}`
            : `${marker} ${index}`,
      ]),
    )
    const payload = {
      ...original.draft,
      data: {
        ...original.draft.data,
        title: marker,
        summary: `${marker} description`,
        image: '/images/marketing/sourcing.webp',
        fields,
      },
      seo: { ...original.draft.seo, title: `SEO ${marker}` },
    }
    const saved = await context.request.patch(endpoint, {
      headers: origin,
      data: { action: 'save', version: original.version, payload },
    })
    expect(saved.status()).toBe(200)
    const draft = (await saved.json()).document
    const path = template.path === '/' ? '/' : template.path + '/'
    expect(await (await anonymous.get(path)).text()).not.toContain(marker)
    const previewPath = `/studio-preview/${item.id}/`
    const denied = await anonymous.get(previewPath, { maxRedirects: 0 })
    expect(denied.status()).toBe(307)
    expect(await denied.text()).not.toContain(marker)
    const preview = await context.request.get(previewPath)
    expect(preview.status()).toBe(200)
    expect(preview.headers()['cache-control']).toContain('no-store')
    expect(preview.headers()['x-robots-tag']).toContain('noindex')
    expect(await preview.text()).toContain(marker)
    await page.goto(previewPath)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('main')).toContainText(marker)
    const renderedDraft = await page.locator('main').evaluate(
      (main) =>
        `${main.textContent}\n${Array.from(main.querySelectorAll('*'))
          .flatMap((node) =>
            Array.from(node.attributes).map((attribute) => attribute.value),
          )
          .join('\n')}`,
    )
    for (const field of template.fields)
      expect(
        renderedDraft,
        `Draft slot ${template.slug}/${field.key}`,
      ).toContain(fields[field.key])
    const publish = await context.request.patch(endpoint, {
      headers: origin,
      data: { action: 'publish', version: draft.version },
    })
    expect(publish.status()).toBe(200)
    const published = (await publish.json()).document
    await page.goto(path)
    await expect(page.locator('main')).toContainText(marker)
    await expect(page).toHaveTitle(new RegExp(`SEO ${marker}`))
    const renderedLive = await page.locator('main').evaluate(
      (main) =>
        `${main.textContent}\n${Array.from(main.querySelectorAll('*'))
          .flatMap((node) =>
            Array.from(node.attributes).map((attribute) => attribute.value),
          )
          .join('\n')}`,
    )
    for (const field of template.fields)
      expect(
        renderedLive,
        `Published slot ${template.slug}/${field.key}`,
      ).toContain(fields[field.key])
    await expect(
      page.locator('main img[src*="sourcing.webp"]').first(),
    ).toBeVisible()
    // Restore the exact original data so subsequent public regression tests remain meaningful.
    const restored = await context.request.patch(endpoint, {
      headers: origin,
      data: {
        action: 'save',
        version: published.version,
        payload: original.draft,
      },
    })
    expect(restored.status()).toBe(200)
    const restoredDocument = (await restored.json()).document
    expect(
      (
        await context.request.patch(endpoint, {
          headers: origin,
          data: { action: 'publish', version: restoredDocument.version },
        })
      ).status(),
    ).toBe(200)
  }
  await anonymous.dispose()
})

test('fixed editor supports searching fields, saved full-layout preview and mobile editing', async ({
  page,
  context,
}) => {
  const inventory = await (
    await context.request.get('/api/studio/content/')
  ).json()
  const about = inventory.documents.find(
    (item: { path: string }) => item.path === '/gioi-thieu',
  )
  expect(about).toBeDefined()
  await page.goto(`/admin/content/${about.id}/`)
  await expect(page.getByLabel('Đường dẫn', { exact: true })).toHaveCount(0)
  await page.getByLabel('Tìm trường nội dung').fill('copy-3')
  const searchIcon = await page
    .locator('.studio-fixed-copy .studio-search svg')
    .boundingBox()
  const searchInput = await page.getByLabel('Tìm trường nội dung').boundingBox()
  expect(
    Math.abs(
      searchIcon!.y +
        searchIcon!.height / 2 -
        searchInput!.y -
        searchInput!.height / 2,
    ),
  ).toBeLessThanOrEqual(3)
  const field = page.locator('[data-copy-key="copy-3"]')
  await expect(field).toBeVisible()
  await field.fill(
    'Đoạn giới thiệu mới để kiểm thử việc biên tập trang cố định.',
  )
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  await page.reload()
  await page.getByLabel('Tìm trường nội dung').fill('copy-3')
  await expect(field).toHaveValue(
    'Đoạn giới thiệu mới để kiểm thử việc biên tập trang cố định.',
  )
  await page.screenshot({
    path: 'artifacts/screenshots/studio-fixed-desktop.png',
  })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-fixed-mobile.png',
  })
  const popupEvent = page.waitForEvent('popup')
  await page.getByRole('link', { name: 'Xem bản nháp đã lưu' }).click()
  const preview = await popupEvent
  await expect(preview.locator('main')).toContainText(
    'Đoạn giới thiệu mới để kiểm thử việc biên tập trang cố định.',
  )
  await expect(preview.locator('h1')).toHaveCount(1)
  await expect(preview.locator('.tbs-header')).toBeVisible()
  await preview.screenshot({
    path: 'artifacts/screenshots/studio-fixed-preview.png',
  })
  await preview.close()
})

test('SEO role can save metadata for review without editing content or publishing', async ({
  page,
  context,
  browser,
}) => {
  const credentials = {
    email: 'seo@example.test',
    password: 'Seo-test-password-728!',
  }
  expect(
    (
      await context.request.post('/api/studio/users/', {
        headers: origin,
        data: { ...credentials, name: 'SEO TBS', role: 'seo' },
      })
    ).status(),
  ).toBe(201)
  const inventory = await (
    await context.request.get('/api/studio/content/')
  ).json()
  const item = inventory.documents.find(
    (item: { path: string }) => item.path === '/quy-trinh',
  )
  const endpoint = `/api/studio/content/${item.id}/`
  const original = (await (await context.request.get(endpoint)).json()).document
  const specialist = await browser.newContext({
    baseURL: 'http://127.0.0.1:4174',
    viewport: { width: 1440, height: 1000 },
  })
  expect(
    (
      await specialist.request.post('/api/studio/session/', {
        headers: origin,
        data: credentials,
      })
    ).status(),
  ).toBe(200)
  const editor = await specialist.newPage()
  await editor.goto(`/admin/content/${item.id}/`)
  await editor.getByRole('tab', { name: 'SEO', exact: true }).click()
  await expect(editor.getByLabel('SEO title')).toBeEnabled()
  await editor
    .getByLabel('SEO title')
    .fill('Quy trình nhập hàng · SEO đã duyệt')
  await editor
    .getByLabel('Meta description')
    .fill(
      'Mô tả SEO được cập nhật từ tài khoản chuyên viên, chờ quản trị viên xuất bản.',
    )
  await editor.getByLabel('Canonical', { exact: true }).fill('/gioi-thieu')
  await editor
    .getByLabel('Ảnh Open Graph', { exact: true })
    .fill('/images/marketing/sourcing.webp')
  await editor.getByLabel('Không lập chỉ mục trang này').check()
  await editor
    .getByRole('button', { name: 'Lưu bản nháp', exact: true })
    .click()
  await expect(editor.getByRole('status')).toContainText('Đã lưu')
  await expect(
    editor.getByRole('button', { name: 'Xuất bản', exact: true }),
  ).toHaveCount(0)
  await editor.reload()
  await expect(editor.getByLabel('SEO title')).toHaveValue(
    'Quy trình nhập hàng · SEO đã duyệt',
  )
  await editor.screenshot({
    path: 'artifacts/screenshots/studio-seo-specialist.png',
  })
  await editor.getByRole('tab', { name: 'Nội dung', exact: true }).click()
  await expect(editor.getByLabel('Tiêu đề', { exact: true })).toBeDisabled()
  const saved = (await (await specialist.request.get(endpoint)).json()).document
  expect(saved.draft.data).toEqual(original.draft.data)
  expect(saved.published.seo).toEqual(original.published.seo)
  expect(
    (
      await specialist.request.patch(endpoint, {
        headers: { ...origin, 'x-user-role': 'admin' },
        data: {
          action: 'save',
          version: saved.version,
          payload: original.draft,
        },
      })
    ).status(),
  ).toBe(403)
  expect(
    (
      await specialist.request.patch(endpoint, {
        headers: origin,
        data: { action: 'publish', version: saved.version },
      })
    ).status(),
  ).toBe(403)
  expect(
    (
      await specialist.request.patch(endpoint, {
        headers: origin,
        data: {
          action: 'save-seo',
          version: saved.version,
          seo: saved.draft.seo,
          payload: original.draft,
        },
      })
    ).status(),
  ).toBe(400)
  expect(
    (
      await context.request.patch(endpoint, {
        headers: origin,
        data: { action: 'publish', version: saved.version },
      })
    ).status(),
  ).toBe(200)
  await page.goto('/quy-trinh/')
  await expect(page).toHaveTitle(
    'Quy trình nhập hàng · SEO đã duyệt | TBS GROUP',
  )
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    saved.draft.seo.description,
  )
  await expect(page.locator('h1')).toHaveText(original.draft.data.title)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://nhaphangchinhngach.vn/gioi-thieu/',
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://nhaphangchinhngach.vn/images/marketing/sourcing.webp',
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  )
  await specialist.close()
})

test('browser history asks before discarding unsaved copy and can cancel or accept', async ({
  page,
  context,
}) => {
  await page.goto('/admin/content/')
  await page.getByLabel('Tìm nội dung').fill('/gioi-thieu')
  await page
    .getByRole('table')
    .getByRole('link', { name: 'TBS GROUP', exact: true })
    .click()
  await expect(page).toHaveURL(/\/admin\/content\/[a-f0-9-]{36}\/$/)
  const editorUrl = page.url()
  await page.getByLabel('Tiêu đề', { exact: true }).fill('Thay đổi chưa lưu')
  const dialogs: string[] = []
  page.on('dialog', (dialog) => {
    dialogs.push(dialog.message())
    return dialog.dismiss()
  })
  await page.evaluate(() => history.back())
  await expect.poll(() => dialogs.length).toBe(1)
  await expect(page).toHaveURL(editorUrl)
  await expect(page.getByLabel('Tiêu đề', { exact: true })).toHaveValue(
    'Thay đổi chưa lưu',
  )
  await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
  expect(dialogs).toHaveLength(2)
  expect(
    (await (await context.request.get('/api/studio/session/')).json()).user,
  ).not.toBeNull()
  await expect(page.getByLabel('Tiêu đề', { exact: true })).toHaveValue(
    'Thay đổi chưa lưu',
  )
  page.removeAllListeners('dialog')
  page.once('dialog', (dialog) => dialog.accept())
  await page.evaluate(() => history.back())
  await expect(page).toHaveURL(/\/admin\/content\/$/)
  await page.evaluate(() => history.forward())
  await expect(page).toHaveURL(editorUrl)
  await expect(page.getByLabel('Tiêu đề', { exact: true })).not.toHaveValue(
    'Thay đổi chưa lưu',
  )
})
