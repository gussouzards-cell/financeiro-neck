import { useState } from 'react'
import { exportToCSV, exportToPDF, exportToExcel } from '../utils/exportUtils'

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('mes')
  const [turma, setTurma] = useState('todas')
  const [status, setStatus] = useState('todos')

  // Carregar dados do localStorage
  const cobrancas = JSON.parse(localStorage.getItem('cobrancas') || '[]')
  const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]')
  const alunos = JSON.parse(localStorage.getItem('alunos') || '[]')
  const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')

  // Gerar relatórios combinando cobranças e pagamentos
  const relatorios = cobrancas.map((cobranca: any) => {
    const responsavel = responsaveis.find((r: any) => r.id === cobranca.responsavelId)
    const aluno = alunos.find((a: any) => a.responsavelId === cobranca.responsavelId)
    const pagamento = pagamentos.find((p: any) => p.cobrancaId === cobranca.id)
    
    let statusRelatorio = 'Pendente'
    if (cobranca.status === 'Paga') {
      statusRelatorio = 'Pago'
    } else {
      const vencimento = new Date(cobranca.vencimento)
      const hoje = new Date()
      if (vencimento < hoje) {
        statusRelatorio = 'Atrasado'
      }
    }
    
    return {
      id: cobranca.id,
      aluno: aluno?.nome || 'Não encontrado',
      responsavel: responsavel?.nome || 'Não encontrado',
      valor: cobranca.valor,
      vencimento: cobranca.vencimento,
      pagamento: pagamento?.data || '-',
      status: statusRelatorio,
      tipo: cobranca.tipo,
    }
  })

  const handleExportCSV = () => {
    const dadosExportacao = relatorios.map((r) => ({
      Aluno: r.aluno,
      Responsável: r.responsavel,
      Valor: `R$ ${r.valor.toFixed(2).replace('.', ',')}`,
      Vencimento: r.vencimento !== '-' ? new Date(r.vencimento).toLocaleDateString('pt-BR') : '-',
      Pagamento: r.pagamento !== '-' ? new Date(r.pagamento).toLocaleDateString('pt-BR') : '-',
      Status: r.status,
      Tipo: r.tipo,
    }))
    exportToCSV(dadosExportacao, `relatorio-financeiro-${new Date().toISOString().split('T')[0]}`)
  }

  const handleExportPDF = () => {
    const dadosExportacao = relatorios.map((r) => ({
      Aluno: r.aluno,
      Responsável: r.responsavel,
      Valor: `R$ ${r.valor.toFixed(2).replace('.', ',')}`,
      Vencimento: r.vencimento !== '-' ? new Date(r.vencimento).toLocaleDateString('pt-BR') : '-',
      Pagamento: r.pagamento !== '-' ? new Date(r.pagamento).toLocaleDateString('pt-BR') : '-',
      Status: r.status,
      Tipo: r.tipo,
    }))
    exportToPDF(
      dadosExportacao,
      `relatorio-financeiro-${new Date().toISOString().split('T')[0]}`,
      'Relatório Financeiro - Colégio Neck'
    )
  }

  const handleExportExcel = () => {
    const dadosExportacao = relatorios.map((r) => ({
      Aluno: r.aluno,
      Responsável: r.responsavel,
      Valor: r.valor,
      'Data Vencimento': r.vencimento !== '-' ? new Date(r.vencimento).toLocaleDateString('pt-BR') : '-',
      'Data Pagamento': r.pagamento !== '-' ? new Date(r.pagamento).toLocaleDateString('pt-BR') : '-',
      Status: r.status,
      Tipo: r.tipo,
    }))
    exportToExcel(dadosExportacao, `relatorio-financeiro-${new Date().toISOString().split('T')[0]}`)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Relatórios</h2>
        <p className="text-gray-dark">Análise completa do financeiro da escola</p>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Período</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="input-field"
            >
              <option value="mes">Este mês</option>
              <option value="trimestre">Este trimestre</option>
              <option value="ano">Este ano</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Turma</label>
            <select
              value={turma}
              onChange={(e) => setTurma(e.target.value)}
              className="input-field"
            >
              <option value="todas">Todas</option>
              <option value="1ano">1º Ano</option>
              <option value="2ano">2º Ano</option>
              <option value="3ano">3º Ano</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-3 flex-wrap">
        <button onClick={handleExportCSV} className="btn-outline">
          Exportar CSV
        </button>
        <button onClick={handleExportExcel} className="btn-outline">
          Exportar Excel
        </button>
        <button onClick={handleExportPDF} className="btn-outline">
          Exportar PDF
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light border-b border-gray-medium">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Aluno</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Responsável</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Vencimento</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Pagamento</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {relatorios.map((relatorio) => (
                <tr
                  key={relatorio.id}
                  className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-black">{relatorio.aluno}</td>
                  <td className="px-6 py-4 text-sm text-black">{relatorio.responsavel}</td>
                  <td className="px-6 py-4 text-sm font-medium text-black">
                    {relatorio.valor > 0 ? `R$ ${relatorio.valor.toFixed(2).replace('.', ',')}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-dark">
                    {relatorio.vencimento !== '-' ? new Date(relatorio.vencimento).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-dark">
                    {relatorio.pagamento !== '-' ? new Date(relatorio.pagamento).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        relatorio.status === 'Pago'
                          ? 'bg-gray-light text-black'
                          : relatorio.status === 'Atrasado'
                          ? 'bg-black text-white'
                          : 'bg-white border border-gray-medium text-gray-dark'
                      }`}
                    >
                      {relatorio.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{relatorio.tipo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

