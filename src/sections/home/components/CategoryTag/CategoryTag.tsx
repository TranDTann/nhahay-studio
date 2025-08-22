import { Tag } from 'antd'
import './styles.css'

type TCategoryTagProps = {
  tagName: string
  isCategoriesList?: boolean
}

const CategoryTag = ({ tagName, isCategoriesList }: TCategoryTagProps) => {
  return (
    <Tag
      color="#F4796C"
      className={`${
        isCategoriesList
          ? 'tag-container_categories-list display-max-3-lines'
          : 'tag-container display-max-1-lines'
      }`}
    >
      {tagName}
    </Tag>
  )
}

export default CategoryTag
