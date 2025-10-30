import { useState, useEffect } from 'react'
import { sessionStorageUtils } from '@/utils/sessionStorage'
import { configService } from '@/api/configService'

export const useSessionConfig = () => {
  const [configs, setConfigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Lấy tất cả configs từ session storage
  const getConfigs = () => {
    return sessionStorageUtils.getConfigs()
  }

  // Lấy config value theo key
  const getConfigByKey = (key: string): string | null => {
    return sessionStorageUtils.getConfigByKey(key)
  }

  // Lấy social media URLs
  const getSocialMediaUrls = () => {
    return {
      facebook: getConfigByKey('facebook') || '',
      instagram: getConfigByKey('instagram') || '',
      tiktok: getConfigByKey('tiktok') || '',
      youtube: getConfigByKey('youtube') || '',
      twitter: getConfigByKey('twitter') || '',
      linkedin: getConfigByKey('linkedin') || '',
      zalo: getConfigByKey('zalo') || ''
    }
  }

  // Kiểm tra xem có configs trong session storage không
  const hasConfigs = () => {
    return sessionStorageUtils.hasConfigs()
  }

  // Refresh configs (xóa session storage)
  const refreshConfigs = () => {
    sessionStorageUtils.clearConfigs()
    setConfigs([])
  }

  // Đồng bộ configs từ server và lưu vào session storage
  const refreshFromServer = async () => {
    setLoading(true)
    try {
      const response = await configService.getAllConfigs()
      const list = response?.result || []
      sessionStorageUtils.saveConfigs(list)
      setConfigs(list)
    } catch (error) {
      console.error('Error fetching configs from server:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load configs từ session storage
  const loadConfigs = () => {
    setLoading(true)
    try {
      const storedConfigs = sessionStorageUtils.getConfigs()
      if (storedConfigs) {
        setConfigs(storedConfigs)
        console.log('📦 Đã load configs từ session storage')
      }
    } catch (error) {
      console.error('Error loading configs from session storage:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Hydrate nhanh từ session (nếu có)
    const stored = sessionStorageUtils.getConfigs()
    if (stored && stored.length > 0) {
      setConfigs(stored)
      setLoading(false)
    }
    // Luôn đồng bộ mới nhất từ server khi reload trang
    refreshFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    configs,
    loading,
    getConfigs,
    getConfigByKey,
    getSocialMediaUrls,
    hasConfigs,
    refreshConfigs,
    loadConfigs,
    refreshFromServer
  }
}
