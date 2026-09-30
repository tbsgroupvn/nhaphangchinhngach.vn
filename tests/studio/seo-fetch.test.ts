import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { once } from 'node:events'
import { fetchAuditHtml } from '../../src/lib/studio/seo-fetch'

test('audit fetch is bounded to configured public routes, does not follow redirects or forward cookies', async () => {
  let leakedCookie = false,
    externalHits = 0
  const server = createServer((req, res) => {
    leakedCookie ||= !!req.headers.cookie
    if (req.url === '/redirect/') {
      res.writeHead(302, { Location: '/external/' })
      res.end()
      return
    }
    if (req.url === '/external/') externalHits++
    if (req.url === '/slow/') return
    if (req.url === '/huge/') {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end('a'.repeat(2 * 1024 * 1024 + 1))
      return
    }
    if (req.url === '/json/') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end('{}')
      return
    }
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<main><h1>TBS</h1></main>')
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`
  try {
    assert.equal(
      await fetchAuditHtml(origin, '/gioi-thieu'),
      '<main><h1>TBS</h1></main>',
    )
    for (const path of [
      '//evil.test',
      '/admin',
      '/api/studio/session',
      '/studio-preview/a',
      '/%2e%2e/admin',
      '/a?b=c',
      '/a#b',
      '/a/../admin',
    ])
      await assert.rejects(fetchAuditHtml(origin, path))
    await assert.rejects(fetchAuditHtml(`${origin}/path`, '/'))
    await assert.rejects(fetchAuditHtml(origin, '/redirect'), /302/)
    await assert.rejects(fetchAuditHtml(origin, '/huge'), /quá lớn/)
    await assert.rejects(fetchAuditHtml(origin, '/json'), /HTML/)
    await assert.rejects(fetchAuditHtml(origin, '/slow', 30))
    assert.equal(externalHits, 0)
    assert.equal(leakedCookie, false)
  } finally {
    server.closeAllConnections()
    server.close()
    await once(server, 'close')
  }
})
