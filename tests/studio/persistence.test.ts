import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, basename, sep } from 'node:path'

test('independent Node processes retain AI draft isolation, history, usage and retired request IDs', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'tbs-restart-'))
  try {
    for (const mode of ['write', 'read']) {
      const { stdout } = await promisify(execFile)(
        process.execPath,
        [
          '--import',
          'tsx',
          'tests/support/studio-persistence-child.ts',
          mode,
          directory,
        ],
        { cwd: process.cwd(), windowsHide: true, timeout: 30000 },
      )
      assert.match(stdout, new RegExp(`Persistence ${mode} verified`))
    }
  } finally {
    if (
      !resolve(directory).startsWith(resolve(tmpdir()) + sep) ||
      !basename(directory).startsWith('tbs-restart-')
    )
      throw new Error('Unsafe cleanup')
    rmSync(directory, { recursive: true, force: true })
  }
})
