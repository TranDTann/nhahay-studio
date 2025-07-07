import CategoryTag from '../../components/CategoryTag/CategoryTag'
import { TCategory } from '../types'
import './styles.css'

type TCategoryItemProps = {
  categoryData: TCategory
}

const CategoryItem = ({ categoryData }: TCategoryItemProps) => {
  return (
    <div className="category-container">
      <div className="category-thumbnail-container">
        <img
          src={categoryData.thumbnail}
          alt="category-thumbnail"
          className="category-thumbnail image-hover-zoom"
        />
      </div>
      <div className="category-tag">
        <CategoryTag tagName={categoryData.name} isCategoriesList />
      </div>
    </div>
  )
}

export default CategoryItem
