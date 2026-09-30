import { chromium } from '@playwright/test'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'

const output = 'tests/fixtures/fixed-pages-before.json'
if (existsSync(output)) throw new Error('Baseline already exists; do not overwrite acceptance evidence.')
const paths = ['/', '/gioi-thieu', '/nang-luc-van-hanh', '/dich-vu', '/nganh-hang', '/quy-trinh', '/chi-phi-chung-tu', '/kien-thuc', '/hoi-dap', '/lien-he', '/chinh-sach/bao-mat', '/chinh-sach/dieu-khoan', '/chinh-sach/dich-vu']
const browser = await chromium.launch()
const page = await browser.newPage({ javaScriptEnabled: false })
const pages = []
try {
  for (const path of paths) {
    const response = await page.goto(`http://127.0.0.1:4173${path}`, { waitUntil: 'domcontentloaded' })
    if (response.status() !== 200) throw new Error(`Unexpected status for ${path}`)
    pages.push({ path, title: await page.title(), text: (await page.locator('main').textContent()).replace(/\s+/g, ' ').trim(), links: await page.locator('main a[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))) })
  }
  mkdirSync('tests/fixtures', { recursive: true })
  writeFileSync(output, JSON.stringify(pages, null, 2) + '\n')
  console.log(`Captured ${pages.length} approved page baselines`)
} finally { await browser.close() }
