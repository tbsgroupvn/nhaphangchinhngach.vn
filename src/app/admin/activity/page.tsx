import { getStudio } from '@/lib/studio/runtime'
import { requirePageUser } from '@/lib/studio/pages'
import { recentActivity } from '@/lib/studio/activity'
import ActivityTable from '@/components/studio/ActivityTable'

export default function ActivityPage() {
  requirePageUser('audit.read')
  return (
    <>
      <div className="studio-page-heading">
        <div>
          <h1>Nhật ký hoạt động</h1>
          <p>200 hoạt động gần nhất · giờ Việt Nam</p>
        </div>
      </div>
      <ActivityTable items={recentActivity(getStudio().db, 200)} />
    </>
  )
}
