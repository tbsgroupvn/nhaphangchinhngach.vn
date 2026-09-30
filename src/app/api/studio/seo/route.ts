import { getStudio, requireUser } from '@/lib/studio/runtime'
import { studioFailure, studioJson } from '@/lib/studio/api'
import { publicSeoSettings } from '@/lib/studio/public-content'

export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    requireUser('content.read')
    const { seo, content } = getStudio()
    return studioJson({
      rows: seo.overview(),
      tasks: seo.tasks(),
      assignees: seo.assignees(),
      documents: content.list(),
      indexable: publicSeoSettings().indexable,
      auditConfigured: !!process.env.STUDIO_ORIGIN,
    })
  } catch (error) {
    return studioFailure(error)
  }
}
