'use client'

import { useCategoriesStore } from '@/store/categories/categoriesStore'
import { Menu as MenuAntd } from 'antd'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getMenu } from './data'
import './styles.css'

const Menu = () => {
  const pathname = usePathname()
  const { categories, getCategories } = useCategoriesStore((state) => state)

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <div className="menu-container">
      <MenuAntd
        mode="horizontal"
        selectedKeys={[pathname]}
        items={getMenu(categories)}
        style={{ border: 'none' }}
      />
    </div>
  )
}

export default Menu
