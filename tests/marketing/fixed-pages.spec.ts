import { test, expect } from '@playwright/test'
import baselines from '../fixtures/fixed-pages-before.json'

test.use({ javaScriptEnabled: false })
for (const baseline of baselines) {
  test(`CMS migration preserves approved fixed-page copy and links: ${baseline.path}`, async ({
    page,
  }) => {
    const response = await page.goto(baseline.path)
    expect(response?.status()).toBe(200)
    expect(await page.title()).toBe(baseline.title)
    expect(
      (await page.locator('main').textContent())!.replace(/\s+/g, ' ').trim(),
    ).toBe(baseline.text)
    expect(
      await page
        .locator('main a[href]')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href'))),
    ).toEqual(baseline.links)
  })
}
