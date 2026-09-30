import { test, expect, type APIRequestContext } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import type { StudioUser } from '../../src/lib/studio/auth'

const headers = { Origin: 'http://127.0.0.1:4174' }
const owner = {
  name: 'Chủ website',
  email: 'owner@example.test',
  password: 'Owner-test-password-728!',
}

async function loginOwner(request: APIRequestContext) {
  if ((await (await request.get('/api/studio/session/')).json()).setupRequired)
    expect(
      (
        await request.post('/api/studio/setup/', {
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
      await request.post('/api/studio/session/', { headers, data: owner })
    ).status(),
  ).toBe(200)
}
async function createUser(
  request: APIRequestContext,
  role: 'admin' | 'editor',
) {
  const input = {
    name: `Concurrency ${role}`,
    email: `${randomUUID()}@example.test`,
    password: 'Concurrency-test-password-728!',
    role,
  }
  const response = await request.post('/api/studio/users/', {
    headers,
    data: input,
  })
  expect(response.status()).toBe(201)
  return { input, user: (await response.json()).user as StudioUser }
}

test('two independent editors saving one revision concurrently retain only the winning private draft', async ({
  context,
  playwright,
}) => {
  await loginOwner(context.request)
  const clients: APIRequestContext[] = []
  try {
    for (let index = 0; index < 2; index++) {
      const { input } = await createUser(context.request, 'editor')
      const client = await playwright.request.newContext({
        baseURL: 'http://127.0.0.1:4174',
        extraHTTPHeaders: headers,
      })
      clients.push(client)
      expect(
        (await client.post('/api/studio/session/', { data: input })).status(),
      ).toBe(200)
    }
    const created = await clients[0].post('/api/studio/content/', {
      data: {
        kind: 'article',
        data: {
          slug: `concurrency-${randomUUID()}`,
          title: 'Concurrent private draft',
          summary: 'Original summary',
          image: '/images/marketing/containers.webp',
          category: 'Kiến thức',
          categorySlug: 'kien-thuc',
          sections: [{ heading: 'Original heading', body: ['Original body'] }],
        },
        seo: {
          title: 'Concurrent title',
          description: 'Concurrent description',
          canonical: '',
          image: '',
          noindex: true,
        },
      },
    })
    expect(created.status()).toBe(201)
    const doc = (await created.json()).document
    const snapshots = await Promise.all(
      clients.map(
        async (client) =>
          (await (await client.get(`/api/studio/content/${doc.id}/`)).json())
            .document,
      ),
    )
    expect(snapshots[0].version).toBe(snapshots[1].version)
    const writes = await Promise.all(
      clients.map((client, index) =>
        client.patch(`/api/studio/content/${doc.id}/`, {
          data: {
            action: 'save',
            version: snapshots[index].version,
            payload: {
              ...snapshots[index].draft,
              data: {
                ...snapshots[index].draft.data,
                title: `Editor ${index} wins`,
              },
            },
          },
        }),
      ),
    )
    expect(writes.map((response) => response.status()).sort()).toEqual([
      200, 409,
    ])
    const winner = writes.findIndex((response) => response.status() === 200)
    const after = (
      await (await clients[0].get(`/api/studio/content/${doc.id}/`)).json()
    ).document
    expect(after.version).toBe(doc.version + 1)
    expect(after.draft.data.title).toBe(`Editor ${winner} wins`)
    expect(after.published).toBeNull()
    expect((await context.request.get(`${after.path}/`)).status()).toBe(404)
  } finally {
    for (const client of clients) await client.dispose()
  }
})

test('team conflicts preserve pending roles and require an explicit local or server choice', async ({
  page,
  context,
  playwright,
}) => {
  await loginOwner(context.request)
  const remoteAdmin = await createUser(context.request, 'admin')
  const target = await createUser(context.request, 'editor')
  const remote = await playwright.request.newContext({
    baseURL: 'http://127.0.0.1:4174',
    extraHTTPHeaders: headers,
  })
  try {
    expect(
      (
        await remote.post('/api/studio/session/', { data: remoteAdmin.input })
      ).status(),
    ).toBe(200)
    expect(
      (
        await context.request.patch('/api/studio/users/', {
          headers,
          data: { id: target.user.id, changes: { role: 'admin' } },
        })
      ).status(),
    ).toBe(400)
    await page.goto('/admin/users/')
    const row = page.getByRole('row').filter({ hasText: target.user.email })
    await row.getByRole('combobox').selectOption('admin')
    const changed = await remote.patch('/api/studio/users/', {
      data: {
        id: target.user.id,
        revision: target.user.revision,
        changes: { role: 'viewer' },
      },
    })
    expect(changed.status()).toBe(200)
    const latest = (await changed.json()).user as StudioUser
    await row
      .getByRole('button', { name: `Lưu vai trò của ${target.user.name}` })
      .click()
    const conflict = page.getByRole('region', {
      name: 'Đối chiếu thay đổi tài khoản',
    })
    await expect(conflict).toContainText('Chỉ xem, Hoạt động trên máy chủ')
    await expect(conflict).toBeFocused()
    await expect(row.getByRole('combobox')).toHaveValue('admin')
    await expect(row.getByRole('combobox')).toBeDisabled()
    await conflict
      .getByRole('button', { name: 'Dùng bản trên máy chủ' })
      .click()
    await expect(row.getByRole('combobox')).toHaveValue('viewer')
    await row.getByRole('combobox').selectOption('editor')
    expect(
      (
        await remote.patch('/api/studio/users/', {
          data: {
            id: target.user.id,
            revision: latest.revision,
            changes: { status: 'disabled' },
          },
        })
      ).status(),
    ).toBe(200)
    await row
      .getByRole('button', { name: `Lưu vai trò của ${target.user.name}` })
      .click()
    await expect(conflict).toContainText('Chỉ xem, Đã khóa trên máy chủ')
    await expect(conflict).toBeFocused()
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    await page.screenshot({
      path: 'artifacts/screenshots/studio-users-conflict-desktop.png',
      fullPage: true,
    })
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 })
      const roleBox = await row.getByRole('combobox').boundingBox()
      expect(roleBox!.width).toBeGreaterThanOrEqual(200)
      const lockBox = await row
        .getByRole('button', { name: `Khóa ${target.user.name}` })
        .boundingBox()
      expect(lockBox!.x + lockBox!.width).toBeLessThanOrEqual(width)
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width)
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(390)
    await page.screenshot({
      path: 'artifacts/screenshots/studio-users-conflict-mobile.png',
      fullPage: true,
    })
    const apply = conflict.getByRole('button', {
      name: 'Áp dụng lựa chọn của tôi',
    })
    await apply.focus()
    await page.keyboard.press('Enter')
    await expect(conflict).toHaveCount(0)
    await expect(row.getByRole('combobox')).toHaveValue('editor')
    await expect(row).toContainText('Đã khóa')
    const users = (await (await remote.get('/api/studio/users/')).json())
      .users as StudioUser[]
    expect(users.find((user) => user.id === target.user.id)).toMatchObject({
      role: 'editor',
      status: 'disabled',
    })
  } finally {
    await remote.dispose()
  }
})
