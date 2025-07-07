'use client'

import paths from '@/routes/paths'
import { Button, Divider } from 'antd'
import { useRouter } from 'next/navigation'
import LoginForm from '../LoginForm/LoginForm'
import LoginWithGoogle from '../LoginWithGoogle'
import './styles.css'

const LoginView = () => {
  const router = useRouter()

  return (
    <div className="login-wrapper">
      <h1 className="login-title">Login</h1>
      <p className="login-description">Login your account</p>
      <LoginForm />
      <div className="no-account">
        <p>Don’t have an account?</p>
        <Button
          type="link"
          className="sign-up-button"
          onClick={() => router.push(paths.auth.signup)}
        >
          Sign up
        </Button>
      </div>
      <Divider className="login-with-others">
        <p>Login</p>
        <p>with Others</p>
      </Divider>
      <LoginWithGoogle />
    </div>
  )
}

export default LoginView
