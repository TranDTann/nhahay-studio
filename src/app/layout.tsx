'use client'
import { Suspense } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { App as AntApp, ConfigProvider } from 'antd';
import { HomeLayout } from '@/layout/home';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider as AppConfigProvider } from '@/contexts/ConfigContext';
import theme from '../../config/themeConfig';
import '@/styles/variables.scss';
import '@/styles/global.scss';
import '@/styles/components.scss';
import '@/styles/content-blocks.scss';
import '@/styles/article-renderer.scss';
import { Be_Vietnam_Pro } from 'next/font/google'
import './global.css'

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
          <AppConfigProvider>
            <ConfigProvider theme={theme}>
              <AntApp>
                <Suspense>
                  <HomeLayout>{children}</HomeLayout>
                </Suspense>
              </AntApp>
            </ConfigProvider>
          </AppConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
