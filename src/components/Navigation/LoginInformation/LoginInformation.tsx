'use client'

import { useAuthStore } from '@/store/auth/authStore'
import { Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { FcGoogle } from 'react-icons/fc'
import { TbLogout } from 'react-icons/tb'
import { FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import paths from '@/routes/paths'
import Cookies from 'js-cookie'
import './styles.css'

const LoginInformation = () => {
  const router = useRouter()
  const { loginWithGoogle, authUser } = useAuthStore((state) => state)

  const handleLoginWithGoogle = async () => {
    try {
      await loginWithGoogle({})
      router.push(paths.dashboard.home())
    } catch (error) {}
  }

  if (!authUser) {
    return (
      <div className="login-information-container">
        <Button type="text" onClick={() => router.push(paths.auth.login)}>
          Đăng nhập
        </Button>
        <Button type="text" onClick={handleLoginWithGoogle}>
          <FcGoogle />
        </Button>
      </div>
    )
  }

  const handleLogout = () => {
    Cookies.remove('token')
    router.push(paths.auth.login)
  }

  const logoutItems: MenuProps['items'] = [
    {
      label: (
        <Button
          type="text"
          size="small"
          style={{ background: 'transparent' }}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      ),
      key: '0'
    }
  ]

  return (
    <div className="user-container">
      <FaUser />
      <p className="user-name">{authUser?.name}</p>
      <Dropdown menu={{ items: logoutItems }} trigger={['click']}>
        <Button type="text" size="large">
          <TbLogout />
        </Button>
      </Dropdown>
    </div>
  )
}

export default LoginInformation
