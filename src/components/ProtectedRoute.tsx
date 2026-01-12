import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isCoordenador } = useAuth()

  // Coordenador e Admin podem acessar a área administrativa
  if (!isAuthenticated || (!isAdmin && !isCoordenador)) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

