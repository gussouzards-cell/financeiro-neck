import { Outlet, Link, useLocation } from 'react-router-dom'
import Header from './Header'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const location = useLocation()
  const { isCoordenador } = useAuth()

  const navigationBase = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Cadastro', path: '/cadastro' },
    { name: 'Alunos & Responsáveis', path: '/alunos' },
    { name: 'Contratos', path: '/contratos' },
    { name: 'Cobranças Automáticas', path: '/cobrancas-automaticas' },
    { name: 'Inadimplência', path: '/inadimplencia' },
    { name: 'Comunicação', path: '/comunicacao' },
    { name: 'Comprovantes', path: '/comprovantes' },
    { name: 'Calendário', path: '/calendario' },
    { name: 'Fluxo de Caixa', path: '/fluxo-caixa' },
    { name: 'Notas Fiscais', path: '/notas-fiscais' },
    { name: 'Conciliação', path: '/conciliacao' },
    { name: 'Relatórios', path: '/relatorios' },
  ]

  const navigationAdmin = [
    { name: 'Gastos', path: '/gastos' },
  ]

  // Coordenador não vê o menu de Gastos
  const navigation = isCoordenador ? navigationBase : [...navigationBase, ...navigationAdmin]

  return (
    <div className="min-h-screen bg-white">
      <Header />
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

