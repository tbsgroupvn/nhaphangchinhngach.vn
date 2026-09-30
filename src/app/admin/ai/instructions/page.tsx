import { cookies } from 'next/headers'
import { requirePageUser } from '@/lib/studio/pages'
import { getStudio, SESSION_COOKIE } from '@/lib/studio/runtime'
import AiInstructionsWorkspace from '@/components/studio/AiInstructionsWorkspace'
export default function AiInstructionsPage() {
  const user = requirePageUser('ai.use')
  return (
    <AiInstructionsWorkspace
      initial={getStudio().knowledge.instructions(
        cookies().get(SESSION_COOKIE)!.value,
      )}
      canWrite={user.role === 'admin'}
    />
  )
}
