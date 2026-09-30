import { test, expect } from '@playwright/test'
import type { BrowserContext } from '@playwright/test'
import { randomUUID } from 'node:crypto'
const headers = { Origin: 'http://127.0.0.1:4174' }
test('contextual AI requires authorization and never exposes history anonymously', async ({
  request,
}) => {
  expect((await request.get('/api/studio/ai/generations/')).status()).toBe(401)
})

test('AI request fields wait for client readiness before accepting a brief', async ({
  browser,
  context,
  page,
}) => {
  const doc = await setup(context)
  const staticContext = await browser.newContext({
    storageState: await context.storageState(),
    javaScriptEnabled: false,
  })
  try {
    const staticPage = await staticContext.newPage()
    await staticPage.goto(
      `http://127.0.0.1:4174/admin/content/${doc.id}/?tab=ai`,
    )
    await expect(
      staticPage.getByLabel('Yêu cầu biên tập', { exact: true }),
    ).toBeDisabled()
    await expect(
      staticPage.getByLabel('Tác vụ', { exact: true }),
    ).toBeDisabled()
  } finally {
    await staticContext.close()
  }
  await page.goto(`/admin/content/${doc.id}/?tab=ai`)
  const prompt = page.getByLabel('Yêu cầu biên tập', { exact: true })
  await prompt.fill(
    'Yêu cầu đầu tiên phải được giữ sau khi giao diện sẵn sàng.',
  )
  await expect(
    page.getByRole('button', { name: 'Tạo đề xuất', exact: true }),
  ).toBeEnabled()
  await expect(prompt).toHaveValue(
    'Yêu cầu đầu tiên phải được giữ sau khi giao diện sẵn sàng.',
  )
})

test('switching editor tabs preserves the pending AI brief and selected proposal', async ({
  page,
  context,
}) => {
  const doc = await setup(context)
  await page.goto(`/admin/content/${doc.id}/?tab=ai`)
  const panel = page.getByRole('region', { name: 'Đề xuất AI', exact: true }),
    prompt = 'Giữ yêu cầu đang soạn khi đối chiếu các tab nội dung.'
  await panel.getByLabel('Yêu cầu biên tập', { exact: true }).fill(prompt)
  await panel.getByLabel('Tác vụ', { exact: true }).selectOption('seo')
  await page.getByRole('tab', { name: 'Nội dung', exact: true }).click()
  await page.getByRole('tab', { name: 'AI', exact: true }).click()
  await expect(
    panel.getByLabel('Yêu cầu biên tập', { exact: true }),
  ).toHaveValue(prompt)
  await expect(panel.getByLabel('Tác vụ', { exact: true })).toHaveValue('seo')
  page.once('dialog', (dialog) => dialog.accept())
  await panel.getByRole('button', { name: 'Tạo đề xuất', exact: true }).click()
  const result = panel.getByRole('region', {
    name: 'Kết quả đề xuất',
    exact: true,
  })
  await result
    .getByRole('checkbox', { name: 'Tiêu đề SEO', exact: true })
    .check()
  await page.getByRole('tab', { name: 'SEO', exact: true }).click()
  await page.getByRole('tab', { name: 'AI', exact: true }).click()
  await expect(
    result.getByRole('checkbox', { name: 'Tiêu đề SEO', exact: true }),
  ).toBeChecked()
})

async function setup(context: BrowserContext) {
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
  const provider = await (
    await context.request.get('/api/studio/ai/provider/')
  ).json()
  expect(
    (
      await context.request.put('/api/studio/ai/provider/', {
        headers,
        data: {
          version: provider.version,
          config: {
            provider: 'openai',
            model: 'editor-fixture',
            maxOutputTokens: 2048,
            dailyTokenBudget: 100000,
            dailyRequestLimit: 100,
            apiKey: 'sk-browser-fixture-success-only',
          },
        },
      })
    ).status(),
  ).toBe(200)
  const response = await context.request.post('/api/studio/content/', {
    headers,
    data: {
      kind: 'article',
      data: {
        slug: `ai-test-${Date.now()}`,
        title: 'Bản nháp AI riêng để kiểm thử',
        summary: 'Nội dung gốc không tự thay đổi.',
        image: '/images/marketing/containers.webp',
        category: 'Kiến thức',
        categorySlug: 'kien-thuc',
        sections: [
          {
            heading: 'Nội dung gốc',
            body: ['Chỉ dùng dữ liệu này trong kiểm thử giao diện AI.'],
          },
        ],
      },
      seo: {
        title: 'Tiêu đề gốc',
        description: 'Mô tả gốc',
        canonical: '',
        noindex: false,
        image: '',
      },
    },
  })
  expect(response.status()).toBe(201)
  return (await response.json()).document
}

