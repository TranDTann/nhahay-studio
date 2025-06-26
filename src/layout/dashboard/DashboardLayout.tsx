import useAuthRouter from '@/auth/useAuthRouter'
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

  if ((isLoggingIn || isSigningUp) && !pathname.includes(paths.auth.root)) {
    content = <LoadingScreen />
  } else {
    content = children
  }

  return (
    <div className="dashboard-container">
      <NavigationBar />
      <div id="main-body" className="main-container">
        {content}
      </div>
    </div>
  )
}

export default DashboardLayout
