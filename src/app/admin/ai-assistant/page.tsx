import { cookies } from 'next/headers'
import { requirePageUser } from '@/lib/studio/pages'
import { getStudio, SESSION_COOKIE } from '@/lib/studio/runtime'
import AiProviderWorkspace from '@/components/studio/AiProviderWorkspace'

export default function LegacyAdminPage() {
  const user = requirePageUser('ai.use')
  return (
    <AiProviderWorkspace
      initial={getStudio().aiProvider.get(cookies().get(SESSION_COOKIE)!.value)}
      canConfigure={user.role === 'admin'}
    />
  )
}
