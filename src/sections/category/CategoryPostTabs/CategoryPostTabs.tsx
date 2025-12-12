'use client'

import { postTyes, PostTypeEnum } from '@/store/article/articleStore'
import { useCategoryPostsStore } from '@/store/categoryPosts/categoryPostStore'
import { Select, Tabs, TabsProps } from 'antd'
import './styles.scss'

const CategoryPostTabs = () => {
  const { filters } = useCategoryPostsStore((state) => state)

  const tabItems: TabsProps['items'] = postTyes.map((i) => ({
    key: i.key.toString(),
    label: i.label
  }))

  return (
    <div id="CategoryPostTabs">
      <Tabs
        defaultActiveKey={PostTypeEnum.NONE.toString()}
        items={tabItems}
        onChange={(activeKey) =>
          useCategoryPostsStore.setState({
            filters: { ...filters, listType: +activeKey }
          })
        }
        style={{ backgroundColor: '#fff' }}
        className="category-post-tabs-container color-primary"
      />
      <Select
        defaultValue={PostTypeEnum.NONE.toString()}
        value={filters?.listType?.toString()}
        onChange={(value) =>
          useCategoryPostsStore.setState({
            filters: { ...filters, listType: +value }
          })
        }
        className="category-post-selection-container"
        style={{ backgroundColor: '#fff' }}
        options={tabItems.map((item) => ({
          label: item.label,
          value: item.key
        }))}
      />
    </div>
  )
}

export default CategoryPostTabs
