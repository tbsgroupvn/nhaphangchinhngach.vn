import { test, expect } from '@playwright/test'
import sharp from 'sharp'
const headers = { Origin: 'http://127.0.0.1:4174' }
const owner = {
  email: 'owner@example.test',
  password: 'Owner-test-password-728!',
  name: 'Chủ website',
}

test('an existing admin sees the applied brand in a newly opened SEO preview', async ({
  page,
  context,
}) => {
  const initial = await (
    await context.request.get('/api/studio/settings/')
  ).json()
  try {
    await page.goto('/admin/dashboard/')
    const payload = structuredClone(initial.payload)
    payload.identity.name = 'TBS SEO UPDATED'
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: initial.version, payload },
        })
      ).status(),
    ).toBe(200)
    await page
      .getByRole('navigation', { name: 'Quản trị website' })
      .getByRole('link', { name: 'Nội dung', exact: true })
      .click()
    await page.getByRole('link', { name: 'Bài viết mới', exact: true }).click()
    await page.getByRole('tab', { name: 'SEO', exact: true }).click()
    await page
      .getByLabel('SEO title', { exact: true })
      .fill('Hướng dẫn nhập khẩu')
    await expect(page.locator('.studio-serp-title')).toHaveText(
      'Hướng dẫn nhập khẩu | TBS SEO UPDATED',
    )
  } finally {
    const latest = await (
      await context.request.get('/api/studio/settings/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: latest.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(200)
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

test('settings retain unsaved work and explicitly resolve both conflict choices', async ({
  page,
  context,
}) => {
  const initial = await (
    await context.request.get('/api/studio/settings/')
  ).json()
  const restore = async () => {
    const latest = await (
      await context.request.get('/api/studio/settings/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: latest.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(200)
  }
  try {
    await page.goto('/admin/settings/')
    await page
      .getByLabel('Tên doanh nghiệp', { exact: true })
      .fill('Local brand')
    page.once('dialog', (dialog) => dialog.dismiss())
    await page
      .getByRole('navigation', { name: 'Quản trị website' })
      .getByRole('link', { name: 'Nội dung', exact: true })
      .click()
    await expect(page).toHaveURL(/\/admin\/settings\/$/)
    await expect(
      page.getByLabel('Tên doanh nghiệp', { exact: true }),
    ).toHaveValue('Local brand')
    let remote = structuredClone(initial.payload)
    remote.identity.name = 'Remote brand'
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: initial.version, payload: remote },
        })
      ).status(),
    ).toBe(200)
    page.once('dialog', (dialog) => dialog.accept())
    await page
      .getByRole('button', { name: 'Áp dụng lên website', exact: true })
      .click()
    const conflict = page.getByRole('region', { name: 'Bản trên máy chủ' })
    await expect(conflict).toContainText('Remote brand')
    await expect(conflict).toContainText('Local brand')
    await page.setViewportSize({ width: 390, height: 844 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390)
    await page.screenshot({
      path: 'artifacts/screenshots/studio-settings-conflict-mobile.png',
      fullPage: true,
    })
    await page
      .getByRole('button', { name: 'Giữ bản của tôi', exact: true })
      .click()
    page.once('dialog', (dialog) => dialog.accept())
    await page
      .getByRole('button', { name: 'Áp dụng lên website', exact: true })
      .click()
    await expect(page.getByRole('status')).toContainText('Đã áp dụng')
    expect(
      (await (await context.request.get('/api/studio/settings/')).json())
        .payload.identity.name,
    ).toBe('Local brand')
    const saved = await (
      await context.request.get('/api/studio/settings/')
    ).json()
    remote = structuredClone(saved.payload)
    remote.identity.name = 'New remote brand'
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: saved.version, payload: remote },
        })
      ).status(),
    ).toBe(200)
    await page
      .getByLabel('Tên doanh nghiệp', { exact: true })
      .fill('Unsaved local name')
    page.once('dialog', (dialog) => dialog.accept())
    await page
      .getByRole('button', { name: 'Áp dụng lên website', exact: true })
      .click()
    await expect(conflict).toBeVisible()
    await page
      .getByRole('button', { name: 'Dùng bản trên máy chủ', exact: true })
      .click()
    await expect(
      page.getByLabel('Tên doanh nghiệp', { exact: true }),
    ).toHaveValue('New remote brand')
    await expect(
      page.getByRole('button', { name: 'Áp dụng lên website', exact: true }),
    ).toBeDisabled()
    await page.getByRole('tab', { name: 'Thương hiệu', exact: true }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(
      page.getByRole('tab', { name: 'Điều hướng', exact: true }),
    ).toBeFocused()
    await page
      .getByRole('button', { name: 'Đưa mục 1 xuống: Menu chính', exact: true })
      .click()
    await expect(
      page.getByLabel('Menu chính · Tên mục 1', { exact: true }),
    ).toHaveValue(initial.payload.navigation[1].label)
    await page
      .getByRole('button', { name: 'Thêm mục: Menu chính', exact: true })
      .click()
    await expect(
      page.getByLabel('Menu chính · Tên mục 6', { exact: true }),
    ).toBeVisible()
    await page
      .getByRole('button', { name: 'Xóa mục 6: Menu chính', exact: true })
      .click()
    await expect(
      page.getByLabel('Menu chính · Tên mục 6', { exact: true }),
    ).toHaveCount(0)
    page.once('dialog', (dialog) => dialog.accept())
    await page
      .getByRole('button', { name: 'Áp dụng lên website', exact: true })
      .click()
    await expect(page.getByRole('status')).toContainText('Đã áp dụng')
  } finally {
    await restore()
  }
})

