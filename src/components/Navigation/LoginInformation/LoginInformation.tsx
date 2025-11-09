'use client'

import paths from '@/routes/paths'
import { useAuthStore } from '@/store/auth/authStore'
import type { MenuProps } from 'antd'
import { Button, Dropdown, Tooltip } from 'antd'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { FaUser } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { TbLogout } from 'react-icons/tb'
import './styles.scss'

type TLoginInformationProps = {
  isTablet?: boolean
}

const LoginInformation = ({ isTablet }: TLoginInformationProps) => {
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
      <div id="LoginInformation">
        <div
          className={`login-information-container ${
            isTablet ? 'tablet-menu' : 'desktop-menu'
          }`}
        >
          <Button type="default" onClick={() => router.push(paths.auth.login)}>
            Đăng nhập
          </Button>
          {/* <Button type="text" onClick={handleLoginWithGoogle}>
            <FcGoogle />
          </Button> */}
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    Cookies.remove('token')

    router.push(paths.auth.login)
    useAuthStore.setState({ postDetailPage: undefined })
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
    <div id="LoginInformation">
      <div
        className={`user-container ${
          isTablet ? 'tablet-menu' : 'desktop-menu'
        }`}
      >
        <FaUser />
        <Tooltip placement="bottomLeft" title={authUser?.username}>
          <p className="user-name">{authUser?.username}</p>
        </Tooltip>
        <Dropdown menu={{ items: logoutItems }} trigger={['click']}>
          <Button type="text" size="large">
            <TbLogout />
          </Button>
        </Dropdown>
      </div>
    </div>
  )
}

export default LoginInformation
