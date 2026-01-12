import { useState, useEffect } from 'react'

interface EventoFinanceiro {
  id: string
  tipo: 'Vencimento' | 'Pagamento' | 'Cobrança' | 'Evento'
  titulo: string
  valor?: number
  responsavelId?: string
  responsavelNome?: string
  data: string
  status?: string
  cor?: string
}

export default function CalendarioFinanceiro() {
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())
  const [eventos, setEventos] = useState<EventoFinanceiro[]>([])

  useEffect(() => {
    carregarEventos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mesSelecionado, anoSelecionado])

  const carregarEventos = () => {
    // Carregar cobranças
    const cobrancas = JSON.parse(localStorage.getItem('cobrancas') || '[]')
    const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
    const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]')

    const eventosCarregados: EventoFinanceiro[] = []

    // Adicionar vencimentos
    cobrancas.forEach((cobranca: any) => {
      const responsavel = responsaveis.find((r: any) => r.id === cobranca.responsavelId)
      eventosCarregados.push({
        id: `VENC-${cobranca.id}`,
        tipo: 'Vencimento',
        titulo: `Vencimento - ${responsavel?.nome || 'Não encontrado'}`,
        valor: cobranca.valor,
        responsavelId: cobranca.responsavelId,
        responsavelNome: responsavel?.nome,
        data: cobranca.vencimento,
        status: cobranca.status,
      })
    })

    // Adicionar pagamentos
    pagamentos.forEach((pagamento: any) => {
      const responsavel = responsaveis.find((r: any) => r.id === pagamento.responsavelId)
      eventosCarregados.push({
        id: `PAG-${pagamento.id}`,
        tipo: 'Pagamento',
        titulo: `Pagamento - ${responsavel?.nome || 'Não encontrado'}`,
        valor: pagamento.valor,
        responsavelId: pagamento.responsavelId,
        responsavelNome: responsavel?.nome,
        data: pagamento.data,
        status: pagamento.status,
      })
    })

    setEventos(eventosCarregados)
  }

  const diasNoMes = new Date(anoSelecionado, mesSelecionado + 1, 0).getDate()
  const primeiroDia = new Date(anoSelecionado, mesSelecionado, 1).getDay()
  const nomesMeses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getEventosDoDia = (dia: number) => {
    const dataCompleta = `${anoSelecionado}-${String(mesSelecionado + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    return eventos.filter((e) => e.data.startsWith(dataCompleta))
  }

  const getCorEvento = (tipo: EventoFinanceiro['tipo'], status?: string, dataEvento?: string) => {
    if (tipo === 'Pagamento') return 'bg-gray-light border-l-4 border-black'
    if (tipo === 'Vencimento' && status === 'Paga') return 'bg-gray-light border-l-4 border-gray-medium'
    if (tipo === 'Vencimento' && status === 'Pendente') {
      if (dataEvento) {
        const data = new Date(dataEvento)
        const hoje = new Date()
        if (data < hoje) return 'bg-white border-l-4 border-black'
      }
      return 'bg-gray-light border-l-4 border-black'
    }
    return 'bg-gray-light border-l-4 border-gray-medium'
  }

  const proximoMes = () => {
    if (mesSelecionado === 11) {
      setMesSelecionado(0)
      setAnoSelecionado(anoSelecionado + 1)
    } else {
      setMesSelecionado(mesSelecionado + 1)
    }
  }

  const mesAnterior = () => {
    if (mesSelecionado === 0) {
      setMesSelecionado(11)
      setAnoSelecionado(anoSelecionado - 1)
    } else {
      setMesSelecionado(mesSelecionado - 1)
    }
  }

  const hoje = new Date()
  const hojeDia = hoje.getDate()
  const hojeMes = hoje.getMonth()
  const hojeAno = hoje.getFullYear()

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Calendário Financeiro</h2>
        <p className="text-gray-dark">Visualize vencimentos e pagamentos no calendário</p>
      </div>

      {/* Controles do calendário */}
      <div className="card mb-6">
        <div className="flex justify-between items-center">
          <button onClick={mesAnterior} className="btn-outline">
            ← Mês Anterior
          </button>
          <h3 className="text-xl font-semibold text-black">
            {nomesMeses[mesSelecionado]} {anoSelecionado}
          </h3>
          <button onClick={proximoMes} className="btn-outline">
            Próximo Mês →
          </button>
        </div>
      </div>

      {/* Calendário */}
      <div className="card p-0 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-medium">
          {diasSemana.map((dia) => (
            <div key={dia} className="p-4 text-center text-sm font-semibold text-black border-r border-gray-medium last:border-r-0">
              {dia}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {/* Espaços vazios antes do primeiro dia */}
          {Array.from({ length: primeiroDia }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[120px] border-r border-b border-gray-medium" />
          ))}

          {/* Dias do mês */}
          {Array.from({ length: diasNoMes }).map((_, index) => {
            const dia = index + 1
            const eventosDoDia = getEventosDoDia(dia)
            const isHoje =
              dia === hojeDia && mesSelecionado === hojeMes && anoSelecionado === hojeAno

            return (
              <div
                key={dia}
                className={`min-h-[120px] border-r border-b border-gray-medium p-2 ${
                  isHoje ? 'bg-gray-light' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${isHoje ? 'text-black' : 'text-gray-dark'}`}>
                  {dia}
                </div>
                <div className="space-y-1">
                  {eventosDoDia.slice(0, 3).map((evento) => (
                    <div
                      key={evento.id}
                      className={`text-xs p-1 rounded ${getCorEvento(evento.tipo, evento.status, evento.data)}`}
                      title={`${evento.titulo} - R$ ${evento.valor?.toFixed(2).replace('.', ',') || '0,00'}`}
                    >
                      <p className="font-medium text-black truncate">{evento.titulo}</p>
                      {evento.valor && (
                        <p className="text-gray-dark">
                          R$ {evento.valor.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                  ))}
                  {eventosDoDia.length > 3 && (
                    <p className="text-xs text-gray-dark">+{eventosDoDia.length - 3} mais</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="card mt-6">
        <h3 className="text-sm font-semibold text-black mb-4">Legenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-light border-l-4 border-black" />
            <span className="text-sm text-gray-dark">Vencimento Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-light border-l-4 border-gray-medium" />
            <span className="text-sm text-gray-dark">Vencimento Pago</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-light border-l-4 border-black" />
            <span className="text-sm text-gray-dark">Pagamento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-light" />
            <span className="text-sm text-gray-dark">Hoje</span>
          </div>
        </div>
      </div>
    </div>
  )
}

