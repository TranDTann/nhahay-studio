'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import { Logo } from '@/components/Navigation/Logo'
import { ConfigProvider as AppConfigProvider } from '@/contexts/ConfigContext'
import paths from '@/routes/paths'
import { ArrowLeftOutlined, MenuOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Layout } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import theme from '../../../config/themeConfig'

const { Content } = Layout

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024)
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <AppConfigProvider>
      <ConfigProvider theme={theme}>
        <Layout style={{ minHeight: '100vh' }}>
          <button
            className="admin-sidebar__toggle"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <MenuOutlined />
          </button>

          <div
            className={`admin-sidebar__overlay ${isSidebarOpen ? 'open' : ''}`}
            onClick={closeSidebar}
          />
          {isSidebarOpen && <AdminSidebar isOpen={isSidebarOpen} />}

          <Layout className="admin-content">
            <Content style={{ padding: '16px 8px', background: '#fff' }}>
              <Button
                style={{ marginLeft: 24 }}
                onClick={() => router.push(paths.dashboard.home())}
              >
                <ArrowLeftOutlined />
                <Logo size="xs" />
                Quay lại NhahayStudio
              </Button>
              {children}
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </AppConfigProvider>
  )
}
