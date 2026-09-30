import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assertSameOrigin, readJson } from '../../src/lib/studio/http'

test('mutation requests reject absent, foreign and opaque origins', () => {
  for (const origin of ['', 'https://attacker.test', 'null']) {
    assert.throws(
      () =>
        assertSameOrigin(
          new Request('https://tbs.test/api/studio/session', {
            headers: origin ? { origin } : {},
          }),
        ),
      /Nguồn yêu cầu/,
    )
  }
  assert.doesNotThrow(() =>
    assertSameOrigin(
      new Request('https://tbs.test/api/studio/session', {
        headers: { origin: 'https://tbs.test' },
      }),
    ),
  )
})

test('JSON parsing rejects oversized and malformed bodies without trusting content-length', async () => {
  await assert.rejects(
    readJson(
      new Request('https://tbs.test', {
        method: 'POST',
        body: 'x'.repeat(200),
        headers: { 'Content-Type': 'application/json' },
      }),
      100,
    ),
    /quá lớn/,
  )
  await assert.rejects(
    readJson(
      new Request('https://tbs.test', {
        method: 'POST',
        body: '{broken',
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
    /JSON/,
  )
  await assert.rejects(
    readJson(new Request('https://tbs.test', { method: 'POST', body: '{}' })),
    /JSON/,
  )
  assert.deepEqual(
    await readJson(
      new Request('https://tbs.test', {
        method: 'POST',
        body: '{"ok":true}',
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
    { ok: true },
  )
})
