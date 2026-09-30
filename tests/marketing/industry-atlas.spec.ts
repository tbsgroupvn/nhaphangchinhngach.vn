import { test, expect, type Page } from '@playwright/test'

const hub = '/nganh-hang/'
const results = '[data-industry-results]'

async function rows(page: Page) {
  return page.locator(`${results} li h3 a`)
}

test('search matches accents, aliases and updates URL without reloading', async ({ page }) => {
  await page.goto(hub)
  const marker = await page.evaluate(() => ((window as any).__atlasMarker = Math.random()))
  const search = page.getByRole('searchbox', { name: 'Tìm ngành hàng' })

  await search.fill('may moc moi')
  await expect(await rows(page)).toHaveCount(1)
  await expect(page.locator(results)).toContainText('Máy móc mới')
  await expect(page).toHaveURL(/q=may\+moc\+moi/)

  await search.fill('đồ gia dụng không điện')
  await expect((await rows(page)).first()).toHaveText('Gia dụng không điện')

  await search.fill('GIA DUNG')
  await expect((await rows(page)).first()).toContainText('Gia dụng')
  expect(await page.evaluate(() => (window as any).__atlasMarker)).toBe(marker)
})

test('category and trait filters combine with AND, survive Back/Forward and drop unknown values', async ({ page }) => {
  await page.goto(hub)
  await page.getByLabel('Nhóm ngành', { exact: true }).selectOption('gia-dung-noi-that')
  await expect(await rows(page)).toHaveCount(2)
  await expect(page).toHaveURL(/category=gia-dung-noi-that/)

  await page.getByRole('checkbox', { name: 'Cồng kềnh' }).check()
  await expect(await rows(page)).toHaveCount(1)
  await expect(page.locator(results)).toContainText('Nội thất và phụ kiện')
  await expect(page).toHaveURL(/traits=cong-kenh/)
  await expect(page.getByRole('status').filter({ hasText: 'phù hợp' })).toContainText('1 ngành hàng phù hợp')

  await page.goBack()
  await expect(await rows(page)).toHaveCount(2)
  await expect(page.getByRole('checkbox', { name: 'Cồng kềnh' })).not.toBeChecked()
  await page.goForward()
  await expect(await rows(page)).toHaveCount(1)
  await expect(page.getByRole('checkbox', { name: 'Cồng kềnh' })).toBeChecked()

  await page.goto(`${hub}?category=khong-co&traits=la&traits=cong-kenh&traits=cong-kenh`)
  await expect(page.getByLabel('Nhóm ngành', { exact: true })).toHaveValue('')
  await expect(page.getByRole('checkbox', { name: 'Cồng kềnh' })).toBeChecked()
  await expect(page.locator(`${results} li h3 a`)).not.toHaveCount(0)
})

test('no result keeps the query, suggests categories and direct contact without any form', async ({ page }) => {
  await page.goto(`${hub}?q=${encodeURIComponent('máy dệt khongcotrongatlas')}`)
  const region = page.locator(results)
  await expect(region).toContainText('Chưa có ngành hàng khớp')
  await expect(region).toContainText('máy dệt khongcotrongatlas')
  await expect(region).toContainText('Có thể gần với')
  await expect(region.locator('a[href="tel:+84976005335"]')).toBeVisible()
  await expect(region.locator('a[href*="zalo.me"]')).toBeVisible()
  await expect(page.locator('main input[type="email"], main input[type="tel"], main textarea')).toHaveCount(0)
})

test('hub, category and detail stay usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: 'http://127.0.0.1:4173' })
  const page = await context.newPage()
  await page.goto(`${hub}?q=may+moc`)
  await expect(page.locator(`${results} li h3 a`).first()).toContainText('Máy móc')
  await expect(page.locator('[data-atlas-category]')).toHaveCount(2)
  await expect(page.locator('main a[href="tel:+84976005335"]').first()).toBeVisible()
  await page.goto('/nganh-hang/gia-dung-noi-that/')
  await expect(page.locator('h1')).toHaveText('Gia dụng và nội thất')
  await expect(page.locator('main h3 a[href="/nganh-hang/gia-dung-noi-that/noi-that-phu-kien/"]')).toBeVisible()
  await page.goto('/nganh-hang/gia-dung-noi-that/gia-dung-khong-dien/')
  await expect(page.locator('nav[aria-label="Đường dẫn"]')).toContainText('Gia dụng và nội thất')
  await expect(page.getByRole('region', { name: 'Nội dung chuẩn bị' })).toContainText('Ngành hàng: Gia dụng không điện')
  await context.close()
})

