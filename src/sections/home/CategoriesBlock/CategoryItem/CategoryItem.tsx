import paths from '@/routes/paths'
import { Category } from '@/store/categories/crud'
import { Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import './styles.scss'

type TCategoryItemProps = {
  categoryData: Category
}

const CategoryItem = ({ categoryData }: TCategoryItemProps) => {
  const router = useRouter()

  return (
    <div id="CategoryItem">
      <div
        className="category-container image-hover-zoom-container"
        onClick={() =>
          router.push(
            paths.dashboard.category({
              id: categoryData.id,
              title: categoryData.name
            })
          )
        }
      >
        <div className="category-thumbnail-container">
          <img
            src={
              categoryData.urlThumbnail
                ? categoryData.urlThumbnail
                : 'https://hangnhatchuan365.com/wp-content/uploads/2020/09/thiet-bi-bep-108x108-1-36x36.png'
            }
            alt="category-thumbnail"
            className="category-thumbnail image-hover-zoom"
          />
          <Tooltip title={categoryData.name}>
            <p className="display-max-2-lines category-name">
              {categoryData.name}
            </p>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default CategoryItem
