import { cookies } from 'next/headers'
import { requirePageUser } from '@/lib/studio/pages'
import { getStudio, SESSION_COOKIE } from '@/lib/studio/runtime'
import KnowledgeWorkspace from '@/components/studio/KnowledgeWorkspace'
export default function KnowledgePage() {
  requirePageUser('ai.use')
  return (
    <KnowledgeWorkspace
      initial={getStudio().knowledge.list(cookies().get(SESSION_COOKIE)!.value)}
    />
  )
}
