import { expect, test } from '@playwright/test'

const origin = { Origin: 'http://127.0.0.1:4174' }
const owner = {
  email: 'owner@example.test',
  password: 'Owner-test-password-728!',
  name: 'Chủ website',
}

test.beforeEach(async ({ context }) => {
  const session = await (
    await context.request.get('/api/studio/session/')
  ).json()
  if (session.setupRequired)
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

test('Industry Workspace creates, reviews, publishes and archives structured content', async ({
  page,
  context,
}) => {
  await page.goto('/admin/industries/')
  await expect(page.getByRole('heading', { name: 'Industry Atlas' })).toBeVisible()
  await expect(page.locator('.studio-projection-status')).toContainText(
    'Chỉ mục tìm kiếm sẵn sàng',
  )
  await expect(page.getByRole('tab', { name: 'Nhóm ngành' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Ngành hàng' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Đặc tính' })).toBeVisible()

  await page.getByRole('tab', { name: 'Nhóm ngành' }).click()
  await page.getByRole('button', { name: 'Tạo nhóm ngành' }).click()
  await page.getByLabel('Tên nhóm ngành').fill('Thiết bị thử nghiệm')
  await page.getByLabel('Đường dẫn nhóm').fill('thiet-bi-thu-nghiem')
  await page
    .getByLabel('Mô tả nhóm')
    .fill('Nhóm được tạo để kiểm thử quy trình quản trị Atlas có cấu trúc.')
  await page.getByRole('button', { name: 'Tạo bản nháp', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/content\/[a-f0-9-]{36}\/$/)
  await expect(page.getByLabel('Thứ tự hiển thị')).toBeVisible()
  await expect(
    page.getByLabel('Thêm mã ngành nổi bật').getByRole('option', {
      name: 'Gia dụng không điện',
    }),
  ).toHaveCount(1)

  await page.goto('/admin/industries/')
  await page.getByRole('tab', { name: 'Ngành hàng' }).click()
  await page.getByRole('button', { name: 'Tạo ngành hàng' }).click()
  await page.getByLabel('Tên ngành hàng').fill('Máy kiểm thử Atlas')
  await page.getByLabel('Đường dẫn ngành').fill('may-kiem-thu-atlas')
  await page
    .getByLabel('Mô tả ngành')
    .fill('Ngành hàng thử nghiệm cho quy trình biên tập và duyệt nghiệp vụ.')
  await page.getByLabel('Nhóm ngành').selectOption({ label: 'Máy móc và dây chuyền' })
  await page.getByRole('button', { name: 'Tạo bản nháp', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/content\/[a-f0-9-]{36}\/$/)
  const id = new URL(page.url()).pathname.split('/').filter(Boolean).at(-1)!

  await expect(page.getByLabel('Nhóm ngành')).toHaveValue('may-moc-day-chuyen')
  await expect(page.getByText('Bí danh tìm kiếm')).toBeVisible()
  await expect(page.getByText('Thông tin kỹ thuật')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Bằng chứng hình ảnh', exact: true }),
  ).toBeVisible()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Xuất bản', exact: true }).click()
  await expect(page.locator('.studio-error[role="alert"]')).toContainText('duyệt')

  await page.getByLabel('Người duyệt nghiệp vụ').fill('Bộ phận XNK TBS')
  await page.getByLabel('Ngày duyệt').fill('2026-09-28T08:00')
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  const preview = await context.request.get(`/studio-preview/${id}/`)
  expect(preview.status()).toBe(200)
  expect(preview.headers()['cache-control']).toContain('no-store')
  expect(preview.headers()['x-robots-tag']).toContain('noindex')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Xuất bản', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã xuất bản')

  await page.goto('/admin/industries/')
  await page.getByRole('tab', { name: 'Ngành hàng' }).click()
  const row = page.getByRole('row').filter({ hasText: 'Máy kiểm thử Atlas' })
  await row.getByRole('button', { name: 'Lưu trữ Máy kiểm thử Atlas' }).click()
  await expect(page.getByRole('dialog', { name: 'Lưu trữ ngành hàng' })).toBeVisible()
  await page.getByRole('button', { name: 'Xác nhận lưu trữ' }).click()
  await expect(row).toContainText('Đã lưu trữ')
  await row.getByRole('button', { name: 'Khôi phục Máy kiểm thử Atlas' }).click()
  await expect(row).toContainText('Bản nháp')

  await page.getByRole('tab', { name: 'Đặc tính' }).click()
  const firstTrait = page.locator('[data-industry-trait]').first()
  const active = firstTrait.getByRole('checkbox', { name: 'Đang sử dụng' })
  await active.uncheck()
  await page.getByRole('button', { name: 'Lưu đặc tính' }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu đặc tính')

  await page.screenshot({ path: 'artifacts/screenshots/studio-industries-desktop.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.screenshot({ path: 'artifacts/screenshots/studio-industries-mobile.png' })
})

test('Industry Workspace respects viewer, SEO and editor capabilities', async ({
  context,
  browser,
}) => {
  for (const role of ['editor', 'seo', 'viewer'] as const) {
    const response = await context.request.post('/api/studio/users/', {
      headers: origin,
      data: {
        name: `Atlas ${role}`,
        email: `atlas-${role}@example.test`,
        password: `Atlas-${role}-password-728!`,
        role,
      },
    })
    expect([201, 409]).toContain(response.status())
  }
  const inventory = await (await context.request.get('/api/studio/content/')).json()
  const industry = inventory.documents.find((item: { kind: string }) => item.kind === 'industry')

  for (const role of ['viewer', 'seo', 'editor'] as const) {
    const roleContext = await browser.newContext({ baseURL: 'http://127.0.0.1:4174' })
    expect(
      (
        await roleContext.request.post('/api/studio/session/', {
          headers: origin,
          data: {
            email: `atlas-${role}@example.test`,
            password: `Atlas-${role}-password-728!`,
          },
        })
      ).status(),
    ).toBe(200)
    const rolePage = await roleContext.newPage()
    await rolePage.goto('/admin/industries/')
    await expect(rolePage.getByRole('heading', { name: 'Industry Atlas' })).toBeVisible()
    await rolePage.getByRole('tab', { name: 'Ngành hàng' }).click()
    await expect(rolePage.getByRole('button', { name: 'Tạo ngành hàng' })).toHaveCount(
      role === 'editor' ? 1 : 0,
    )
    await rolePage.goto(`/admin/content/${industry.id}/`)
    await rolePage.getByRole('tab', { name: 'Nội dung', exact: true }).click()
    if (role === 'editor')
      await expect(rolePage.getByLabel('Tiêu đề', { exact: true })).toBeEnabled()
    else
      await expect(rolePage.getByLabel('Tiêu đề', { exact: true })).toBeDisabled()
    await rolePage.getByRole('tab', { name: 'SEO' }).click()
    if (role === 'viewer')
      await expect(rolePage.getByLabel('SEO title')).toBeDisabled()
    else await expect(rolePage.getByLabel('SEO title')).toBeEnabled()
    await roleContext.close()
  }
})