test('AI HTTP commands enforce current roles, same-origin consent and draft-only SEO writes', async ({
  context,
  browser,
}) => {
  const doc = await setup(context),
    provider = await (
      await context.request.get('/api/studio/ai/provider/')
    ).json()
  const input = {
    id: randomUUID(),
    documentId: doc.id,
    documentVersion: doc.version,
    providerVersion: provider.version,
    task: 'rewrite',
    fields: ['title'],
    prompt: 'Only propose a reviewed title change.',
    consent: true,
  }
  expect(
    (
      await context.request.post('/api/studio/ai/generations/', { data: input })
    ).status(),
  ).toBe(403)
  expect(
    (
      await context.request.post('/api/studio/ai/generations/', {
        headers,
        data: { ...input, consent: false },
      })
    ).status(),
  ).toBe(400)
  const ownerJob = await (
    await context.request.post('/api/studio/ai/generations/', {
      headers,
      data: input,
    })
  ).json()
  for (const role of ['editor', 'seo', 'viewer']) {
    const user = {
      name: `Generation ${role}`,
      role,
      email: `generation-${role}@example.test`,
      password: 'Generation-browser-password-728!',
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
            data: user,
          })
        ).status(),
      ).toBe(200)
      expect(
        (
          await other.request.get(`/api/studio/ai/generations/${ownerJob.id}/`)
        ).status(),
      ).toBe(role === 'viewer' ? 403 : 200)
      expect(
        (
          await other.request.delete(
            `/api/studio/ai/generations/${ownerJob.id}/`,
            {
              headers: { ...headers, 'x-role': 'admin' },
              data: { version: ownerJob.version },
            },
          )
        ).status(),
      ).toBe(403)
      const generated = await other.request.post(
        '/api/studio/ai/generations/',
        {
          headers: { ...headers, 'x-role': 'admin' },
          data: { ...input, id: randomUUID() },
        },
      )
      expect(generated.status()).toBe(role === 'editor' ? 200 : 403)
      if (role === 'seo') {
        expect(
          (
            await other.request.patch(
              `/api/studio/ai/generations/${ownerJob.id}/`,
              {
                headers,
                data: {
                  version: ownerJob.version,
                  documentVersion: doc.version,
                  fields: ['title'],
                  consent: true,
                },
              },
            )
          ).status(),
        ).toBe(403)
        const response = await other.request.post(
          '/api/studio/ai/generations/',
          {
            headers,
            data: {
              ...input,
              id: randomUUID(),
              task: 'seo',
              fields: ['seo.title'],
            },
          },
        )
        expect(response.status()).toBe(200)
        const job = await response.json()
        const applied = await other.request.patch(
          `/api/studio/ai/generations/${job.id}/`,
          {
            headers,
            data: {
              version: job.version,
              documentVersion: doc.version,
              fields: ['seo.title'],
              consent: true,
            },
          },
        )
        expect(applied.status()).toBe(200)
        const changed = (await applied.json()).document
        expect(changed.draft.data).toEqual(doc.draft.data)
        expect(changed.draft.seo.title).toBe('Đề xuất kiểm thử cho Tiêu đề SEO')
        expect(changed.published).toBeNull()
      }
    } finally {
      await other.close()
    }
  }
})

