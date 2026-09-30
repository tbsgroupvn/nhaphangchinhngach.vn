import MediaLibrary from '@/components/studio/MediaLibrary'
import { can } from '@/lib/studio/auth'
import { getStudio } from '@/lib/studio/runtime'
import { requirePageUser } from '@/lib/studio/pages'

export default function MediaPage() {
  const user = requirePageUser()
  return (
    <MediaLibrary
      initial={getStudio().media.list()}
      canWrite={can(user, 'media.write')}
    />
  )
}
