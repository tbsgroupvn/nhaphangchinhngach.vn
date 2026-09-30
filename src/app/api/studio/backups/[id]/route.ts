import { cookies } from 'next/headers'
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { studioFailure } from '@/lib/studio/api'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    requireUser('settings.write')
    const file = getStudio().backups.file(
      cookies().get(SESSION_COOKIE)!.value,
      params.id,
    )
    return new Response(
      Readable.toWeb(createReadStream(file.path)) as ReadableStream<Uint8Array>,
      {
        headers: {
          'Content-Type': 'application/vnd.sqlite3',
          'Content-Length': String(file.bytes),
          'Content-Disposition': `attachment; filename="${file.filename}"`,
          'Cache-Control': 'private, no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    )
  } catch (error) {
    return studioFailure(error)
  }
}
