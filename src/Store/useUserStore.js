import { create } from 'zustand'
const BACK_URL = import.meta.env.VITE_BACK_URL

export const useUserStore = create((set, get) => ({
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

  updateUserLocal: updatedFields =>
    set(state => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),

  updateUser: async formData => {
    try {
      const response = await fetch(`${BACK_URL}/api/update-user`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })

      if (!response.ok) throw new Error('Error al actualizar el perfil')

      const result = await response.json()

      if (result.user) {
        set(state => ({
          user: state.user ? { ...state.user, ...result.user } : result.user,
        }))
      }

      return result
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  setUser: user => set({ user }),
  logout: () => set({ user: null }),
}))
