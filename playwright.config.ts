import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/marketing',
  testIgnore: /industry-atlas-scale.spec.ts/,
  timeout: 45000,
  expect: { timeout: 10000 },
  use: { baseURL: 'http://127.0.0.1:4173', viewport: { width: 1440, height: 1000 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'artifacts/test-report' }]],
  outputDir: 'artifacts/test-results',
  workers: 1,
})
