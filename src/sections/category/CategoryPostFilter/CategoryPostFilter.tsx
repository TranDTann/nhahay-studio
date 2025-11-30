'use client'

import { useDebounce } from '@/hooks/useDebounce'
import {
  EViewMode,
  useCategoryPostsStore
} from '@/store/categoryPosts/categoryPostStore'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { FaList, FaThLarge } from 'react-icons/fa'
import './styles.scss'

const CategoryPostFilter = () => {
  const [valueSearch, setValueSearch] = useState('')

  const searchQuery = useDebounce(valueSearch, 300).trim()

  const { viewMode, filters } = useCategoryPostsStore((state) => state)

  const gridMode = viewMode === EViewMode.GRID

  useEffect(() => {
    useCategoryPostsStore.setState({
      filters: { ...filters, search: searchQuery ? searchQuery : undefined }
    })
  }, [searchQuery])

  const tooltipStyles = {
    body: {
      fontSize: 12,
      lineHeight: 1.2,
      minHeight: 'auto'
    },
    root: {
      borderRadius: 4
    }
  }

  return (
    <Flex
      id="CategoryPostFilter"
      justify="space-between"
      gap={16}
      style={{ padding: '4px 0 20px' }}
    >
      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm kiếm bài viết"
        onChange={(e) => setValueSearch(e.target.value)}
        value={valueSearch}
        className="input-search-post"
      />
      <div className="category-post-view-mode">
        <Tooltip
          placement="topLeft"
          title="Chế độ xem lưới"
          styles={tooltipStyles}
        >
          <Button
            onClick={() =>
              useCategoryPostsStore.setState({ viewMode: EViewMode.GRID })
            }
            type={gridMode ? 'primary' : 'text'}
            style={{ marginRight: 8 }}
            className={`${gridMode && 'background-color-primary'}`}
          >
            <FaThLarge />
          </Button>
        </Tooltip>
        <Tooltip
          styles={tooltipStyles}
          placement="topRight"
          title="Chế độ xem danh sách"
        >
          <Button
            onClick={() =>
              useCategoryPostsStore.setState({ viewMode: EViewMode.LIST })
            }
            type={gridMode ? 'text' : 'primary'}
            className={`${!gridMode && 'background-color-primary'}`}
          >
            <FaList />
          </Button>
        </Tooltip>
      </div>
    </Flex>
  )
}

export default CategoryPostFilter
