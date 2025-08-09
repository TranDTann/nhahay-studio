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
        src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/14235/production/_100058428_mediaitem100058424.jpg"
        alt="category-thumbnail"
        className="category-thumbnail-image"
      />
      <h2 className="category-name">{categoryData.name}</h2>
    </div>
  )
}

export default CategoryInfo
