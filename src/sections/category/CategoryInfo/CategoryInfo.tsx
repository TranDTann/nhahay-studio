'use client'

import { Category } from '@/store/categories/crud'
import { Flex } from 'antd'
import './styles.scss'

type TCategoryInfoProps = {
  categoryData: Category
}

const CategoryInfo = ({ categoryData }: TCategoryInfoProps) => {
  return (
    <div id="CategoryInfo">
      <div className="category-info-container">
        <div className="category-intro-web">
          <p>
            Nhà Hay Studio là trang web chuyên chia sẻ về NHÀ và những thứ liên
            quan gắn liền với nhà: Smart home, bếp, vật liệu
          </p>
        </div>
        <Flex className="category-info-header" align="center" gap={16}>
          <img
            src={
              categoryData.urlThumbnail
                ? categoryData.urlThumbnail
                : 'https://hangnhatchuan365.com/wp-content/uploads/2020/09/thiet-bi-bep-108x108-1-36x36.png'
            }
            alt="category-thumbnail"
            className="category-thumbnail-image"
          />
          <div>
            <p className="category-intro">Bạn đang xem các bài viết về</p>
            <h2 className="category-name">{categoryData.name}</h2>
          </div>
        </Flex>
      </div>
    </div>
  )
}

export default CategoryInfo
