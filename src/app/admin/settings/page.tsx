import { requirePageUser } from '@/lib/studio/pages'
import { getStudio } from '@/lib/studio/runtime'
import SiteSettingsWorkspace from '@/components/studio/SiteSettingsWorkspace'

export default function SettingsPage() {
  requirePageUser('settings.write')
  return <SiteSettingsWorkspace initial={getStudio().siteSettings.get()} />
}
