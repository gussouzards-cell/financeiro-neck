import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

interface NotaFiscal {
  id: string
  numero: string
  professor: string
  email: string
  cnpj: string
  valor: number
  dataEmissao: string
  dataVencimento: string
  dataEnvio: string
  descricao: string
  status: 'Pendente' | 'Paga' | 'Vencida'
  arquivo: string
}

export default function MinhasNotasFiscais() {
  const { user } = useAuth()
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')

  useEffect(() => {
    // Carregar notas fiscais do localStorage
    const todasNF = JSON.parse(localStorage.getItem('notasFiscaisProfessores') || '[]')
    const minhasNF = todasNF.filter((nf: NotaFiscal) => nf.email === user?.email)
    setNotasFiscais(minhasNF)
  }, [user?.email])

  const notasFiltradas = notasFiscais.filter((nf) => {
    return filtroStatus === 'todos' || nf.status === filtroStatus
  })

  const getStatusColor = (status: NotaFiscal['status']) => {
    switch (status) {
      case 'Paga':
        return 'bg-gray-light text-black'
      case 'Pendente':
        return 'bg-black text-white'
      case 'Vencida':
        return 'bg-white border-2 border-black text-black'
      default:
        return 'bg-gray-light text-black'
    }
  }

  const totalPendente = notasFiscais
    .filter((nf) => nf.status === 'Pendente')
    .reduce((acc, nf) => acc + nf.valor, 0)

  const totalPago = notasFiscais
    .filter((nf) => nf.status === 'Paga')
    .reduce((acc, nf) => acc + nf.valor, 0)

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-semibold text-black mb-2">Minhas Notas Fiscais</h2>
          <p className="text-gray-dark">Visualize e acompanhe o status das suas notas fiscais</p>
        </div>
        <Link to="/professor/enviar-nf" className="btn-primary">
          + Nova nota fiscal
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total pendente</p>
          <p className="text-2xl font-semibold text-black">
            R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total pago</p>
          <p className="text-2xl font-semibold text-black">
            R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-black mb-2">Filtrar por status</label>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todos</option>
          <option value="Pendente">Pendente</option>
          <option value="Paga">Paga</option>
          <option value="Vencida">Vencida</option>
        </select>
      </div>

      {notasFiltradas.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-dark mb-4">Nenhuma nota fiscal encontrada.</p>
          <Link to="/professor/enviar-nf" className="btn-primary inline-block">
            Enviar primeira nota fiscal
          </Link>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-light border-b border-gray-medium">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Número NF</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Descrição</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Emissão</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Vencimento</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Status</th>
                </tr>
              </thead>
              <tbody>
                {notasFiltradas
                  .sort((a, b) => new Date(b.dataEnvio).getTime() - new Date(a.dataEnvio).getTime())
                  .map((nf) => (
                    <tr
                      key={nf.id}
                      className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-black">{nf.numero}</td>
                      <td className="px-6 py-4 text-sm text-black">{nf.descricao}</td>
                      <td className="px-6 py-4 text-sm font-medium text-black">
                        R$ {nf.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-dark">
                        {new Date(nf.dataEmissao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-dark">
                        {new Date(nf.dataVencimento).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            nf.status
                          )}`}
                        >
                          {nf.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}


