import { notFound } from 'next/navigation'
import Link from 'next/link'
import ContentPreview from '@/components/marketing/ContentPreview'
import { getStudio } from '@/lib/studio/runtime'
import { requirePageUser } from '@/lib/studio/pages'
import { StudioError } from '@/lib/studio/errors'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Bản nháp TBS Studio',
  robots: { index: false, follow: false },
}
export default function PreviewPage({ params }: { params: { id: string } }) {
  requirePageUser()
  let document
  try {
    document = getStudio().content.get(params.id)
  } catch (error) {
    if (error instanceof StudioError && error.status === 404) notFound()
    throw error
  }
  return (
    <>
      <div className="tbs-preview-banner">
        <span>Bản nháp đã lưu · v{document.version}</span>
        <Link href={`/admin/content/${document.id}/`}>Trở lại biên tập</Link>
      </div>
      <ContentPreview payload={getStudio().content.preview(document.id)} />
    </>
  )
}
