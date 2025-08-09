import { Category } from '@/store/categories/crud'
import CategoryTag from '../../components/CategoryTag/CategoryTag'
import './styles.css'
import { useRouter } from 'next/navigation'
import paths from '@/routes/paths'

type TCategoryItemProps = {
  categoryData: Category
}

const CategoryItem = ({ categoryData }: TCategoryItemProps) => {
  const router = useRouter()

  return (
    <div
      className="category-container image-hover-zoom-container"
      onClick={() => router.push(paths.dashboard.category(categoryData.id))}
    >
      <div className="category-thumbnail-container">
        <img
          src={
            categoryData?.['thumbnail'] ??
            'https://hangnhatchuan365.com/wp-content/uploads/2020/09/thiet-bi-bep-108x108-1-36x36.png'
          }
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
