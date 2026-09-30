import { test, expect } from '@playwright/test'
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

test('knowledge saves actual drafts, approves separately and retrieves only the approved snapshot with provenance', async ({
  page,
  context,
  playwright,
}) => {
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  expect((await anonymous.get('/api/studio/ai/knowledge/')).status()).toBe(401)
  await anonymous.dispose()
  await page.goto('/admin/ai/knowledge/')
  await page.getByRole('link', { name: 'Thêm nguồn', exact: true }).click()
  await page
    .getByLabel('Tên tài liệu', { exact: true })
    .fill('Hồ sơ chứng từ kiểm thử')
  await page
    .getByLabel('Đơn vị / người cung cấp', { exact: true })
    .fill('TBS - tài liệu thử nghiệm')
  await page
    .getByLabel('URL nguồn', { exact: true })
    .fill('https://example.test/chung-tu')
  await page.getByLabel('Nhãn', { exact: true }).fill('chứng từ, nhập khẩu')
  await page
    .getByLabel('Nội dung nguồn', { exact: true })
    .fill(
      'Invoice và packing list được đối chiếu theo thông tin lô hàng. Đây là bản đã được kiểm tra trong thử nghiệm.',
    )
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/ai\/knowledge\/[a-f0-9-]{36}\/$/)
  const id = new URL(page.url()).pathname.split('/').filter(Boolean).at(-1)!
  expect(
    (
      await (
        await context.request.post('/api/studio/ai/knowledge/context/', {
          headers,
          data: { query: 'chứng từ' },
        })
      ).json()
    ).sources.some((item: { id: string }) => item.id === id),
  ).toBe(false)
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Duyệt cho AI', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã duyệt')
  await page
    .getByLabel('Nội dung nguồn', { exact: true })
    .fill(
      'Bản nháp chưa được duyệt có thông tin khác và không được gửi làm căn cứ cho AI.',
    )
  page.once('dialog', (dialog) => dialog.dismiss())
  await page
    .getByRole('link', { name: 'Kho kiến thức', exact: true })
    .first()
    .click()
  await expect(page.getByLabel('Nội dung nguồn', { exact: true })).toHaveValue(
    /Bản nháp chưa được duyệt/,
  )
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await page.reload()
  const retrieved = await (
    await context.request.post('/api/studio/ai/knowledge/context/', {
      headers,
      data: { query: 'chứng từ' },
    })
  ).json()
  const source = retrieved.sources.find(
    (item: { id: string }) => item.id === id,
  )
  expect(source.excerpt).toContain('Invoice')
  expect(source.excerpt).not.toContain('Bản nháp chưa')
  expect(source.sourceUrl).toBe('https://example.test/chung-tu')
  await page.getByRole('tab', { name: 'So sánh bản duyệt' }).click()
  await expect(
    page.getByRole('region', { name: 'Bản đang dùng cho AI' }),
  ).toContainText('Invoice')
  await expect(
    page.getByRole('region', { name: 'Bản đang dùng cho AI' }),
  ).toContainText('Doanh nghiệp')
  await page.screenshot({
    path: 'artifacts/screenshots/studio-knowledge-compare.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({
    path: 'artifacts/screenshots/studio-knowledge-mobile.png',
    fullPage: true,
  })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Rút duyệt', exact: true }).click()
  expect(
    (
      await (
        await context.request.post('/api/studio/ai/knowledge/context/', {
          headers,
          data: { query: 'chứng từ' },
        })
      ).json()
    ).sources.some((item: { id: string }) => item.id === id),
  ).toBe(false)
})

