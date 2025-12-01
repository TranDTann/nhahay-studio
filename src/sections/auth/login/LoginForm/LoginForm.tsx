'use client'

import paths from '@/routes/paths'
import { useAuthStore } from '@/store/auth/authStore'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Flex, Form, FormProps, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { TLoginForm } from '../types'
import './styles.css'

const LoginForm = () => {
  const router = useRouter()
  const { login, postDetailPage } = useAuthStore((state) => state)

  const onFinish: FormProps<TLoginForm>['onFinish'] = async (values) => {
    try {
      await login(values)
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
      className="login-form"
    >
      <Form.Item<TLoginForm>
        name="username"
        rules={[
          { required: true, message: 'Vui lòng nhập địa chỉ email của bạn.' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Tên đăng nhập"
          className="email-address-input"
        />
      </Form.Item>
      <Form.Item<TLoginForm>
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
      <Form.Item className="remember-wrapper">
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="remember-checkbox">Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          {/* <Button type="link" className="forgot-password-button">
            Forgot password
          </Button> */}
        </Flex>
      </Form.Item>
      <Form.Item className="login-button-wrapper">
        <Button
          block
          type="primary"
          htmlType="submit"
          className="login-button background-color-primary"
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
