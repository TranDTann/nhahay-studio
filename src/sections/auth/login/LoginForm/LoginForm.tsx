'use client'

import { Button, Checkbox, Flex, Form, FormProps, Input } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import './styles.css'
import { TLoginForm } from '../types'
import { useRouter } from 'next/navigation'
import paths from '@/routes/paths'
import { useAuthStore } from '@/store/auth/authStore'

const LoginForm = () => {
  const router = useRouter()
  const { login } = useAuthStore((state) => state)

  const onFinish: FormProps<TLoginForm>['onFinish'] = async (values) => {
    try {
      await login(values)
      router.push(paths.dashboard.home())
    } catch (error) {}
  }

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      className="login-form"
    >
      <Form.Item<TLoginForm>
        name="username"
        rules={[
          { required: true, message: 'Please input your email address!' },
          { type: 'email', message: 'Please enter a valid email address!' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Email Address"
          className="email-address-input"
        />
      </Form.Item>
      <Form.Item<TLoginForm>
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
          className="password-input"
        />
      </Form.Item>
      <Form.Item className="remember-wrapper">
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="remember-checkbox">Remember me</Checkbox>
          </Form.Item>
          <Button type="link" className="forgot-password-button">
            Forgot password
          </Button>
        </Flex>
      </Form.Item>
      <Form.Item className="login-button-wrapper">
        <Button block type="primary" htmlType="submit" className="login-button">
          Login Now
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
