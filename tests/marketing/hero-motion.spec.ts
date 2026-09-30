import { test, expect } from '@playwright/test'

test('cinematic entrance can replay without blocking direct contact', async ({
  page,
}) => {
  await page.goto('/')
  const hero = page.locator('.tbs-hero')
  await expect(hero).toHaveAttribute('data-hero-state', 'ready')
  await hero.getByRole('button', { name: 'Xem lại hiệu ứng mở đầu' }).click()
  await expect(hero).toHaveAttribute('data-hero-state', 'playing')
  await hero.locator('[data-contact="phone"]').click({ trial: true })
  await expect(hero.locator('h1')).toContainText('TBS GROUP')
  const firstFrame = await hero
    .locator('.tbs-hero-image')
    .evaluate((el) => getComputedStyle(el).transform)
  await expect
    .poll(() =>
      hero
        .locator('.tbs-hero-image')
        .evaluate((el) => getComputedStyle(el).transform),
    )
    .not.toBe(firstFrame)
  await page.screenshot({ path: 'artifacts/screenshots/hero-entrance.png' })
  await expect(hero).toHaveAttribute('data-hero-state', 'ready')
  await expect(hero.locator('.tbs-hero-word').first()).toHaveCSS('opacity', '1')
  await expect(hero.locator('.tbs-hero-shutters')).toHaveCSS(
    'pointer-events',
    'none',
  )
  await page.screenshot({ path: 'artifacts/screenshots/hero-settled.png' })
})

test('desktop hero depth responds to the pointer and resets on leave', async ({
  page,
}) => {
  await page.goto('/')
  const hero = page.locator('.tbs-hero')
  await expect(hero).toHaveAttribute('data-hero-state', 'ready')
  await expect(hero).toHaveAttribute('data-hero-mode', 'desktop')
  const depth = hero.locator('.tbs-hero-depth')
  const offset = () =>
    depth.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)
  const bounds = (await hero.boundingBox())!
  await page.mouse.move(bounds.x + bounds.width * 0.85, bounds.y + 100)
  await expect.poll(offset).toBeGreaterThan(3)
  await page.mouse.move(5, 5)
  await expect.poll(offset).toBeCloseTo(0, 1)
})

test('changing reduced motion stops and restores the complete static hero', async ({
  page,
}) => {
  await page.goto('/')
  const hero = page.locator('.tbs-hero')
  await expect(hero).toHaveAttribute('data-hero-state', 'ready')
  await hero.getByRole('button', { name: 'Xem lại hiệu ứng mở đầu' }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(hero).toHaveAttribute('data-hero-state', 'reduced')
  await expect(hero.locator('.tbs-hero-image')).toHaveCSS('transform', 'none')
  await expect(hero.locator('.tbs-hero-depth')).toHaveCSS('transform', 'none')
  await expect(hero.locator('.tbs-hero-word').first()).toHaveCSS('opacity', '1')
  await expect(
    hero.getByRole('button', { name: 'Xem lại hiệu ứng mở đầu' }),
  ).toHaveCount(0)
  await hero.locator('[data-contact="phone"]').click({ trial: true })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(hero).toHaveAttribute('data-hero-state', 'ready')
})

test('touch devices get a short entrance without pointer parallax', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/')
  const hero = page.locator('.tbs-hero')
  await expect(hero).toHaveAttribute('data-hero-mode', 'touch')
  await expect(hero).toHaveAttribute('data-hero-state', 'ready')
  await hero.dispatchEvent('pointermove', {
    clientX: 360,
    clientY: 220,
    pointerType: 'touch',
  })
  await expect(hero.locator('.tbs-hero-depth')).toHaveCSS('transform', 'none')
  await expect(hero.locator('h1')).toBeVisible()
  await page.screenshot({ path: 'artifacts/screenshots/hero-touch.png' })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await context.close()
})

test('hero animation cleans up across client navigation', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('.tbs-hero')).toHaveAttribute(
    'data-hero-state',
    'ready',
  )
  await page.locator('.tbs-desktop-nav a[href="/dich-vu/"]').click()
  await expect(page).toHaveURL(/\/dich-vu\/?$/)
  await page.locator('.tbs-brand').click()
  await expect(page.locator('.tbs-hero')).toHaveAttribute(
    'data-hero-state',
    'ready',
  )
  await expect(
    page.getByRole('button', { name: 'Xem lại hiệu ứng mở đầu' }),
  ).toHaveCount(1)
  expect(errors).toEqual([])
})

test('keyboard replay retains focus and cannot restart while already playing', async ({
  page,
}) => {
  await page.goto('/')
  const hero = page.locator('.tbs-hero')
  const replay = hero.getByRole('button', { name: 'Xem lại hiệu ứng mở đầu' })
  await expect(hero).toHaveAttribute('data-hero-state', 'ready')
  await replay.focus()
  await page.keyboard.press('Enter')
  await expect(hero).toHaveAttribute('data-hero-state', 'playing')
  await expect(replay).toBeFocused()
  await expect(replay).toHaveAttribute('aria-disabled', 'true')
  await page.keyboard.press('Enter')
  await expect(hero).toHaveAttribute('data-hero-state', 'ready')
  await expect(replay).toBeFocused()
  await expect(replay).toHaveAttribute('aria-disabled', 'false')
  await page.keyboard.press('Enter')
  await expect(hero).toHaveAttribute('data-hero-state', 'playing')
})
