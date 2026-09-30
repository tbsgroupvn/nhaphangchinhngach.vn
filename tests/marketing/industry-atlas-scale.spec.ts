import { test, expect } from '@playwright/test'

const results = '[data-industry-results]'
const stale = 'http://127.0.0.1:4176'
const unavailable = 'http://127.0.0.1:4177'

test('100-industry hub renders server-side, keeps images lazy and filters quickly and stably', async ({ page }) => {
  const response = await page.goto('/nganh-hang/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('[data-atlas-category]')).toHaveCount(7)
  await expect(page.getByRole('status').filter({ hasText: 'đã xuất bản' })).toContainText('103 ngành hàng')
  const eager = await page.locator('main img').evaluateAll((nodes) =>
    nodes.filter((node) => node.getAttribute('loading') !== 'lazy').length,
  )
  expect(eager).toBeLessThanOrEqual(3)
  expect(await page.locator('main img').count()).toBeLessThan(50)

  const search = page.getByRole('searchbox', { name: 'Tìm ngành hàng' })
  const started = Date.now()
  await search.fill('may det thu')
  await expect(page.locator(`${results} li h3 a`)).toHaveCount(20)
  expect(Date.now() - started).toBeLessThan(2000)
  const first = await page.locator(`${results} li h3 a`).allTextContents()
  await search.fill('')
  await search.fill('may det thu')
  expect(await page.locator(`${results} li h3 a`).allTextContents()).toEqual(first)

  await search.fill('ZZ-PIN-NANG-LUONG-7')
  await expect(page.locator(`${results} li h3 a`).first()).toHaveText('Pin năng lượng thử 7')

  await page.getByLabel('Nhóm ngành', { exact: true }).selectOption('zz-scale-bao-bi')
  await search.fill('')
  await expect(page.locator(`${results} li h3 a`)).toHaveCount(20)
  const images = await page.locator(`${results} img`).evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('loading')),
  )
  expect(images.every((value) => value === 'lazy')).toBe(true)
})

test('JavaScript chunks failing to load leave server content and contact usable', async ({ page }) => {
  await page.route('**/_next/static/chunks/**', (route) => route.abort())
  await page.goto('/nganh-hang/?q=bao+bi')
  await expect(page.locator('[data-atlas-category]')).toHaveCount(7)
  await expect(page.locator(`${results} li h3 a`).first()).toContainText('Bao bì')
  await expect(page.locator('main a[href="tel:+84976005335"]').first()).toBeVisible()
})

test('broken images keep their frame and all text', async ({ page }) => {
  await page.route(/\/_next\/image|\.webp/, (route) => route.fulfill({ status: 404, body: '' }))
  await page.goto('/nganh-hang/')
  const media = page.locator('[data-atlas-category] img').first().locator('..')
  const box = await media.boundingBox()
  expect(box!.height).toBeGreaterThan(100)
  await expect(page.locator('[data-atlas-category] h3').first()).not.toBeEmpty()
})

test('slow navigation never leaves an endless transition cover', async ({ page }) => {
  await page.goto('/nganh-hang/')
  await page.route('**/nganh-hang/zz-scale-may-det/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2500))
    await route.continue()
  })
  await page.locator('[data-atlas-category] h3 a').filter({ hasText: 'Máy dệt' }).click()
  await expect(page.locator('h1')).toHaveText('Nhóm thử Máy dệt', { timeout: 15000 })
  await expect(page.locator('[data-transition-state="departing"]')).toHaveCount(0)
})

test('rebuild failure after a good snapshot serves the last good index publicly and warns in Studio status', async ({ page }) => {
  await page.goto(`${stale}/nganh-hang/?q=bao+bi+thu+20`)
  await expect(page.locator(`${results} li h3 a`).first()).toHaveText('Bao bì thử 20')
  await expect(page.locator(results)).not.toContainText('Đã đổi sau chỉ mục tốt')
  await expect(page.getByRole('alert').filter({ hasText: 'Tìm kiếm tạm thời' })).toHaveCount(0)
  const detail = await page.goto(`${stale}/nganh-hang/zz-scale-bao-bi/bao-bi-020/`)
  expect(detail?.status()).toBe(200)
  await expect(page.locator('main')).toContainText('Đã đổi sau chỉ mục tốt')
})

test('first index failure disables search honestly but keeps category bands and contact', async ({ page }) => {
  const response = await page.goto(`${unavailable}/nganh-hang/?q=bao+bi`)
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('alert').filter({ hasText: 'Tìm kiếm tạm thời chưa sẵn sàng' })).toBeVisible()
  await expect(page.getByText(/0 ngành hàng phù hợp/)).toHaveCount(0)
  await expect(page.getByRole('searchbox', { name: 'Tìm ngành hàng' })).toBeDisabled()
  await expect(page.locator('[data-atlas-category]')).toHaveCount(7)
  await expect(page.locator('main a[href="tel:+84976005335"]').first()).toBeVisible()
})

test('animation API missing still navigates and shows content', async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error mô phỏng trình duyệt thiếu Web Animations API
    delete Element.prototype.animate
  })
  await page.goto('/nganh-hang/')
  await page.locator('[data-atlas-category] h3 a').first().click()
  await expect(page.locator('h1')).not.toHaveText('Bắt đầu từ đặc điểm sản phẩm')
})

test('zoom 200% equivalent (720px CSS width) has no horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 })
  for (const path of ['/nganh-hang/', '/nganh-hang/zz-scale-dien-tu/', '/nganh-hang/zz-scale-dien-tu/dien-tu-001/']) {
    await page.goto(path)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), path).toBeLessThanOrEqual(0)
  }
})

test('Studio shows the stale-index warning to the owner', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: stale })
  const login = await context.request.post('/api/studio/session/', {
    headers: { Origin: stale },
    data: { email: 'atlas@example.test', password: 'Atlas-fixture-password-728!' },
  })
  expect(login.status()).toBe(200)
  const page = await context.newPage()
  await page.goto('/admin/industries/')
  await expect(page.locator('.studio-projection-status')).toContainText('bản tốt gần nhất')
  await context.close()
})
