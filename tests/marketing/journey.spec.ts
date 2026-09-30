import { expect, test } from '@playwright/test'

test('journey stage selection updates its detail and exclusive pressed state', async ({
  page,
}) => {
  await page.goto('/')
  const journey = page.locator('#hanh-trinh')
  await journey.scrollIntoViewIfNeeded()
  await expect(
    journey.getByRole('button', { name: 'Tiếp nhận', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')

  for (const [name, detail] of [
    ['Kiểm đếm', 'Đối chiếu từng kiện hàng'],
    ['Thông quan', 'Hoàn thiện hồ sơ thông quan'],
    ['Giao hàng', 'Bàn giao đến điểm hẹn'],
    ['Tiếp nhận', 'Hàng đến kho, hành trình bắt đầu'],
  ]) {
    await journey.getByRole('button', { name, exact: true }).click()
    await expect(journey.locator('button[aria-pressed="true"]')).toHaveCount(1)
    await expect(
      journey.getByRole('button', { name, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(journey.locator('[data-journey-detail]')).toContainText(detail)
  }
})

test('journey works with a keyboard and reduced motion at narrow mobile widths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const journey = page.locator('#hanh-trinh')
  await journey.scrollIntoViewIfNeeded()
  const delivery = journey.getByRole('button', {
    name: 'Giao hàng',
    exact: true,
  })
  await delivery.focus()
  await page.keyboard.press('Enter')
  await expect(delivery).toHaveAttribute('aria-pressed', 'true')
  await expect(journey.locator('[data-journey-detail]')).toContainText(
    'Bàn giao đến điểm hẹn',
  )
  const bounds = await journey.evaluate((element) => ({
    width: element.scrollWidth,
    available: document.documentElement.clientWidth,
  }))
  expect(bounds.width).toBeLessThanOrEqual(bounds.available)
})

test('journey motion can be paused and resumed without blocking stage selection', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const journey = page.locator('#hanh-trinh')
  await journey.scrollIntoViewIfNeeded()
  const pause = journey.getByRole('button', {
    name: 'Tạm dừng chuyển động',
    exact: true,
  })
  await expect(pause).toBeVisible()
  await expect(pause).toHaveAttribute('title', 'Tạm dừng chuyển động')
  await expect(journey.getByTestId('journey-fallback')).toBeHidden()
  const canvas = journey.getByTestId('journey-canvas').locator('canvas')

  const distinctFrames = () =>
    canvas.evaluate(async (element: HTMLCanvasElement) => {
      const frames = new Set<string>()
      for (let index = 0; index < 12; index++) {
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        )
        frames.add(element.toDataURL())
      }
      return frames.size
    })

  await journey.getByRole('button', { name: 'Giao hàng', exact: true }).click()
  await pause.click()
  const resume = journey.getByRole('button', {
    name: 'Tiếp tục chuyển động',
    exact: true,
  })
  await expect(resume).toBeVisible()
  await expect(resume).toHaveAttribute('title', 'Tiếp tục chuyển động')
  expect(await distinctFrames()).toBe(1)

  const pausedFrame = await canvas.evaluate((element: HTMLCanvasElement) =>
    element.toDataURL(),
  )
  await journey.getByRole('button', { name: 'Kiểm đếm', exact: true }).click()
  await expect(journey.locator('[data-journey-detail]')).toContainText(
    'Đối chiếu từng kiện hàng',
  )
  await expect
    .poll(() =>
      canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()),
    )
    .not.toBe(pausedFrame)
  expect(await distinctFrames()).toBe(1)

  await resume.focus()
  await page.keyboard.press('Enter')
  await expect(pause).toBeFocused()
  await expect(pause).toHaveAttribute('title', 'Tạm dừng chuyển động')
  // Sample at the real click; protocol/screenshot work can outlast the finite movement.
  await page.evaluate(() => {
    const host = window as typeof window & {
      journeyTransitionFrames?: Promise<number>
    }
    const element = document.querySelector<HTMLCanvasElement>(
      '[data-testid="journey-canvas"] canvas',
    )!
    host.journeyTransitionFrames = new Promise<number>((resolve) => {
      document
        .querySelector('#hanh-trinh button[aria-label="Thông quan"]')!
        .addEventListener(
          'click',
          () => {
            const frames = new Set<string>()
            let remaining = 12
            const sample = () => {
              frames.add(element.toDataURL())
              if (--remaining) requestAnimationFrame(sample)
              else resolve(frames.size)
            }
            requestAnimationFrame(sample)
          },
          { once: true, capture: true },
        )
    })
  })
  await journey.getByRole('button', { name: 'Thông quan', exact: true }).click()
  expect(
    await page.evaluate(
      () =>
        (
          window as typeof window & {
            journeyTransitionFrames?: Promise<number>
          }
        ).journeyTransitionFrames,
    ),
  ).toBeGreaterThan(1)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await journey.getByRole('button', { name: 'Giao hàng', exact: true }).click()
  await expect(journey.locator('[data-journey-detail]')).toContainText(
    'Bàn giao đến điểm hẹn',
  )
  expect(await distinctFrames()).toBe(1)
})

test('WebGL failure leaves a visible image and working journey details', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...args: unknown[]
    ) {
      if (
        kind === 'webgl' ||
        kind === 'webgl2' ||
        kind === 'experimental-webgl'
      )
        return null
      return Reflect.apply(getContext, this, [kind, ...args])
    } as typeof getContext
  })
  await page.goto('/')
  const journey = page.locator('#hanh-trinh')
  await journey.scrollIntoViewIfNeeded()
  await expect(journey.getByTestId('journey-fallback')).toBeVisible()
  await expect(
    journey.getByRole('img', {
      name: 'Container hàng hóa tại khu vực kho vận',
    }),
  ).toBeVisible()
  await journey.getByRole('button', { name: 'Thông quan', exact: true }).click()
  await expect(journey.locator('[data-journey-detail]')).toContainText(
    'Hoàn thiện hồ sơ thông quan',
  )
})

