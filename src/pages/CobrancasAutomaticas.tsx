import { useState, useEffect } from 'react'

interface CobrancaAutomatica {
  id: string
  responsavelId: string
  responsavelNome: string
  valor: number
  diaVencimento: number // Dia do mês (1-31)
  tipo: 'PIX' | 'Boleto' | 'Cartão'
  ativa: boolean
  descricao: string
  dataInicio: string
  dataFim?: string
}

export default function CobrancasAutomaticas() {
  const [cobrancas, setCobrancas] = useState<CobrancaAutomatica[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [formData, setFormData] = useState({
    responsavelId: '',
    valor: '',
    diaVencimento: '5',
    tipo: 'PIX' as CobrancaAutomatica['tipo'],
    descricao: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
  })

  useEffect(() => {
    // Carregar cobranças automáticas do localStorage
    const cobrancasSalvas = JSON.parse(localStorage.getItem('cobrancasAutomaticas') || '[]')
    setCobrancas(cobrancasSalvas)
  }, [])

  // Carregar responsáveis
  const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const responsavel = responsaveis.find((r: any) => r.id === formData.responsavelId)

    const novaCobranca: CobrancaAutomatica = {
      id: `CA${Date.now()}`,
      responsavelId: formData.responsavelId,
      responsavelNome: responsavel?.nome || '',
      valor: parseFloat(formData.valor),
      diaVencimento: parseInt(formData.diaVencimento),
      tipo: formData.tipo,
      ativa: true,
      descricao: formData.descricao || `Mensalidade - ${formData.tipo}`,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim || undefined,
    }

    const novasCobrancas = [...cobrancas, novaCobranca]
    setCobrancas(novasCobrancas)
    localStorage.setItem('cobrancasAutomaticas', JSON.stringify(novasCobrancas))

    // Resetar formulário
    setFormData({
      responsavelId: '',
      valor: '',
      diaVencimento: '5',
      tipo: 'PIX',
      descricao: '',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: '',
    })
    setMostrarForm(false)
    alert('Cobrança automática configurada com sucesso!')
  }

  const toggleCobranca = (id: string) => {
    const novasCobrancas = cobrancas.map((c) =>
      c.id === id ? { ...c, ativa: !c.ativa } : c
    )
    setCobrancas(novasCobrancas)
    localStorage.setItem('cobrancasAutomaticas', JSON.stringify(novasCobrancas))
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta cobrança automática?')) {
      const novasCobrancas = cobrancas.filter((c) => c.id !== id)
      setCobrancas(novasCobrancas)
      localStorage.setItem('cobrancasAutomaticas', JSON.stringify(novasCobrancas))
    }
  }

  const gerarCobrancasDoMes = () => {
    const hoje = new Date()
    const mesAtual = hoje.getMonth() + 1
    const anoAtual = hoje.getFullYear()

    // Carregar cobranças existentes uma vez
    const cobrancasExistentes = JSON.parse(localStorage.getItem('cobrancas') || '[]')
    const cobrancasGeradas: any[] = []

    cobrancas
      .filter((c) => c.ativa)
      .forEach((cobranca) => {
        // Verificar se já existe cobrança para este mês
        const jaExiste = cobrancasExistentes.some(
          (c: any) =>
            c.responsavelId === cobranca.responsavelId &&
            new Date(c.vencimento).getMonth() + 1 === mesAtual &&
            new Date(c.vencimento).getFullYear() === anoAtual
        )

        if (!jaExiste) {
          // Verificar se está dentro do período
          const dataInicio = new Date(cobranca.dataInicio)
          const dataFim = cobranca.dataFim ? new Date(cobranca.dataFim) : null

          if (
            (dataInicio <= hoje && !dataFim) ||
            (dataInicio <= hoje && dataFim && dataFim >= hoje)
          ) {
            // Gerar data de vencimento
            const dataVencimento = new Date(anoAtual, mesAtual - 1, cobranca.diaVencimento)

            const novaCobranca = {
              id: `C${Date.now()}-${cobranca.id}`,
              responsavelId: cobranca.responsavelId,
              valor: cobranca.valor,
              vencimento: dataVencimento.toISOString().split('T')[0],
              tipo: cobranca.tipo,
              status: 'Pendente',
              idExterno: `${cobranca.tipo}-${anoAtual}-${mesAtual.toString().padStart(2, '0')}-${cobranca.responsavelId.slice(-3)}`,
              descricao: cobranca.descricao,
              automatica: true,
            }

            cobrancasGeradas.push(novaCobranca)
          }
        }
      })

    if (cobrancasGeradas.length > 0) {
      const todasCobrancas = [...cobrancasExistentes, ...cobrancasGeradas]
      localStorage.setItem('cobrancas', JSON.stringify(todasCobrancas))
      alert(`${cobrancasGeradas.length} cobrança(s) gerada(s) com sucesso!`)
    } else {
      alert('Nenhuma cobrança nova para gerar neste mês.')
    }
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-semibold text-black mb-2">Cobranças Automáticas</h2>
          <p className="text-gray-dark">Configure cobranças recorrentes mensais</p>
        </div>
        <div className="flex gap-3">
          <button onClick={gerarCobrancasDoMes} className="btn-outline">
            Gerar Cobranças do Mês
          </button>
          <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
            {mostrarForm ? 'Cancelar' : '+ Nova Cobrança Automática'}
          </button>
        </div>
      </div>

      {mostrarForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Configurar Cobrança Automática</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="responsavelId" className="block text-sm font-medium text-black mb-2">
                Responsável *
              </label>
              <select
                id="responsavelId"
                value={formData.responsavelId}
                onChange={(e) => setFormData({ ...formData, responsavelId: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Selecione um responsável</option>
                {responsaveis.map((resp: any) => (
                  <option key={resp.id} value={resp.id}>
                    {resp.nome} - R$ {resp.valorMensal.toFixed(2).replace('.', ',')}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="valor" className="block text-sm font-medium text-black mb-2">
                  Valor *
                </label>
                <input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="input-field"
                  placeholder="0,00"
                  required
                />
              </div>
              <div>
                <label htmlFor="diaVencimento" className="block text-sm font-medium text-black mb-2">
                  Dia do Vencimento *
                </label>
                <input
                  id="diaVencimento"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.diaVencimento}
                  onChange={(e) => setFormData({ ...formData, diaVencimento: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-black mb-2">
                  Tipo de Pagamento *
                </label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value as CobrancaAutomatica['tipo'] })
                  }
                  className="input-field"
                  required
                >
                  <option value="PIX">PIX</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Cartão">Cartão</option>
                </select>
              </div>
              <div>
                <label htmlFor="dataInicio" className="block text-sm font-medium text-black mb-2">
                  Data de Início *
                </label>
                <input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="dataFim" className="block text-sm font-medium text-black mb-2">
                Data de Fim (opcional)
              </label>
              <input
                id="dataFim"
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                className="input-field"
              />
              <p className="text-xs text-gray-dark mt-1">
                Deixe em branco para cobrança indefinida
              </p>
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-black mb-2">
                Descrição
              </label>
              <input
                id="descricao"
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="input-field"
                placeholder="Ex: Mensalidade - PIX"
              />
            </div>

            <button type="submit" className="btn-primary">
              Configurar Cobrança Automática
            </button>
          </form>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-medium">
          <h3 className="text-lg font-semibold text-black">
            Cobranças Automáticas Configuradas ({cobrancas.length})
          </h3>
        </div>
        {cobrancas.length === 0 ? (
          <div className="p-12 text-center text-gray-dark">
            <p>Nenhuma cobrança automática configurada.</p>
            <p className="text-sm mt-2">Clique em "Nova Cobrança Automática" para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-light border-b border-gray-medium">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Responsável</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Dia Vencimento</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Período</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
                </tr>
              </thead>
              <tbody>
                {cobrancas.map((cobranca) => (
                  <tr
                    key={cobranca.id}
                    className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-black font-medium">{cobranca.responsavelNome}</td>
                    <td className="px-6 py-4 text-sm font-medium text-black">
                      R$ {cobranca.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-dark">Dia {cobranca.diaVencimento}</td>
                    <td className="px-6 py-4 text-sm text-gray-dark">{cobranca.tipo}</td>
                    <td className="px-6 py-4 text-sm text-gray-dark">
                      {new Date(cobranca.dataInicio).toLocaleDateString('pt-BR')}
                      {cobranca.dataFim && ` até ${new Date(cobranca.dataFim).toLocaleDateString('pt-BR')}`}
                      {!cobranca.dataFim && ' (indefinido)'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => toggleCobranca(cobranca.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cobranca.ativa
                            ? 'bg-black text-white'
                            : 'bg-gray-light text-gray-dark'
                        }`}
                      >
                        {cobranca.ativa ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(cobranca.id)}
                        className="text-gray-dark hover:text-black font-medium"
                      >
                        Excluir
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