test('knowledge search, context preview and source conflicts preserve local text until an explicit choice', async ({
  page,
  context,
}) => {
  const created = await (
    await context.request.post('/api/studio/ai/knowledge/', {
      headers,
      data: {
        payload: {
          title: 'Nguồn vận chuyển riêng',
          category: 'service',
          sourceName: 'TBS fixture',
          sourceUrl: '',
          body: 'Vận chuyển hàng cần đối chiếu đóng gói và thông tin tuyến trước khi tư vấn.',
          tags: ['vận chuyển'],
          reviewDue: '',
        },
      },
    })
  ).json()
  await page.goto(`/admin/ai/knowledge/${created.id}/`)
  await page
    .getByLabel('Tên tài liệu', { exact: true })
    .fill('Tên cục bộ chưa ghi đè')
  expect(
    (
      await context.request.patch(`/api/studio/ai/knowledge/${created.id}/`, {
        headers,
        data: {
          action: 'save',
          version: created.version,
          payload: { ...created.draft, title: 'Tên trên máy chủ' },
        },
      })
    ).status(),
  ).toBe(200)
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(
    page.getByRole('region', { name: 'Xung đột phiên bản' }),
  ).toContainText('Tên trên máy chủ')
  await expect(page.getByLabel('Tên tài liệu', { exact: true })).toHaveValue(
    'Tên cục bộ chưa ghi đè',
  )
  await page
    .getByRole('button', { name: 'Giữ bản của tôi', exact: true })
    .click()
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Duyệt cho AI', exact: true }).click()
  await page
    .getByRole('link', { name: 'Kho kiến thức', exact: true })
    .first()
    .click()
  await page.getByLabel('Tìm nguồn', { exact: true }).fill('cuc bo')
  await expect(
    page.getByRole('link', { name: 'Tên cục bộ chưa ghi đè', exact: true }),
  ).toBeVisible()
  await page.getByLabel('Chủ đề đối chiếu', { exact: true }).fill('vận chuyển')
  await page
    .getByRole('button', { name: 'Đối chiếu nguồn', exact: true })
    .click()
  await expect(
    page.getByRole('region', { name: 'Nguồn phù hợp' }),
  ).toContainText('TBS fixture')
  await page.screenshot({
    path: 'artifacts/screenshots/studio-knowledge-library.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({
    path: 'artifacts/screenshots/studio-knowledge-library-mobile.png',
    fullPage: true,
  })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
})

test('changing the query while retrieval is pending cannot show evidence for the old query', async ({
  page,
}) => {
  await page.goto('/admin/ai/knowledge/')
  let release!: () => void, reached!: () => void
  const gate = new Promise<void>((resolve) => {
      release = resolve
    }),
    ready = new Promise<void>((resolve) => {
      reached = resolve
    })
  await page.route('**/api/studio/ai/knowledge/context/', async (route) => {
    const response = await route.fetch()
    reached()
    await gate
    await route.fulfill({ response })
  })
  await page.getByLabel('Chủ đề đối chiếu', { exact: true }).fill('vận chuyển')
  await page
    .getByRole('button', { name: 'Đối chiếu nguồn', exact: true })
    .click()
  await ready
  await page
    .getByLabel('Chủ đề đối chiếu', { exact: true })
    .fill('chủ đề khác chưa tra cứu')
  release()
  await expect(
    page.getByRole('button', { name: 'Đối chiếu nguồn', exact: true }),
  ).toBeEnabled()
  await expect(page.getByRole('region', { name: 'Nguồn phù hợp' })).toHaveCount(
    0,
  )
})

