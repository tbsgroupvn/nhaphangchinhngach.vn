import { test, expect } from '@playwright/test'
import { templateFields } from '../../src/lib/studio/template-model'
const headers = { Origin: 'http://127.0.0.1:4174' }
test.beforeEach(async ({ context }) => {
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
})

test('every shared business field reaches actual public DOM, links, images or metadata', async ({
  page,
  context,
}) => {
  test.setTimeout(90000)
  const response = await context.request.get('/api/studio/templates/')
  expect(response.status()).toBe(200)
  const initial = await response.json()
  const values = Object.fromEntries(
    templateFields.map((field, index) => [
      field.key,
      field.kind === 'image'
        ? '/images/marketing/sourcing.webp'
        : field.kind === 'link'
          ? `/lien-he/#template-${index}`
          : `Nội dung kiểm chứng ${index} hoàn chỉnh`,
    ]),
  )
  try {
    expect(
      (
        await context.request.put('/api/studio/templates/', {
          headers,
          data: { version: initial.version, values },
        })
      ).status(),
    ).toBe(200)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    let text = '',
      hrefs: string[] = [],
      images: string[] = []
    const collect = async () => {
      text += await page.locator('main').textContent()
      hrefs.push(
        ...(await page
          .locator('main a[href]')
          .evaluateAll((nodes) =>
            nodes.map((node) => node.getAttribute('href')!),
          )),
      )
      images.push(
        ...(await page
          .locator('main img')
          .evaluateAll((nodes) =>
            nodes.map(
              (node) =>
                `${node.getAttribute('alt')} ${node.getAttribute('src')}`,
            ),
          )),
      )
    }
    await page.goto('/')
    for (let stage = 0; stage < 4; stage++) {
      await page.locator('.journey-stage').nth(stage).click()
      await collect()
    }
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      const note = await page.locator('.journey-scene-note').boundingBox()
      const toggle = await page.locator('.journey-motion-toggle').boundingBox()
      expect(
        note!.x + note!.width,
        `Journey label must leave room for pause at ${width}px`,
      ).toBeLessThanOrEqual(toggle!.x - 8)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width)
    }
    const { documents } = await (
      await context.request.get('/api/studio/content/')
    ).json()
    const industry = documents.find(
      (item: { kind: string; publishedPath?: string; archivedAt?: string }) =>
        item.kind === 'industry' && item.publishedPath && !item.archivedAt,
    )
    for (const path of [
      '/dich-vu/',
      '/dich-vu/van-chuyen-trung-viet/',
      industry.publishedPath,
      '/kien-thuc/chuan-bi-thong-tin-lo-hang/',
      '/hoi-dap/',
      '/kien-thuc/',
      '/kien-thuc/?q=khongcotukhoanay',
      '/sitemap/',
      '/chinh-sach/bao-mat/',
      '/template-missing-test/',
    ]) {
      await page.goto(path)
      await collect()
      if (path === '/sitemap/') {
        expect(await page.title()).toContain(values['sitemap.seoTitle'])
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
          'content',
          values['sitemap.seoDescription'],
        )
      }
    }
    await expect(page.locator('.tbs-transition-wordmark > span')).toHaveText(
      values['shared.transitionCaption'],
    )
    for (const field of templateFields) {
      if (field.kind === 'image')
        expect(decodeURIComponent(images.join(' ')), field.key).toContain(
          values[field.key],
        )
      else if (field.kind === 'link')
        expect(
          hrefs.map((href) => href.replace('/#', '#')),
          field.key,
        ).toContain(values[field.key].replace('/#', '#'))
      else if (field.key === 'journey.imageAlt')
        expect(images.join(' '), field.key).toContain(values[field.key])
      else if (
        ![
          'sitemap.seoTitle',
          'sitemap.seoDescription',
          'shared.transitionCaption',
        ].includes(field.key)
      )
        expect(text, field.key).toContain(values[field.key])
    }
  } finally {
    const latest = await (
      await context.request.get('/api/studio/templates/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/templates/', {
          headers,
          data: { version: latest.version, values: initial.values },
        })
      ).status(),
    ).toBe(200)
  }
})

