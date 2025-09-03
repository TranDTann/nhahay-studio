import useAuthRouter from '@/auth/useAuthRouter'
import { Footer } from '@/components/Footer'
import { LoadingScreen } from '@/components/LoadingScreen'
import NavigationBar from '@/components/Navigation/NavigationBar'
import paths from '@/routes/paths'
import { useAuthStore } from '@/store/auth/authStore'
import { usePathname } from 'next/navigation'
import './styles.css'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthRouter()

  const pathname = usePathname()
  const { isLoggingIn, isSigningUp } = useAuthStore((state) => state)

  let content: React.ReactNode = null

  const isLoadingPage =
    ((isLoggingIn || isSigningUp) && !pathname.includes(paths.auth.root)) ||
    pathname === '/'

  if (isLoadingPage) {
    content = <LoadingScreen />
  } else {
    content = children
  }

  const isPostDetailPage = pathname.includes(paths.dashboard.postDetail(''))

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div
        id="main-body"
        className={`main-container ${
          isPostDetailPage && 'main-container-width-80'
        }`}
      >
        {content}
      </div>
      <Footer />
    </div>
  )
}

export default DashboardLayout
