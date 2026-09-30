import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readUploadBytes } from '../../src/lib/studio/media-upload'

test('binary upload reading enforces actual streamed bytes even with false length headers', async () => {
  let canceled = false
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(101))
    },
    cancel() {
      canceled = true
    },
  })
  const request = new Request('http://localhost/upload', {
    method: 'POST',
    headers: { 'Content-Length': '1' },
    body,
    duplex: 'half',
  } as RequestInit)
  await assert.rejects(readUploadBytes(request, 100), { status: 413 })
  assert.equal(canceled, true)
})

test('a stalled upload expires and cancels the stream instead of holding processing capacity', async () => {
  let canceled = false
  const body = new ReadableStream({
    cancel() {
      canceled = true
    },
  })
  const request = new Request('http://localhost/upload', {
    method: 'POST',
    body,
    duplex: 'half',
  } as RequestInit)
  await assert.rejects(readUploadBytes(request, 100, 20), { status: 408 })
  assert.equal(canceled, true)
})
