import { useState, useEffect } from 'react'
import { message } from 'antd'
import {
  configService,
  ConfigItem,
  ConfigQueryParams
} from '@/api/configService'

export const useConfig = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0
  })

  // Fetch all configs
  const fetchConfigs = async (
    params: ConfigQueryParams = {
      search: '',
      sort: 'key',
      sortDir: 0,
      skip: 0,
      take: 100
    }
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await configService.getAllConfigs(params)
      setConfigs(response.result || [])

      // Cập nhật pagination nếu có
      if (response.total !== undefined) {
        setPagination((prev) => ({
          ...prev,
          total: response.total,
          current: response.page || 1,
          pageSize: response.pageSize || 10
        }))
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch configs'
      console.error(errorMessage, err)
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Create new config
  const createConfig = async (config: Omit<ConfigItem, 'id'>) => {
    try {
      await configService.createConfig(config)
      message.success('Config created successfully')
      await fetchConfigs() // Refresh the list
      return true
    } catch (err) {
      const errorMessage = 'Failed to create config'
      console.error(errorMessage, err)
      message.error(errorMessage)
      return false
    }
  }

  // Update config
  const updateConfig = async (config: ConfigItem) => {
    try {
      await configService.updateConfig(config)
      message.success('Config updated successfully')
      await fetchConfigs() // Refresh the list
      return true
    } catch (err) {
      const errorMessage = 'Failed to update config'
      console.error(errorMessage, err)
      message.error(errorMessage)
      return false
    }
  }

  // Delete config
  const deleteConfig = async (id: number) => {
    try {
      await configService.deleteConfig(id)
      message.success('Config deleted successfully')
      await fetchConfigs() // Refresh the list
      return true
    } catch (err) {
      const errorMessage = 'Failed to delete config'
      console.error(errorMessage, err)
      message.error(errorMessage)
      return false
    }
  }

  // Get config by key
  const getConfigByKey = async (key: string) => {
    try {
      return await configService.getConfigByKey(key)
    } catch (err) {
      console.error('Failed to get config by key:', err)
      return null
    }
  }

  // Initialize on mount
  useEffect(() => {
    fetchConfigs()
  }, [])

  return {
    configs,
    loading,
    error,
    pagination,
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
    getConfigByKey
  }
}
