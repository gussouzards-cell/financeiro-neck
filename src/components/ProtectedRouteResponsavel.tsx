import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRouteResponsavel({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isResponsavel } = useAuth()

  if (!isAuthenticated || !isResponsavel) {
    return <Navigate to="/login-responsavel" replace />
  }

  return <>{children}</>
}


