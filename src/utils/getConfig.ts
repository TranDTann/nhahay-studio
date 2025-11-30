import { ConfigItem } from '@/api/configService'
import { EConfig } from '@/types/config'

export const getConfigValue = (key: EConfig, configs: ConfigItem[]) => {
  return configs.find((c) => c.key === key)?.value || ''
}
