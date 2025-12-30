import { create } from 'zustand'
import { encryptionService } from '../Utils/encryption'

const BACK_URL = import.meta.env.VITE_BACK_URL

// Clave única para localStorage
const STORAGE_KEY = 'nv_auth_enc'  // Solo guardamos el token encriptado

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  isActive: false,
  token: null,

  // 🔹 Inicializar desde localStorage
  initializeFromStorage: () => {
    try {
      const encryptedToken = localStorage.getItem(STORAGE_KEY);
      
      if (encryptedToken) {
        const decrypted = encryptionService.decrypt(encryptedToken);
        
        if (decrypted && decrypted.token && decrypted.expires > Date.now()) {
          // Token válido, guardar en estado pero NO los datos de usuario
          set({
            token: decrypted.token,
            isActive: true
          });
          
          // Auto-refresh si falta poco para expirar
          const timeUntilExpiry = decrypted.expires - Date.now();
          if (timeUntilExpiry < 300000) { // 5 minutos
            setTimeout(() => get().refreshToken(), timeUntilExpiry - 60000);
          }
          
          return true;
        } else {
          // Token expirado, limpiar
          get().clearStorage();
        }
      }
    } catch (error) {
      console.error('Error al inicializar desde storage:', error);
      get().clearStorage();
    }
    
    set({ user: null, token: null, isActive: false });
    return false;
  },

  // 🔹 Guardar sesión (solo token encriptado)
  setSession: ({ user, token }) => {
    const expires = Date.now() + (23 * 60 * 60 * 1000); // 23 horas
    
    // Datos a encriptar - SOLO el token y metadata
    const authData = {
      token,
      expires,
      timestamp: Date.now()
    };
    
    // Encriptar
    const encrypted = encryptionService.encrypt(authData);
    
    if (encrypted) {
      // Guardar SOLO el token encriptado en localStorage
      localStorage.setItem(STORAGE_KEY, encrypted);
      
      // Guardar usuario en estado (NO en localStorage)
      set({
        user: user || null,
        token: token || null,
        isActive: !!user,
      });
      
      // Programar limpieza automática
      setTimeout(() => {
        get().clearExpiredSession();
      }, expires - Date.now());
    }
  },

  // 🔹 Obtener token desencriptado
  getToken: () => {
    const encryptedToken = localStorage.getItem(STORAGE_KEY);
    if (!encryptedToken) return null;
    
    const decrypted = encryptionService.decrypt(encryptedToken);
    if (decrypted && decrypted.token && decrypted.expires > Date.now()) {
      return decrypted.token;
    }
    
    get().clearExpiredSession();
    return null;
  },

  // 🔹 Fetch del perfil desde el backend
  fetchUser: async () => {
    const token = get().getToken();
    
    if (!token) {
      set({ user: null, isActive: false });
      return null;
    }

    set({ loading: true });
    
    try {
      const res = await fetch(`${BACK_URL}/api/GetUserProfile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Token inválido, limpiar
          get().clearStorage();
        }
        set({ user: null, isActive: false, loading: false });
        return null;
      }

      const resData = await res.json();
      const userData = resData?.data || resData;

      // Actualizar SOLO en estado, NO en localStorage
      set({
        user: userData,
        isActive: true,
        loading: false,
      });
      
      return userData;
    } catch (err) {
      console.error("Error en fetchUser:", err);
      set({ user: null, isActive: false, loading: false });
      return null;
    }
  },

  // 🔹 Refresh token
  refreshToken: async () => {
    try {
      const token = get().getToken();
      if (!token) return false;

      const res = await fetch(`${BACK_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const { accessToken } = await res.json();
        // Mantener el usuario actual en estado
        get().setSession({ token: accessToken, user: get().user });
        return true;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
    
    get().logout();
    return false;
  },

  // 🔹 Logout: limpiar todo
  logout: () => {
    get().clearStorage();
    set({
      user: null,
      token: null,
      isActive: false,
      loading: false,
    });
  },

  // 🔹 Limpiar localStorage
  clearStorage: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // 🔹 Limpiar sesión expirada
  clearExpiredSession: () => {
    const encryptedToken = localStorage.getItem(STORAGE_KEY);
    if (encryptedToken) {
      const decrypted = encryptionService.decrypt(encryptedToken);
      if (!decrypted || decrypted.expires <= Date.now()) {
        get().clearStorage();
        set({ user: null, token: null, isActive: false });
      }
    }
  },

  // 🔹 Actualización local del estado
  updateUserLocal: (updatedFields) => set(state => ({
    user: state.user ? { ...state.user, ...updatedFields } : null,
  })),

  // 🔹 Actualización en el backend
  updateUser: async (formData) => {
    const token = get().getToken();
    if (!token) throw new Error("No token disponible");

    try {
      const res = await fetch(`${BACK_URL}/api/update-user`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al actualizar usuario");

      const result = await res.json();
      const newUserBody = result.user || result.data || result;

      if (newUserBody) {
        // Actualizar SOLO en estado
        set(state => ({
          user: state.user ? { ...state.user, ...newUserBody } : newUserBody,
          isActive: true,
        }));
      }
      return result;
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  },

  // 🔹 Nuevo: Verificar sesión sin guardar datos en localStorage
  checkSession: async () => {
    const token = get().getToken();
    if (!token) {
      set({ isActive: false, user: null });
      return false;
    }

    try {
      const res = await fetch(`${BACK_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const isValid = res.ok;
      set({ isActive: isValid });
      if (!isValid) get().clearStorage();
      
      return isValid;
    } catch (error) {
      set({ isActive: false });
      return false;
    }
  },
}));