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
      <h1 className="signup-title">Đăng ký</h1>
      <p className="signup-description">Tạo tài khoản</p>
      <SignupForm />
      <div className="have-account">
        <p>Bạn đã có tài khoản?</p>
        <Button
          type="link"
          className="login-now-button color-primary"
          onClick={() => router.push(paths.auth.login)}
        >
          Đăng nhập
        </Button>
      </div>
    </div>
  )
}

export default SignUpView
