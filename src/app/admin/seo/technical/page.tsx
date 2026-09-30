import TechnicalSeoWorkspace from '@/components/studio/TechnicalSeoWorkspace'
import { requirePageUser } from '@/lib/studio/pages'
import { technicalSeoData } from '@/lib/studio/technical-seo-data'
import { can } from '@/lib/studio/auth'

export default function TechnicalSeoPage() {
  const user = requirePageUser()
  return (
    <TechnicalSeoWorkspace
      initial={technicalSeoData()}
      canWrite={can(user, 'settings.write')}
    />
  )
}
