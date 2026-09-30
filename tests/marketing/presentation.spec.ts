import { test, expect } from '@playwright/test'

for (const viewport of [
  { width: 320, height: 740 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
  { width: 1920, height: 1080 },
]) {
  test(`home assets and layout at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/')
    await expect(page.locator('.tbs-hero-image')).toBeVisible()
    const heroImage = await page
      .locator('.tbs-hero-image')
      .evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      )
    expect(heroImage).toBe(true)
    const heroBounds = await page.locator('.tbs-hero').boundingBox()
    const dock = await page.locator('.tbs-mobile-dock').boundingBox()
    expect(heroBounds!.y + heroBounds!.height).toBeLessThan(
      dock?.y ?? viewport.height,
    )
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width)
    await page.screenshot({
      path: `artifacts/screenshots/home-${viewport.width}.png`,
    })
    await page.locator('footer').scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        page
          .locator('footer img')
          .evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
      )
      .toBe(true)
    expect(errors).toEqual([])
  })
}

test('core home content and contact survive JavaScript disabled', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/')
  await expect(page.locator('h1')).toContainText('TBS GROUP')
  await expect(
    page.locator('main a[href="tel:+84976005335"]').first(),
  ).toBeVisible()
  await expect(
    page.locator('main a[href="https://zalo.me/0976005335"]').first(),
  ).toBeVisible()
  await expect(page.locator('.tbs-service-item')).toHaveCount(6)
  await expect(page.getByTestId('journey-fallback')).toBeVisible()
  await context.close()
})

test('local preview stays noindex and does not inject tracking scripts', async ({
  page,
  request,
}) => {
  await page.goto('/')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  )
  await expect(
    page.locator(
      'script[src*="googletagmanager"],script[src*="clarity.ms"],script[src*="google-analytics"]',
    ),
  ).toHaveCount(0)
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Disallow: /')
})

test('small brand labels remain readable against the soft section background', async ({
  page,
}) => {
  await page.goto('/')
  const colors = await page.locator('.tbs-journey').evaluate((section) => ({
    text: getComputedStyle(section.querySelector('.journey-eyebrow')!).color,
    background: getComputedStyle(section).backgroundColor,
  }))
  const luminance = (color: string) => {
    const linear = color
      .match(/\d+/g)!
      .slice(0, 3)
      .map((value) => Number(value) / 255)
      .map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      )
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
  }
  const values = [luminance(colors.text), luminance(colors.background)].sort(
    (a, b) => b - a,
  )
  expect((values[0] + 0.05) / (values[1] + 0.05)).toBeGreaterThanOrEqual(4.5)
})
