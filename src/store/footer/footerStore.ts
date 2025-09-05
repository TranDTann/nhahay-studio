/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigItem } from '@/api/configService'
import { create } from 'zustand'

interface IFooterState {
  configs: ConfigItem[]
}

export const useFooterStore = create<IFooterState>((set) => ({
  configs: []
}))
