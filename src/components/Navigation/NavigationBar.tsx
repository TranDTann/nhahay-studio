import { useNavigationBarStore } from '@/store/navigationBar/navigationBarStore'
import { Drawer } from 'antd'
import { FaBars } from 'react-icons/fa'
import { LedTextBanner } from '../LedTextBanner'
import { LoginInformation } from './LoginInformation'
import { Logo } from './Logo'
import { Menu } from './Menu'
import './styles.scss'

interface NavigationBarProps {
  className?: string
}

const NavigationBar = ({ className }: NavigationBarProps) => {
  const { openMenu } = useNavigationBarStore((state) => state)

  return (
    <div id="NavigationBar" className={className}>
      <div className="navigation-bar-container">
        <LedTextBanner />
        <div className="navigation-bar-container-content">
          <div className="navigation-bar-content">
            <Logo />
            <Menu />
            <LoginInformation />
            <button
              className="menu-toggle"
              onClick={() =>
                useNavigationBarStore.setState({ openMenu: !openMenu })
              }
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>
      <Drawer
        title="Nhahay Studio"
        placement="left"
        style={{
          width: '80%'
        }}
        onClose={() => useNavigationBarStore.setState({ openMenu: false })}
        open={openMenu}
      >
        <Menu mode="inline" />
        <LoginInformation isTablet />
      </Drawer>
    </div>
  )
}

export default NavigationBar
