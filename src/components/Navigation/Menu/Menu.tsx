'use client'

import { Menu as MenuAntd } from 'antd'
import { usePathname } from 'next/navigation'
import { MENU_ITEMS } from './data'
import './styles.css'

const Menu = () => {
  const pathname = usePathname()

  return (
    <div className="menu-container">
      <MenuAntd
        mode="horizontal"
        selectedKeys={[pathname]}
        items={MENU_ITEMS}
        style={{ border: 'none' }}
      />
    </div>
  )
}

export default Menu