test('configured navigation retains the parent section on a detail page without activating the home link', async ({
  context,
  browser,
}) => {
  const initial = await (
    await context.request.get('/api/studio/settings/')
  ).json()
  const payload = structuredClone(initial.payload)
  payload.navigation = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Dịch vụ', href: '/dich-vu' },
  ]
  const publicContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  try {
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: initial.version, payload },
        })
      ).status(),
    ).toBe(200)
    const page = await publicContext.newPage()
    await page.goto('http://127.0.0.1:4174/dich-vu/nhap-khau-chinh-ngach/')
    await expect(
      page
        .locator('.tbs-desktop-nav')
        .getByRole('link', { name: 'Dịch vụ', exact: true }),
    ).toHaveAttribute('aria-current', 'page')
    await expect(
      page.locator('.tbs-desktop-nav a[href="/"]'),
    ).not.toHaveAttribute('aria-current')
  } finally {
    const latest = await (
      await context.request.get('/api/studio/settings/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: latest.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(200)
    await publicContext.close()
  }
})

test('shared settings enforce HTTP permissions, origin, revisions and public image ownership', async ({
  context,
  playwright,
}) => {
  const initial = await (
    await context.request.get('/api/studio/settings/')
  ).json()
  const outsider = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  const credentials = {
    name: 'Settings editor',
    email: `settings-${Date.now()}@example.test`,
    password: 'Settings-role-password-729!',
    role: 'editor',
  }
  const created = await context.request.post('/api/studio/users/', {
    headers,
    data: credentials,
  })
  expect(created.status()).toBe(201)
  const { user } = await created.json()
  let mediaId: string | undefined
  try {
    expect(
      (
        await outsider.put('/api/studio/settings/', {
          headers,
          data: { version: initial.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(401)
    expect(
      (
        await outsider.post('/api/studio/session/', {
          headers,
          data: credentials,
        })
      ).status(),
    ).toBe(200)
    expect(
      (
        await outsider.put('/api/studio/settings/', {
          headers,
          data: {
            version: initial.version,
            payload: initial.payload,
            role: 'admin',
          },
        })
      ).status(),
    ).toBe(403)
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers: { Origin: 'https://foreign.example' },
          data: { version: initial.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(403)
    const invalid = structuredClone(initial.payload)
    invalid.navigation[0].href = '/admin/'
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: initial.version, payload: invalid },
        })
      ).status(),
    ).toBe(409)
    const uploads = await context.request.post('/api/studio/media/', {
      headers: {
        ...headers,
        'Content-Type': 'image/png',
        'X-File-Name': 'shared-brand.png',
      },
      data: await sharp({
        create: { width: 240, height: 120, channels: 3, background: '#0083ca' },
      })
        .png()
        .toBuffer(),
    })
    expect(uploads.status()).toBe(201)
    const { item } = await uploads.json()
    mediaId = item.id
    const anon = await playwright.request.newContext({
      baseURL: 'http://127.0.0.1:4174',
    })
    try {
      expect((await anon.get(item.url)).status()).toBe(404)
      const payload = structuredClone(initial.payload)
      payload.identity.logo = item.url
      const results = await Promise.all(
        [0, 1].map(() =>
          context.request.put('/api/studio/settings/', {
            headers,
            data: { version: initial.version, payload },
          }),
        ),
      )
      expect(results.map((result) => result.status()).sort()).toEqual([
        200, 409,
      ])
      expect((await anon.get(item.url)).status()).toBe(200)
      expect(
        (
          await context.request.delete(`/api/studio/media/${item.id}/`, {
            headers,
            data: { version: 1 },
          })
        ).status(),
      ).toBe(409)
    } finally {
      await anon.dispose()
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
    expect(
      (
        await outsider.put('/api/studio/settings/', {
          headers,
          data: { version: initial.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(401)
  } finally {
    const current = await (
      await context.request.get('/api/studio/settings/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: current.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(200)
    if (mediaId)
      expect(
        (
          await context.request.delete(`/api/studio/media/${mediaId}/`, {
            headers,
            data: { version: 1 },
          })
        ).status(),
      ).toBe(200)
    await outsider.dispose()
  }
})

test('long shared copy stays contained and contact/schema render safely without JavaScript', async ({
  context,
  browser,
}) => {
  const initial = await (
    await context.request.get('/api/studio/settings/')
  ).json()
  const payload = structuredClone(initial.payload)
  payload.identity.name = 'TBS </script><script>window.injected=true</script>'
  payload.identity.phone = '+123456789012345'
  payload.identity.phoneDisplay = '+123456789012345'
  payload.contactLabel = 'Tư vấn nhập khẩu qua Zalo'
  payload.footer.headline = 'THUONGHIEU'.repeat(17)
  payload.navigation = [
    '/gioi-thieu/',
    '/dich-vu/',
    '/nganh-hang/',
    '/kien-thuc/',
    '/lien-he/',
    '/quy-trinh/',
  ].map((href) => ({ label: 'Điều hướng doanh nghiệp', href }))
  const publicContext = await browser.newContext({ javaScriptEnabled: false })
  try {
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: initial.version, payload },
        })
      ).status(),
    ).toBe(200)
    const web = await publicContext.newPage()
    await web.goto('http://127.0.0.1:4174/lien-he/')
    const schema = JSON.parse(
      (await web
        .locator('script[type="application/ld+json"]')
        .first()
        .textContent()) || '{}',
    )
    expect(schema.name).toBe(payload.identity.name)
    await expect(
      web.locator('script').filter({ hasText: /^window.injected=true$/ }),
    ).toHaveCount(0)
    for (const width of [1440, 1024, 390, 320]) {
      await web.setViewportSize({ width, height: 900 })
      expect(
        await web.evaluate(() => document.documentElement.scrollWidth),
        `document at ${width}`,
      ).toBeLessThanOrEqual(width)
      const header = await web.locator('.tbs-header-inner').boundingBox()
      for (const selector of ['.tbs-brand', '.tbs-header-phone']) {
        const box = await web.locator(selector).boundingBox()
        expect(
          box!.x + box!.width,
          `${selector} at ${width}`,
        ).toBeLessThanOrEqual(width)
        expect(box!.y + box!.height).toBeLessThanOrEqual(
          header!.y + header!.height,
        )
      }
    }
    await expect(
      web.locator('.tbs-mobile-dock a[href^="tel:"]'),
    ).toHaveAttribute('href', 'tel:+123456789012345')
    await web.screenshot({
      path: 'artifacts/screenshots/studio-settings-long-public-mobile.png',
      fullPage: true,
    })
  } finally {
    const current = await (
      await context.request.get('/api/studio/settings/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: current.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(200)
    await publicContext.close()
  }
})

test('an existing visitor gets one coherent settings snapshot after client navigation', async ({
  context,
  browser,
}) => {
  const initial = await (
    await context.request.get('/api/studio/settings/')
  ).json()
  const publicContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })
  try {
    const web = await publicContext.newPage()
    await web.goto('http://127.0.0.1:4174/gioi-thieu/')
    await web.evaluate(() => {
      ;(window as typeof window & { sameDocument?: boolean }).sameDocument =
        true
    })
    const payload = structuredClone(initial.payload)
    payload.identity.name = 'TBS UPDATED'
    payload.identity.email = 'updated@example.test'
    payload.identity.phone = '+84912345678'
    payload.identity.phoneDisplay = '0912 345 678'
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: initial.version, payload },
        })
      ).status(),
    ).toBe(200)
    await web.locator('.tbs-footer a[href="/chi-phi-chung-tu/"]').click()
    await expect(web).toHaveURL(/\/chi-phi-chung-tu\/$/)
    expect(
      await web.evaluate(
        () =>
          (window as typeof window & { sameDocument?: boolean }).sameDocument,
      ),
    ).toBe(true)
    await expect(
      web.locator('.tbs-footer a[href="mailto:updated@example.test"]'),
    ).toBeVisible()
    await expect(web.locator('.tbs-header-phone')).toHaveAttribute(
      'href',
      'tel:+84912345678',
    )
    await expect(
      web.locator('.tbs-contact-links a[href^="tel:"]').first(),
    ).toHaveAttribute('href', 'tel:+84912345678')
    const schema = JSON.parse(
      (await web
        .locator('script[type="application/ld+json"]')
        .first()
        .textContent()) || '{}',
    )
    expect(schema.telephone).toBe('+84912345678')
    expect(schema.name).toBe('TBS UPDATED')
    await expect(web).toHaveTitle(/\| TBS UPDATED$/)
    await expect(web.locator('.tbs-transition-wordmark')).toContainText(
      'TBS UPDATED',
    )
  } finally {
    const latest = await (
      await context.request.get('/api/studio/settings/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: latest.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(200)
    await publicContext.close()
  }
})

test('shared site configuration reaches header, footer, contact, schema and title without changing deployment gates', async ({
  page,
  context,
  playwright,
}) => {
  const response = await context.request.get('/api/studio/settings/')
  expect(response.status()).toBe(200)
  const initial = await response.json()
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  try {
    expect((await anonymous.get('/api/studio/settings/')).status()).toBe(401)
    await page.goto('/admin/settings/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Cấu hình website',
    )
    await page
      .getByLabel('Tên doanh nghiệp', { exact: true })
      .fill('TBS GROUP TEST')
    await page
      .getByLabel('Số gọi quốc tế', { exact: true })
      .fill('+84912345678')
    await page
      .getByLabel('Số điện thoại hiển thị', { exact: true })
      .fill('0912 345 678')
    await page
      .getByLabel('Email liên hệ', { exact: true })
      .fill('sales-fixture@example.test')
    await page.getByRole('tab', { name: 'Chân trang', exact: true }).click()
    await page
      .getByLabel('Tiêu đề chân trang', { exact: true })
      .fill('Kết nối cùng TBS')
    await page.getByRole('tab', { name: 'Điều hướng', exact: true }).click()
    await page
      .getByLabel('Menu chính · Tên mục 1', { exact: true })
      .fill('Doanh nghiệp')
    page.once('dialog', (dialog) => dialog.accept())
    await page
      .getByRole('button', { name: 'Áp dụng lên website', exact: true })
      .click()
    await expect(page.getByRole('status')).toContainText('Đã áp dụng')
    await page.reload()
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(
      page.getByLabel('Tên doanh nghiệp', { exact: true }),
    ).toHaveValue('TBS GROUP TEST')
    await page.screenshot({
      path: 'artifacts/screenshots/studio-site-settings-desktop.png',
      fullPage: true,
    })
    await page.setViewportSize({ width: 390, height: 844 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390)
    await page.screenshot({
      path: 'artifacts/screenshots/studio-site-settings-mobile.png',
      fullPage: true,
    })
    const publicPage = await page
      .context()
      .browser()!
      .newContext({ viewport: { width: 1440, height: 1000 } })
    try {
      const web = await publicPage.newPage()
      await web.goto('http://127.0.0.1:4174/lien-he/')
      await expect(web.locator('.tbs-header-phone')).toHaveAttribute(
        'href',
        'tel:+84912345678',
      )
      await expect(web.locator('.tbs-header-phone')).toContainText(
        '0912 345 678',
      )
      await expect(
        web
          .locator('.tbs-desktop-nav')
          .getByRole('link', { name: 'Doanh nghiệp' }),
      ).toBeVisible()
      await expect(web.locator('.tbs-footer h2')).toHaveText('Kết nối cùng TBS')
      expect(await web.title()).toContain('| TBS GROUP TEST')
      await expect(web.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        /noindex/,
      )
      const organization = JSON.parse(
        (await web
          .locator('script[type="application/ld+json"]')
          .first()
          .textContent()) || '{}',
      )
      expect(organization.telephone).toBe('+84912345678')
      expect(organization.email).toBe('sales-fixture@example.test')
      expect(organization.name).toBe('TBS GROUP TEST')
      expect(
        await web
          .locator('a[href="mailto:sales-fixture@example.test"]')
          .count(),
      ).toBeGreaterThan(1)
      await web.setViewportSize({ width: 390, height: 844 })
      await expect(
        web.locator('.tbs-mobile-dock a[href^="tel:"]'),
      ).toHaveAttribute('href', 'tel:+84912345678')
      expect(
        await web.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(390)
    } finally {
      await publicPage.close()
    }
  } finally {
    const latest = await (
      await context.request.get('/api/studio/settings/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/settings/', {
          headers,
          data: { version: latest.version, payload: initial.payload },
        })
      ).status(),
    ).toBe(200)
    await anonymous.dispose()
  }
})
