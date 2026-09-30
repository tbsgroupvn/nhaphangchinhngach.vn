import { cookies } from 'next/headers'
import { requirePageUser } from '@/lib/studio/pages'
import { getStudio, SESSION_COOKIE } from '@/lib/studio/runtime'
import BackupWorkspace from '@/components/studio/BackupWorkspace'

export default function BackupsPage() {
  requirePageUser('settings.write')
  return (
    <BackupWorkspace
      initial={getStudio().backups.list(cookies().get(SESSION_COOKIE)!.value)}
    />
  )
}
