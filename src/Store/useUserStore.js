import { create } from 'zustand'
const BACK_URL = import.meta.env.VITE_BACK_URL

export const useUserStore = create(set => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    try {
      const res = await fetch(`${BACK_URL}/api/GetUserProfile`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) {
        set({ user: null, loading: false })
        return
      }

      const data = await res.json()
      set({ user: data.data, loading: false })
    } catch (err) {
      console.error(err)
      set({ user: null, loading: false })
    }
  },

  setUser: user => set({ user }),
  logout: () => set({ user: null }),
}))
