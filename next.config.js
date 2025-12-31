/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Netlify
  output: 'standalone',

  // Remove static export to support API routes
  // trailingSlash: false, // REMOVED - Was causing redirect loop with Netlify
  images: {
    unoptimized: true
  },
  
  // Improved module resolution
  webpack: (config, { isServer }) => {
    // Improve module resolution for Netlify
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    // Handle case-sensitive imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    }
    
    return config
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