test('detail page renders the contract without empty headings and breadcrumb is two-level', async ({ page }) => {
  await page.goto('/nganh-hang/may-moc-day-chuyen/may-moc-moi/')
  const crumbs = page.locator('nav[aria-label="Đường dẫn"] li')
  await expect(crumbs).toHaveText(['Trang chủ', 'Ngành hàng', 'Máy móc và dây chuyền', 'Máy móc mới'])
  for (const id of ['dac-diem', 'chuan-bi', 'kiem-tra', 'brief']) await expect(page.locator(`#${id}`)).toBeVisible()
  const empty = await page.locator('main h2, main h3').evaluateAll((nodes) =>
    nodes.filter((node) => !node.textContent?.trim()).length,
  )
  expect(empty).toBe(0)
  await expect(page.locator('main')).not.toContainText(/mã HS\s*\d|thuế suất\s*\d/i)
})

test('filter URLs are noindex,follow with hub canonical; category/detail canonical is two-level', async ({ page }) => {
  await page.goto(`${hub}?q=may&category=may-moc-day-chuyen`)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /follow/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://nhaphangchinhngach.vn/nganh-hang/')
  await page.goto('/nganh-hang/may-moc-day-chuyen/may-moc-moi/')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://nhaphangchinhngach.vn/nganh-hang/may-moc-day-chuyen/may-moc-moi/',
  )
  const breadcrumb = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.map((node) => JSON.parse(node.textContent || '{}')).find((data) => data['@type'] === 'BreadcrumbList'),
  )
  expect(breadcrumb.itemListElement.map((item: { name: string }) => item.name)).toEqual([
    'Trang chủ', 'Ngành hàng', 'Máy móc và dây chuyền', 'Máy móc mới',
  ])
  const hubLinks = await page.goto(hub).then(() =>
    page.locator('main a[href*="?"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')!)),
  )
  for (const href of hubLinks) {
    const params = new URL(href, 'http://x').searchParams
    for (const key of params.keys()) expect(['q', 'category', 'traits']).toContain(key)
  }
})

test('sitemap never exposes filter or legacy one-level Atlas URLs', async ({ request }) => {
  // Danh sách hub/category/industry được kiểm ở unit test sitemapEntries;
  // môi trường cục bộ chưa bật index nên sitemap có thể rỗng.
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  const xml = await response.text()
  expect(xml).not.toContain('/nganh-hang/?')
  for (const legacy of ['gia-dung-khong-dien', 'noi-that-phu-kien', 'may-moc-moi'])
    expect(xml).not.toContain(`<loc>https://nhaphangchinhngach.vn/nganh-hang/${legacy}/</loc>`)
})

test('analytics payloads carry only buckets, allowlisted ids and counts', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'true')
    ;(window as any).__events = []
    ;(window as any).gtag = (...args: unknown[]) => (window as any).__events.push(args)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => undefined },
    })
  })
  await page.goto(hub)
  await page.getByRole('searchbox', { name: 'Tìm ngành hàng' }).fill('Model XK-900 bí mật')
  await page.getByRole('button', { name: 'Tìm kiếm' }).click()
  await page.getByLabel('Nhóm ngành', { exact: true }).selectOption('may-moc-day-chuyen')
  await page.getByRole('searchbox', { name: 'Tìm ngành hàng' }).fill('may')
  await page.locator(`${results} li h3 a`).first().click()
  await page.waitForURL(/may-moc-moi/)
  await page.getByRole('button', { name: 'Sao chép nội dung chuẩn bị' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Đã sao chép' })).toBeVisible()
  const events = await page.evaluate(() => (window as any).__events as unknown[][])
  const payload = JSON.stringify(events)
  expect(payload).not.toMatch(/XK-900|bí mật|bi mat|Model/i)
  expect(payload).not.toContain('?q=')
  expect(payload).not.toContain('0976')
  const names = events.filter((args) => args[0] === 'event').map((args) => args[1])
  expect(names).toContain('industry_search')
  expect(names).toContain('industry_filter_apply')
  expect(names).toContain('brief_copy')
})

