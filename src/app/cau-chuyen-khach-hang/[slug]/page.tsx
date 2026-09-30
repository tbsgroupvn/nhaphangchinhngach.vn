import { notFound, permanentRedirect } from 'next/navigation'
import { getStoryBySlug } from '@/data/customerStories'

export default function Page({ params }: { params: { slug: string } }) {
  if (!getStoryBySlug(params.slug)) notFound()
  permanentRedirect('/nang-luc-van-hanh')
}
