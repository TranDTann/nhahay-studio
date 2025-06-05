'use client'

import { Divider } from 'antd'
import LoginForm from '../LoginForm/LoginForm'
import LoginWithGoogle from '../LoginWithGoogle'
import './styles.css'

const LoginView = () => {
  return (
    <div className="login-wrapper">
      <h1 className="login-title">Login</h1>
      <p className="login-description">Login your account</p>
      <div className="form-wrapper">
        <LoginForm />
      </div>
      <div className="no-account">
        <p>Don’t have an account?</p>
        <a href="">Sign up</a>
      </div>
      <Divider className="login-with-others" style={{ borderColor: '#7cb305' }}>
        <p>Login</p>
        <p>with Others</p>
      </Divider>
      <LoginWithGoogle />
    </div>
  )
}

export default LoginView
