import { create } from 'zustand'

const BACK_URL = import.meta.env.VITE_BACK_URL

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  isActive: false,
  token: null, // ⬅️ Token guardado en memoria

  // 🔹 Login exitoso: guardar token y usuario
  setSession: ({ user, token }) => {
    set({
      user: user || null,
      token: token || null,
      isActive: !!user,
    })
  },

  // 🔹 Fetch del perfil usando token
  fetchUser: async () => {
    const token = get().token
    if (!token) {
      set({ user: null, isActive: false })
      return
    }

    set({ loading: true })
    try {
      const res = await fetch(`${BACK_URL}/api/GetUserProfile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        set({ user: null, isActive: false, loading: false })
        return
      }

      const resData = await res.json()
      const userData = resData?.data || resData

      set({
        user: userData,
        isActive: true,
        loading: false,
      })
    } catch (err) {
      console.error("Error en fetchUser:", err)
      set({ user: null, isActive: false, loading: false })
    }
  },

  // 🔹 Logout: limpiar todo
  logout: () => set({
    user: null,
    token: null,
    isActive: false,
    loading: false,
  }),

  // 🔹 Actualización local
  updateUserLocal: (updatedFields) => set(state => ({
    user: state.user ? { ...state.user, ...updatedFields } : null,
  })),

  // 🔹 Actualización en el backend usando token
  updateUser: async (formData) => {
    const token = get().token
    if (!token) throw new Error("No token disponible")

    try {
      const res = await fetch(`${BACK_URL}/api/update-user`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Error al actualizar usuario")

      const result = await res.json()
      const newUserBody = result.user || result.data || result

      if (newUserBody) {
        set(state => ({
          user: state.user ? { ...state.user, ...newUserBody } : newUserBody,
          isActive: true,
        }))
      }
      return result
    } catch (err) {
      console.error("Error updating user:", err)
      throw err
    }
  },
}))
