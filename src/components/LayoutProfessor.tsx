import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LayoutProfessor() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', path: '/professor/dashboard' },
    { name: 'Minhas Notas Fiscais', path: '/professor/notas-fiscais' },
    { name: 'Enviar Nota Fiscal', path: '/professor/enviar-nf' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login-professor')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="h-20 border-b border-gray-medium bg-white flex items-center justify-between px-8 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-black tracking-tight">
            <span className="font-light">Colégio</span>{' '}
            <span className="font-bold">Neck</span>
          </h2>
          <span className="text-gray-medium">|</span>
          <span className="text-lg font-medium text-gray-dark">Portal do Professor</span>
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
      <div className="flex pt-20">
        <aside className="w-64 border-r border-gray-medium min-h-[calc(100vh-80px)] pt-8">
          <nav className="px-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-card font-medium transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-dark hover:bg-gray-light'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

