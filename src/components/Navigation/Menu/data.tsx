import paths from '@/routes/paths'
import { Category } from '@/store/categories/crud'
import { useNavigationBarStore } from '@/store/navigationBar/navigationBarStore'
import Link from 'next/link'

type TGetMenuProps = {
  categories: Category[]
  isAdmin?: boolean
}

export const getMenu = ({ categories, isAdmin }: TGetMenuProps) => [
  {
    key: '/home',
    label: (
      <Link
        href="/home"
        onClick={() => useNavigationBarStore.setState({ openMenu: false })}
      >
        Trang chủ
      </Link>
    )
  },
  {
    key: '/categories',
    label: 'Danh mục bài viết',
    popupClassName: 'category-menu-popup',
    children: categories.map((categoryItem) => ({
      key: categoryItem.id,
      label: (
        <Link
          href={paths.dashboard.category({
            id: categoryItem.id,
            title: categoryItem.name
          })}
          onClick={() => useNavigationBarStore.setState({ openMenu: false })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={
                categoryItem.urlThumbnail
                  ? categoryItem.urlThumbnail
                  : 'https://hangnhatchuan365.com/wp-content/uploads/2020/09/thiet-bi-bep-108x108-1-36x36.png'
              }
              alt={categoryItem.name}
              width={20}
              height={20}
              style={{ borderRadius: '3px' }}
            />
            <span>{categoryItem.name}</span>
          </div>
        </Link>
      )
    }))
  },
  ...(isAdmin
    ? [
        {
          key: '/admin',
          label: (
            <Link
              href={paths.admin.articles()}
              onClick={() =>
                useNavigationBarStore.setState({ openMenu: false })
              }
            >
              Admin
            </Link>
          ),
          hidden: true
        }
      ]
    : [])
]
