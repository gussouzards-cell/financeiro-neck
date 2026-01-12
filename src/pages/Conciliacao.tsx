type StatusConciliacao = 'Conciliado automaticamente' | 'Pendente' | 'Divergente'

interface Pagamento {
  id: string
  valor: number
  data: string
  tipo: string
  origem: string
  status: StatusConciliacao
  cobrancaId?: string
  divergencia?: string
  responsavelNome?: string
}

export default function Conciliacao() {
  const pagamentos: Pagamento[] = [
    {
      id: 'P001',
      valor: 1200,
      data: '2024-11-05',
      tipo: 'PIX',
      origem: 'Banco ABC',
      status: 'Conciliado automaticamente',
      cobrancaId: 'C001',
    },
    {
      id: 'P002',
      valor: 1200,
      data: '2024-11-03',
      tipo: 'Boleto',
      origem: 'Banco XYZ',
      status: 'Conciliado automaticamente',
      cobrancaId: 'C002',
    },
    {
      id: 'P003',
      valor: 1250,
      data: '2024-11-01',
      tipo: 'PIX',
      origem: 'Banco ABC',
      status: 'Divergente',
      cobrancaId: 'C003',
      divergencia: 'Valor divergente: esperado R$ 1.200,00',
    },
    {
      id: 'P004',
      valor: 1200,
      data: '2024-10-28',
      tipo: 'Cartão',
      origem: 'Gateway PagSeguro',
      status: 'Pendente',
    },
    {
      id: 'P005',
      valor: 600,
      data: '2024-10-25',
      tipo: 'PIX',
      origem: 'Banco ABC',
      status: 'Conciliado automaticamente',
      cobrancaId: 'C004',
    },
  ]

  const getStatusColor = (status: StatusConciliacao) => {
    switch (status) {
      case 'Conciliado automaticamente':
        return 'bg-gray-light text-black'
      case 'Pendente':
        return 'bg-black text-white'
      case 'Divergente':
        return 'bg-white border-2 border-black text-black'
      default:
        return 'bg-gray-light text-black'
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Conciliação de pagamentos</h2>
        <p className="text-gray-dark">Controle e concilie pagamentos recebidos automaticamente</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light border-b border-gray-medium">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Data</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Tipo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Origem</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Cobrança</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((pagamento) => (
                <tr
                  key={pagamento.id}
                  className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-black">
                    {new Date(pagamento.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-black">
                    R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{pagamento.tipo}</td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{pagamento.origem}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        pagamento.status
                      )}`}
                    >
                      {pagamento.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-dark">
                    {pagamento.cobrancaId ? (
                      <span className="text-black font-medium">{pagamento.cobrancaId}</span>
                    ) : (
                      <span className="text-gray-dark">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {pagamento.status !== 'Conciliado automaticamente' && (
                      <button className="text-black hover:underline font-medium">
                        Conciliar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagamentos.some((p) => p.status === 'Divergente' && p.divergencia) && (
        <div className="mt-6 card bg-gray-light border-gray-medium">
          <h3 className="text-sm font-semibold text-black mb-4">Divergências detectadas</h3>
          <div className="space-y-2">
            {pagamentos
              .filter((p) => p.status === 'Divergente' && p.divergencia)
              .map((pagamento) => (
                <div key={pagamento.id} className="text-sm text-gray-dark">
                  <span className="font-medium text-black">Pagamento {pagamento.id}:</span>{' '}
                  {pagamento.divergencia}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-6 card">
        <h3 className="text-sm font-semibold text-black mb-4">Como funciona a conciliação automática</h3>
        <div className="space-y-3 text-sm text-gray-dark">
          <p>
            A conciliação automática ocorre quando um pagamento recebido corresponde a uma cobrança
            existente através de:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>ID da transação</li>
            <li>Valor exato</li>
            <li>Data de vencimento (tolerância de ±3 dias)</li>
          </ul>
          <p className="mt-4">
            Pagamentos que não correspondem automaticamente ficam como <strong className="text-black">Pendentes</strong> e
            podem ser conciliados manualmente.
          </p>
        </div>
      </div>
    </div>
  )
}

