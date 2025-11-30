'use client'

import useAuthRouter from '@/auth/useAuthRouter'
import { BackToTop } from '@/components/BackToTop'
import { Footer } from '@/components/Footer'
import { LoadingScreen } from '@/components/LoadingScreen'
import { PopupBanner } from '@/components/PopupBanner'
import NavigationBar from '@/components/Navigation/NavigationBar'
import { useConfigContext } from '@/contexts/ConfigContext'
import paths from '@/routes/paths'
import { useAuthStore } from '@/store/auth/authStore'
import { usePathname } from 'next/navigation'
import './styles.css'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthRouter()

  const pathname = usePathname()
  const { isLoggingIn, isSigningUp } = useAuthStore((state) => state)
  const { getConfigByKey } = useConfigContext()
  const ledText = getConfigByKey('LED_TEXT')
  const hasLedText = ledText && ledText.trim() !== ''

  let content: React.ReactNode = null

  const isLoadingPage =
    ((isLoggingIn || isSigningUp) && !pathname.includes(paths.auth.root)) ||
    pathname === '/'

  if (isLoadingPage) {
    content = <LoadingScreen />
  } else {
    content = children
  }

  const isPostDetailPage = pathname.includes(
    paths.dashboard.postDetail({ id: '', title: '' })
  )

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div
        id="main-body"
        className={`main-container ${isPostDetailPage && 'main-container-width-80'} 
        ${hasLedText && 'main-container-led-text'}
          `}
      >
        {content}
      </div>
      <Footer />
      <BackToTop />
      <PopupBanner />
    </div >
  )
}

export default DashboardLayout
