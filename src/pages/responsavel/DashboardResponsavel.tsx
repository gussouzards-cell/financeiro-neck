import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

interface Cobranca {
  id: string
  valor: number
  vencimento: string
  tipo: string
  status: string
  idExterno: string
}

interface Pagamento {
  id: string
  valor: number
  data: string
  tipo: string
  status: string
  cobrancaId: string
}

export default function DashboardResponsavel() {
  const { user } = useAuth()
  const [responsavel, setResponsavel] = useState<any>(null)
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])

  useEffect(() => {
    // Carregar dados do responsável
    const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
    const responsavelEncontrado = responsaveis.find((r: any) => r.id === user?.responsavelId)
    setResponsavel(responsavelEncontrado)

    // Carregar cobranças (mockadas por enquanto)
    const cobrancasMockadas: Cobranca[] = [
      {
        id: 'C001',
        valor: responsavelEncontrado?.valorMensal || 1200,
        vencimento: '2024-11-05',
        tipo: 'PIX',
        status: 'Pendente',
        idExterno: 'PIX-2024-11-001',
      },
      {
        id: 'C002',
        valor: responsavelEncontrado?.valorMensal || 1200,
        vencimento: '2024-10-05',
        tipo: 'Boleto',
        status: 'Paga',
        idExterno: 'BLT-2024-10-001',
      },
    ]
    setCobrancas(cobrancasMockadas)

    // Carregar pagamentos
    const pagamentosMockados: Pagamento[] = [
      {
        id: 'P001',
        valor: responsavelEncontrado?.valorMensal || 1200,
        data: '2024-10-05',
        tipo: 'Boleto',
        status: 'Conciliado',
        cobrancaId: 'C002',
      },
    ]
    setPagamentos(pagamentosMockados)
  }, [user?.responsavelId])

  const cobrancasPendentes = cobrancas.filter((c) => c.status === 'Pendente')
  const totalPendente = cobrancasPendentes.reduce((acc, c) => acc + c.valor, 0)
  const totalPago = pagamentos.reduce((acc, p) => acc + p.valor, 0)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Bem-vindo, {user?.name}</h2>
        <p className="text-gray-dark">Acompanhe suas informações financeiras</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Cobranças pendentes</p>
          <p className="text-3xl font-semibold text-black">{cobrancasPendentes.length}</p>
          <p className="text-xs text-gray-dark mt-2">
            Total: R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total pago</p>
          <p className="text-3xl font-semibold text-black">
            R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Valor mensal</p>
          <p className="text-3xl font-semibold text-black">
            R$ {(responsavel?.valorMensal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-black">Cobranças Pendentes</h3>
            <Link to="/responsavel/cobrancas" className="text-sm text-black hover:underline font-medium">
              Ver todas →
            </Link>
          </div>
          {cobrancasPendentes.length === 0 ? (
            <p className="text-gray-dark text-sm">Nenhuma cobrança pendente</p>
          ) : (
            <div className="space-y-4">
              {cobrancasPendentes.slice(0, 3).map((cobranca) => (
                <div key={cobranca.id} className="border border-gray-medium rounded-card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-black">
                        R$ {cobranca.valor.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-sm text-gray-dark mt-1">
                        Vencimento: {new Date(cobranca.vencimento).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-dark mt-1">Tipo: {cobranca.tipo}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                      Pendente
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-black">Últimos Pagamentos</h3>
            <Link to="/responsavel/pagamentos" className="text-sm text-black hover:underline font-medium">
              Ver todos →
            </Link>
          </div>
          {pagamentos.length === 0 ? (
            <p className="text-gray-dark text-sm">Nenhum pagamento registrado</p>
          ) : (
            <div className="space-y-4">
              {pagamentos.slice(0, 3).map((pagamento) => (
                <div key={pagamento.id} className="border border-gray-medium rounded-card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-black">
                        R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-sm text-gray-dark mt-1">
                        Data: {new Date(pagamento.data).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-gray-dark mt-1">Tipo: {pagamento.tipo}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-light text-black">
                      {pagamento.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


