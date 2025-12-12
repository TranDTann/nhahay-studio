import paths from '@/routes/paths'
import { Category } from '@/store/categories/crud'
import { useNavigationBarStore } from '@/store/navigationBar/navigationBarStore'
import Link from 'next/link'

type TGetMenuProps = {
  categories: Category[]
  isAdmin?: boolean
}

enum DefaultCategory {
  XoBep = 'Xó Bếp',
  MeoNhaHay = 'Mẹo Nhà Hay',
  NhaHayKhuyenDung = 'Nhà Hay Khuyên Dùng',
  NhaHayDanhGia = 'Nhà Hay Đánh Giá'
}

const KEYWORD = 'Nhà Hay'

export const getMenu = ({ categories, isAdmin }: TGetMenuProps) => {
  const categoriesInDropdown = []

  let xoBep = null
  let meoNhaHay = null
  let nhaHayDanhGia = null
  let nhaHayKhuyenDung = null

  const categoryMap = {
    [DefaultCategory.XoBep]: (item) => (xoBep = item),
    [DefaultCategory.MeoNhaHay]: (item) => (meoNhaHay = item),
    [DefaultCategory.NhaHayDanhGia]: (item) => (nhaHayDanhGia = item),
    [DefaultCategory.NhaHayKhuyenDung]: (item) => (nhaHayKhuyenDung = item)
  }

  categories.forEach((item) => {
    if (!item?.isTopBar) {
      categoriesInDropdown.push(item)
      return
    }

    const getCategory = categoryMap[item.name]
    if (getCategory) getCategory(item)
  })

  const renderCategoryDefaultLabel = (text: string) => {
    if (!text) return text

    const parts = text.split(KEYWORD)

    if (parts.length <= 1) return text

    return (
      <>
        {parts[0]}
        <span className="highlight-nhahay-text">{KEYWORD}</span>
        {parts[1]}
      </>
    )
  }

  return [
    {
      key: '/home',
      label: (
        <Link
          href="/home"
          onClick={() => useNavigationBarStore.setState({ openMenu: false })}
        >
          Trang Chủ
        </Link>
      )
    },
    {
      key: '/categories',
      label: 'Tin Tức Gia Dụng',
      popupClassName: 'category-menu-popup',
      children: categoriesInDropdown.map((categoryItem) => ({
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
    ...(xoBep
      ? [
          {
            key: `${paths.dashboard.category({
              id: xoBep.id,
              title: xoBep.name
            })}`,
            label: (
              <Link
                className="highlight-nhahay"
                href={paths.dashboard.category({
                  id: xoBep.id,
                  title: xoBep.name
                })}
                onClick={() =>
                  useNavigationBarStore.setState({ openMenu: false })
                }
              >
                {renderCategoryDefaultLabel(xoBep.name)}
              </Link>
            )
          }
        ]
      : []),
    ...(meoNhaHay
      ? [
          {
            key: `${paths.dashboard.category({
              id: meoNhaHay.id,
              title: meoNhaHay.name
            })}`,
            label: (
              <Link
                href={paths.dashboard.category({
                  id: meoNhaHay.id,
                  title: meoNhaHay.name
                })}
                onClick={() =>
                  useNavigationBarStore.setState({ openMenu: false })
                }
              >
                {renderCategoryDefaultLabel(meoNhaHay.name)}
              </Link>
            )
          }
        ]
      : []),
    ...(nhaHayDanhGia
      ? [
          {
            key: `${paths.dashboard.category({
              id: nhaHayDanhGia.id,
              title: nhaHayDanhGia.name
            })}`,
            label: (
              <Link
                href={paths.dashboard.category({
                  id: nhaHayDanhGia.id,
                  title: nhaHayDanhGia.name
                })}
                onClick={() =>
                  useNavigationBarStore.setState({ openMenu: false })
                }
              >
                {renderCategoryDefaultLabel(nhaHayDanhGia.name)}
              </Link>
            )
          }
        ]
      : []),
    ...(nhaHayKhuyenDung
      ? [
          {
            key: `${paths.dashboard.category({
              id: nhaHayKhuyenDung.id,
              title: nhaHayKhuyenDung.name
            })} `,
            label: (
              <Link
                href={paths.dashboard.category({
                  id: nhaHayKhuyenDung.id,
                  title: nhaHayKhuyenDung.name
                })}
                onClick={() =>
                  useNavigationBarStore.setState({ openMenu: false })
                }
              >
                {renderCategoryDefaultLabel(nhaHayKhuyenDung.name)}
              </Link>
            )
          }
        ]
      : []),
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
}