test('lost apply responses reconcile once and concurrent content edits cannot be overwritten', async ({
  page,
  context,
}) => {
  const doc = await setup(context)
  await page.goto(`/admin/content/${doc.id}/?tab=ai`)
  const panel = page.getByRole('region', { name: 'Đề xuất AI', exact: true }),
    result = panel.getByRole('region', { name: 'Kết quả đề xuất', exact: true })
  await panel
    .getByLabel('Yêu cầu biên tập', { exact: true })
    .fill('Đề xuất tiêu đề và mô tả để kiểm tra từng phần.')
  page.once('dialog', (dialog) => dialog.accept())
  await panel.getByRole('button', { name: 'Tạo đề xuất', exact: true }).click()
  await result.getByRole('checkbox', { name: 'Tiêu đề', exact: true }).check()
  await page.route('**/api/studio/ai/generations/*/', async (route) => {
    if (route.request().method() !== 'PATCH') return route.continue()
    await route.fetch()
    await route.abort('failed')
  })
  page.once('dialog', (dialog) => dialog.accept())
  await result
    .getByRole('button', { name: 'Áp dụng mục đã chọn', exact: true })
    .click()
  await expect(panel).toContainText(
    'Đã xác nhận thay đổi được lưu vào bản nháp.',
  )
  await page.unrouteAll({ behavior: 'wait' })
  const after = (
    await (await context.request.get(`/api/studio/content/${doc.id}/`)).json()
  ).document
  expect(after.version).toBe(doc.version + 1)
  expect(after.draft.data.summary).toBe(doc.draft.data.summary)
  const remote = await context.request.patch(`/api/studio/content/${doc.id}/`, {
    headers,
    data: {
      action: 'save',
      version: after.version,
      payload: {
        ...after.draft,
        data: {
          ...after.draft.data,
          summary: 'Remote editor kept this summary.',
        },
      },
    },
  })
  expect(remote.status()).toBe(200)
  await result
    .getByRole('checkbox', { name: 'Mô tả ngắn', exact: true })
    .check()
  page.once('dialog', (dialog) => dialog.accept())
  await result
    .getByRole('button', { name: 'Áp dụng mục đã chọn', exact: true })
    .click()
  await expect(panel.getByRole('alert')).toContainText('đã thay đổi')
  const final = (
    await (await context.request.get(`/api/studio/content/${doc.id}/`)).json()
  ).document
  expect(final.draft.data.summary).toBe('Remote editor kept this summary.')
  expect(final.published).toBeNull()
})
test('AI editor generates contextual proposals, requires consent and applies only selected draft fields', async ({
  page,
  context,
}) => {
  const doc = await setup(context)
  await page.goto(`/admin/content/${doc.id}/?tab=ai`)
  const panel = page.getByRole('region', { name: 'Đề xuất AI', exact: true })
  await panel
    .getByLabel('Yêu cầu biên tập', { exact: true })
    .fill('Viết rõ ràng phần tiêu đề và mô tả trong phạm vi nguồn đã cung cấp.')
  const before = await (
    await context.request.get('/api/studio/ai/provider/')
  ).json()
  page.once('dialog', (dialog) => dialog.dismiss())
  await panel.getByRole('button', { name: 'Tạo đề xuất', exact: true }).click()
  expect(
    (await (await context.request.get('/api/studio/ai/provider/')).json())
      .budget.requests,
  ).toBe(before.budget.requests)
  page.once('dialog', (dialog) => dialog.accept())
  await panel.getByRole('button', { name: 'Tạo đề xuất', exact: true }).click()
  const result = panel.getByRole('region', {
    name: 'Kết quả đề xuất',
    exact: true,
  })
  await expect(result).toContainText('Đề xuất kiểm thử cho Tiêu đề')
  const unchanged = (
    await (await context.request.get(`/api/studio/content/${doc.id}/`)).json()
  ).document
  expect(unchanged.draft).toEqual(doc.draft)
  await result.getByRole('checkbox', { name: 'Tiêu đề', exact: true }).check()
  await expect(
    result.getByRole('checkbox', { name: 'Mô tả ngắn', exact: true }),
  ).not.toBeChecked()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: 'artifacts/screenshots/studio-ai-proposal-desktop.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: 'artifacts/screenshots/studio-ai-proposal-mobile.png',
    fullPage: true,
  })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  page.once('dialog', (dialog) => dialog.accept())
  await result
    .getByRole('button', { name: 'Áp dụng mục đã chọn', exact: true })
    .click()
  await expect(panel).toContainText('Đã áp dụng vào bản nháp')
  const changed = (
    await (await context.request.get(`/api/studio/content/${doc.id}/`)).json()
  ).document
  expect(changed.draft.data.title).toBe('Đề xuất kiểm thử cho Tiêu đề')
  expect(changed.draft.data.summary).toBe(doc.draft.data.summary)
  expect(changed.published).toBeNull()
  await page.reload()
  await panel
    .getByRole('region', { name: 'Lịch sử AI', exact: true })
    .getByRole('button', { name: 'Viết lại', exact: true })
    .first()
    .click()
  await expect(
    panel.getByRole('region', { name: 'Kết quả đề xuất', exact: true }),
  ).toContainText('Đã áp dụng')
})
test('lost generation responses recover through history, and malformed provider output cannot become a proposal', async ({
  page,
  context,
}) => {
  const doc = await setup(context)
  await page.goto(`/admin/content/${doc.id}/?tab=ai`)
  const panel = page.getByRole('region', { name: 'Đề xuất AI', exact: true })
  await panel
    .getByLabel('Yêu cầu biên tập', { exact: true })
    .fill('Viết lại nội dung trong phạm vi đã chọn.')
  await page.route(
    '**/api/studio/ai/generations/',
    async (route) => {
      await route.fetch()
      await route.abort('failed')
    },
    { times: 1 },
  )
  page.once('dialog', (dialog) => dialog.accept())
  await panel.getByRole('button', { name: 'Tạo đề xuất', exact: true }).click()
  await expect(panel.getByRole('alert')).toBeVisible()
  const budget = (
    await (await context.request.get('/api/studio/ai/provider/')).json()
  ).budget.requests
  await panel
    .getByRole('button', { name: 'Kiểm tra kết quả yêu cầu', exact: true })
    .click()
  await expect(
    panel.getByRole('region', { name: 'Kết quả đề xuất' }),
  ).toContainText('Đề xuất kiểm thử')
  expect(
    (await (await context.request.get('/api/studio/ai/provider/')).json())
      .budget.requests,
  ).toBe(budget)
  await panel
    .getByLabel('Yêu cầu biên tập', { exact: true })
    .fill('[fixture:invalid] output must be rejected')
  page.once('dialog', (dialog) => dialog.accept())
  await panel.getByRole('button', { name: 'Tạo đề xuất', exact: true }).click()
  await expect(
    panel.getByRole('region', { name: 'Kết quả đề xuất' }),
  ).toContainText('Phản hồi không đúng cấu trúc')
  await expect(
    panel.getByRole('button', { name: 'Áp dụng mục đã chọn' }),
  ).toHaveCount(0)
})

