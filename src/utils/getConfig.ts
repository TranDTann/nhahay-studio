import { ConfigItem } from '@/api/configService'

export const getConfigValue = (key: string, configs: ConfigItem[]) => {
  return configs.find((c) => c.key === key)?.value || ''
}
