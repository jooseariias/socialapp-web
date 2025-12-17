import { Navigate } from 'react-router-dom'
import { useUserStore } from '../Store/useUserStore'

export default function RedirectIfAuth({ children }) {
  const { user, loading, isActive } = useUserStore()

  // Si App.jsx está haciendo el fetchUser inicial, no hacemos nada
  if (loading) return null

  // Si ya detectamos sesión, mandamos al feed de una vez
  if (isActive || user) {
    return <Navigate to="/Feed" replace />
  }

  return children
}