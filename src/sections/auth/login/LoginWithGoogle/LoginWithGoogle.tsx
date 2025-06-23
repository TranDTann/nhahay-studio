import { Button } from 'antd'
import Image from 'next/image'
import './styles.css'
import { useAuthStore } from '@/store/auth/authStore'
import paths from '@/routes/paths'
import { useRouter } from 'next/navigation'

const LoginWithGoogle = () => {
  const router = useRouter()

  const { loginWithGoogle } = useAuthStore((state) => state)

  const handleLoginWithGoogle = async () => {
    try {
      await loginWithGoogle({})
      router.push(paths.dashboard.home())
    } catch (error) {}
  }

  return (
    <div className="login-google-wrapper">
      <Button className="login-google-button" onClick={handleLoginWithGoogle}>
        <Image
          src="/logos/google-logo.svg"
          alt="google-logo"
          width={30}
          height={30}
        />
        <p>
          Login with <b>google</b>
        </p>
      </Button>
    </div>
  )
}

export default LoginWithGoogle
