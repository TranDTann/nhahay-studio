import { ConfigItem } from '@/api/configService'

const CONFIG_STORAGE_KEY = 'app_configs'

export const sessionStorageUtils = {
  // Lưu configs vào session storage
  saveConfigs: (configs: ConfigItem[]): void => {
    try {
      sessionStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs))
      console.log('✅ Configs đã được lưu vào session storage')
    } catch (error) {
      console.error('❌ Lỗi khi lưu configs vào session storage:', error)
    }
  },

  // Lấy configs từ session storage
  getConfigs: (): ConfigItem[] | null => {
    try {
      const stored = sessionStorage.getItem(CONFIG_STORAGE_KEY)
      if (stored) {
        const configs = JSON.parse(stored)
        console.log('📦 Đã load configs từ session storage')
        return configs
      }
      return null
    } catch (error) {
      console.error('❌ Lỗi khi đọc configs từ session storage:', error)
      return null
    }
  },

  // Lấy config value theo key từ session storage
  getConfigByKey: (key: string): string | null => {
    try {
      const configs = sessionStorageUtils.getConfigs()
      if (configs) {
        const config = configs.find((c) => c.key === key)
        return config?.value || null
      }
      return null
    } catch (error) {
      console.error(`❌ Lỗi khi lấy config key "${key}":`, error)
      return null
    }
  },

  // Xóa configs khỏi session storage
  clearConfigs: (): void => {
    try {
      sessionStorage.removeItem(CONFIG_STORAGE_KEY)
      console.log('🗑️ Đã xóa configs khỏi session storage')
    } catch (error) {
      console.error('❌ Lỗi khi xóa configs khỏi session storage:', error)
    }
  },

  // Kiểm tra xem có configs trong session storage không
  hasConfigs: (): boolean => {
    return sessionStorage.getItem(CONFIG_STORAGE_KEY) !== null
  },

  // Refresh configs (xóa và fetch lại)
  refreshConfigs: async (): Promise<void> => {
    sessionStorageUtils.clearConfigs()
    // Có thể thêm logic fetch lại từ API nếu cần
  }
}
