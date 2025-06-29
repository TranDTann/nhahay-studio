import CategoryItem from './CategoryItem/CategoryItem'
import { CATEGORIES } from './data'
import './styles.css'

const CategoriesBlock = () => {
  return (
    <div className="categories-container">
      <h2 className="categories-block-title">Our Top Categories</h2>
      <div className="categories-list">
        {CATEGORIES.map((category) => (
          <CategoryItem key={category.id} categoryData={category} />
        ))}
      </div>
    </div>
  )
}

export default CategoriesBlock
