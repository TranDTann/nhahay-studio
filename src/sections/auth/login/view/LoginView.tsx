'use client'

import paths from '@/routes/paths'
import { Button, Flex } from 'antd'
import { useRouter } from 'next/navigation'
import LoginForm from '../LoginForm/LoginForm'
import './styles.css'

const LoginView = () => {
  const router = useRouter()

  return (
    <div className="login-wrapper">
      <h1 className="login-title">Đăng nhập</h1>
      <p className="login-description">Đăng nhập vào tài khoản của bạn.</p>
      <LoginForm />
      <div className="no-account">
        <p>Bạn chưa có tài khoản?</p>
        <Button
          type="link"
          className="sign-up-button color-primary"
          onClick={() => router.push(paths.auth.signup)}
        >
          Đăng ký
        </Button>
      </div>
      <Flex align="center">
        <p style={{ color: '#818181', fontSize: '14px' }}>
          Sử dụng không cần đăng nhập
        </p>
        <Button
          style={{ padding: '4px', fontWeight: 600 }}
          className="color-primary"
          type="link"
          onClick={() => router.push(paths.dashboard.home())}
        >
          Trang chủ
        </Button>
      </Flex>
      {/* <Divider className="login-with-others">
        <p>Login</p>
        <p>with Others</p>
      </Divider>
      <LoginWithGoogle /> */}
    </div>
  )
}

export default LoginView
