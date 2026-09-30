import { defineConfig } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'

export default defineConfig({
  testDir: './tests/studio-browser',
  workers: 1,
  timeout: 45000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://127.0.0.1:4174',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  outputDir: 'artifacts/studio-results',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'artifacts/studio-report' }],
  ],
  webServer: {
    command: 'node node_modules/next/dist/bin/next start -p 4174 -H 127.0.0.1',
    url: 'http://127.0.0.1:4174/admin/',
    reuseExistingServer: false,
    env: {
      STUDIO_DATA_DIR: resolve('artifacts', `studio-e2e-${randomUUID()}`),
      STUDIO_BOOTSTRAP_TOKEN:
        'isolated-test-bootstrap-token-at-least-32-characters',
      STUDIO_ORIGIN: 'http://127.0.0.1:4174',
      STUDIO_AI_ENCRYPTION_KEY: Buffer.alloc(32, 31).toString('base64'),
      STUDIO_PROVIDER_FIXTURE: 'isolated-browser-tests',
      NODE_OPTIONS: `--require "${resolve('tests/support/provider-fixture.cjs').replace(/\\/g, '/')}"`,
    },
  },
})
