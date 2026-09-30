import { test, expect } from '@playwright/test'

const headers = { Origin: 'http://127.0.0.1:4174' }
const owner = {
  name: 'Chủ website',
  email: 'owner@example.test',
  password: 'Owner-test-password-728!',
}
const apiKey = 'sk-browser-fixture-success-only'
const config = {
  provider: 'openai',
  model: 'browser-fixture-model',
  maxOutputTokens: 2048,
  dailyTokenBudget: 100000,
  dailyRequestLimit: 50,
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

test('AI provider configuration is protected and tests an actual server adapter with an isolated fixture', async ({
  page,
  context,
  playwright,
}) => {
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  expect((await anonymous.get('/api/studio/ai/provider/')).status()).toBe(401)
  expect(
    (
      await context.request.put('/api/studio/ai/provider/', {
        data: { version: 0, config: { ...config, apiKey } },
      })
    ).status(),
  ).toBe(403)
  const original = await (
    await context.request.get('/api/studio/ai/provider/')
  ).json()
  await page.goto('/admin/ai-assistant/')
  await expect(
    page.getByRole('heading', { name: 'Kết nối AI', exact: true }),
  ).toBeVisible()
  await page.getByLabel('Model', { exact: true }).fill(config.model)
  await page.getByLabel('Khóa API', { exact: true }).fill(apiKey)
  await page.getByRole('button', { name: 'Lưu cấu hình', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  await expect(page.getByLabel('Khóa API', { exact: true })).toHaveValue('')
  await page.reload()
  await expect(page.getByLabel('Model', { exact: true })).toHaveValue(
    config.model,
  )
  await expect(page.getByText('Chưa kiểm tra', { exact: true })).toBeVisible()
  expect(
    await (await context.request.get('/api/studio/ai/provider/')).text(),
  ).not.toContain(apiKey)
  expect(await page.content()).not.toContain(apiKey)
  const beforeConsent = await (
    await context.request.get('/api/studio/ai/provider/')
  ).json()
  for (const consent of [undefined, false]) {
    expect(
      (
        await context.request.post('/api/studio/ai/provider/', {
          headers,
          data: { version: beforeConsent.version, consent },
        })
      ).status(),
    ).toBe(400)
  }
  page.once('dialog', (dialog) => dialog.dismiss())
  await page
    .getByRole('button', { name: 'Kiểm tra kết nối', exact: true })
    .click()
  expect(
    (await (await context.request.get('/api/studio/ai/provider/')).json())
      .budget.requests,
  ).toBe(beforeConsent.budget.requests)
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Kiểm tra kết nối', exact: true })
    .click()
  await expect(
    page.getByText('Kết nối thành công', { exact: true }),
  ).toBeVisible()
  const result = await (
    await context.request.get('/api/studio/ai/provider/')
  ).json()
  expect(result.connection.usage.totalTokens).toBe(35)
  expect(result.version).toBe(original.version + 1)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-ai-provider-desktop.png',
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({
    path: 'artifacts/screenshots/studio-ai-provider-mobile.png',
    fullPage: true,
  })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  for (const control of await page.locator('main input, main button').all()) {
    const box = await control.boundingBox()
    if (box) expect(box.x + box.width).toBeLessThanOrEqual(391)
  }
  await anonymous.dispose()
})

test('AI settings retain unsaved input on conflicts and report provider refusal without false success', async ({
  page,
  context,
}) => {
  let current = await (
    await context.request.get('/api/studio/ai/provider/')
  ).json()
  expect(
    (
      await context.request.put('/api/studio/ai/provider/', {
        headers,
        data: { version: current.version, config: { ...config, apiKey } },
      })
    ).status(),
  ).toBe(200)
  await page.goto('/admin/ai-assistant/')
  await page.getByLabel('Model', { exact: true }).fill('local-model')
  page.once('dialog', (dialog) => dialog.dismiss())
  await page.getByRole('link', { name: 'Nội dung', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/ai-assistant\/$/)
  current = await (await context.request.get('/api/studio/ai/provider/')).json()
  expect(
    (
      await context.request.put('/api/studio/ai/provider/', {
        headers,
        data: {
          version: current.version,
          config: { ...config, model: 'server-model' },
        },
      })
    ).status(),
  ).toBe(200)
  await page.getByRole('button', { name: 'Lưu cấu hình', exact: true }).click()
  await expect(
    page.getByRole('region', { name: 'Bản trên máy chủ' }),
  ).toContainText('server-model')
  await expect(page.getByLabel('Model', { exact: true })).toHaveValue(
    'local-model',
  )
  await page
    .getByRole('button', { name: 'Giữ bản của tôi', exact: true })
    .click()
  await page
    .getByLabel('Khóa API', { exact: true })
    .fill('sk-browser-fixture-unauthorized')
  await page.getByRole('button', { name: 'Lưu cấu hình', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Kiểm tra kết nối', exact: true })
    .click()
  await expect(
    page.getByText('Kết nối thất bại', { exact: true }),
  ).toBeVisible()
  await expect(page.locator('main').getByRole('alert')).toContainText('từ chối khóa')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Gỡ kết nối', exact: true }).click()
  await expect(page.getByText('Chưa cấu hình', { exact: true })).toBeVisible()
})

test('AI status is read-only for editorial roles and denied to viewers, including forged write requests', async ({
  browser,
  context,
}) => {
  for (const role of ['editor', 'seo', 'viewer']) {
    const user = {
      name: `AI ${role}`,
      email: `provider-${role}@example.test`,
      password: 'Provider-role-password-728!',
      role,
    }
    expect(
      (
        await context.request.post('/api/studio/users/', {
          headers,
          data: user,
        })
      ).status(),
    ).toBe(201)
    const other = await browser.newContext({ baseURL: 'http://127.0.0.1:4174' })
    try {
      expect(
        (
          await other.request.post('/api/studio/session/', {
            headers,
            data: { email: user.email, password: user.password },
          })
        ).status(),
      ).toBe(200)
      expect(
        (await other.request.get('/api/studio/ai/provider/')).status(),
      ).toBe(role === 'viewer' ? 403 : 200)
      expect(
        (
          await other.request.put('/api/studio/ai/provider/', {
            headers: { ...headers, 'x-role': 'admin' },
            data: { version: 0, config: { ...config, apiKey } },
          })
        ).status(),
      ).toBe(403)
      expect(
        (
          await other.request.post('/api/studio/ai/provider/', {
            headers,
            data: { version: 0, consent: true },
          })
        ).status(),
      ).toBe(403)
      const page = await other.newPage()
      await page.goto('/admin/ai-assistant/')
      if (role === 'viewer')
        await expect(page).toHaveURL(/\/admin\/dashboard\/$/)
      else {
        await expect(page.getByLabel('Model', { exact: true })).toBeDisabled()
        await expect(
          page.getByRole('button', { name: 'Lưu cấu hình' }),
        ).toHaveCount(0)
        await expect(page.getByLabel('Khóa API', { exact: true })).toHaveCount(
          0,
        )
      }
    } finally {
      await other.close()
    }
  }
})

test('choosing the server configuration explicitly discards only the confirmed local edits', async ({
  page,
  context,
}) => {
  let current = await (
    await context.request.get('/api/studio/ai/provider/')
  ).json()
  expect(
    (
      await context.request.put('/api/studio/ai/provider/', {
        headers,
        data: { version: current.version, config: { ...config, apiKey } },
      })
    ).status(),
  ).toBe(200)
  await page.goto('/admin/ai-assistant/')
  await page.getByLabel('Model', { exact: true }).fill('local-unsaved-model')
  current = await (await context.request.get('/api/studio/ai/provider/')).json()
  expect(
    (
      await context.request.put('/api/studio/ai/provider/', {
        headers,
        data: {
          version: current.version,
          config: { ...config, model: 'remote-confirmed-model' },
        },
      })
    ).status(),
  ).toBe(200)
  await page.getByRole('button', { name: 'Lưu cấu hình', exact: true }).click()
  await page
    .getByRole('button', { name: 'Dùng bản trên máy chủ', exact: true })
    .click()
  await expect(page.getByLabel('Model', { exact: true })).toHaveValue(
    'remote-confirmed-model',
  )
  await expect(
    page.getByRole('button', { name: 'Lưu cấu hình', exact: true }),
  ).toBeDisabled()
  await page.getByRole('link', { name: 'Nội dung', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/content\/$/)
})
