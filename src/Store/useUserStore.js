import { create } from 'zustand'
const BACK_URL = import.meta.env.VITE_BACK_URL

export const useUserStore = create((set, get) => ({
  user: null,
  loading: true,
  isActive: false,

  // Función para obtener el perfil del servidor
 fetchUser: async () => {
    set({ loading: true }); // Asegura que los componentes vean que estamos buscando datos
    try {
      const res = await fetch(`${BACK_URL}/api/GetUserProfile`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        set({ user: null, loading: false, isActive: false });
        return;
      }

      const resData = await res.json();
      const userData = resData?.data || resData;

      // ACTUALIZACIÓN ATÓMICA
      set({ 
        user: userData, 
        loading: false, 
        isActive: true 
      });
    } catch (err) {
      console.error("Error en fetchUser:", err);
      set({ user: null, loading: false, isActive: false });
    }
  },

  // Para guardar el usuario manualmente (ej: desde el Login)
  setUser: (user) => set({ 
    user: user || null, 
    isActive: !!user, 
    loading: false 
  }),

  // Para activar el estado de autenticación
  setIsActive: (value) => set({ 
    isActive: value, 
    loading: false 
  }),

  // Actualización local (UI inmediata)
  updateUserLocal: updatedFields =>
    set(state => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),

  // Petición de actualización al servidor
  updateUser: async formData => {
    try {
      const response = await fetch(`${BACK_URL}/api/update-user`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Error al actualizar')
      
      const result = await response.json()
      const newUserBody = result.user || result.data || result

      if (newUserBody) {
        set(state => ({
          user: state.user ? { ...state.user, ...newUserBody } : newUserBody,
          isActive: true
        }))
      }
      return result
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  // Limpieza total
  logout: () => set({ user: null, isActive: false, loading: false }),
}))