test('losing the WebGL context keeps the selected stage usable', async ({
  page,
}) => {
  await page.goto('/')
  const journey = page.locator('#hanh-trinh')
  await journey.scrollIntoViewIfNeeded()
  const canvas = journey.getByTestId('journey-canvas').locator('canvas')
  await expect(canvas).toBeVisible()
  await expect(journey.getByTestId('journey-fallback')).toBeHidden()
  await canvas.evaluate((element) =>
    element.dispatchEvent(new Event('webglcontextlost', { cancelable: true })),
  )
  await expect(journey.getByTestId('journey-fallback')).toBeVisible()
  await journey.getByRole('button', { name: 'Giao hàng', exact: true }).click()
  await expect(journey.locator('[data-journey-detail]')).toContainText(
    'Bàn giao đến điểm hẹn',
  )
})

for (const width of [1440, 390]) {
  test(`journey draws a nonblank scene and changes its truck position at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const journey = page.locator('#hanh-trinh')
    await journey.scrollIntoViewIfNeeded()
    await expect(journey.getByTestId('journey-fallback')).toBeHidden()
    const canvas = journey.getByTestId('journey-canvas').locator('canvas')
    const pixels = await canvas.evaluate((element: HTMLCanvasElement) => {
      const sample = document.createElement('canvas')
      sample.width = 100
      sample.height = 60
      const context = sample.getContext('2d')!
      context.drawImage(element, 0, 0, 100, 60)
      const data = context.getImageData(0, 0, 100, 60).data
      const colors = new Set<string>()
      for (let index = 0; index < data.length; index += 4) {
        colors.add(
          `${data[index] >> 4},${data[index + 1] >> 4},${data[index + 2] >> 4}`,
        )
      }
      return colors.size
    })
    expect(pixels).toBeGreaterThan(30)
    const before = await canvas.evaluate((element: HTMLCanvasElement) =>
      element.toDataURL(),
    )
    await journey
      .getByRole('button', { name: 'Giao hàng', exact: true })
      .click()
    await expect
      .poll(() =>
        canvas.evaluate((element: HTMLCanvasElement) => element.toDataURL()),
      )
      .not.toBe(before)
  })
}
