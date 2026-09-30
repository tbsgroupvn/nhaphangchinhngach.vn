import { redirect } from 'next/navigation'
import { requirePageUser } from '@/lib/studio/pages'

export default function PreviewPage({ params }: { params: { id: string } }) {
  requirePageUser()
  redirect(`/studio-preview/${params.id}/`)
}
