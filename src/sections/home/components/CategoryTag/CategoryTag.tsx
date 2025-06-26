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
        isCategoriesList ? 'tag-container_categories-list' : 'tag-container'
      }`}
    >
      {tagName}
    </Tag>
  )
}

export default CategoryTag
