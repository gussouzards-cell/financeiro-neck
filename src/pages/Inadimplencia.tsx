import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Inadimplente {
  id: string
  responsavelNome: string
  responsavelId: string
  alunoNome: string
  valorDevido: number
  diasAtraso: number
  ultimaCobranca: string
  totalCobrancas: number
  telefone: string
  whatsapp: string
  email: string
}

export default function Inadimplencia() {
  const [inadimplentes, setInadimplentes] = useState<Inadimplente[]>([])
  const [filtroDias, setFiltroDias] = useState<string>('todos')
  const [filtroValor, setFiltroValor] = useState<string>('todos')

  useEffect(() => {
    calcularInadimplencia()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calcularInadimplencia = () => {
    // Carregar dados
    const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
    const alunos = JSON.parse(localStorage.getItem('alunos') || '[]')
    const cobrancas = JSON.parse(localStorage.getItem('cobrancas') || '[]')

    const hoje = new Date()
    const inadimplentesList: Inadimplente[] = []

    responsaveis.forEach((responsavel: any) => {
      // Buscar cobranças pendentes e atrasadas
      const cobrancasPendentes = cobrancas.filter((c: any) => {
        if (c.responsavelId !== responsavel.id || c.status === 'Paga') return false
        const vencimento = new Date(c.vencimento)
        return vencimento < hoje
      })

      if (cobrancasPendentes.length > 0) {
        const valorTotal = cobrancasPendentes.reduce((acc: number, c: any) => acc + c.valor, 0)
        const diasAtraso = Math.max(
          ...cobrancasPendentes.map((c: any) => {
            const diff = hoje.getTime() - new Date(c.vencimento).getTime()
            return Math.ceil(diff / (1000 * 60 * 60 * 24))
          })
        )
        const ultimaCobranca = cobrancasPendentes.sort(
          (a: any, b: any) => new Date(b.vencimento).getTime() - new Date(a.vencimento).getTime()
        )[0]

        // Buscar aluno do responsável
        const aluno = alunos.find((a: any) => a.responsavelId === responsavel.id)

        inadimplentesList.push({
          id: responsavel.id,
          responsavelNome: responsavel.nome,
          responsavelId: responsavel.id,
          alunoNome: aluno?.nome || 'Não encontrado',
          valorDevido: valorTotal,
          diasAtraso,
          ultimaCobranca: ultimaCobranca.vencimento,
          totalCobrancas: cobrancasPendentes.length,
          telefone: responsavel.telefone,
          whatsapp: responsavel.whatsapp,
          email: responsavel.email,
        })
      }
    })

    // Ordenar por dias de atraso (maior primeiro)
    inadimplentesList.sort((a, b) => b.diasAtraso - a.diasAtraso)
    setInadimplentes(inadimplentesList)
  }

  const inadimplentesFiltrados = inadimplentes.filter((i) => {
    const matchDias =
      filtroDias === 'todos' ||
      (filtroDias === '0-30' && i.diasAtraso <= 30) ||
      (filtroDias === '31-60' && i.diasAtraso > 30 && i.diasAtraso <= 60) ||
      (filtroDias === '60+' && i.diasAtraso > 60)

    const matchValor =
      filtroValor === 'todos' ||
      (filtroValor === '0-500' && i.valorDevido <= 500) ||
      (filtroValor === '500-1000' && i.valorDevido > 500 && i.valorDevido <= 1000) ||
      (filtroValor === '1000+' && i.valorDevido > 1000)

    return matchDias && matchValor
  })

  const totalInadimplencia = inadimplentes.reduce((acc, i) => acc + i.valorDevido, 0)
  const totalInadimplentes = inadimplentes.length
  const mediaDiasAtraso =
    inadimplentes.length > 0
      ? Math.round(inadimplentes.reduce((acc, i) => acc + i.diasAtraso, 0) / inadimplentes.length)
      : 0

  const gerarLinkWhatsApp = (inadimplente: Inadimplente) => {
    const mensagem = encodeURIComponent(
      `Olá ${inadimplente.responsavelNome}, tudo bem?\n\n` +
      `Lembramos que você possui cobrança(s) em atraso:\n\n` +
      `💰 Valor total devido: R$ ${inadimplente.valorDevido.toFixed(2).replace('.', ',')}\n` +
      `📅 Dias de atraso: ${inadimplente.diasAtraso} dias\n` +
      `📋 Total de cobranças: ${inadimplente.totalCobrancas}\n\n` +
      `Por favor, entre em contato conosco para regularizar sua situação.\n\n` +
      `Obrigado!`
    )
    return `https://wa.me/${inadimplente.whatsapp}?text=${mensagem}`
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Dashboard de Inadimplência</h2>
        <p className="text-gray-dark">Análise detalhada de inadimplentes e estratégias de cobrança</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border-2 border-black">
          <p className="text-sm text-gray-dark mb-2">Total em inadimplência</p>
          <p className="text-3xl font-semibold text-black">
            R$ {totalInadimplencia.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total de inadimplentes</p>
          <p className="text-3xl font-semibold text-black">{totalInadimplentes}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Média de dias em atraso</p>
          <p className="text-3xl font-semibold text-black">{mediaDiasAtraso} dias</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Dias de atraso</label>
            <select
              value={filtroDias}
              onChange={(e) => setFiltroDias(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              <option value="0-30">0 a 30 dias</option>
              <option value="31-60">31 a 60 dias</option>
              <option value="60+">Mais de 60 dias</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Valor devido</label>
            <select
              value={filtroValor}
              onChange={(e) => setFiltroValor(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              <option value="0-500">Até R$ 500,00</option>
              <option value="500-1000">R$ 500,01 a R$ 1.000,00</option>
              <option value="1000+">Acima de R$ 1.000,00</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de inadimplentes */}
      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-medium">
          <h3 className="text-lg font-semibold text-black">
            Inadimplentes ({inadimplentesFiltrados.length})
          </h3>
        </div>
        {inadimplentesFiltrados.length === 0 ? (
          <div className="p-12 text-center text-gray-dark">
            <p>Nenhum inadimplente encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-light border-b border-gray-medium">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Responsável</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Aluno</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor Devido</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Dias Atraso</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Cobranças</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Última Cobrança</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Ações</th>
                </tr>
              </thead>
              <tbody>
                {inadimplentesFiltrados.map((inadimplente) => (
                  <tr
                    key={inadimplente.id}
                    className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-black font-medium">
                      {inadimplente.responsavelNome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-dark">{inadimplente.alunoNome}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-black">
                      R$ {inadimplente.valorDevido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          inadimplente.diasAtraso <= 30
                            ? 'bg-gray-light text-black'
                            : inadimplente.diasAtraso <= 60
                            ? 'bg-black text-white'
                            : 'bg-white border-2 border-black text-black'
                        }`}
                      >
                        {inadimplente.diasAtraso} dias
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-dark">
                      {inadimplente.totalCobrancas} {inadimplente.totalCobrancas === 1 ? 'cobrança' : 'cobranças'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-dark">
                      {new Date(inadimplente.ultimaCobranca).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <a
                          href={gerarLinkWhatsApp(inadimplente)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black hover:underline font-medium text-xs"
                        >
                          WhatsApp
                        </a>
                        <Link
                          to={`/responsavel/${inadimplente.responsavelId}`}
                          className="text-black hover:underline font-medium text-xs"
                        >
                          Ver detalhes
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Análise por faixa de atraso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-black mb-4">Distribuição por Faixa de Atraso</h3>
          <div className="space-y-3">
            {[
              { label: '0 a 30 dias', count: inadimplentes.filter((i) => i.diasAtraso <= 30).length },
              { label: '31 a 60 dias', count: inadimplentes.filter((i) => i.diasAtraso > 30 && i.diasAtraso <= 60).length },
              { label: 'Mais de 60 dias', count: inadimplentes.filter((i) => i.diasAtraso > 60).length },
            ].map((faixa) => (
              <div key={faixa.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-dark">{faixa.label}</span>
                  <span className="text-sm font-medium text-black">{faixa.count} responsáveis</span>
                </div>
                <div className="h-2 bg-gray-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{
                      width: `${totalInadimplentes > 0 ? (faixa.count / totalInadimplentes) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-black mb-4">Top 5 Maiores Valores</h3>
          <div className="space-y-3">
            {inadimplentes
              .sort((a, b) => b.valorDevido - a.valorDevido)
              .slice(0, 5)
              .map((inadimplente) => (
                <div key={inadimplente.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-black">{inadimplente.responsavelNome}</p>
                    <p className="text-xs text-gray-dark">{inadimplente.alunoNome}</p>
                  </div>
                  <p className="text-sm font-semibold text-black">
                    R$ {inadimplente.valorDevido.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

