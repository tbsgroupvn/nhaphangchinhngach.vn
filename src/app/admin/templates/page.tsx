import { requirePageUser } from '@/lib/studio/pages'
import { getStudio } from '@/lib/studio/runtime'
import TemplateWorkspace from '@/components/studio/TemplateWorkspace'

export default function TemplatesPage() {
  requirePageUser('settings.write')
  return <TemplateWorkspace initial={getStudio().templates.get()} />
}
