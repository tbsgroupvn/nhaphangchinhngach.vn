import { test, expect } from '@playwright/test'

function contrast(foreground: string, background: string) {
  const luminance = (value: string) => {
    const channels = value
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number)
      .map((channel) => channel / 255)
      .map((channel) =>
        channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4,
      )
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  }
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  )
  return (values[0] + 0.05) / (values[1] + 0.05)
}

test('marketing uses the supplied TBS logo colors and accessible brand shades', async ({
  page,
}) => {
  await page.goto('/')
  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement)
    return [
      '--tbs-brand',
      '--tbs-brand-secondary',
      '--tbs-brand-strong',
      '--tbs-soft',
      '--tbs-accent',
      '--tbs-lime',
    ].map((token) => style.getPropertyValue(token).trim())
  })
  expect(tokens).toEqual([
    '#0083ca',
    '#3d94d9',
    '#006fa8',
    '#f3f6f7',
    '#8dceef',
    '',
  ])
  await expect(page.locator('.tbs-brand img')).toHaveAttribute(
    'src',
    /logo-color\.png/,
  )
  await expect(page.locator('.tbs-header')).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  )
  await expect(page.locator('.tbs-principles')).toHaveCSS(
    'background-color',
    'rgb(243, 246, 247)',
  )
  await expect(page.locator('.tbs-industries-section')).toHaveCSS(
    'background-color',
    'rgb(24, 33, 38)',
  )
  await expect(page.locator('.tbs-footer')).toHaveCSS(
    'background-color',
    'rgb(24, 33, 38)',
  )
})

test('text keeps AA contrast on light, dark and selected color surfaces', async ({
  page,
}) => {
  await page.goto('/')
  const samples = [
    ['.tbs-principles small', '.tbs-principles'],
    ['.tbs-principles span', '.tbs-principles'],
    ['.tbs-principles p', '.tbs-principles'],
    ['.tbs-service-item:first-child h3', '.tbs-service-item:first-child'],
    ['.tbs-service-item:first-child p', '.tbs-service-item:first-child'],
    ['.tbs-industries-section .tbs-eyebrow', '.tbs-industries-section'],
    ['.tbs-industry-list p', '.tbs-industries-section'],
    ['.journey-eyebrow', '.tbs-journey'],
    ['.tbs-hero .tbs-button-primary', '.tbs-hero .tbs-button-primary'],
    [
      '.tbs-home-article:first-child .tbs-article-number',
      '.tbs-home-article:first-child .tbs-article-number',
    ],
    [
      '.tbs-home-article:nth-child(2) .tbs-article-number',
      '.tbs-home-article:nth-child(2) .tbs-article-number',
    ],
    [
      '.journey-stage[aria-pressed="true"] .journey-stage-copy > span',
      '.journey-stage[aria-pressed="true"]',
    ],
    [
      '.journey-stage[aria-pressed="true"] .journey-stage-index',
      '.journey-stage[aria-pressed="true"]',
    ],
    ['.tbs-footer-grid a', '.tbs-footer'],
    ['.tbs-footer .tbs-button-primary', '.tbs-footer .tbs-button-primary'],
  ]
  for (const [textSelector, surfaceSelector] of samples) {
    const colors = await page.evaluate(
      ({ textSelector, surfaceSelector }) => ({
        text: getComputedStyle(document.querySelector(textSelector)!).color,
        background: getComputedStyle(document.querySelector(surfaceSelector)!)
          .backgroundColor,
      }),
      { textSelector, surfaceSelector },
    )
    expect(
      contrast(colors.text, colors.background),
      textSelector,
    ).toBeGreaterThanOrEqual(4.5)
  }
  const firstService = page.locator('.tbs-service-item').first()
  await firstService.hover()
  await expect(firstService).toHaveCSS('background-color', 'rgb(0, 91, 140)')
})

test('brand contact actions have consistent colors and visible keyboard focus', async ({
  page,
}) => {
  await page.goto('/')
  for (const selector of [
    '.tbs-hero .tbs-button-primary',
    '.tbs-footer .tbs-button-primary',
  ]) {
    const button = page.locator(selector)
    await expect(button).toHaveCSS('background-color', 'rgb(0, 111, 168)')
    await expect(button).toHaveCSS('color', 'rgb(255, 255, 255)')
    await button.scrollIntoViewIfNeeded()
    await button.focus()
    await expect(button).toHaveCSS('outline-style', 'solid')
    await expect(button).toHaveCSS('outline-color', 'rgb(141, 206, 239)')
    await button.hover()
    await expect(button).toHaveCSS('background-color', 'rgb(0, 91, 140)')
  }
  await page.goto('/lien-he')
  const contact = page.locator('main .tbs-button-primary').first()
  await expect(contact).toHaveCSS('background-color', 'rgb(0, 111, 168)')
  await contact.focus()
  await expect(contact).toHaveCSS('outline-color', 'rgb(0, 111, 168)')
})
