import paths from '@/routes/paths'
import { Category } from '@/store/categories/crud'
import Link from 'next/link'

export const getMenu = (categories: Category[]) => [
  {
    key: '/home',
    label: <Link href="/home">Trang chủ</Link>
  },
  {
    key: '/categories',
    label: 'Danh mục sản phẩm',
    children: categories.map((categoryItem) => ({
      key: categoryItem.id,
      label: (
        <Link href={paths.dashboard.category(categoryItem.id)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={
                categoryItem?.['thumbnail'] ??
                'https://hangnhatchuan365.com/wp-content/uploads/2020/09/thiet-bi-bep-108x108-1-36x36.png'
              }
              alt={categoryItem.name}
              width={20}
              height={20}
            />
            <span>{categoryItem.name}</span>
          </div>
        </Link>
      )
    }))
  },
  {
    key: '/admin',
    label: <Link href={paths.admin.articles()}>Admin</Link>
  }
]
