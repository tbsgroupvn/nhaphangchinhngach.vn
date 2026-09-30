import { cookies } from 'next/headers'
import { requirePageUser } from '@/lib/studio/pages'
import { getStudio, SESSION_COOKIE } from '@/lib/studio/runtime'
import AiHistoryWorkspace from '@/components/studio/AiHistoryWorkspace'
export default function GenerationPage() {
  requirePageUser('ai.use')
  const studio = getStudio()
  return (
    <AiHistoryWorkspace
      documents={studio.content.list().map(({ id, title }) => ({ id, title }))}
      records={studio.generations.list(cookies().get(SESSION_COOKIE)!.value)}
    />
  )
}