test('brand instructions persist with optimistic conflict checks and do not change public copy', async ({
  page,
  context,
}) => {
  await page.goto('/admin/ai/instructions/')
  const current = await (
    await context.request.get('/api/studio/ai/instructions/')
  ).json()
  await page
    .getByLabel('Giọng văn', { exact: true })
    .fill(
      'Chính xác, ngắn gọn, tránh các khẳng định không có nguồn chứng minh.',
    )
  await page
    .getByRole('button', { name: 'Lưu nguyên tắc', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  await page.reload()
  await expect(page.getByLabel('Giọng văn', { exact: true })).toHaveValue(
    /Chính xác, ngắn gọn/,
  )
  expect(
    (
      await context.request.put('/api/studio/ai/instructions/', {
        headers,
        data: { version: current.version, values: current.values },
      })
    ).status(),
  ).toBe(409)
  const result = await (
    await context.request.post('/api/studio/ai/knowledge/context/', {
      headers,
      data: { query: 'chứng từ' },
    })
  ).json()
  expect(result.policy.values.tone).toContain('Chính xác, ngắn gọn')
  expect(await (await context.request.get('/')).text()).not.toContain(
    'Chính xác, ngắn gọn, tránh các khẳng định',
  )
  await page.screenshot({
    path: 'artifacts/screenshots/studio-ai-instructions.png',
    fullPage: true,
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({
    path: 'artifacts/screenshots/studio-ai-instructions-mobile.png',
    fullPage: true,
  })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  for (const keepLocal of [true, false]) {
    const server = await (
      await context.request.get('/api/studio/ai/instructions/')
    ).json()
    await page
      .getByLabel('Giọng văn', { exact: true })
      .fill(`Local tone remains pending for conflict choice ${keepLocal}.`)
    expect(
      (
        await context.request.put('/api/studio/ai/instructions/', {
          headers,
          data: {
            version: server.version,
            values: {
              ...server.values,
              tone: `Remote tone for conflict choice ${keepLocal}.`,
            },
          },
        })
      ).status(),
    ).toBe(200)
    await page
      .getByRole('button', { name: 'Lưu nguyên tắc', exact: true })
      .click()
    await expect(
      page.getByRole('region', { name: 'Bản trên máy chủ' }),
    ).toContainText(`Remote tone for conflict choice ${keepLocal}.`)
    await expect(page.getByLabel('Giọng văn', { exact: true })).toHaveValue(
      `Local tone remains pending for conflict choice ${keepLocal}.`,
    )
    await page
      .getByRole('button', {
        name: keepLocal ? 'Giữ bản của tôi' : 'Dùng bản trên máy chủ',
        exact: true,
      })
      .click()
    if (keepLocal) {
      await page
        .getByRole('button', { name: 'Lưu nguyên tắc', exact: true })
        .click()
      await expect(page.getByRole('status')).toContainText('Đã lưu')
    }
    await page.reload()
    await expect(page.getByLabel('Giọng văn', { exact: true })).toHaveValue(
      keepLocal
        ? `Local tone remains pending for conflict choice ${keepLocal}.`
        : `Remote tone for conflict choice ${keepLocal}.`,
    )
  }
})

test('an archive conflict can be reactivated without discarding kept local edits', async ({
  page,
  context,
}) => {
  const source = await (
    await context.request.post('/api/studio/ai/knowledge/', {
      headers,
      data: {
        payload: {
          title: 'Archive conflict source',
          category: 'reference',
          sourceName: 'TBS fixture',
          sourceUrl: '',
          body: 'Source text for archive conflict and local recovery.',
          tags: [],
          reviewDue: '',
        },
      },
    })
  ).json()
  await page.goto(`/admin/ai/knowledge/${source.id}/`)
  await page
    .getByLabel('Tên tài liệu', { exact: true })
    .fill('Local changes retained after reactivation')
  expect(
    (
      await context.request.patch(`/api/studio/ai/knowledge/${source.id}/`, {
        headers,
        data: { action: 'archive', version: source.version },
      })
    ).status(),
  ).toBe(200)
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(
    page.getByRole('region', { name: 'Xung đột phiên bản' }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Giữ bản của tôi', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Khôi phục nguồn', exact: true }),
  ).toBeEnabled()
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Khôi phục nguồn', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã khôi phục')
  await expect(page.getByLabel('Tên tài liệu', { exact: true })).toHaveValue(
    'Local changes retained after reactivation',
  )
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  await page.reload()
  await expect(page.getByLabel('Tên tài liệu', { exact: true })).toHaveValue(
    'Local changes retained after reactivation',
  )
})

test('knowledge API rejects cross-origin and viewer access while editors can draft but never approve or change instructions', async ({
  browser,
  context,
}) => {
  const payload = {
    title: 'Nguồn thử phân quyền',
    category: 'reference',
    sourceName: 'TBS fixture',
    sourceUrl: '',
    body: '<img src=x onerror="window.knowledgeInjected=true"> Chứng từ này chỉ là dữ liệu văn bản trong kiểm thử.',
    tags: [],
    reviewDue: '',
  }
  expect(
    (
      await context.request.post('/api/studio/ai/knowledge/', {
        data: { payload },
      })
    ).status(),
  ).toBe(403)
  for (const role of ['editor', 'viewer']) {
    const user = {
      name: `Knowledge ${role}`,
      role,
      email: `knowledge-ui-${role}@example.test`,
      password: 'Knowledge-ui-password-731!',
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
        (await other.request.get('/api/studio/ai/knowledge/')).status(),
      ).toBe(role === 'viewer' ? 403 : 200)
      const created = await other.request.post('/api/studio/ai/knowledge/', {
        headers,
        data: { payload },
      })
      expect(created.status()).toBe(role === 'viewer' ? 403 : 201)
      expect(
        (
          await other.request.put('/api/studio/ai/instructions/', {
            headers,
            data: { version: 0, values: {} },
          })
        ).status(),
      ).toBe(403)
      if (role === 'editor') {
        const source = await created.json()
        expect(
          (
            await other.request.patch(
              `/api/studio/ai/knowledge/${source.id}/`,
              {
                headers: { ...headers, 'x-role': 'admin' },
                data: { action: 'approve', version: source.version },
              },
            )
          ).status(),
        ).toBe(403)
        expect(
          (
            await other.request.delete(
              `/api/studio/ai/knowledge/${source.id}/`,
              { headers, data: { version: source.version } },
            )
          ).status(),
        ).toBe(403)
        const page = await other.newPage()
        await page.goto(`/admin/ai/knowledge/${source.id}/`)
        await expect(
          page.getByRole('button', { name: 'Duyệt cho AI' }),
        ).toHaveCount(0)
        await page.getByRole('tab', { name: 'So sánh bản duyệt' }).click()
        expect(await page.evaluate(() => 'knowledgeInjected' in window)).toBe(
          false,
        )
        await expect(page.locator('main img')).toHaveCount(0)
        await expect(
          page.getByRole('region', { name: 'Bản nháp hiện tại' }),
        ).toContainText('<img src=x')
      }
    } finally {
      await other.close()
    }
  }
})
