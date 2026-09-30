import IndustryWorkspace from '@/components/studio/IndustryWorkspace'
import { can } from '@/lib/studio/auth'
import { requirePageUser } from '@/lib/studio/pages'
import { getStudio } from '@/lib/studio/runtime'
import {
  publicIndustryAtlas,
  publicIndustrySearch,
} from '@/lib/studio/public-content'

export default function IndustriesPage() {
  const user = requirePageUser('content.read')
  const { content, industryTaxonomy } = getStudio()
  // Cùng một đường dựng chỉ mục với trang public để trạng thái Studio phản ánh đúng.
  const projection = publicIndustrySearch(publicIndustryAtlas())
  return (
    <IndustryWorkspace
      initialItems={content
        .list()
        .filter(
          (item) => item.kind === 'industryCategory' || item.kind === 'industry',
        )}
      initialTaxonomy={industryTaxonomy.read()}
      projectionStatus={{
        stale: projection.stale,
        unavailable: projection.unavailable,
        diagnostic: projection.diagnostic,
      }}
      canWrite={can(user, 'content.write')}
      canPublish={can(user, 'content.publish')}
    />
  )
}
