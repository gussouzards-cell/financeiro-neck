import { useState, useEffect } from 'react'
import { exportToPDF } from '../utils/exportUtils'

interface Comprovante {
  id: string
  pagamentoId: string
  responsavelId: string
  responsavelNome: string
  alunoNome: string
  valor: number
  dataPagamento: string
  tipoPagamento: string
  numeroDocumento: string
  dataGeracao: string
}

export default function Comprovantes() {
  const [comprovantes, setComprovantes] = useState<Comprovante[]>([])
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('todos')

  useEffect(() => {
    // Carregar comprovantes do localStorage
    const comprovantesSalvos = JSON.parse(localStorage.getItem('comprovantes') || '[]')
    setComprovantes(comprovantesSalvos)

    // Gerar comprovantes a partir de pagamentos se não houver
    if (comprovantesSalvos.length === 0) {
      // Usar setTimeout para evitar problemas de renderização
      setTimeout(() => {
        gerarComprovantesAutomaticos()
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gerarComprovantesAutomaticos = () => {
    // Buscar pagamentos e gerar comprovantes
    const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]')
    const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
    const alunos = JSON.parse(localStorage.getItem('alunos') || '[]')

    const novosComprovantes: Comprovante[] = pagamentos.map((pagamento: any) => {
      const responsavel = responsaveis.find((r: any) => r.id === pagamento.responsavelId)
      const aluno = alunos.find((a: any) => a.responsavelId === pagamento.responsavelId)

      return {
        id: `COMP${pagamento.id}`,
        pagamentoId: pagamento.id,
        responsavelId: pagamento.responsavelId || '',
        responsavelNome: responsavel?.nome || 'Não encontrado',
        alunoNome: aluno?.nome || 'Não encontrado',
        valor: pagamento.valor || 0,
        dataPagamento: pagamento.data || new Date().toISOString(),
        tipoPagamento: pagamento.tipo || 'PIX',
        numeroDocumento: `COMP-${pagamento.id || Date.now()}-${new Date(pagamento.data || new Date()).getFullYear()}`,
        dataGeracao: new Date().toISOString(),
      }
    })

    if (novosComprovantes.length > 0) {
      setComprovantes(novosComprovantes)
      localStorage.setItem('comprovantes', JSON.stringify(novosComprovantes))
    }
  }

  const gerarComprovante = (comprovante: Comprovante) => {
    const dados = [
      {
        'Número do Comprovante': comprovante.numeroDocumento,
        'Data de Geração': new Date(comprovante.dataGeracao).toLocaleDateString('pt-BR'),
        'Responsável': comprovante.responsavelNome,
        'Aluno': comprovante.alunoNome,
        'Valor Pago': `R$ ${comprovante.valor.toFixed(2).replace('.', ',')}`,
        'Data do Pagamento': new Date(comprovante.dataPagamento).toLocaleDateString('pt-BR'),
        'Tipo de Pagamento': comprovante.tipoPagamento,
        'Status': 'Confirmado',
      },
    ]

    exportToPDF(
      dados,
      `comprovante-${comprovante.numeroDocumento}`,
      `Comprovante de Pagamento - ${comprovante.numeroDocumento}`
    )
  }

  const comprovantesFiltrados = comprovantes.filter((c) => {
    if (filtroPeriodo === 'todos') return true

    const dataPagamento = new Date(c.dataPagamento)
    const hoje = new Date()
    const mesAtual = hoje.getMonth()
    const anoAtual = hoje.getFullYear()

    switch (filtroPeriodo) {
      case 'mes':
        return dataPagamento.getMonth() === mesAtual && dataPagamento.getFullYear() === anoAtual
      case 'trimestre':
        const trimestreAtual = Math.floor(mesAtual / 3)
        return (
          Math.floor(dataPagamento.getMonth() / 3) === trimestreAtual &&
          dataPagamento.getFullYear() === anoAtual
        )
      case 'ano':
        return dataPagamento.getFullYear() === anoAtual
      default:
        return true
    }
  })

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-semibold text-black mb-2">Comprovantes e Documentos</h2>
          <p className="text-gray-dark">Gere e gerencie comprovantes de pagamento</p>
        </div>
        <button onClick={gerarComprovantesAutomaticos} className="btn-outline">
          Gerar Comprovantes
        </button>
      </div>

      <div className="card mb-6">
        <label className="block text-sm font-medium text-black mb-2">Filtrar por período</label>
        <select
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          className="input-field"
        >
          <option value="todos">Todos</option>
          <option value="mes">Este mês</option>
          <option value="trimestre">Este trimestre</option>
          <option value="ano">Este ano</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-medium">
          <h3 className="text-lg font-semibold text-black">
            Comprovantes ({comprovantesFiltrados.length})
          </h3>
        </div>
        {comprovantesFiltrados.length === 0 ? (
          <div className="p-12 text-center text-gray-dark">
            <p>Nenhum comprovante encontrado.</p>
            <p className="text-sm mt-2">Clique em "Gerar Comprovantes" para criar comprovantes dos pagamentos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-light border-b border-gray-medium">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Número</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Responsável</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Aluno</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Data Pagamento</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
                </tr>
              </thead>
              <tbody>
                {comprovantesFiltrados
                  .sort((a, b) => new Date(b.dataPagamento).getTime() - new Date(a.dataPagamento).getTime())
                  .map((comprovante) => (
                    <tr
                      key={comprovante.id}
                      className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-black">
                        {comprovante.numeroDocumento}
                      </td>
                      <td className="px-6 py-4 text-sm text-black">{comprovante.responsavelNome}</td>
                      <td className="px-6 py-4 text-sm text-gray-dark">{comprovante.alunoNome}</td>
                      <td className="px-6 py-4 text-sm font-medium text-black">
                        R$ {comprovante.valor.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-dark">
                        {new Date(comprovante.dataPagamento).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-dark">{comprovante.tipoPagamento}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => gerarComprovante(comprovante)}
                          className="text-black hover:underline font-medium"
                        >
                          Baixar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

