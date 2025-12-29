import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../Store/useUserStore'

export default function ProtectedRoute({ children }) {
  const { user } = useUserStore();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
