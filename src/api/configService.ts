import axiosInstance from './axiosConfig'

export interface ConfigItem {
  id?: number
  key: string
  value: string
  description: string
}

export interface ConfigQueryParams {
  sort?: string
  sortDir?: number
  search?: string
  skip?: number
  take?: number
}

export interface ConfigResponse {
  result: ConfigItem[]
  message?: string
  success?: boolean
  count?: number
  total?: number
  page?: number
  pageSize?: number
}

export const configService = {
  // Get all configs
  getAllConfigs: async (
    params?: ConfigQueryParams
  ): Promise<ConfigResponse> => {
    const queryParams = new URLSearchParams()

    if (params) {
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.sortDir)
        queryParams.append('sortDir', params.sortDir.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.skip !== undefined)
        queryParams.append('skip', params.skip.toString())
    }
    queryParams.append('take', '1000')

    const url = `/api/configsetting${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`
    const response = await axiosInstance.get(url)
    return response.data
  },

  // Get config by ID
  getConfigById: async (id: number): Promise<ConfigItem> => {
    const response = await axiosInstance.get(`/api/configsetting/${id}`)
    return response.data
  },

  // Create new config
  createConfig: async (config: Omit<ConfigItem, 'id'>): Promise<ConfigItem> => {
    const response = await axiosInstance.post('/api/configsetting', config)
    return response.data
  },

  // Update config
  updateConfig: async (config: ConfigItem): Promise<ConfigItem> => {
    const response = await axiosInstance.put(`/api/configsetting`, config)
    return response.data
  },

  // Delete config
  deleteConfig: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/configsetting/${id}`)
  },

  // Get config by key
  getConfigByKey: async (key: string): Promise<ConfigItem> => {
    const response = await axiosInstance.get(`/api/configsetting/key/${key}`)
    return response.data
  }
}
