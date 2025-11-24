import { Navigate } from 'react-router-dom'
import { useUserStore } from '../Store/useUserStore'

export default function RedirectIfAuth({ children }) {
  const { user, loading } = useUserStore()

  if (loading) return <p>Cargando...</p>

  if (user) return <Navigate to="/ResetPassword" replace />

  return children
}
