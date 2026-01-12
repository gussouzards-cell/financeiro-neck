import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface Cobranca {
  id: string
  valor: number
  vencimento: string
  tipo: string
  status: string
  idExterno: string
  descricao?: string
}

export default function CobrancasResponsavel() {
  const { user } = useAuth()
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')

  useEffect(() => {
    // Carregar responsável
    const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
    const responsavel = responsaveis.find((r: any) => r.id === user?.responsavelId)

    // Carregar cobranças
    const cobrancasMockadas: Cobranca[] = [
      {
        id: 'C001',
        valor: responsavel?.valorMensal || 1200,
        vencimento: '2024-11-05',
        tipo: 'PIX',
        status: 'Pendente',
        idExterno: 'PIX-2024-11-001',
        descricao: 'Mensalidade - Novembro 2024',
      },
      {
        id: 'C002',
        valor: responsavel?.valorMensal || 1200,
        vencimento: '2024-10-05',
        tipo: 'Boleto',
        status: 'Paga',
        idExterno: 'BLT-2024-10-001',
        descricao: 'Mensalidade - Outubro 2024',
      },
      {
        id: 'C003',
        valor: responsavel?.valorMensal || 1200,
        vencimento: '2024-09-05',
        tipo: 'PIX',
        status: 'Paga',
        idExterno: 'PIX-2024-09-001',
        descricao: 'Mensalidade - Setembro 2024',
      },
    ]
    setCobrancas(cobrancasMockadas)
  }, [user?.responsavelId])

  const cobrancasFiltradas = cobrancas.filter((c) => {
    return filtroStatus === 'todos' || c.status === filtroStatus
  })

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Minhas Cobranças</h2>
        <p className="text-gray-dark">Visualize todas as suas cobranças</p>
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-black mb-2">Filtrar por status</label>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todas</option>
          <option value="Pendente">Pendentes</option>
          <option value="Paga">Pagas</option>
        </select>
      </div>

      <div className="space-y-4">
        {cobrancasFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-dark">Nenhuma cobrança encontrada.</p>
          </div>
        ) : (
          cobrancasFiltradas.map((cobranca) => (
            <div key={cobranca.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-dark mb-1">Cobrança: {cobranca.idExterno}</p>
                  {cobranca.descricao && (
                    <p className="text-sm font-medium text-black mb-2">{cobranca.descricao}</p>
                  )}
                  <p className="text-2xl font-semibold text-black mb-2">
                    R$ {cobranca.valor.toFixed(2).replace('.', ',')}
                  </p>
                  <div className="space-y-1 text-sm text-gray-dark">
                    <p>Vencimento: {new Date(cobranca.vencimento).toLocaleDateString('pt-BR')}</p>
                    <p>Tipo: {cobranca.tipo}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cobranca.status === 'Paga'
                      ? 'bg-gray-light text-black'
                      : 'bg-black text-white'
                  }`}
                >
                  {cobranca.status}
                </span>
              </div>
              {cobranca.status === 'Pendente' && (
                <div className="pt-4 border-t border-gray-medium">
                  <p className="text-sm text-gray-dark mb-2">
                    Esta cobrança está pendente. Realize o pagamento o quanto antes.
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}


