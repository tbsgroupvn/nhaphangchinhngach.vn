import { redirect } from 'next/navigation'
import { currentUser } from '@/lib/studio/runtime'

export default function AdminPage() {
  if (currentUser()) redirect('/admin/dashboard/')
  return null
}
