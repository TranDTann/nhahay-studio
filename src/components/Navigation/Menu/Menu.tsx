'use client'

import { EUserRole, useAuthStore } from '@/store/auth/authStore'
import { useCategoriesStore } from '@/store/categories/categoriesStore'
import { Menu as MenuAntd } from 'antd'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getMenu } from './data'
import './styles.scss'

type TMenuProps = { mode?: 'horizontal' | 'vertical' | 'inline' }

const Menu = ({ mode = 'horizontal' }: TMenuProps) => {
  const pathname = usePathname()

  const { categories, getCategories } = useCategoriesStore((state) => state)
  const authUser = useAuthStore((state) => state.authUser)

  const isAdmin = authUser && authUser.role === EUserRole.ADMIN

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div id="Menu">
      <div className={`menu-container ${mode === 'inline' && 'menu-tablet'}`}>
        <MenuAntd
          mode={mode}
          selectedKeys={[pathname]}
          items={getMenu({ categories, isAdmin })}
          style={{ border: 'none' }}
        />
      </div>
    </div>
  )
}

export default Menu
