/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to support API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  experimental: {
    optimizePackageImports: ['@heroicons/react']
  },
  
  async rewrites() {
    return [
      {
        source: '/admin/cms',
        destination: '/admin/index.html'
      }
    ]
  },
  
  async headers() {
    return [
      {
        source: '/admin/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 