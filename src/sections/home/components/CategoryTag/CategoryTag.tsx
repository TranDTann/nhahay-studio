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
        color="#52c41a"
        className={`${
          isCategoriesList
            ? 'tag-container_categories-list display-max-3-lines'
            : 'tag-container display-max-1-lines'
        }`}
        style={{ boxShadow: '0 1px 1px #3aad00' }}
      >
        {tagName}
      </Tag>
    </div>
  )
}

export default CategoryTag
