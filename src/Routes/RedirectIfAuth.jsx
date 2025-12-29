import { Navigate } from 'react-router-dom'
import { useUserStore } from '../Store/useUserStore'

export default function RedirectIfAuth({ children }) {
  const { user } = useUserStore()

  if (user) {
    return <Navigate to="/Feed" replace />
  }

  return children
}
