import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface Cobranca {
  id: string
  valor: number
  vencimento: string
  tipo: string
  status: string
  idExterno: string
  descricao?: string
}

export default function DetalheResponsavel() {
  const { id } = useParams()
  const [taxaJuros] = useState(1) // 1% ao mês
  const [responsavel, setResponsavel] = useState<any>(null)
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [pagamentos, setPagamentos] = useState<any[]>([])

  useEffect(() => {
    // Carregar responsável do localStorage
    const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
    const responsavelEncontrado = responsaveis.find((r: any) => r.id === id)
    
    if (responsavelEncontrado) {
      setResponsavel(responsavelEncontrado)
      
      // Carregar cobranças do responsável
      const todasCobrancas = JSON.parse(localStorage.getItem('cobrancas') || '[]')
      const cobrancasResponsavel = todasCobrancas.filter((c: any) => c.responsavelId === id)
      setCobrancas(cobrancasResponsavel)
      
      // Carregar pagamentos do responsável
      const todosPagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]')
      const pagamentosResponsavel = todosPagamentos.filter((p: any) => p.responsavelId === id)
      setPagamentos(pagamentosResponsavel)
    }
  }, [id])

  if (!responsavel) {
    return (
      <div>
        <Link to="/alunos" className="text-gray-dark hover:text-black mb-4 inline-block">
          ← Voltar para Alunos & Responsáveis
        </Link>
        <p className="text-gray-dark">Responsável não encontrado</p>
      </div>
    )
  }

  // Função para calcular juros de parcela atrasada
  const calcularJuros = (valor: number, dataVencimento: string): { diasAtraso: number; valorJuros: number; valorTotal: number } => {
    const hoje = new Date()
    const vencimento = new Date(dataVencimento)
    const diffTime = hoje.getTime() - vencimento.getTime()
    const diasAtraso = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
    
    if (diasAtraso <= 0) {
      return { diasAtraso: 0, valorJuros: 0, valorTotal: valor }
    }

    // Calcular meses de atraso (arredondado para cima)
    const mesesAtraso = Math.ceil(diasAtraso / 30)
    const valorJuros = (valor * taxaJuros / 100) * mesesAtraso
    const valorTotal = valor + valorJuros

    return { diasAtraso, valorJuros, valorTotal }
  }

  // Filtrar cobranças atrasadas
  const cobrancasAtrasadas = cobrancas.filter((c) => {
    if (c.status === 'Paga') return false
    const vencimento = new Date(c.vencimento)
    const hoje = new Date()
    return vencimento < hoje
  })

  // Função para gerar link do WhatsApp
  const gerarLinkWhatsApp = (cobranca: Cobranca) => {
    const { valorJuros, valorTotal } = calcularJuros(cobranca.valor, cobranca.vencimento)
    const mensagem = encodeURIComponent(
      `Olá ${responsavel.nome}, tudo bem?\n\n` +
      `Lembramos que você possui uma cobrança pendente:\n\n` +
      `📋 Cobrança: ${cobranca.idExterno}\n` +
      `💰 Valor original: R$ ${cobranca.valor.toFixed(2).replace('.', ',')}\n` +
      (valorJuros > 0 ? `📈 Juros (${taxaJuros}% ao mês): R$ ${valorJuros.toFixed(2).replace('.', ',')}\n` : '') +
      `💵 Valor total: R$ ${valorTotal.toFixed(2).replace('.', ',')}\n` +
      `📅 Vencimento: ${new Date(cobranca.vencimento).toLocaleDateString('pt-BR')}\n` +
      `💳 Tipo: ${cobranca.tipo}\n\n` +
      `Por favor, realize o pagamento o quanto antes.\n\n` +
      `Obrigado!`
    )
    return `https://wa.me/${responsavel.whatsapp}?text=${mensagem}`
  }

  const handleCobrarWhatsApp = () => {
    if (cobrancasAtrasadas.length === 0) {
      alert('Não há cobranças atrasadas para enviar.')
      return
    }

    // Se houver apenas uma cobrança atrasada, envia direto
    if (cobrancasAtrasadas.length === 1) {
      window.open(gerarLinkWhatsApp(cobrancasAtrasadas[0]), '_blank')
    } else {
      // Se houver múltiplas, mostra opção de escolher
      const cobrancaSelecionada = cobrancasAtrasadas[0] // Por padrão, a primeira
      window.open(gerarLinkWhatsApp(cobrancaSelecionada), '_blank')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link to="/alunos" className="text-gray-dark hover:text-black mb-4 inline-block">
          ← Voltar para Alunos & Responsáveis
        </Link>
        <h2 className="text-3xl font-semibold text-black mb-2">{responsavel.nome}</h2>
        <p className="text-gray-dark">Detalhes do responsável financeiro</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-black mb-6">Dados pessoais</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-dark mb-1">Email</p>
                <p className="text-black">{responsavel.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-dark mb-1">Telefone</p>
                <p className="text-black">{responsavel.telefone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-dark mb-1">CPF</p>
                <p className="text-black">{responsavel.cpf}</p>
              </div>
            </div>
          </div>

          {cobrancasAtrasadas.length > 0 && (
            <div className="card bg-gray-light border-2 border-black">
              <h3 className="text-lg font-semibold text-black mb-4">⚠️ Cobranças Atrasadas</h3>
              <div className="space-y-4 mb-4">
                {cobrancasAtrasadas.map((cobranca) => {
                  const { diasAtraso, valorJuros, valorTotal } = calcularJuros(cobranca.valor, cobranca.vencimento)
                  return (
                    <div
                      key={cobranca.id}
                      className="border border-black rounded-card p-4 bg-white"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-xs text-gray-dark mb-1">Cobrança: {cobranca.idExterno}</p>
                          <p className="text-sm text-gray-dark mb-2">
                            Vencimento: {new Date(cobranca.vencimento).toLocaleDateString('pt-BR')} 
                            <span className="ml-2 font-semibold text-black">({diasAtraso} dias atrasado)</span>
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-dark">
                              Valor original: <span className="text-black font-medium">R$ {cobranca.valor.toFixed(2).replace('.', ',')}</span>
                            </p>
                            {valorJuros > 0 && (
                              <p className="text-sm text-gray-dark">
                                Juros ({taxaJuros}% ao mês): <span className="text-black font-medium">R$ {valorJuros.toFixed(2).replace('.', ',')}</span>
                              </p>
                            )}
                            <p className="text-base font-semibold text-black mt-2">
                              Valor total: R$ {valorTotal.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white">
                          Atrasada
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-medium">
                        <div className="text-xs text-gray-dark">
                          <p>Tipo: {cobranca.tipo}</p>
                        </div>
                        <a
                          href={gerarLinkWhatsApp(cobranca)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-black hover:underline"
                        >
                          Enviar via WhatsApp →
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-semibold text-black mb-6">Histórico de cobranças</h3>
            <div className="space-y-4">
              {cobrancas.length === 0 ? (
                <p className="text-gray-dark">Nenhuma cobrança registrada</p>
              ) : (
                cobrancas.map((cobranca) => {
                  const isAtrasada = cobrancasAtrasadas.some((c) => c.id === cobranca.id)
                  const { valorJuros, valorTotal } = calcularJuros(cobranca.valor, cobranca.vencimento)
                  
                  return (
                    <div
                      key={cobranca.id}
                      className={`border rounded-card p-4 ${isAtrasada ? 'border-2 border-black bg-gray-light' : 'border-gray-medium'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          {isAtrasada ? (
                            <div>
                              <p className="text-xs text-gray-dark line-through">R$ {cobranca.valor.toFixed(2).replace('.', ',')}</p>
                              <p className="font-semibold text-black">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
                              {valorJuros > 0 && (
                                <p className="text-xs text-gray-dark">(+ R$ {valorJuros.toFixed(2).replace('.', ',')} de juros)</p>
                              )}
                            </div>
                          ) : (
                            <p className="font-semibold text-black">R$ {cobranca.valor.toFixed(2).replace('.', ',')}</p>
                          )}
                          <p className="text-sm text-gray-dark">Vencimento: {new Date(cobranca.vencimento).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            cobranca.status === 'Paga'
                              ? 'bg-gray-light text-black'
                              : isAtrasada
                              ? 'bg-black text-white'
                              : 'bg-black text-white'
                          }`}
                        >
                          {cobranca.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-medium">
                        <div className="text-xs text-gray-dark">
                          <p>Tipo: {cobranca.tipo}</p>
                          <p>ID: {cobranca.idExterno}</p>
                        </div>
                        {isAtrasada && cobranca.status !== 'Paga' && (
                          <a
                            href={gerarLinkWhatsApp(cobranca)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-black hover:underline"
                          >
                            WhatsApp →
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-black mb-6">Histórico de pagamentos</h3>
            <div className="space-y-4">
              {pagamentos.length === 0 ? (
                <p className="text-gray-dark">Nenhum pagamento registrado</p>
              ) : (
                pagamentos.map((pagamento) => (
                  <div
                    key={pagamento.id}
                    className="border border-gray-medium rounded-card p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-black">R$ {pagamento.valor.toFixed(2).replace('.', ',')}</p>
                        <p className="text-sm text-gray-dark">Data: {new Date(pagamento.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-light text-black">
                        {pagamento.status || 'Conciliado'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-medium">
                      <div className="text-xs text-gray-dark">
                        <p>Tipo: {pagamento.tipo}</p>
                        {pagamento.cobrancaId && <p>Conciliado com: {pagamento.cobrancaId}</p>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-black mb-6">Informações financeiras</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-dark mb-1">Status</p>
                <p className="text-black font-medium">{responsavel.statusFinanceiro}</p>
              </div>
              <div>
                <p className="text-sm text-gray-dark mb-1">Valor mensal</p>
                <p className="text-black font-semibold text-xl">
                  R$ {responsavel.valorMensal.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-dark mb-1">Preferência de pagamento</p>
                <p className="text-black">{responsavel.preferenciaPagamento}</p>
              </div>
            </div>
          </div>

          <Link
            to={`/cobranca/${responsavel.id}`}
            className="btn-primary w-full text-center block mb-3"
          >
            Gerar cobrança
          </Link>

          {cobrancasAtrasadas.length > 0 && (
            <button
              onClick={handleCobrarWhatsApp}
              className="btn-outline w-full text-center block"
            >
              📱 Cobrar via WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
