/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'

interface State {
  openMenu: boolean
}

export const useNavigationBarStore = create<State>((set) => ({
  openMenu: false
}))