test('analytics stays silent without consent', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('analytics_consent', 'false')
    ;(window as any).__events = []
    ;(window as any).gtag = (...args: unknown[]) => (window as any).__events.push(args)
  })
  await page.goto(hub)
  await page.getByRole('searchbox', { name: 'Tìm ngành hàng' }).fill('may')
  await page.getByRole('button', { name: 'Tìm kiếm' }).click()
  const industryEvents = await page.evaluate(() =>
    ((window as any).__events as unknown[][]).filter((args) => String(args[1]).startsWith('industry_')),
  )
  expect(industryEvents).toHaveLength(0)
})

test('mobile bottom sheet traps focus, closes with Escape and applies filters', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(hub)
  await expect(page.getByRole('group', { name: 'Lọc theo đặc tính' })).toBeHidden()
  const trigger = page.getByRole('button', { name: /^Bộ lọc/ })
  const box = await trigger.boundingBox()
  expect(box!.height).toBeGreaterThanOrEqual(44)
  await trigger.click()
  const sheet = page.getByRole('dialog', { name: 'Lọc theo đặc tính' })
  await expect(sheet).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(sheet).toHaveCount(0)
  await trigger.click()
  await sheet.getByRole('checkbox', { name: 'Cần nâng hạ' }).check()
  await sheet.getByRole('button', { name: 'Áp dụng' }).click()
  await expect(sheet).toHaveCount(0)
  await expect(page).toHaveURL(/traits=can-nang-ha/)
  await expect(trigger).toContainText('1 đang chọn')
  await expect(page.locator(`${results} li h3 a`)).not.toHaveCount(0)
})

for (const width of [320, 390, 768, 1440, 1920])
  test(`atlas pages have no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [
      `${hub}?q=${'x'.repeat(120)}`,
      hub,
      '/nganh-hang/gia-dung-noi-that/',
      '/nganh-hang/may-moc-day-chuyen/may-moc-moi/',
    ]) {
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      expect(overflow, `${path} @${width}`).toBeLessThanOrEqual(0)
    }
  })

test('reduced motion keeps content and disables decorative transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(hub)
  const duration = await page
    .locator('[data-atlas-category] img')
    .first()
    .evaluate((node) => getComputedStyle(node).transitionDuration)
  expect(duration.split(',').every((value) => parseFloat(value) === 0)).toBe(true)
  await expect(page.locator('[data-atlas-category]')).toHaveCount(2)
  await page.screenshot({ path: 'artifacts/screenshots/atlas-hub-reduced-motion.png', fullPage: true })
})

test('only the first category image is eager; the rest lazy-load', async ({ page }) => {
  await page.goto(hub)
  const loading = await page
    .locator('[data-atlas-category] img')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('loading')))
  expect(loading.slice(1).every((value) => value === 'lazy')).toBe(true)
})

test('atlas screenshots for manual review', async ({ page }) => {
  for (const [name, width] of [['desktop', 1440], ['mobile', 390]] as const) {
    await page.setViewportSize({ width, height: 900 })
    for (const [slug, path] of [
      ['hub', hub],
      ['category', '/nganh-hang/gia-dung-noi-that/'],
      ['detail', '/nganh-hang/may-moc-day-chuyen/may-moc-moi/'],
    ]) {
      await page.goto(path)
      await page.screenshot({ path: `artifacts/screenshots/atlas-${slug}-${name}.png`, fullPage: true })
    }
  }
})
