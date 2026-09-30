import { test, expect } from '@playwright/test'

const innerRoutes = [
  '/gioi-thieu', '/nang-luc-van-hanh', '/dich-vu', '/nganh-hang',
  '/quy-trinh', '/chi-phi-chung-tu', '/kien-thuc', '/hoi-dap', '/lien-he',
  '/chinh-sach/bao-mat', '/chinh-sach/dieu-khoan', '/chinh-sach/dich-vu',
  '/dich-vu/nhap-khau-chinh-ngach', '/dich-vu/uy-thac-nhap-khau',
  '/dich-vu/van-chuyen-trung-viet', '/dich-vu/gom-hang-kiem-dem',
  '/dich-vu/tim-nguon-kiem-tra-nha-cung-cap', '/dich-vu/thu-tuc-hai-quan',
  '/nganh-hang/gia-dung-noi-that', '/nganh-hang/may-moc-day-chuyen',
  '/nganh-hang/gia-dung-noi-that/gia-dung-khong-dien',
  '/nganh-hang/gia-dung-noi-that/noi-that-phu-kien',
  '/nganh-hang/may-moc-day-chuyen/may-moc-moi', '/kien-thuc/chuan-bi-thong-tin-lo-hang',
  '/kien-thuc/doc-bao-gia-nhap-khau',
]

for (const route of innerRoutes) {
  test(`public route ${route} has one heading, canonical and direct contact`, async ({ page }) => {
    const response = await page.goto(route)
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).not.toBeEmpty()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://nhaphangchinhngach.vn${route}/`)
    await expect(page.locator('main a[href="tel:+84976005335"]').first()).toBeVisible()
    await expect(page.locator('input[type="email"], input[type="tel"], textarea')).toHaveCount(0)
  })
}

test('knowledge search handles Vietnamese accents, URL state, categories and empty results', async ({ page }) => {
  await page.goto('/kien-thuc')
  await page.getByRole('searchbox', { name: 'Tìm bài viết' }).fill('DOC BAO GIA')
  await page.getByRole('button', { name: 'Tìm kiếm' }).click()
  await expect(page.locator('[data-knowledge-results] article')).toHaveCount(1)
  await expect(page.locator('[data-knowledge-results]')).toContainText('Đọc báo giá nhập khẩu')
  expect(new URL(page.url()).searchParams.get('q')).toBe('DOC BAO GIA')
  await page.reload()
  await expect(page.getByRole('searchbox')).toHaveValue('DOC BAO GIA')
  await page.getByRole('searchbox').fill('')
  await page.getByLabel('Chủ đề').selectOption('chuan-bi')
  await page.getByRole('button', { name: 'Tìm kiếm' }).click()
  await expect(page.locator('[data-knowledge-results] article')).toHaveCount(1)
  await expect(page.locator('[data-knowledge-results]')).toContainText('Chuẩn bị thông tin lô hàng')
  await page.getByRole('searchbox').fill('khongcobaivietnay')
  await page.getByRole('button', { name: 'Tìm kiếm' }).click()
  await expect(page.locator('[data-knowledge-results] article')).toHaveCount(0)
  await expect(page.getByRole('status')).toContainText('0 bài viết')
  await page.getByRole('link', { name: 'Xóa bộ lọc' }).click()
  await expect(page.locator('[data-knowledge-results] article')).toHaveCount(2)
})

test('knowledge search remains functional without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/kien-thuc?q=doc+bao+gia&category=chi-phi')
  await expect(page.locator('[data-knowledge-results] article')).toHaveCount(1)
  await expect(page.getByRole('searchbox')).toHaveValue('doc bao gia')
  await context.close()
})

test('brief copy reports success only after a successful clipboard write', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (text: string) => { (window as any).__copiedBrief = text },
    } })
  })
  await page.goto('/lien-he')
  await page.getByRole('button', { name: 'Sao chép nội dung chuẩn bị' }).click()
  await expect(page.getByRole('status')).toContainText('Đã sao chép')
  const copied = await page.evaluate(() => (window as any).__copiedBrief)
  expect(copied).toContain('Nơi giao tại Việt Nam:')
  expect(copied).toContain('Sản phẩm')
})

test('denied clipboard leaves a selectable brief and an honest error', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new DOMException('Denied', 'NotAllowedError') },
    } })
  })
  await page.goto('/lien-he')
  await page.getByRole('button', { name: 'Sao chép nội dung chuẩn bị' }).click()
  await expect(page.getByRole('status')).toContainText('Chưa sao chép được')
  await expect(page.getByRole('region', { name: 'Nội dung chuẩn bị' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Nội dung chuẩn bị' })).toBeFocused()
  await expect(page.getByRole('status')).not.toContainText('Đã sao chép')
})

test('unknown content returns 404 and legacy service redirects remain usable', async ({ page }) => {
  for (const section of ['dich-vu', 'nganh-hang', 'kien-thuc']) {
    const response = await page.goto(`/${section}/khong-ton-tai`)
    expect(response?.status()).toBe(404)
  }
  await page.goto('/dich-vu/gom-hang-le-ghep-container')
  await expect(page).toHaveURL(/\/dich-vu\/gom-hang-kiem-dem\/?$/)
  for (const [legacy, target] of [
    ['/nganh-hang/gia-dung-khong-dien/', '/nganh-hang/gia-dung-noi-that/gia-dung-khong-dien/'],
    ['/nganh-hang/noi-that-phu-kien/', '/nganh-hang/gia-dung-noi-that/noi-that-phu-kien/'],
    ['/nganh-hang/may-moc-moi/', '/nganh-hang/may-moc-day-chuyen/may-moc-moi/'],
  ]) {
    const response = await page.request.get(legacy, { maxRedirects: 0 })
    expect(response.status(), legacy).toBe(308)
    expect(new URL(response.headers().location, 'http://127.0.0.1:4173').pathname, legacy).toBe(target)
  }
  expect((await page.goto('/nganh-hang/may-moc-day-chuyen/gia-dung-khong-dien/'))?.status()).toBe(404)
  await page.goto('/nhap-khau-chinh-ngach')
  await expect(page).toHaveURL(/\/dich-vu\/nhap-khau-chinh-ngach\/?$/)
  await expect(page.locator('form')).toHaveCount(0)
})

test('FAQ expands with the keyboard', async ({ page }) => {
  await page.goto('/hoi-dap')
  const question = page.locator('main details').first()
  await question.locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(question).toHaveAttribute('open', '')
  await page.keyboard.press('Enter')
  await expect(question).not.toHaveAttribute('open', '')
})

test('tables and preparation content stay within narrow mobile pages', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 })
  for (const path of ['/dich-vu/van-chuyen-trung-viet', '/chi-phi-chung-tu', '/kien-thuc', '/lien-he']) {
    await page.goto(path)
    const width = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }))
    expect(width.content, path).toBeLessThanOrEqual(width.viewport)
  }
})
