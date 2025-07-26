import paths from '@/routes/paths'
import Link from 'next/link'

export const MENU_ITEMS = [
  {
    key: '/home',
    label: <Link href="/home">Trang chủ</Link>
  },
  {
    key: '/categories',
    label: (
      <Link style={{ color: 'rgb(34 34 34 / 88%)' }} href="/">
        Danh mục sản phẩm
      </Link>
    ),
    children: [
      {
        key: '1',
        label: (
          <Link
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            href={paths.dashboard.category('Thiết bị nhà bếp')}
          >
            <img
              src="https://hangnhatchuan365.com/wp-content/uploads/2020/09/thiet-bi-bep-108x108-1-36x36.png"
              alt="Thiết bị nhà bếp"
              width={20}
              height={20}
            />
            <span>Thiết bị nhà bếp</span>
          </Link>
        )
      },
      {
        key: '2',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="https://hangnhatchuan365.com/wp-content/uploads/2020/09/tu-lanh-108x108-1-36x36.png"
              alt="Lưu trữ & làm mát"
              width={20}
              height={20}
            />
            <span>Lưu trữ & làm mát</span>
          </div>
        )
      },
      {
        key: '3',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="https://hangnhatchuan365.com/wp-content/uploads/2020/09/1-1594532749-7006133703-ecovacs-deebot-n79-icon-1-36x36.jpg"
              alt="Thiết bị làm sạch"
              width={20}
              height={20}
            />
            <span>Thiết bị làm sạch</span>
          </div>
        )
      },
      {
        key: '4',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="https://hangnhatchuan365.com/wp-content/uploads/2020/09/images-1-36x36.png"
              alt="Phòng tắm & WC"
              width={20}
              height={20}
            />
            <span>Phòng tắm & WC</span>
          </div>
        )
      },
      {
        key: '4',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src="https://hangnhatchuan365.com/wp-content/uploads/2020/09/phan-mem-phu-tung-linh-kien-oto-36x36.jpg"
              alt="Phụ kiện khác"
              width={20}
              height={20}
            />
            <span>Phụ kiện khác</span>
          </div>
        )
      }
    ]
  },
  {
    key: '/blog',
    label: <Link href="/">Bài viết</Link>
  }
]
