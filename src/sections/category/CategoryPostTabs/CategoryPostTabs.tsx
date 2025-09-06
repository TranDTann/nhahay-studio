'use client'

import { postTyes, PostTypeEnum } from '@/store/article/articleStore'
import { useCategoryPostsStore } from '@/store/categoryPosts/categoryPostStore'
import { Tabs, TabsProps } from 'antd'
import './styles.css'

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
      />
    </div>
  )
}

export default CategoryPostTabs
