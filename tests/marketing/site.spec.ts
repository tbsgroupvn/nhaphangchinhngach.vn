import { test, expect } from '@playwright/test'

test('home establishes TBS identity and offers contact without collecting a lead', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('TBS GROUP')
  await expect(
    page.locator('main a[href="tel:+84976005335"]').first(),
  ).toBeVisible()
  await expect(
    page.locator('main a[href="https://zalo.me/0976005335"]').first(),
  ).toBeVisible()
  await expect(
    page.locator('input[type="email"], input[type="tel"], textarea'),
  ).toHaveCount(0)
  const schema = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents()
  expect(schema.join('')).not.toContain('123 Đường ABC')
})

test('mobile menu supports keyboard dismissal and does not overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Mở menu' })
  await menu.click()
  await expect(page.getByRole('dialog', { name: 'Điều hướng' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Điều hướng' })).toHaveCount(0)
  await expect(menu).toBeFocused()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('service, knowledge and contact journeys provide distinct usable pages', async ({
  page,
}) => {
  for (const path of [
    '/dich-vu/uy-thac-nhap-khau/',
    '/nganh-hang/may-moc-day-chuyen/may-moc-moi/',
    '/chi-phi-chung-tu/',
    '/kien-thuc/chuan-bi-thong-tin-lo-hang/',
    '/lien-he/',
  ]) {
    const response = await page.goto(path)
    expect(response?.status(), path).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('form:has(input[type="tel"])')).toHaveCount(0)
  }
  const missing = await page.goto('/dich-vu/khong-ton-tai/')
  expect(missing?.status()).toBe(404)
})

test('logistics stage control changes readable content and reduced-motion stays usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const journey = page.locator('#hanh-trinh')
  await journey.scrollIntoViewIfNeeded()
  await journey.getByRole('button', { name: /Giao hàng/ }).click()
  await expect(
    journey.getByRole('button', { name: /Giao hàng/ }),
  ).toHaveAttribute('aria-pressed', 'true')
  await expect(journey.locator('[data-journey-detail]')).toContainText(
    /giao|bàn giao/i,
  )
})

test('contact primary link has a distinct foreground and background', async ({
  page,
}) => {
  await page.goto('/lien-he/')
  const colors = await page
    .locator('[data-placement="contact-main"][data-contact="phone"]')
    .evaluate((element) => ({
      color: getComputedStyle(element).color,
      background: getComputedStyle(element).backgroundColor,
    }))
  expect(colors.color).not.toBe(colors.background)
})

test('sales can share a direct FAQ link that opens the answer', async ({
  page,
}) => {
  await page.goto('/hoi-dap/')
  const link = page.getByRole('link', { name: /^Liên kết câu hỏi:/ }).first()
  const href = await link.getAttribute('href')
  expect(href).toMatch(/^#faq-/)
  await page.goto(`/hoi-dap/${href}`)
  await expect(page.locator(`details${href}`)).toHaveAttribute('open', '')
  await expect(page.locator(`details${href} p`).first()).toBeVisible()
})
