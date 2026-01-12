import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-20 border-b border-gray-medium bg-white flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-black tracking-tight">
          <span className="font-light">Colégio</span>{' '}
          <span className="font-bold">Neck</span>
        </h1>
        <span className="text-gray-medium">|</span>
        <span className="text-lg font-medium text-gray-dark">Financeiro</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-dark">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-dark hover:text-black font-medium"
        >
          Sair
        </button>
      </div>
    </header>
  )
}





