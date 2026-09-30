import { defineConfig } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'

// Ba server cách ly cho Industry Atlas: quy mô 100 ngành, chỉ mục cũ (stale)
// và chưa từng có chỉ mục (unavailable). Không đụng tới .data thật.
const run = randomUUID()
function server(port: number, mode: 'normal' | 'stale', fault: boolean) {
  const dir = resolve('artifacts', `atlas-scale-${port}-${run}`)
  return {
    command: `npx tsx tests/support/atlas-scale-fixture.ts "${dir}" ${mode} && node node_modules/next/dist/bin/next start -p ${port} -H 127.0.0.1`,
    url: `http://127.0.0.1:${port}/nganh-hang/`,
    reuseExistingServer: false,
    timeout: 180000,
    env: {
      STUDIO_DATA_DIR: dir,
      STUDIO_ORIGIN: `http://127.0.0.1:${port}`,
      ...(fault ? { STUDIO_FAULT_INDUSTRY_INDEX: 'fail' } : {}),
    },
  }
}

export default defineConfig({
  testDir: './tests/marketing',
  testMatch: /industry-atlas-scale\.spec\.ts/,
  workers: 1,
  timeout: 60000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://127.0.0.1:4175',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  outputDir: 'artifacts/atlas-scale-results',
  reporter: [['list']],
  webServer: [
    server(4175, 'normal', false),
    server(4176, 'stale', true),
    server(4177, 'normal', true),
  ],
})
