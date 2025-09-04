'use client'

import { postTyes, PostTypeEnum } from '@/store/article/articleStore'
import { Tabs, TabsProps } from 'antd'
import './styles.css'

type TCategoryPostFilterProps = {
  setPostType: (data: number) => void
}

const CategoryPostFilter = ({ setPostType }: TCategoryPostFilterProps) => {
  const tabItems: TabsProps['items'] = postTyes.map((i) => ({
    key: i.key.toString(),
    label: i.label
  }))

  return (
    <div id="CategoryPostFilter">
      <Tabs
        defaultActiveKey={PostTypeEnum.NONE.toString()}
        items={tabItems}
        onChange={(activeKey) => setPostType(+activeKey)}
        style={{ backgroundColor: '#fff' }}
      />
    </div>
  )
}

export default CategoryPostFilter
