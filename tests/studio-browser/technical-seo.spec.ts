import { test, expect } from '@playwright/test'

const headers = { Origin: 'http://127.0.0.1:4174' }
const owner = {
  email: 'owner@example.test',
  password: 'Owner-test-password-728!',
  name: 'Chủ website',
}
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

test('technical SEO manages real HTTP redirects with revisions, safe targets and mobile layout', async ({
  page,
  context,
  browser,
}) => {
  const response = await context.request.get('/api/studio/seo/technical/')
  expect(response.status()).toBe(200)
  const data = await response.json()
  const target = data.targets.find(
    (item: { path: string }) => item.path === '/dich-vu',
  )
  const anonymous = await browser.newContext()
  expect(
    (
      await anonymous.request.get(
        'http://127.0.0.1:4174/api/studio/seo/technical/',
      )
    ).status(),
  ).toBe(401)
  await anonymous.close()
  await page.goto('/admin/seo/')
  await page.getByRole('link', { name: 'SEO kỹ thuật' }).click()
  await page
    .getByRole('button', { name: 'Thêm chuyển hướng', exact: true })
    .click()
  await page.getByLabel('URL nguồn', { exact: true }).fill('/campaign-import/')
  await page.getByLabel('Trang đích', { exact: true }).selectOption(target.id)
  await page
    .getByRole('button', { name: 'Lưu chuyển hướng', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const rule = page.getByRole('row').filter({ hasText: '/campaign-import' })
  await expect(rule).toContainText('/dich-vu')
  let redirected = await context.request.get('/campaign-import/', {
    maxRedirects: 0,
  })
  expect(redirected.status()).toBe(308)
  expect(redirected.headers().location).toBe('/dich-vu/')
  await page.reload()
  await rule.getByRole('button', { name: 'Sửa chuyển hướng' }).click()
  await page.getByLabel('Loại chuyển hướng').selectOption('307')
  await page
    .getByRole('button', { name: 'Lưu chuyển hướng', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  redirected = await context.request.get('/campaign-import/', {
    maxRedirects: 0,
  })
  expect(redirected.status()).toBe(307)
  const fresh = await (
    await context.request.get('/api/studio/seo/technical/')
  ).json()
  const stored = fresh.redirects.find(
    (item: { source: string }) => item.source === '/campaign-import',
  )
  expect(
    (
      await context.request.post('/api/studio/seo/technical/', {
        headers,
        data: { action: 'delete-redirect', id: stored.id, version: 1 },
      })
    ).status(),
  ).toBe(409)
  expect(
    (
      await context.request.post('/api/studio/seo/technical/', {
        headers: { Origin: 'https://evil.test' },
        data: {
          action: 'delete-redirect',
          id: stored.id,
          version: stored.version,
        },
      })
    ).status(),
  ).toBe(403)
  for (const source of [
    '/admin/unsafe',
    '//evil.test',
    '/dich-vu',
    '/dich-vu/van-chuyen-quoc-te',
    '/a/../b',
  ]) {
    expect(
      (
        await context.request.post('/api/studio/seo/technical/', {
          headers,
          data: {
            action: 'save-redirect',
            id: null,
            version: 0,
            payload: { source, targetId: target.id, status: 308 },
          },
        })
      ).status(),
    ).toBeGreaterThanOrEqual(400)
  }
  await page.screenshot({
    path: 'artifacts/screenshots/studio-technical-desktop.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-technical-mobile.png',
    fullPage: true,
  })
  page.once('dialog', (dialog) => dialog.accept())
  await rule.getByRole('button', { name: 'Xóa chuyển hướng' }).click()
  await expect(rule).toHaveCount(0)
  expect(
    (
      await context.request.get('/campaign-import/', { maxRedirects: 0 })
    ).status(),
  ).toBe(404)
})

test('verification settings reach the real head while preview robots and sitemap remain locked', async ({
  page,
  context,
}) => {
  await page.goto('/admin/seo/technical/')
  await page
    .getByLabel('Mã xác minh Google')
    .fill(
      'fixture-verification-owner-one_12345\nfixture-verification-owner-two_12345',
    )
  await page
    .getByRole('button', { name: 'Lưu cấu hình SEO', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã lưu cấu hình')
  await page.reload()
  await expect(page.getByLabel('Mã xác minh Google')).toHaveValue(
    'fixture-verification-owner-one_12345\nfixture-verification-owner-two_12345',
  )
  const html = await (await context.request.get('/')).text()
  expect(html).toContain(
    'name="google-site-verification" content="fixture-verification-owner-one_12345"',
  )
  expect(html).toContain(
    'name="google-site-verification" content="fixture-verification-owner-two_12345"',
  )
  expect(html).toContain('noindex')
  expect(await (await context.request.get('/robots.txt')).text()).toContain(
    'Disallow: /',
  )
  expect(
    await (await context.request.get('/sitemap.xml')).text(),
  ).not.toContain('<loc>')
  // A concurrent save must leave local edits intact and offer explicit comparison.
  await page
    .getByLabel('Mã xác minh Google')
    .fill('fixture-verification-local_12345')
  const current = (
    await (await context.request.get('/api/studio/seo/technical/')).json()
  ).settings
  expect(
    (
      await context.request.post('/api/studio/seo/technical/', {
        headers,
        data: {
          action: 'settings',
          version: current.version,
          payload: {
            googleVerification: ['fixture-verification-remote_12345'],
            blockIndexing: true,
          },
        },
      })
    ).status(),
  ).toBe(200)
  await page
    .getByRole('button', { name: 'Lưu cấu hình SEO', exact: true })
    .click()
  await expect(page.getByLabel('Mã xác minh Google')).toHaveValue(
    'fixture-verification-local_12345',
  )
  await expect(page.getByLabel('Bản trên máy chủ')).toContainText(
    'fixture-verification-remote_12345',
  )
  await page.getByRole('button', { name: 'Giữ bản của tôi' }).click()
  await page
    .getByRole('button', { name: 'Lưu cấu hình SEO', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã lưu cấu hình')
  await page.getByLabel('Mã xác minh Google').fill('')
  await page.getByLabel('Tạm ngừng lập chỉ mục').uncheck()
  await page
    .getByRole('button', { name: 'Lưu cấu hình SEO', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã lưu cấu hình')
})

test('published slug changes preserve the old HTTP URL and all redirects follow the latest publication', async ({
  context,
}) => {
  const list = (
    await (await context.request.get('/api/studio/content/')).json()
  ).documents
  const seed = (
    await (
      await context.request.get(
        `/api/studio/content/${list.find((item: { kind: string }) => item.kind === 'article').id}/`,
      )
    ).json()
  ).document.draft
  const created = await context.request.post('/api/studio/content/', {
    headers,
    data: { ...seed, data: { ...seed.data, slug: 'http-old-route' } },
  })
  expect(created.status()).toBe(201)
  let item = (await created.json()).document
  const endpoint = `/api/studio/content/${item.id}/`
  const publish = async () => {
    const response = await context.request.patch(endpoint, {
      headers,
      data: { action: 'publish', version: item.version },
    })
    expect(response.status()).toBe(200)
    item = (await response.json()).document
  }
  await publish()
  for (const slug of ['http-middle-route', 'http-final-route']) {
    item = (
      await (
        await context.request.patch(endpoint, {
          headers,
          data: {
            action: 'save',
            version: item.version,
            payload: { ...item.draft, data: { ...item.draft.data, slug } },
          },
        })
      ).json()
    ).document
    expect(
      (
        await context.request.get(`${item.publishedPath}/`, { maxRedirects: 0 })
      ).status(),
    ).toBe(200)
    expect(
      (
        await context.request.get(`/kien-thuc/${slug}/`, { maxRedirects: 0 })
      ).status(),
    ).toBe(404)
    await publish()
  }
  for (const path of ['http-old-route', 'http-middle-route']) {
    const response = await context.request.get(`/kien-thuc/${path}/`, {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(308)
    expect(response.headers().location).toBe('/kien-thuc/http-final-route/')
  }
  expect(
    (await context.request.get('/kien-thuc/http-final-route/')).status(),
  ).toBe(200)
  expect(
    (
      await context.request.patch(endpoint, {
        headers,
        data: { action: 'unpublish', version: item.version },
      })
    ).status(),
  ).toBe(409)
})

test('redirect conflict recovery refreshes destinations published by another administrator', async ({
  page,
  context,
}) => {
  let data = await (
    await context.request.get('/api/studio/seo/technical/')
  ).json()
  data = await (
    await context.request.post('/api/studio/seo/technical/', {
      headers,
      data: {
        action: 'save-redirect',
        id: null,
        version: 0,
        payload: {
          source: '/conflict-source',
          targetId: data.targets[0].id,
          status: 308,
        },
      },
    })
  ).json()
  const rule = data.redirects.find(
    (item: { source: string }) => item.source === '/conflict-source',
  )
  await page.goto('/admin/seo/technical/')
  await page
    .getByRole('row')
    .filter({ hasText: '/conflict-source' })
    .getByRole('button', { name: 'Sửa chuyển hướng' })
    .click()
  await page.getByLabel('URL nguồn', { exact: true }).fill('/local-source-kept')
  const list = (
    await (await context.request.get('/api/studio/content/')).json()
  ).documents
  const seed = (
    await (
      await context.request.get(
        `/api/studio/content/${list.find((item: { kind: string }) => item.kind === 'article').id}/`,
      )
    ).json()
  ).document.draft
  let item = (
    await (
      await context.request.post('/api/studio/content/', {
        headers,
        data: {
          ...seed,
          data: { ...seed.data, slug: 'new-conflict-destination' },
        },
      })
    ).json()
  ).document
  item = (
    await (
      await context.request.patch(`/api/studio/content/${item.id}/`, {
        headers,
        data: { action: 'publish', version: item.version },
      })
    ).json()
  ).document
  expect(
    (
      await context.request.post('/api/studio/seo/technical/', {
        headers,
        data: {
          action: 'save-redirect',
          id: rule.id,
          version: rule.version,
          payload: { source: rule.source, targetId: item.id, status: 308 },
        },
      })
    ).status(),
  ).toBe(200)
  await page
    .getByRole('button', { name: 'Lưu chuyển hướng', exact: true })
    .click()
  await expect(page.getByLabel('Bản trên máy chủ')).toContainText(
    '/kien-thuc/new-conflict-destination',
  )
  await expect(page.getByLabel('URL nguồn', { exact: true })).toHaveValue(
    '/local-source-kept',
  )
  await page.getByRole('button', { name: 'Dùng bản trên máy chủ' }).click()
  await expect(page.getByLabel('Trang đích', { exact: true })).toHaveValue(
    item.id,
  )
  await page.getByLabel('Loại chuyển hướng').selectOption('307')
  await page.setViewportSize({ width: 390, height: 844 })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-redirect-mobile.png',
  })
  await page
    .getByRole('button', { name: 'Lưu chuyển hướng', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const response = await context.request.get('/conflict-source/', {
    maxRedirects: 0,
  })
  expect(response.status()).toBe(307)
  expect(response.headers().location).toBe(
    '/kien-thuc/new-conflict-destination/',
  )
})

test('settings conflict recovery refreshes operational status without losing unsaved input', async ({
  page,
  context,
}) => {
  const current = (
    await (await context.request.get('/api/studio/seo/technical/')).json()
  ).settings
  const initial = await (
    await context.request.post('/api/studio/seo/technical/', {
      headers,
      data: {
        action: 'settings',
        version: current.version,
        payload: {
          googleVerification: [
            'fixture-first-owner_12345',
            'fixture-second-owner_12345',
          ],
          blockIndexing: false,
        },
      },
    })
  ).json()
  await page.goto('/admin/seo/technical/')
  await page.getByLabel('Mã xác minh Google').fill('fixture-local-keep_12345')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page
    .getByRole('link', { name: 'SEO & nội dung', exact: true })
    .last()
    .click()
  await expect(page).toHaveURL(/\/admin\/seo\/technical\/$/)
  await expect(page.getByLabel('Mã xác minh Google')).toHaveValue(
    'fixture-local-keep_12345',
  )
  await context.request.post('/api/studio/seo/technical/', {
    headers,
    data: {
      action: 'settings',
      version: initial.settings.version,
      payload: {
        googleVerification: ['fixture-remote-only_12345'],
        blockIndexing: true,
      },
    },
  })
  await page
    .getByRole('button', { name: 'Lưu cấu hình SEO', exact: true })
    .click()
  await page.getByRole('button', { name: 'Dùng bản trên máy chủ' }).click()
  await expect(page.getByLabel('Mã xác minh Google')).toHaveValue(
    'fixture-remote-only_12345',
  )
  await expect(page.getByLabel('Tạm ngừng lập chỉ mục')).toBeChecked()
  await expect(
    page.getByRole('region', { name: 'Search Console', exact: true }),
  ).toContainText('1 mã đã cấu hình')
  await expect(
    page.getByRole('button', { name: 'Lưu cấu hình SEO', exact: true }),
  ).toBeDisabled()
})

test('technical API rejects forged roles, revoked and disabled sessions and simultaneous stale writes', async ({
  context,
  playwright,
}) => {
  const endpoint = '/api/studio/seo/technical/'
  const initial = await (await context.request.get(endpoint)).json()
  const payload = {
    source: '/technical-race',
    targetId: initial.targets[0].id,
    status: 308,
  }
  const created = await (
    await context.request.post(endpoint, {
      headers,
      data: { action: 'save-redirect', id: null, version: 0, payload },
    })
  ).json()
  const rule = created.redirects.find(
    (item: { source: string }) => item.source === payload.source,
  )
  const writes = await Promise.all(
    [307, 308].map((status) =>
      context.request.post(endpoint, {
        headers,
        data: {
          action: 'save-redirect',
          id: rule.id,
          version: rule.version,
          payload: { ...payload, status },
        },
      }),
    ),
  )
  expect(writes.map((response) => response.status()).sort()).toEqual([200, 409])
  const second = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  const credentials = {
    email: 'technical-role@example.test',
    password: 'Technical-password-728!',
  }
  try {
    let user = (
      await (
        await context.request.post('/api/studio/users/', {
          headers,
          data: { ...credentials, name: 'SEO kỹ thuật', role: 'seo' },
        })
      ).json()
    ).user
    expect(
      (
        await second.post('/api/studio/session/', {
          headers,
          data: credentials,
        })
      ).status(),
    ).toBe(200)
    for (const mutation of [
      {
        action: 'settings',
        version: created.settings.version,
        payload: { googleVerification: [], blockIndexing: false },
      },
      {
        action: 'save-redirect',
        id: null,
        version: 0,
        payload: { ...payload, source: '/forged-admin' },
      },
      { action: 'delete-redirect', id: rule.id, version: 2 },
    ])
      expect(
        (
          await second.post(endpoint, {
            headers: { ...headers, 'x-user-role': 'admin' },
            data: mutation,
          })
        ).status(),
      ).toBe(403)
    await second.delete('/api/studio/session/', { headers })
    expect((await second.get(endpoint)).status()).toBe(401)
    user = (
      await (
        await context.request.patch('/api/studio/users/', {
          headers,
          data: {
            id: user.id,
            revision: user.revision,
            changes: { role: 'admin' },
          },
        })
      ).json()
    ).user
    expect(
      (
        await second.post('/api/studio/session/', {
          headers,
          data: credentials,
        })
      ).status(),
    ).toBe(200)
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
        await second.post(endpoint, {
          headers,
          data: { action: 'delete-redirect', id: rule.id, version: 2 },
        })
      ).status(),
    ).toBe(401)
    expect((await context.request.get(endpoint)).status()).toBe(200)
  } finally {
    await second.dispose()
  }
})
