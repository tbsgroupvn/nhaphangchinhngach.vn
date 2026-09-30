import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { requirePageUser } from '@/lib/studio/pages'
import { getStudio, SESSION_COOKIE } from '@/lib/studio/runtime'
import { StudioError } from '@/lib/studio/errors'
import KnowledgeEditor from '@/components/studio/KnowledgeEditor'
export default function KnowledgeEditorPage({
  params,
}: {
  params: { id: string }
}) {
  const user = requirePageUser('ai.use')
  try {
    return (
      <KnowledgeEditor
        initial={getStudio().knowledge.get(
          cookies().get(SESSION_COOKIE)!.value,
          params.id,
        )}
        canApprove={user.role === 'admin'}
      />
    )
  } catch (error) {
    if (error instanceof StudioError && error.status === 404) notFound()
    throw error
  }
}
