'use client';

import { Suspense } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { App as AntApp, ConfigProvider } from 'antd';
import { HomeLayout } from '@/layout/home';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import theme from '../../config/themeConfig';
import '@/styles/variables.scss';
import '@/styles/global.scss';
import '@/styles/components.scss';
import '@/styles/content-blocks.scss';
import '@/styles/article-renderer.scss';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <body className={inter.className} suppressHydrationWarning>
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
  );
}
