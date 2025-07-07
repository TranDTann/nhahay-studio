/** @type {import('next').NextConfig} */
const withLinaria = require('next-with-linaria')
import path from 'path'
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "@/styles/variables.scss";`
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(scss|css)$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: {
              auto: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        },
        'sass-loader'
      ]
    })
    return config
  },
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
