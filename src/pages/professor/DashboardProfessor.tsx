import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function DashboardProfessor() {
  const { user } = useAuth()

  // Buscar notas fiscais do professor do localStorage
  const notasFiscais = JSON.parse(localStorage.getItem('notasFiscaisProfessores') || '[]')
  const minhasNF = notasFiscais.filter((nf: any) => nf.email === user?.email)

  const totalEnviadas = minhasNF.length
  const totalPendentes = minhasNF.filter((nf: any) => nf.status === 'Pendente').length
  const totalPagas = minhasNF.filter((nf: any) => nf.status === 'Paga').length

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Bem-vindo, {user?.name}</h2>
        <p className="text-gray-dark">Gerencie suas notas fiscais de forma simples</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total enviadas</p>
          <p className="text-3xl font-semibold text-black">{totalEnviadas}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Pendentes</p>
          <p className="text-3xl font-semibold text-black">{totalPendentes}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Pagas</p>
          <p className="text-3xl font-semibold text-black">{totalPagas}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-black mb-4">Ações rápidas</h3>
          <div className="space-y-3">
            <Link to="/professor/enviar-nf" className="btn-primary w-full text-center block">
              Enviar nova nota fiscal
            </Link>
            <Link to="/professor/notas-fiscais" className="btn-outline w-full text-center block">
              Ver minhas notas fiscais
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-black mb-4">Informações</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-dark mb-1">Email</p>
              <p className="text-black">{user?.email}</p>
            </div>
            {user?.cnpj && (
              <div>
                <p className="text-gray-dark mb-1">CNPJ</p>
                <p className="text-black">{user.cnpj}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {minhasNF.length > 0 && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-black mb-4">Últimas notas fiscais</h3>
          <div className="space-y-3">
            {minhasNF.slice(0, 3).map((nf: any) => (
              <div key={nf.id} className="border border-gray-medium rounded-card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-black">NF {nf.numero}</p>
                    <p className="text-sm text-gray-dark mt-1">{nf.descricao}</p>
                    <p className="text-xs text-gray-dark mt-2">
                      Enviada em: {new Date(nf.dataEnvio).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      nf.status === 'Paga'
                        ? 'bg-gray-light text-black'
                        : nf.status === 'Pendente'
                        ? 'bg-black text-white'
                        : 'bg-white border-2 border-black text-black'
                    }`}
                  >
                    {nf.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {minhasNF.length > 3 && (
            <div className="mt-4">
              <Link
                to="/professor/notas-fiscais"
                className="text-black hover:underline font-medium text-sm"
              >
                Ver todas ({minhasNF.length})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


