import type { MetadataRoute } from 'next'
import { site } from '@/data/marketing'
import { publicSeoSettings } from '@/lib/studio/public-content'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  if (!publicSeoSettings().indexable) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/studio/media/'],
      disallow: [
        '/admin',
        '/api',
        '/studio-preview',
        '/private',
        '/temp',
        '/test-newsletter',
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
