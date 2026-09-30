/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to support API routes
  trailingSlash: true,
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
    serverComponentsExternalPackages: ['better-sqlite3', 'sharp'],
    optimizePackageImports: ['@heroicons/react']
  },
  
  async redirects() {
    return [
      {
        source: '/admin/cms',
        destination: '/admin/',
        permanent: false
      },
      {
        source: '/admin/index.html',
        destination: '/admin/',
        permanent: false
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
            value: 'DENY'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
