import { test, expect } from '@playwright/test'

const origin = { Origin: 'http://127.0.0.1:4174' }
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
          headers: origin,
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
        headers: origin,
        data: owner,
      })
    ).status(),
  ).toBe(200)
})

test('SEO workspace shows actual draft findings, scans published HTML and keeps planner changes after reload', async ({
  page,
  context,
}) => {
  const response = await context.request.get('/api/studio/seo/')
  expect(response.status()).toBe(200)
  const initial = await response.json()
  const item = initial.rows.find(
    (row: { path: string }) => row.path === '/gioi-thieu',
  )
  const endpoint = `/api/studio/content/${item.id}/`
  const original = (await (await context.request.get(endpoint)).json()).document
  const changed = await context.request.patch(endpoint, {
    headers: origin,
    data: {
      action: 'save-seo',
      version: original.version,
      seo: { ...original.draft.seo, description: '' },
    },
  })
  expect(changed.status()).toBe(200)
  await page.goto('/admin/seo/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'SEO & nội dung',
  )
  await page.getByLabel('Tìm trang SEO').fill('/gioi-thieu')
  await page
    .getByRole('table')
    .getByRole('link', { name: original.draft.data.title, exact: true })
    .click()
  await expect(
    page.getByRole('tab', { name: 'SEO', exact: true }),
  ).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.studio-serp-title')).toHaveText(
    `${original.draft.seo.title} | TBS GROUP`,
  )
  await page.goto('/admin/seo/')
  await page.getByLabel('Tìm trang SEO').fill('/gioi-thieu')
  await expect(page.getByRole('table')).toContainText(
    'Chưa có meta description.',
  )
  await page
    .getByRole('button', { name: 'Quét HTML /gioi-thieu', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã quét')
  await page.getByLabel('Nguồn kiểm tra').selectOption('live')
  await expect(page.getByRole('table')).toContainText('Đã quét')
  const state = await (await context.request.get('/api/studio/seo/')).json()
  const live = state.rows.find((row: { id: string }) => row.id === item.id).live
  expect(live.status).toBe('checked')
  expect(live.headings).toBeGreaterThan(0)
  expect(live.images).toBeGreaterThan(0)
  expect(live.stale).toBe(false)
  await page
    .getByRole('tab', { name: 'Kế hoạch nội dung', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Thêm công việc', exact: true })
    .click()
  await page
    .getByLabel('Từ khóa chính', { exact: true })
    .fill('hồ sơ nhập khẩu chính ngạch')
  await page
    .getByLabel('Công việc', { exact: true })
    .fill('Rà soát chứng từ cho sale')
  await page
    .getByLabel('Nội dung liên quan', { exact: true })
    .selectOption(item.id)
  await page.getByLabel('Hạn hoàn thành', { exact: true }).fill('2026-10-15')
  await page.getByRole('button', { name: 'Lưu công việc', exact: true }).click()
  await expect(page.getByRole('table')).toContainText(
    'Rà soát chứng từ cho sale',
  )
  await page.reload()
  await page
    .getByRole('tab', { name: 'Kế hoạch nội dung', exact: true })
    .click()
  await expect(page.getByRole('table')).toContainText(
    'hồ sơ nhập khẩu chính ngạch',
  )
  await page
    .getByRole('button', { name: 'Sửa Rà soát chứng từ cho sale', exact: true })
    .click()
  await page
    .getByLabel('Trạng thái công việc', { exact: true })
    .selectOption('review')
  await page.getByRole('button', { name: 'Lưu công việc', exact: true }).click()
  await expect(page.getByRole('table')).toContainText('Chờ duyệt')
  await page.getByRole('tab', { name: 'Liên kết nội bộ', exact: true }).click()
  const suggestionsLoaded = page.waitForResponse(response => response.url().includes('/api/studio/seo/links/') && response.status() === 200)
  await page.getByLabel('Trang cần bổ sung liên kết').selectOption(item.id)
  await suggestionsLoaded
  await expect(page.getByRole('heading', { name: 'Trang liên quan đã xuất bản', exact: true })).toBeVisible()
  await expect(page.locator('.studio-link-suggestions')).toBeVisible()
  await page.screenshot({ path: 'artifacts/screenshots/studio-seo-links.png' })
  await page.getByRole('tab', { name: 'Kiểm tra SEO', exact: true }).click()
  await page.screenshot({
    path: 'artifacts/screenshots/studio-seo-desktop.png',
  })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({ path: 'artifacts/screenshots/studio-seo-mobile.png' })
  await page
    .getByRole('tab', { name: 'Kế hoạch nội dung', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Thêm công việc', exact: true })
    .click()
  await page
    .getByLabel('Công việc', { exact: true })
    .fill('Bản chưa lưu trên mobile')
  expect(
    await page.getByRole('dialog').evaluate((node) => node.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-seo-task-mobile.png',
  })
  page.once('dialog', (dialog) => dialog.dismiss())
  await page
    .getByRole('button', { name: 'Đóng công việc', exact: true })
    .click()
  await expect(page.getByLabel('Công việc', { exact: true })).toHaveValue(
    'Bản chưa lưu trên mobile',
  )
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Đóng công việc', exact: true })
    .click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const current = (await (await context.request.get(endpoint)).json()).document
  expect(
    (
      await context.request.patch(endpoint, {
        headers: origin,
        data: {
          action: 'save-seo',
          version: current.version,
          seo: original.draft.seo,
        },
      })
    ).status(),
  ).toBe(200)
})

test('SEO API rejects anonymous, forged viewer mutations, foreign origin and stale planner versions', async ({
  context,
  playwright,
}) => {
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  expect((await anonymous.get('/api/studio/seo/')).status()).toBe(401)
  expect(
    (
      await anonymous.post('/api/studio/seo/audit/', {
        headers: origin,
        data: { id: '00000000-0000-0000-0000-000000000000' },
      })
    ).status(),
  ).toBe(401)
  const credential = {
    email: 'seo-viewer@example.test',
    password: 'Viewer-test-password-728!',
  }
  expect(
    (
      await context.request.post('/api/studio/users/', {
        headers: origin,
        data: { ...credential, name: 'SEO viewer', role: 'viewer' },
      })
    ).status(),
  ).toBe(201)
  expect(
    (
      await anonymous.post('/api/studio/session/', {
        headers: origin,
        data: credential,
      })
    ).status(),
  ).toBe(200)
  const item = (await (await context.request.get('/api/studio/seo/')).json())
    .rows[0]
  const input = {
    keyword: 'SEO',
    title: 'API planner task',
    documentId: item.id,
    assigneeId: null,
    dueDate: '',
    status: 'planned',
    notes: '',
  }
  const mutation = { action: 'save', id: null, version: 0, payload: input }
  expect(
    (
      await anonymous.post('/api/studio/seo/tasks/', {
        headers: { ...origin, 'x-user-role': 'admin' },
        data: mutation,
      })
    ).status(),
  ).toBe(403)
  expect(
    (
      await anonymous.post('/api/studio/seo/audit/', {
        headers: origin,
        data: { id: item.id },
      })
    ).status(),
  ).toBe(403)
  expect(
    (
      await context.request.post('/api/studio/seo/tasks/', {
        headers: { Origin: 'https://other.test' },
        data: mutation,
      })
    ).status(),
  ).toBe(403)
  const created = await context.request.post('/api/studio/seo/tasks/', {
    headers: origin,
    data: mutation,
  })
  expect(created.status()).toBe(200)
  const task = (await created.json()).task
  expect(
    (
      await context.request.post('/api/studio/seo/tasks/', {
        headers: origin,
        data: { ...mutation, id: task.id, version: 0 },
      })
    ).status(),
  ).toBe(409)
  expect(
    (
      await context.request.post('/api/studio/seo/tasks/', {
        headers: origin,
        data: { action: 'delete', id: task.id, version: 1 },
      })
    ).status(),
  ).toBe(200)
  await anonymous.dispose()
})

test('planner conflict recovery preserves local edits and requires review of the current task', async ({
  page,
  context,
}) => {
  const payload = {
    keyword: 'hồ sơ',
    title: 'Công việc xung đột',
    documentId: null,
    assigneeId: null,
    dueDate: '',
    status: 'planned',
    notes: '',
  }
  const created = await context.request.post('/api/studio/seo/tasks/', {
    headers: origin,
    data: { action: 'save', id: null, version: 0, payload },
  })
  expect(created.status()).toBe(200)
  const task = (await created.json()).task
  await page.goto('/admin/seo/?view=planner')
  await page
    .getByRole('button', { name: 'Sửa Công việc xung đột', exact: true })
    .click()
  await page.getByLabel('Công việc', { exact: true }).fill('Công việc của tôi')
  expect(
    (
      await context.request.post('/api/studio/seo/tasks/', {
        headers: origin,
        data: {
          action: 'save',
          id: task.id,
          version: 1,
          payload: {
            ...payload,
            title: 'Công việc người khác',
            notes: 'Nguồn mới',
          },
        },
      })
    ).status(),
  ).toBe(200)
  await page.getByRole('button', { name: 'Lưu công việc', exact: true }).click()
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText(
    'đã thay đổi',
  )
  await expect(
    page.getByRole('button', { name: 'Đối chiếu bản mới', exact: true }),
  ).toBeVisible({ timeout: 1500 })
  await page
    .getByRole('button', { name: 'Đối chiếu bản mới', exact: true })
    .click()
  await expect(page.getByLabel('Công việc', { exact: true })).toHaveValue(
    'Công việc của tôi',
  )
  await expect(
    page.getByRole('region', { name: 'Bản đang lưu trên máy chủ' }),
  ).toContainText('Công việc người khác')
  await expect(
    page.getByRole('region', { name: 'Bản đang lưu trên máy chủ' }),
  ).toContainText('Nguồn mới')
  await page
    .getByRole('button', {
      name: 'Giữ bản của tôi trên phiên bản mới',
      exact: true,
    })
    .click()
  await page.getByRole('button', { name: 'Lưu công việc', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const saved = (
    await (await context.request.get('/api/studio/seo/')).json()
  ).tasks.find((item: { id: string }) => item.id === task.id)
  expect(saved.title).toBe('Công việc của tôi')
  expect(saved.version).toBe(3)
})

test('refresh removes link suggestions for targets no longer published', async ({
  page,
  context,
}) => {
  const documents = (
    await (await context.request.get('/api/studio/seo/')).json()
  ).rows
  let source: { id: string; path: string } | undefined,
    target: { id: string; path: string } | undefined
  for (const document of documents) {
    const suggestions = (
      await (
        await context.request.get(`/api/studio/seo/links/?id=${document.id}`)
      ).json()
    ).suggestions
    if (suggestions.length) {
      source = document
      target = suggestions[0]
      break
    }
  }
  expect(source).toBeDefined()
  expect(target).toBeDefined()
  await page.goto('/admin/seo/')
  await page.getByRole('tab', { name: 'Liên kết nội bộ', exact: true }).click()
  await page.getByLabel('Trang cần bổ sung liên kết').selectOption(source!.id)
  const copy = page.getByRole('button', {
    name: `Sao chép ${target!.path}`,
    exact: true,
  })
  await expect(copy).toBeVisible()
  const endpoint = `/api/studio/content/${target!.id}/`
  const before = (await (await context.request.get(endpoint)).json()).document
  const removed = await context.request.patch(endpoint, {
    headers: origin,
    data: { action: 'unpublish', version: before.version },
  })
  expect(removed.status()).toBe(200)
  await page
    .getByRole('button', { name: 'Tải lại dữ liệu SEO', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã cập nhật')
  await expect(copy).toHaveCount(0)
  expect(
    (
      await context.request.patch(endpoint, {
        headers: origin,
        data: {
          action: 'publish',
          version: (await removed.json()).document.version,
        },
      })
    ).status(),
  ).toBe(200)
})
