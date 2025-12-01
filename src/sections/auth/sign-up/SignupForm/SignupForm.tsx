'use client'

import paths from '@/routes/paths'
import { useAuthStore } from '@/store/auth/authStore'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, FormProps, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { TSignupForm } from '../types'
import './styles.css'

const SignupForm = () => {
  const router = useRouter()
  const { signup, login, postDetailPage } = useAuthStore((state) => state)

  const onFinish: FormProps<TSignupForm>['onFinish'] = async (values) => {
    try {
      await signup({
        username: values.username,
        email: values.username,
        password: values.password
      })

      await login({ username: values.username, password: values.password })

      if (postDetailPage) {
        router.push(
          paths.dashboard.postDetail({
            id: postDetailPage.id,
            title: postDetailPage.title
          })
        )
      } else {
        router.push(paths.dashboard.home())
      }

      useAuthStore.setState({ isLoggingIn: false })
    } catch (error) {
      console.log({ error })
    }
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
          { required: true, message: 'Vui lòng nhập địa chỉ email của bạn.' },
          { type: 'email', message: 'Email không hợp lệ.' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Tên đăng nhập"
          className="email-address-input"
        />
      </Form.Item>
      <Form.Item<TSignupForm>
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn.' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Mật khẩu"
          className="password-input"
        />
      </Form.Item>
      <Form.Item
        name="password2"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Xác nhận mật khẩu.' },
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
          placeholder="Xác nhận mật khẩu"
          className="password-input"
        />
      </Form.Item>
      <Form.Item className="signup-button-wrapper">
        <Button
          block
          type="primary"
          htmlType="submit"
          className="signup-button background-color-primary"
        >
          Tạo tài khoản
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SignupForm
