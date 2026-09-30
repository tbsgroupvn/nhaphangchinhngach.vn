import ContentInventory from '@/components/studio/ContentInventory'
import { getStudio } from '@/lib/studio/runtime'
import { requirePageUser } from '@/lib/studio/pages'
import { can } from '@/lib/studio/auth'

export default function ContentPage() {
  const user = requirePageUser()
  return (
    <ContentInventory
      items={getStudio().content.list()}
      canWrite={can(user, 'content.write')}
    />
  )
}
