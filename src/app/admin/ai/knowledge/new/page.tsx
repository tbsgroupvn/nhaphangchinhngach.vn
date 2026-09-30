import { requirePageUser } from '@/lib/studio/pages'
import KnowledgeEditor from '@/components/studio/KnowledgeEditor'
export default function NewKnowledgePage() {
  const user = requirePageUser('ai.use')
  return <KnowledgeEditor initial={null} canApprove={user.role === 'admin'} />
}
