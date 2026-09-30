import { z } from 'zod'
import { getStudio, requireUser } from '@/lib/studio/runtime'
import { studioFailure, studioJson } from '@/lib/studio/api'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  try {
    requireUser('content.read')
    const id = z
      .string()
      .uuid()
      .parse(new URL(request.url).searchParams.get('id'))
    return studioJson({ suggestions: getStudio().seo.suggestions(id) })
  } catch (error) {
    return studioFailure(error)
  }
}
