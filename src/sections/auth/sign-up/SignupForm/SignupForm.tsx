'use client'

import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, FormProps, Input } from 'antd'
import './styles.css'
import { TSignupForm } from '../types'
import { useAuthStore } from '@/store/auth/authStore'
import paths from '@/routes/paths'
import { useRouter } from 'next/navigation'

const SignupForm = () => {
  const router = useRouter()
  const { signup } = useAuthStore((state) => state)

  const onFinish: FormProps<TSignupForm>['onFinish'] = async (values) => {
    try {
      await signup({
        username: values.username,
        email: values.username,
        password: values.password
      })

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
      className="signup-form"
    >
      <Form.Item<TSignupForm>
        name="username"
        rules={[
          { required: true, message: 'Please enter your email address!' },
          { type: 'email', message: 'Please enter a valid email address!' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Email Address"
          className="email-address-input"
        />
      </Form.Item>
      <Form.Item<TSignupForm>
        name="password"
        rules={[{ required: true, message: 'Please enter your password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
          className="password-input"
        />
      </Form.Item>
      <Form.Item
        name="password2"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please enter confirm password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(
                new Error('The new password that you entered do not match!')
              )
            }
          })
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Confirm Password"
          className="password-input"
        />
      </Form.Item>
      <Form.Item className="signup-button-wrapper">
        <Button
          block
          type="primary"
          htmlType="submit"
          className="signup-button"
        >
          Create account
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SignupForm
