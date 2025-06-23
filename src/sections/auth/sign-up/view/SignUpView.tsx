'use client'

import paths from '@/routes/paths'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'
import SignupForm from '../SignupForm/SignupForm'
import './styles.css'

const SignUpView = () => {
  const router = useRouter()

  return (
    <div className="signup-wrapper">
      <h1 className="signup-title">Signup</h1>
      <p className="signup-description">Create your account</p>
      <SignupForm />
      <div className="have-account">
        <p>Already have an account?</p>
        <Button
          type="link"
          className="login-now-button"
          onClick={() => router.push(paths.auth.login)}
        >
          Login Now
        </Button>
      </div>
    </div>
  )
}

export default SignUpView
