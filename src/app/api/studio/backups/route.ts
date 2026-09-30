import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getStudio, requireUser, SESSION_COOKIE } from '@/lib/studio/runtime'
import { assertSameOrigin, readJson } from '@/lib/studio/http'
import { studioFailure, studioJson } from '@/lib/studio/api'
import { backupCommandSchema, backupLimit } from '@/lib/studio/backup-model'
import { StudioError } from '@/lib/studio/errors'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export async function GET() {
  try {
    requireUser('settings.write')
    return studioJson({
      jobs: getStudio().backups.list(cookies().get(SESSION_COOKIE)!.value),
    })
  } catch (error) {
    return studioFailure(error)
  }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const token = cookies().get(SESSION_COOKIE)!.value
    const repository = getStudio().backups
    if (
      request.headers.get('content-type')?.split(';')[0] ===
      'application/vnd.sqlite3'
    ) {
      if (Number(request.headers.get('content-length')) > backupLimit)
        throw new StudioError(413, 'Tệp sao lưu vượt 1 GiB.', 'BACKUP_SIZE')
      if (!request.body)
        throw new StudioError(400, 'Tệp sao lưu trống.', 'INVALID_BACKUP')
      return studioJson(
        { job: await repository.stage(token, request.body) },
        201,
      )
    }
    const input = backupCommandSchema.parse(await readJson(request, 8192))
    if (input.action === 'export')
      return studioJson({ job: await repository.export(token) }, 201)
    const result = await repository.restore(
      token,
      input.id,
      input.fingerprint,
      input.confirmation,
    )
    revalidatePath('/', 'layout')
    return studioJson(result)
  } catch (error) {
    return studioFailure(error)
  }
}
export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request)
    requireUser('settings.write')
    const input = z
      .object({ id: z.string().uuid() })
      .strict()
      .parse(await readJson(request, 1024))
    await getStudio().backups.discard(
      cookies().get(SESSION_COOKIE)!.value,
      input.id,
    )
    return studioJson({ deleted: true })
  } catch (error) {
    return studioFailure(error)
  }
}
