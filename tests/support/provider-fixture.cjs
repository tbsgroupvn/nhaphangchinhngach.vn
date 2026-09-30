const path = require('node:path')
const data = path.resolve(process.env.STUDIO_DATA_DIR || '')
const parent = path.resolve(process.cwd(), 'artifacts')
if (
  process.env.STUDIO_PROVIDER_FIXTURE !== 'isolated-browser-tests' ||
  path.dirname(data) !== parent ||
  !/^studio-e2e-[a-f0-9-]+$/.test(path.basename(data))
) {
  throw new Error(
    'Provider fixture requires an isolated Studio browser-test directory',
  )
}
const originalFetch = globalThis.fetch
globalThis.fetch = async (input, init) => {
  const url = new URL(
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url,
  )
  if (url.hostname !== 'api.openai.com') return originalFetch(input, init)
  if (
    url.href !== 'https://api.openai.com/v1/responses' ||
    init?.method !== 'POST'
  )
    throw new Error('Unexpected provider request in fixture')
  const key = new Headers(init.headers).get('authorization')
  if (key === 'Bearer sk-browser-fixture-unauthorized')
    return new Response('Fixture auth failure', { status: 401 })
  if (key !== 'Bearer sk-browser-fixture-success-only')
    throw new Error('Unknown fixture credential; real network denied')
  const body = JSON.parse(init.body)
  if (body.store !== false || body.text?.format?.strict !== true)
    throw new Error('Missing provider safety options')
  let value = { ok: true }
  if (body.input.startsWith('{')) {
    const input = JSON.parse(body.input)
    if (input.task && input.context) {
      const context = input.context
      value = {
        summary: 'Đề xuất biên tập từ nhà cung cấp kiểm thử cô lập.',
        notes: ['Đối chiếu nguồn và kiểm tra chuyên môn trước khi xuất bản.'],
        outline: ['Thông tin cần chuẩn bị', 'Các bước đối chiếu'],
        changes: ['brief', 'outline', 'links'].includes(input.task)
          ? []
          : context.fields.map((field) => ({
              field: input.prompt.includes('[fixture:invalid]')
                ? 'slug'
                : field.key,
              value:
                field.type === 'text'
                  ? `Đề xuất kiểm thử cho ${field.label}`
                  : field.type === 'list'
                    ? ['Nội dung danh sách được đề xuất trong kiểm thử.']
                    : field.type === 'sections'
                      ? [
                          {
                            heading: 'Mục đề xuất',
                            body: [
                              'Đoạn đề xuất được kiểm tra và chưa xuất bản.',
                            ],
                          },
                        ]
                      : [
                          {
                            q: 'Cần chuẩn bị thông tin gì?',
                            a: 'Đối chiếu thông tin hàng hóa với nguồn đã duyệt.',
                          },
                        ],
              sourceIds: context.knowledge.sources.map((source) => source.id),
              reason: 'Làm rõ nội dung trong phạm vi đã chọn.',
            })),
        links:
          input.task === 'links' && context.links.length
            ? [
                {
                  targetId: context.links[0].id,
                  anchor: context.links[0].title,
                  reason: 'Trang công khai thuộc danh mục được cung cấp.',
                },
              ]
            : [],
      }
    }
  }
  return Response.json({
    status: 'completed',
    output: [
      {
        type: 'message',
        content: [{ type: 'output_text', text: JSON.stringify(value) }],
      },
    ],
    usage: { input_tokens: 30, output_tokens: 5, total_tokens: 35 },
  })
}
