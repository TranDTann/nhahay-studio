/** @type {import('next').NextConfig} */
const withLinaria = require('next-with-linaria')
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      },
      {
        protocol: 'http',
        hostname: '*'
      }
    ]
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/umami/script.js',
        destination: 'https://umami.autodity.dev/script.js'
      }
    ]
  },
  compiler: {
    styledComponents: true
  }
}

module.exports = withLinaria(nextConfig)
