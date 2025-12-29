import { useUserStore } from '../Store/useUserStore'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUserStore()

  // 1️⃣ Mientras se resuelve la sesión, NO decidir nada
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#2b0a3d]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    )
  }

  // 2️⃣ Solo cuando terminó el loading
  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}
