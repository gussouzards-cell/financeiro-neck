import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRouteProfessor({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isProfessor } = useAuth()

  if (!isAuthenticated || !isProfessor) {
    return <Navigate to="/login-professor" replace />
  }

  return <>{children}</>
}


