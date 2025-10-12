import { Drawer } from 'antd'
import { useState } from 'react'
import { FaBars } from 'react-icons/fa'
import { LoginInformation } from './LoginInformation'
import { Logo } from './Logo'
import { Menu } from './Menu'
import './styles.scss'

const NavigationBar = () => {
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <div id="NavigationBar">
      <div className="navigation-bar-container">
        <div className="navigation-bar-content">
          <Logo />
          <Menu />
          <LoginInformation />
          <button
            className="menu-toggle"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <FaBars />
          </button>
        </div>
      </div>
      <Drawer
        title="Nhahay Studio"
        placement="left"
        style={{
          width: '80%'
        }}
        onClose={() => setOpenMenu(false)}
        open={openMenu}
      >
        <Menu mode="inline" />
        <LoginInformation isTablet />
      </Drawer>
    </div>
  )
}

export default NavigationBar
