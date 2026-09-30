import { test, expect } from '@playwright/test'

test('navigation remains usable when the browser animation API is unavailable', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Element.prototype, 'animate', {
      configurable: true,
      value: undefined,
    })
  })
  await page.goto('/gioi-thieu')
  await page.locator('.tbs-desktop-nav a[href="/dich-vu/"]').click()
  await expect(page).toHaveURL(/\/dich-vu\/?$/)
  await expect(page.locator('.tbs-page-transition')).toHaveCSS(
    'visibility',
    'hidden',
  )
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  await page.locator('.tbs-header-phone').click({ trial: true })
})

test('internal navigation plays a branded wipe without blocking the header', async ({
  page,
}) => {
  await page.goto('/gioi-thieu')
  const transition = page.locator('.tbs-page-transition')
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  // Sample from the actual click so tool round-trips cannot miss the short wipe.
  await page.evaluate(() => {
    const host = window as typeof window & { routeMotionSamples?: string[] }
    host.routeMotionSamples = []
    document.addEventListener('click', () => {
      const start = performance.now()
      const sample = () => {
        const overlay = document.querySelector<HTMLElement>('.tbs-page-transition')
        const layer = overlay?.querySelector('.tbs-transition-layer:last-child')
        if (layer && overlay?.dataset.transitionState !== 'idle') host.routeMotionSamples!.push(getComputedStyle(layer).transform)
        if (performance.now() - start < 1600) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    }, { once: true, capture: true })
  })
  await page.locator('.tbs-desktop-nav a[href="/dich-vu/"]').click()
  await expect(transition).toHaveAttribute(
    'data-transition-state',
    /departing|revealing/,
  )
  await expect(transition).toHaveCSS('pointer-events', 'none')
  await page.locator('.tbs-header-phone').click({ trial: true })
  await expect
    .poll(() => page.evaluate(() => new Set((window as typeof window & { routeMotionSamples?: string[] }).routeMotionSamples).size))
    .toBeGreaterThan(1)
  await page.screenshot({
    path: 'artifacts/screenshots/route-wipe-desktop.png',
  })
  await expect(page).toHaveURL(/\/dich-vu\/?$/)
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await expect(transition).toHaveCSS('visibility', 'hidden')
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  await expect(page.locator('h1')).toHaveCSS('transform', 'none')
})

test('keyboard navigation and history settle with the destination readable', async ({
  page,
}) => {
  await page.goto('/gioi-thieu')
  const transition = page.locator('.tbs-page-transition')
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.locator('.tbs-desktop-nav a[href="/dich-vu/"]').focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/dich-vu\/?$/)
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.goBack()
  await expect(page).toHaveURL(/\/gioi-thieu\/?$/)
  await expect(transition).toHaveAttribute(
    'data-transition-state',
    /departing|revealing/,
  )
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.goForward()
  await expect(page).toHaveURL(/\/dich-vu\/?$/)
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await expect(page.locator('h1')).toBeVisible()
  await expect(page.locator('main')).not.toHaveAttribute('aria-hidden', 'true')
})

test('repeated navigation cancels the old animation and follows the latest destination', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/gioi-thieu')
  const transition = page.locator('.tbs-page-transition')
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.locator('.tbs-desktop-nav a[href="/dich-vu/"]').click()
  await page.locator('.tbs-desktop-nav a[href="/nganh-hang/"]').click()
  await page.locator('.tbs-desktop-nav a[href="/lien-he/"]').click()
  await expect(page).toHaveURL(/\/lien-he\/?$/)
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  expect(errors).toEqual([])
})

test('reduced motion skips wipes and a live preference change cancels an active wipe', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/gioi-thieu')
  const transition = page.locator('.tbs-page-transition')
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.locator('.tbs-desktop-nav a[href="/dich-vu/"]').click()
  await expect(page).toHaveURL(/\/dich-vu\/?$/)
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await expect(page.locator('h1')).toHaveCSS('transform', 'none')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.locator('.tbs-desktop-nav a[href="/gioi-thieu/"]').click()
  await expect(transition).toHaveAttribute(
    'data-transition-state',
    /departing|revealing/,
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await expect(transition).toHaveCSS('visibility', 'hidden')
  await expect(page.locator('h1')).toHaveCSS('transform', 'none')
})

test('same-page anchors, contact and modified clicks do not start a page wipe', async ({
  page,
}) => {
  await page.goto('/hoi-dap')
  const transition = page.locator('.tbs-page-transition')
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.evaluate(() => {
    // Suppress external actions in the test, after the transition's capture listener.
    document.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    })
  })
  await page.locator('.tbs-header-phone').click()
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.locator('.tbs-skip').focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#noi-dung$/)
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page
    .locator('.tbs-desktop-nav a[href="/dich-vu/"]')
    .dispatchEvent('click', { ctrlKey: true })
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
})

test('mobile menu navigation uses a short wipe and leaves direct contact available', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/gioi-thieu')
  const transition = page.locator('.tbs-page-transition')
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.getByRole('button', { name: 'Mở menu' }).click()
  await page
    .getByRole('navigation', { name: 'Điều hướng di động' })
    .getByRole('link', { name: 'Dịch vụ' })
    .click()
  await expect(transition).toHaveAttribute(
    'data-transition-state',
    /departing|revealing/,
  )
  await page.screenshot({
    path: 'artifacts/screenshots/route-wipe-mobile.png',
  })
  const dockOrder = await page
    .locator('.tbs-mobile-dock')
    .evaluate((el) => Number(getComputedStyle(el).zIndex))
  const curtainOrder = await transition.evaluate((el) =>
    Number(getComputedStyle(el).zIndex),
  )
  expect(
    dockOrder,
    'Opaque transition layers must stay behind the contact dock',
  ).toBeGreaterThan(curtainOrder)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page).toHaveURL(/\/dich-vu\/?$/)
  await expect(transition).toHaveAttribute('data-transition-state', 'idle')
  await page.locator('.tbs-mobile-dock a[href^="tel:"]').click({ trial: true })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await context.close()
})

test('a slow route cannot leave the current page covered indefinitely', async ({
  page,
}) => {
  let releaseResponse!: () => void
  let responseWaiting = false
  const responseGate = new Promise<void>((resolve) => {
    releaseResponse = resolve
  })
  await page.route(
    (url) => url.pathname === '/lien-he/',
    async (route) => {
      if (!route.request().headers()['rsc']) return route.continue()
      const response = await route.fetch()
      responseWaiting = true
      await responseGate
      await route.fulfill({ response })
    },
  )
  try {
    await page.goto('/gioi-thieu')
    // Wait for the real Link prefetch, then keep its actual RSC response pending.
    await expect.poll(() => responseWaiting).toBe(true)
    const transition = page.locator('.tbs-page-transition')
    await page.locator('.tbs-desktop-nav a[href="/lien-he/"]').click()
    await expect(transition).toHaveAttribute(
      'data-transition-state',
      'departing',
    )
    await expect(transition).toHaveAttribute('data-transition-state', 'idle', {
      timeout: 1800,
    })
    await expect(transition).toHaveCSS('visibility', 'hidden')
    await expect(page).toHaveURL(/\/gioi-thieu\/?$/)
    releaseResponse()
    await expect(page).toHaveURL(/\/lien-he\/?$/)
    await expect(transition).toHaveAttribute('data-transition-state', 'idle')
    await expect(page.locator('h1')).toHaveCSS('opacity', '1')
  } finally {
    releaseResponse()
    await page.unrouteAll({ behavior: 'wait' })
  }
})