test('template conflicts keep local work, unsaved navigation is guarded and invalid requests fail', async ({
  page,
  context,
  browser,
}) => {
  const initialResponse = await context.request.get('/api/studio/templates/')
  expect(initialResponse.status()).toBe(200)
  const initial = await initialResponse.json()
  const anonymous = await browser.newContext()
  try {
    expect(
      (
        await anonymous.request.get(
          'http://127.0.0.1:4174/api/studio/templates/',
        )
      ).status(),
    ).toBe(401)
    expect(
      (
        await context.request.put('/api/studio/templates/', {
          headers: { Origin: 'https://attacker.test' },
          data: { version: initial.version, values: initial.values },
        })
      ).status(),
    ).toBe(403)
    await page.goto('/admin/templates/')
    await page.getByRole('searchbox').fill('sidebar.heading')
    const field = page.locator('[data-copy-key="sidebar.heading"]')
    await field.fill('Bản đang sửa trên máy')
    page.once('dialog', (dialog) => dialog.dismiss())
    await page
      .getByRole('navigation', { name: 'Quản trị website' })
      .getByRole('link', { name: 'Nội dung', exact: true })
      .click()
    await expect(page).toHaveURL(/\/admin\/templates\/$/)
    await expect(field).toHaveValue('Bản đang sửa trên máy')
    expect(
      (
        await context.request.put('/api/studio/templates/', {
          headers,
          data: {
            version: initial.version,
            values: {
              ...initial.values,
              'sidebar.heading': 'Bản thay đổi từ máy khác',
            },
          },
        })
      ).status(),
    ).toBe(200)
    page.once('dialog', (dialog) => dialog.accept())
    await page
      .getByRole('button', { name: 'Áp dụng nội dung mẫu', exact: true })
      .click()
    await expect(
      page.getByRole('region', { name: 'Bản trên máy chủ' }),
    ).toContainText('Bản thay đổi từ máy khác')
    await expect(field).toHaveValue('Bản đang sửa trên máy')
    await page
      .getByRole('button', { name: 'Giữ bản của tôi', exact: true })
      .click()
    page.once('dialog', (dialog) => dialog.accept())
    await page
      .getByRole('button', { name: 'Áp dụng nội dung mẫu', exact: true })
      .click()
    await expect(page.getByRole('status')).toContainText('Đã áp dụng')
    expect(
      (await (await context.request.get('/api/studio/templates/')).json())
        .values['sidebar.heading'],
    ).toBe('Bản đang sửa trên máy')
    await field.fill('')
    await page
      .getByRole('button', { name: 'Áp dụng nội dung mẫu', exact: true })
      .click()
    await expect(page.locator('.studio-error[role="alert"]')).toContainText(
      'Tiêu đề',
    )
  } finally {
    await anonymous.close()
    const latest = await (
      await context.request.get('/api/studio/templates/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/templates/', {
          headers,
          data: { version: latest.version, values: initial.values },
        })
      ).status(),
    ).toBe(200)
  }
})

