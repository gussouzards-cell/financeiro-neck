import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface Pagamento {
  id: string
  valor: number
  data: string
  tipo: string
  status: string
  cobrancaId: string
  comprovante?: string
}

export default function PagamentosResponsavel() {
  const { user } = useAuth()
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])

  useEffect(() => {
    // Carregar pagamentos
    const pagamentosMockados: Pagamento[] = [
      {
        id: 'P001',
        valor: 1200,
        data: '2024-10-05',
        tipo: 'Boleto',
        status: 'Conciliado',
        cobrancaId: 'C002',
      },
      {
        id: 'P002',
        valor: 1200,
        data: '2024-09-05',
        tipo: 'PIX',
        status: 'Conciliado',
        cobrancaId: 'C003',
      },
    ]
    setPagamentos(pagamentosMockados)
  }, [user?.responsavelId])

  const totalPago = pagamentos.reduce((acc, p) => acc + p.valor, 0)

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Meus Pagamentos</h2>
        <p className="text-gray-dark">Histórico completo de pagamentos realizados</p>
      </div>

      <div className="card mb-6">
        <p className="text-sm text-gray-dark mb-2">Total pago</p>
        <p className="text-3xl font-semibold text-black">
          R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-gray-dark mt-2">{pagamentos.length} pagamento(s) registrado(s)</p>
      </div>

      <div className="space-y-4">
        {pagamentos.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-dark">Nenhum pagamento registrado.</p>
          </div>
        ) : (
          pagamentos.map((pagamento) => (
            <div key={pagamento.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-dark mb-1">Pagamento: {pagamento.id}</p>
                  <p className="text-2xl font-semibold text-black mb-2">
                    R$ {pagamento.valor.toFixed(2).replace('.', ',')}
                  </p>
                  <div className="space-y-1 text-sm text-gray-dark">
                    <p>Data: {new Date(pagamento.data).toLocaleDateString('pt-BR')}</p>
                    <p>Tipo: {pagamento.tipo}</p>
                    <p>Cobrança: {pagamento.cobrancaId}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-light text-black">
                  {pagamento.status}
                </span>
              </div>
              {pagamento.comprovante && (
                <div className="pt-4 border-t border-gray-medium">
                  <a
                    href={pagamento.comprovante}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black hover:underline font-medium"
                  >
                    Baixar comprovante →
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}


