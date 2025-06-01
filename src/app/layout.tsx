import { Suspense } from 'react'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd'
import { HomeLayout } from '@/layout/home'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import theme from '../../config/themeConfig'
import './global.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className} suppressHydrationWarning>
        <ConfigProvider theme={theme}>
          <AntdRegistry>
            <Suspense>
              <HomeLayout>{children}</HomeLayout>
            </Suspense>
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  )
}
