'use client'

import { Category } from '@/store/categories/crud'
import './styles.css'

type TCategoryInfoProps = {
  categoryData: Category
}

const CategoryInfo = ({ categoryData }: TCategoryInfoProps) => {
  return (
    <div className="category-info-container">
      <img
        src={
          categoryData.urlThumbnail
            ? categoryData.urlThumbnail
            : 'https://hangnhatchuan365.com/wp-content/uploads/2020/09/thiet-bi-bep-108x108-1-36x36.png'
        }
        alt="category-thumbnail"
        className="category-thumbnail-image"
      />
      <h2 className="category-name">{categoryData.name}</h2>
    </div>
  )
}

export default CategoryInfo
