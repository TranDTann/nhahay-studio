'use client'

import { Suspense } from 'react'
import Head from 'next/head'
import { Be_Vietnam_Pro } from 'next/font/google'
import { App as AntApp, ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import theme from '../../config/themeConfig'
import './global.css'
import { HomeLayout } from '@/layout/home'

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <body className={beVietnamPro.className} suppressHydrationWarning>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <AntApp>
              <Suspense>
                <HomeLayout>{children}</HomeLayout>
              </Suspense>
            </AntApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