test('shared template copy has a real editor and reaches server-rendered public pages', async ({
  page,
  context,
}) => {
  const response = await context.request.get('/api/studio/templates/')
  expect(response.status()).toBe(200)
  const initial = await response.json()
  try {
    await page.goto('/admin/templates/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Nội dung mẫu dùng chung',
    )
    await page.getByRole('searchbox').fill('sidebar.heading')
    await page
      .locator('[data-copy-key="sidebar.heading"]')
      .fill('Tư vấn phương án phù hợp')
    page.once('dialog', (dialog) => dialog.accept())
    await page
      .getByRole('button', { name: 'Áp dụng nội dung mẫu', exact: true })
      .click()
    await expect(page.getByRole('status')).toContainText('Đã áp dụng')
    await page.reload()
    await page.getByRole('searchbox').fill('sidebar.heading')
    await expect(page.locator('[data-copy-key="sidebar.heading"]')).toHaveValue(
      'Tư vấn phương án phù hợp',
    )
    const publicPage = await context
      .browser()!
      .newContext({ javaScriptEnabled: false })
    try {
      const web = await publicPage.newPage()
      await web.goto('http://127.0.0.1:4174/dich-vu/nhap-khau-chinh-ngach/')
      await expect(web.locator('.tbs-sidebar h2').last()).toHaveText(
        'Tư vấn phương án phù hợp',
      )
    } finally {
      await publicPage.close()
    }
    await page.getByRole('searchbox').fill('')
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({
      path: 'artifacts/screenshots/studio-templates-desktop.png',
      fullPage: true,
    })
    await page.setViewportSize({ width: 390, height: 844 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390)
    await page.screenshot({
      path: 'artifacts/screenshots/studio-templates-mobile.png',
      fullPage: true,
    })
  } finally {
    const latest = await (
      await context.request.get('/api/studio/templates/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/templates/', {
          headers,
          data: { version: latest.version, values: initial.values },
        })
      ).status(),
    ).toBe(200)
  }
})

test('shared links disappear when their published destination is withdrawn without erasing saved settings', async ({
  page,
  context,
}) => {
  const initial = await (
    await context.request.get('/api/studio/templates/')
  ).json()
  const { documents } = await (
    await context.request.get('/api/studio/content/')
  ).json()
  const entry = documents.find(
    (item: { path: string }) => item.path === '/quy-trinh',
  )
  const { document } = await (
    await context.request.get(`/api/studio/content/${entry.id}/`)
  ).json()
  try {
    expect(
      (
        await context.request.put('/api/studio/templates/', {
          headers,
          data: {
            version: initial.version,
            values: { ...initial.values, 'sidebar.href': '/quy-trinh' },
          },
        })
      ).status(),
    ).toBe(200)
    expect(
      (
        await context.request.patch(`/api/studio/content/${entry.id}/`, {
          headers,
          data: { action: 'unpublish', version: document.version },
        })
      ).status(),
    ).toBe(200)
    await page.goto('/dich-vu/nhap-khau-chinh-ngach/')
    await expect(
      page.locator('.tbs-sidebar a[href^="/quy-trinh"]'),
    ).toHaveCount(0)
    await expect(page.locator('.tbs-prose a[href^="/quy-trinh"]')).toHaveCount(
      0,
    )
    expect(
      (await (await context.request.get('/api/studio/templates/')).json())
        .values['sidebar.href'],
    ).toBe('/quy-trinh')
  } finally {
    let current = (
      await (
        await context.request.get(`/api/studio/content/${entry.id}/`)
      ).json()
    ).document
    const restored = await context.request.patch(
      `/api/studio/content/${entry.id}/`,
      {
        headers,
        data: {
          action: 'save',
          version: current.version,
          payload: document.published,
        },
      },
    )
    expect(restored.status()).toBe(200)
    current = (await restored.json()).document
    expect(
      (
        await context.request.patch(`/api/studio/content/${entry.id}/`, {
          headers,
          data: { action: 'publish', version: current.version },
        })
      ).status(),
    ).toBe(200)
    current = (
      await (
        await context.request.get(`/api/studio/content/${entry.id}/`)
      ).json()
    ).document
    expect(
      (
        await context.request.patch(`/api/studio/content/${entry.id}/`, {
          headers,
          data: {
            action: 'save',
            version: current.version,
            payload: document.draft,
          },
        })
      ).status(),
    ).toBe(200)
    const latest = await (
      await context.request.get('/api/studio/templates/')
    ).json()
    expect(
      (
        await context.request.put('/api/studio/templates/', {
          headers,
          data: { version: latest.version, values: initial.values },
        })
      ).status(),
    ).toBe(200)
  }
})
