'use client'

import { EUserRole, useAuthStore } from '@/store/auth/authStore'
import { useCategoriesStore } from '@/store/categories/categoriesStore'
import { Menu as MenuAntd } from 'antd'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getMenu } from './data'
import './styles.css'

const Menu = () => {
  const pathname = usePathname()

  const { categories, getCategories } = useCategoriesStore((state) => state)
  const authUser = useAuthStore((state) => state.authUser)

  const isAdmin = authUser && authUser.role === EUserRole.ADMIN

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div className="menu-container">
      <MenuAntd
        mode="horizontal"
        selectedKeys={[pathname]}
        items={getMenu({ categories, isAdmin })}
        style={{ border: 'none' }}
      />
    </div>
  )
}

export default Menu
