import { Navigate } from 'react-router-dom'
import { useUserStore } from '../Store/useUserStore'

export default function RedirectIfAuth({ children }) {
  const { user, loading } = useUserStore()

  // 🔑 Mientras carga, MOSTRAMOS el contenido
  if (loading) {
    return children
  }

  // Si hay sesión, redirigir
  if (user) {
    return <Navigate to="/Feed" replace />
  }

  return children
}
