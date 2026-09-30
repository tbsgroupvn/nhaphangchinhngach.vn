import SeoWorkspace from '@/components/studio/SeoWorkspace'
import { getStudio } from '@/lib/studio/runtime'
import { requirePageUser } from '@/lib/studio/pages'
import { can } from '@/lib/studio/auth'
import { publicSeoSettings } from '@/lib/studio/public-content'

export default function SeoPage({
  searchParams,
}: {
  searchParams: { view?: string }
}) {
  const user = requirePageUser(),
    { seo, content } = getStudio()
  return (
    <SeoWorkspace
      initialView={searchParams.view === 'planner' ? 'planner' : 'audit'}
      canWrite={can(user, 'seo.write') || can(user, 'content.write')}
      initial={{
        rows: seo.overview(),
        tasks: seo.tasks(),
        documents: content.list(),
        assignees: seo.assignees(),
        indexable: publicSeoSettings().indexable,
        auditConfigured: !!process.env.STUDIO_ORIGIN,
      }}
    />
  )
}
