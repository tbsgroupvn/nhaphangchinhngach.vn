import { redirect } from 'next/navigation'
import { requirePageUser } from '@/lib/studio/pages'

export default function LegacyAdminPage() {
  requirePageUser()
  redirect('/admin/dashboard/')
}