test('all seven editor tasks expose approved sources and open from the global history on desktop and mobile', async ({
  page,
  context,
}) => {
  const doc = await setup(context)
  const created = await context.request.post('/api/studio/ai/knowledge/', {
    headers,
    data: {
      payload: {
        title: 'Nguồn chuẩn biên tập cho AI',
        category: 'company',
        sourceName: 'TBS fixture',
        sourceUrl: 'https://example.test/tbs-source',
        body: 'Thông tin biên tập đã được duyệt cho tiêu đề và mô tả. Chỉ sử dụng dữ liệu đã đối chiếu, không tự đưa ra cam kết về thuế hoặc thời gian.',
        tags: [],
        reviewDue: '',
      },
    },
  })
  expect(created.status()).toBe(201)
  const source = await created.json()
  expect(
    (
      await context.request.patch(`/api/studio/ai/knowledge/${source.id}/`, {
        headers,
        data: { action: 'approve', version: source.version },
      })
    ).status(),
  ).toBe(200)
  await page.goto(`/admin/content/${doc.id}/?tab=ai`)
  const panel = page.getByRole('region', { name: 'Đề xuất AI', exact: true }),
    result = panel.getByRole('region', { name: 'Kết quả đề xuất', exact: true })
  await panel
    .getByLabel('Yêu cầu biên tập', { exact: true })
    .fill('Dùng nguồn chuẩn biên tập cho AI để đối chiếu thông tin.')
  for (const task of [
    'brief',
    'outline',
    'draft',
    'rewrite',
    'seo',
    'faq',
    'links',
  ]) {
    await panel.getByLabel('Tác vụ', { exact: true }).selectOption(task)
    page.once('dialog', (dialog) => dialog.accept())
    await panel
      .getByRole('button', { name: 'Tạo đề xuất', exact: true })
      .click()
    await expect(result).toContainText(
      'Đề xuất biên tập từ nhà cung cấp kiểm thử cô lập.',
    )
    if (!((await result.locator('details').getAttribute('open')) !== null))
      await result.locator('summary').click()
    await expect(result).toContainText('Nguồn chuẩn biên tập cho AI')
    await expect(
      result.getByRole('link', { name: 'https://example.test/tbs-source' }),
    ).toBeVisible()
    if (['brief', 'outline', 'links'].includes(task))
      await expect(result.getByRole('checkbox')).toHaveCount(0)
    else await expect(result.getByRole('checkbox')).toHaveCount(2)
    if (task === 'links')
      await expect(
        result
          .getByRole('region', { name: 'Liên kết đề xuất' })
          .getByRole('link'),
      ).toHaveCount(1)
  }
  expect(
    (await (await context.request.get(`/api/studio/content/${doc.id}/`)).json())
      .document.draft,
  ).toEqual(doc.draft)
  await panel.getByRole('link', { name: 'Không gian AI', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Đề xuất & lịch sử AI' }),
  ).toBeVisible()
  await page.getByLabel('Trạng thái', { exact: true }).selectOption('completed')
  await page.screenshot({
    path: 'artifacts/screenshots/studio-ai-history-desktop.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({
    path: 'artifacts/screenshots/studio-ai-history-mobile.png',
    fullPage: true,
  })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page
    .getByRole('link', { name: doc.draft.data.title, exact: true })
    .first()
    .click()
  await expect(result).toContainText('Nguồn chuẩn biên tập cho AI')
})
