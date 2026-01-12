import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRouteAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth()

  // Apenas admin pode acessar (coordenador não)
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}


