import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../Store/useUserStore'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUserStore()
  const location = useLocation()

  // Mientras se valida la sesión
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#2b0a3d]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    )
  }

  // Sin usuario → fuera
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  // Usuario válido
  return children
}
