import { useState, useEffect } from 'react'

interface Projecao {
  mes: string
  recebimentos: number
  gastos: number
  saldo: number
  saldoAcumulado: number
}

export default function FluxoCaixa() {
  const [projecoes, setProjecoes] = useState<Projecao[]>([])
  const [mesesProjecao, setMesesProjecao] = useState(6)

  useEffect(() => {
    calcularFluxoCaixa()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesesProjecao])

  const calcularFluxoCaixa = () => {
    const hoje = new Date()
    const projecoesCalculadas: Projecao[] = []

    // Carregar dados históricos
    const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]')
    const gastos = JSON.parse(localStorage.getItem('gastos') || '[]')
    const cobrancasAutomaticas = JSON.parse(localStorage.getItem('cobrancasAutomaticas') || '[]')

    let saldoAcumulado = 0

    for (let i = 0; i < mesesProjecao; i++) {
      const dataProjecao = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1)
      const mesAno = `${dataProjecao.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`

      // Calcular recebimentos projetados
      let recebimentosProjetados = 0

      // Recebimentos históricos do mesmo mês (anos anteriores)
      const mesNumero = dataProjecao.getMonth() + 1
      pagamentos.forEach((pag: any) => {
        const dataPag = new Date(pag.data)
        if (dataPag.getMonth() + 1 === mesNumero) {
          recebimentosProjetados += pag.valor
        }
      })

      // Adicionar recebimentos de cobranças automáticas ativas
      cobrancasAutomaticas
        .filter((ca: any) => ca.ativa)
        .forEach((ca: any) => {
          recebimentosProjetados += ca.valor
        })

      // Calcular gastos projetados
      let gastosProjetados = 0

      // Gastos históricos do mesmo mês
      gastos.forEach((gasto: any) => {
        const dataGasto = new Date(gasto.data)
        if (dataGasto.getMonth() + 1 === mesNumero) {
          gastosProjetados += gasto.valor
        }
      })

      // Média de gastos dos últimos meses
      const gastosRecentes = gastos.filter((g: any) => {
        const dataGasto = new Date(g.data)
        const mesesAtras = (hoje.getTime() - dataGasto.getTime()) / (1000 * 60 * 60 * 24 * 30)
        return mesesAtras <= 6
      })

      if (gastosRecentes.length > 0) {
        const mediaGastos = gastosRecentes.reduce((acc: number, g: any) => acc + g.valor, 0) / gastosRecentes.length
        gastosProjetados = Math.max(gastosProjetados, mediaGastos)
      }

      const saldo = recebimentosProjetados - gastosProjetados
      saldoAcumulado += saldo

      projecoesCalculadas.push({
        mes: mesAno,
        recebimentos: recebimentosProjetados,
        gastos: gastosProjetados,
        saldo,
        saldoAcumulado,
      })
    }

    setProjecoes(projecoesCalculadas)
  }

  const totalRecebimentos = projecoes.reduce((acc, p) => acc + p.recebimentos, 0)
  const totalGastos = projecoes.reduce((acc, p) => acc + p.gastos, 0)
  const saldoFinal = totalRecebimentos - totalGastos

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Análise de Fluxo de Caixa</h2>
        <p className="text-gray-dark">Projeção de recebimentos e gastos futuros</p>
      </div>

      {/* Controles */}
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-black">Meses de projeção:</label>
          <select
            value={mesesProjecao}
            onChange={(e) => setMesesProjecao(parseInt(e.target.value))}
            className="input-field w-32"
          >
            <option value="3">3 meses</option>
            <option value="6">6 meses</option>
            <option value="12">12 meses</option>
          </select>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total de recebimentos projetados</p>
          <p className="text-3xl font-semibold text-black">
            R$ {totalRecebimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total de gastos projetados</p>
          <p className="text-3xl font-semibold text-black">
            R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card border-2 border-black">
          <p className="text-sm text-gray-dark mb-2">Saldo final projetado</p>
          <p className="text-3xl font-semibold text-black">
            R$ {saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-black mb-6">Projeção Mensal</h3>
        <div className="space-y-6">
          {projecoes.map((projecao, index) => {
            const maxValor = Math.max(
              ...projecoes.map((p) => Math.max(p.recebimentos, p.gastos))
            )
            return (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-black">{projecao.mes}</span>
                  <div className="flex gap-4 text-xs text-gray-dark">
                    <span>Receb: R$ {projecao.recebimentos.toFixed(2).replace('.', ',')}</span>
                    <span>Gastos: R$ {projecao.gastos.toFixed(2).replace('.', ',')}</span>
                    <span className="font-semibold text-black">
                      Saldo: R$ {projecao.saldo.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 h-8">
                  <div
                    className="bg-black rounded-card flex items-center justify-end pr-2"
                    style={{ width: `${(projecao.recebimentos / maxValor) * 50}%` }}
                  >
                    {projecao.recebimentos > maxValor * 0.1 && (
                      <span className="text-xs text-white font-medium">
                        R$ {(projecao.recebimentos / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>
                  <div
                    className="bg-gray-medium rounded-card flex items-center justify-end pr-2"
                    style={{ width: `${(projecao.gastos / maxValor) * 50}%` }}
                  >
                    {projecao.gastos > maxValor * 0.1 && (
                      <span className="text-xs text-black font-medium">
                        R$ {(projecao.gastos / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabela detalhada */}
      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-medium">
          <h3 className="text-lg font-semibold text-black">Detalhamento por Mês</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light border-b border-gray-medium">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Mês</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Recebimentos</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Gastos</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Saldo do Mês</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Saldo Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {projecoes.map((projecao, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-black">{projecao.mes}</td>
                  <td className="px-6 py-4 text-sm text-black">
                    R$ {projecao.recebimentos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-dark">
                    R$ {projecao.gastos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-black">
                    R$ {projecao.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-black">
                    R$ {projecao.saldoAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

