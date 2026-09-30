import { test, expect } from '@playwright/test'

const owner = {
  email: 'owner@example.test',
  password: 'Owner-test-password-728!',
  name: 'Chủ website',
}
const origin = { Origin: 'http://127.0.0.1:4174' }

test('owner setup, actual login, team management, revocation and mobile access', async ({
  page,
  context,
  playwright,
}) => {
  const anonymous = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
  })
  expect((await anonymous.get('/api/studio/users/')).status()).toBe(401)
  expect(
    (await anonymous.post('/api/studio/setup/', { data: {} })).status(),
  ).toBe(403)
  expect((await anonymous.get('/api/admin/users/')).status()).toBe(410)
  expect(
    (
      await anonymous.post('/api/gemini/', { data: { message: 'test' } })
    ).status(),
  ).toBe(410)
  const legacyCms = await anonymous.get('/admin/index.html', {
    maxRedirects: 0,
  })
  expect(legacyCms.status()).toBe(307)
  expect(legacyCms.headers().location).toBe('/admin/')
  await page.goto('/admin/')
  await expect(
    page.getByRole('heading', { name: 'Khởi tạo quản trị' }),
  ).toBeVisible()
  await page.getByLabel('Họ và tên').fill(owner.name)
  await page.getByLabel('Email', { exact: true }).fill(owner.email)
  await page.getByLabel('Mật khẩu', { exact: true }).fill(owner.password)
  await page
    .getByLabel('Mã khởi tạo')
    .fill('isolated-test-bootstrap-token-at-least-32-characters')
  await page.getByRole('button', { name: 'Tạo tài khoản chủ sở hữu' }).click()
  await expect(page.getByRole('status')).toContainText('Đã tạo tài khoản')
  await page.getByLabel('Email', { exact: true }).fill(owner.email)
  await page.getByLabel('Mật khẩu', { exact: true }).fill('incorrect-password')
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page.locator('.studio-form').getByRole('alert')).toContainText(
    'không đúng',
  )
  await page.getByLabel('Mật khẩu', { exact: true }).fill(owner.password)
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page).toHaveURL(/\/admin\/dashboard\/$/)
  await expect(page.getByRole('heading', { name: 'Tổng quan' })).toBeVisible()
  const sessionCookie = (await context.cookies()).find(
    (cookie) => cookie.name === 'tbs-studio-session',
  )!
  expect(sessionCookie.httpOnly).toBe(true)
  expect(sessionCookie.sameSite).toBe('Strict')
  expect(
    await page.evaluate(() => localStorage.getItem('admin_token')),
  ).toBeNull()
  await page.screenshot({
    path: 'artifacts/screenshots/studio-dashboard-desktop.png',
  })
  expect((await anonymous.get('/api/studio/content/')).status()).toBe(401)
  await page.getByRole('link', { name: 'Nội dung', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Nội dung website' }),
  ).toBeVisible()
  await page.getByLabel('Tìm nội dung').fill('Chuẩn bị thông tin lô hàng')
  await page
    .getByRole('table')
    .getByRole('link', { name: /Chuẩn bị thông tin lô hàng/ })
    .click()
  await expect(page).toHaveURL(/\/admin\/content\/[a-f0-9-]{36}\/$/)
  const contentId = new URL(page.url()).pathname
    .split('/')
    .filter(Boolean)
    .at(-1)!
  const originalResponse = await context.request.get(`/api/studio/content/${contentId}/`)
  expect(originalResponse.status()).toBe(200)
  const oldDocument = (await originalResponse.json()).document
  await page
    .getByLabel('Tiêu đề', { exact: true })
    .fill('Bản nháp thử nghiệm độc lập')
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  await page.reload()
  await expect(page.getByLabel('Tiêu đề', { exact: true })).toHaveValue(
    'Bản nháp thử nghiệm độc lập',
  )
  const publicPath = oldDocument.path + '/'
  expect(await (await anonymous.get(publicPath)).text()).not.toContain(
    'Bản nháp thử nghiệm độc lập',
  )
  expect(
    (
      await context.request.patch(`/api/studio/content/${contentId}/`, {
        headers: origin,
        data: {
          action: 'save',
          version: oldDocument.version,
          payload: oldDocument.draft,
        },
      })
    ).status(),
  ).toBe(409)
  await page.getByRole('tab', { name: 'SEO' }).click()
  await page.getByLabel('SEO title').fill('SEO từ Studio đã xuất bản')
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã lưu')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Xuất bản', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã xuất bản')
  const liveBody = await (await anonymous.get(publicPath)).text()
  expect(liveBody).toContain('Bản nháp thử nghiệm độc lập')
  expect(liveBody).toContain('SEO từ Studio đã xuất bản')
  expect(await (await anonymous.get('/kien-thuc/')).text()).toContain(
    'Bản nháp thử nghiệm độc lập',
  )
  await page.getByRole('tab', { name: 'Lịch sử' }).click()
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Khôi phục phiên bản 1', exact: true })
    .click()
  await expect(page.getByRole('status')).toContainText('Đã khôi phục')
  expect(await (await anonymous.get(publicPath)).text()).toContain(
    'Bản nháp thử nghiệm độc lập',
  )
  await page.getByRole('tab', { name: 'Nội dung', exact: true }).click()
  await expect(page.getByLabel('Tiêu đề', { exact: true })).toHaveValue(
    oldDocument.draft.data.title,
  )
  await page.screenshot({
    path: 'artifacts/screenshots/studio-editor-desktop.png',
  })
  await page.setViewportSize({ width: 390, height: 844 })
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-editor-mobile.png',
  })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.getByRole('link', { name: 'Nội dung website', exact: true }).click()
  await page.getByRole('link', { name: 'Bài viết mới' }).click()
  await page.getByLabel('Tiêu đề', { exact: true }).fill('Bài mới tạo trong Studio')
  await page.getByLabel('Đường dẫn', { exact: true }).fill('bai-moi-studio')
  await page.getByLabel('Mô tả ngắn').fill('Nội dung kiểm thử trên cơ sở dữ liệu tách biệt.')
  await page.getByLabel('Tiêu đề mục 1', { exact: true }).fill('Nội dung mục đầu tiên')
  await page.getByLabel('Đoạn văn mục 1 1', { exact: true }).fill('Đoạn nội dung mới được lưu thật.')
  await page.getByRole('button', { name: 'Lưu bản nháp', exact: true }).click()
  await expect(page).not.toHaveURL(/\/new\/$/)
  const newId = new URL(page.url()).pathname.split('/').filter(Boolean).at(-1)!
  expect((await anonymous.get('/kien-thuc/bai-moi-studio/')).status()).toBe(404)
  expect(await (await anonymous.get(`/admin/content/${newId}/preview/`)).text()).not.toContain('Đoạn nội dung mới được lưu thật.')
  expect(await (await context.request.get(`/admin/content/${newId}/preview/`)).text()).toContain('Đoạn nội dung mới được lưu thật.')
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Xuất bản', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã xuất bản')
  expect((await anonymous.get('/kien-thuc/bai-moi-studio/')).status()).toBe(200)
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Gỡ xuất bản', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Đã gỡ')
  expect((await anonymous.get('/kien-thuc/bai-moi-studio/')).status()).toBe(404)
  await page.getByRole('link', { name: 'Đội ngũ & phân quyền' }).click()
  await page.getByRole('button', { name: 'Thêm tài khoản' }).click()
  await page.getByLabel('Họ và tên').fill('Biên tập TBS')
  await page.getByLabel('Email', { exact: true }).fill('editor@example.test')
  await page.getByLabel('Mật khẩu ban đầu').fill('Editor-test-password-728!')
  await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click()
  await expect(page.getByRole('table')).toContainText('editor@example.test')
  await page.reload()
  await expect(page.getByRole('table')).toContainText('editor@example.test')
  const editor = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
    extraHTTPHeaders: origin,
  })
  expect(
    (
      await editor.post('/api/studio/session/', {
        data: {
          email: 'editor@example.test',
          password: 'Editor-test-password-728!',
        },
      })
    ).status(),
  ).toBe(200)
  expect(
    (
      await editor.get('/api/studio/users/', {
        headers: { 'x-user-role': 'admin' },
      })
    ).status(),
  ).toBe(403)
  page.once('dialog', (dialog) => dialog.accept())
  await page
    .getByRole('button', { name: 'Khóa Biên tập TBS', exact: true })
    .click()
  await expect(page.getByRole('table')).toContainText('Đã khóa')
  expect((await editor.get('/api/studio/users/')).status()).toBe(401)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Mở menu quản trị' }).click()
  await page
    .getByRole('dialog')
    .getByRole('link', { name: 'Nhật ký hoạt động' })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Nhật ký hoạt động' }),
  ).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await page.screenshot({
    path: 'artifacts/screenshots/studio-activity-mobile.png',
  })
  await page.getByRole('button', { name: 'Mở menu quản trị' }).click()
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Đăng xuất', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Chào mừng trở lại' }),
  ).toBeVisible()
  expect((await context.request.get('/api/studio/users/')).status()).toBe(401)
  await context.addCookies([sessionCookie])
  expect((await context.request.get('/api/studio/users/')).status()).toBe(401)
  await anonymous.dispose()
  await editor.dispose()
})
