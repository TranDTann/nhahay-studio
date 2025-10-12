import { Tag } from 'antd'
import './styles.scss'

type TCategoryTagProps = {
  tagName: string
  isCategoriesList?: boolean
}

const CategoryTag = ({ tagName, isCategoriesList }: TCategoryTagProps) => {
  return (
    <div id="CategoryTag">
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
    </div>
  )
}

export default CategoryTag
