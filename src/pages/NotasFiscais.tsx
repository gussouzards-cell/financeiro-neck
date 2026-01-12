import { useState, useEffect } from 'react'

interface NotaFiscal {
  id: string
  numero: string
  professor: string
  cnpj: string
  valor: number
  dataEmissao: string
  dataVencimento: string
  status: 'Pendente' | 'Paga' | 'Vencida'
  descricao: string
  arquivo?: string
  email?: string
  dataEnvio?: string
}

export default function NotasFiscais() {
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroProfessor, setFiltroProfessor] = useState<string>('todos')
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([])

  useEffect(() => {
    // Carregar notas fiscais do localStorage (enviadas pelos professores)
    const notasProfessores = JSON.parse(
      localStorage.getItem('notasFiscaisProfessores') || '[]'
    )

    // Combinar com dados mockados iniciais (para demonstração)
    const notasMockadas: NotaFiscal[] = [
    {
      id: 'NF001',
      numero: '000001',
      professor: 'Prof. João Silva',
      cnpj: '12.345.678/0001-90',
      valor: 3500,
      dataEmissao: '2024-11-01',
      dataVencimento: '2024-11-10',
      status: 'Pendente',
      descricao: 'Aula de Matemática - Novembro 2024',
    },
    {
      id: 'NF002',
      numero: '000002',
      professor: 'Prof. Maria Santos',
      cnpj: '98.765.432/0001-10',
      valor: 3200,
      dataEmissao: '2024-11-01',
      dataVencimento: '2024-11-10',
      status: 'Paga',
      descricao: 'Aula de Português - Novembro 2024',
    },
    {
      id: 'NF003',
      numero: '000003',
      professor: 'Prof. Carlos Oliveira',
      cnpj: '11.222.333/0001-44',
      valor: 2800,
      dataEmissao: '2024-10-01',
      dataVencimento: '2024-10-10',
      status: 'Vencida',
      descricao: 'Aula de História - Outubro 2024',
    },
    {
      id: 'NF004',
      numero: '000004',
      professor: 'Prof. Ana Costa',
      cnpj: '55.666.777/0001-88',
      valor: 3000,
      dataEmissao: '2024-11-01',
      dataVencimento: '2024-11-10',
      status: 'Pendente',
      descricao: 'Aula de Ciências - Novembro 2024',
    },
    {
      id: 'NF005',
      numero: '000005',
      professor: 'Prof. Pedro Lima',
      cnpj: '99.888.777/0001-66',
      valor: 2900,
      dataEmissao: '2024-11-01',
      dataVencimento: '2024-11-10',
      status: 'Paga',
      descricao: 'Aula de Educação Física - Novembro 2024',
    },
    ]

    // Combinar notas mockadas com notas enviadas pelos professores
    const todasNotas = [...notasMockadas, ...notasProfessores]
    setNotasFiscais(todasNotas)
  }, [])

  const professores = Array.from(new Set(notasFiscais.map((nf) => nf.professor)))

  const notasFiltradas = notasFiscais.filter((nf) => {
    const matchStatus = filtroStatus === 'todos' || nf.status === filtroStatus
    const matchProfessor = filtroProfessor === 'todos' || nf.professor === filtroProfessor
    return matchStatus && matchProfessor
  })

  const totalPendente = notasFiscais
    .filter((nf) => nf.status === 'Pendente')
    .reduce((acc, nf) => acc + nf.valor, 0)

  const totalPago = notasFiscais
    .filter((nf) => nf.status === 'Paga')
    .reduce((acc, nf) => acc + nf.valor, 0)

  const totalVencido = notasFiscais
    .filter((nf) => nf.status === 'Vencida')
    .reduce((acc, nf) => acc + nf.valor, 0)

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

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Notas Fiscais - Professores PJ</h2>
        <p className="text-gray-dark">Gestão de notas fiscais dos professores pessoa jurídica</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total vencido</p>
          <p className="text-2xl font-semibold text-black">
            R$ {totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Status</label>
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
          <div>
            <label className="block text-sm font-medium text-black mb-2">Professor</label>
            <select
              value={filtroProfessor}
              onChange={(e) => setFiltroProfessor(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              {professores.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light border-b border-gray-medium">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Número NF</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Professor</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">CNPJ</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Descrição</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Emissão</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Vencimento</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
              </tr>
            </thead>
            <tbody>
              {notasFiltradas.map((nf) => (
                <tr
                  key={nf.id}
                  className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-black">{nf.numero}</td>
                  <td className="px-6 py-4 text-sm text-black">{nf.professor}</td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{nf.cnpj}</td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{nf.descricao}</td>
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
                  <td className="px-6 py-4 text-sm">
                    {nf.status === 'Pendente' && (
                      <button
                        onClick={() => {
                          if (confirm(`Marcar nota fiscal ${nf.numero} como paga?`)) {
                            alert('Nota fiscal marcada como paga!')
                          }
                        }}
                        className="text-black hover:underline font-medium"
                      >
                        Marcar como paga
                      </button>
                    )}
                    {nf.status === 'Vencida' && (
                      <button
                        onClick={() => {
                          if (confirm(`Marcar nota fiscal ${nf.numero} como paga?`)) {
                            alert('Nota fiscal marcada como paga!')
                          }
                        }}
                        className="text-black hover:underline font-medium"
                      >
                        Pagar agora
                      </button>
                    )}
                    {nf.arquivo && (
                      <a
                        href={nf.arquivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:underline font-medium ml-3"
                      >
                        Ver PDF
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {notasFiltradas.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-dark">Nenhuma nota fiscal encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  )
}

