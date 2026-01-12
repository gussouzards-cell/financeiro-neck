import { useState, useEffect } from 'react'

interface Contrato {
  id: string
  alunoId: string
  alunoNome: string
  responsavelId: string
  responsavelNome: string
  tipo: 'Anual' | 'Semestral' | 'Mensal'
  valorTotal: number
  valorParcela: number
  quantidadeParcelas: number
  dataInicio: string
  dataFim: string
  status: 'Ativo' | 'Encerrado' | 'Cancelado'
  desconto?: number
  observacoes?: string
  dataCriacao: string
}

export default function Contratos() {
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [formData, setFormData] = useState({
    alunoId: '',
    responsavelId: '',
    tipo: 'Mensal' as Contrato['tipo'],
    valorTotal: '',
    quantidadeParcelas: '12',
    dataInicio: new Date().toISOString().split('T')[0],
    desconto: '',
    observacoes: '',
  })

  useEffect(() => {
    // Carregar contratos do localStorage
    const contratosSalvos = JSON.parse(localStorage.getItem('contratos') || '[]')
    setContratos(contratosSalvos)
  }, [])

  // Carregar alunos e responsáveis
  const alunos = JSON.parse(localStorage.getItem('alunos') || '[]')
  const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')

  const calcularValorParcela = (valorTotal: number, quantidadeParcelas: number, desconto: number = 0) => {
    const valorComDesconto = valorTotal - desconto
    return valorComDesconto / quantidadeParcelas
  }

  const calcularDataFim = (dataInicio: string, tipo: Contrato['tipo']) => {
    const inicio = new Date(dataInicio)
    const fim = new Date(inicio)

    switch (tipo) {
      case 'Anual':
        fim.setFullYear(fim.getFullYear() + 1)
        break
      case 'Semestral':
        fim.setMonth(fim.getMonth() + 6)
        break
      case 'Mensal':
        fim.setMonth(fim.getMonth() + 1)
        break
    }

    return fim.toISOString().split('T')[0]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const aluno = alunos.find((a: any) => a.id === formData.alunoId)
    const responsavel = responsaveis.find((r: any) => r.id === formData.responsavelId)

    if (!aluno || !responsavel) {
      alert('Aluno ou responsável não encontrado')
      return
    }

    const valorTotal = parseFloat(formData.valorTotal)
    const desconto = parseFloat(formData.desconto) || 0
    const quantidadeParcelas = parseInt(formData.quantidadeParcelas)
    const valorParcela = calcularValorParcela(valorTotal, quantidadeParcelas, desconto)
    const dataFim = calcularDataFim(formData.dataInicio, formData.tipo)

    const novoContrato: Contrato = {
      id: `CT${Date.now()}`,
      alunoId: formData.alunoId,
      alunoNome: aluno.nome,
      responsavelId: formData.responsavelId,
      responsavelNome: responsavel.nome,
      tipo: formData.tipo,
      valorTotal,
      valorParcela,
      quantidadeParcelas,
      dataInicio: formData.dataInicio,
      dataFim,
      status: 'Ativo',
      desconto: desconto > 0 ? desconto : undefined,
      observacoes: formData.observacoes || undefined,
      dataCriacao: new Date().toISOString(),
    }

    const novosContratos = [...contratos, novoContrato]
    setContratos(novosContratos)
    localStorage.setItem('contratos', JSON.stringify(novosContratos))

    // Resetar formulário
    setFormData({
      alunoId: '',
      responsavelId: '',
      tipo: 'Mensal',
      valorTotal: '',
      quantidadeParcelas: '12',
      dataInicio: new Date().toISOString().split('T')[0],
      desconto: '',
      observacoes: '',
    })
    setMostrarForm(false)
    alert('Contrato criado com sucesso!')
  }

  const handleAlterarStatus = (id: string, novoStatus: Contrato['status']) => {
    const novosContratos = contratos.map((c) =>
      c.id === id ? { ...c, status: novoStatus } : c
    )
    setContratos(novosContratos)
    localStorage.setItem('contratos', JSON.stringify(novosContratos))
  }

  const contratosFiltrados = contratos.filter((c) => {
    const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus
    const matchTipo = filtroTipo === 'todos' || c.tipo === filtroTipo
    return matchStatus && matchTipo
  })

  const valorParcelaCalculado =
    formData.valorTotal && formData.quantidadeParcelas
      ? calcularValorParcela(
          parseFloat(formData.valorTotal),
          parseInt(formData.quantidadeParcelas),
          parseFloat(formData.desconto) || 0
        )
      : 0

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-semibold text-black mb-2">Contratos e Planos</h2>
          <p className="text-gray-dark">Gerencie contratos e planos de pagamento dos alunos</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
          {mostrarForm ? 'Cancelar' : '+ Novo Contrato'}
        </button>
      </div>

      {mostrarForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Criar Novo Contrato</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="alunoId" className="block text-sm font-medium text-black mb-2">
                  Aluno *
                </label>
                <select
                  id="alunoId"
                  value={formData.alunoId}
                  onChange={(e) => {
                    setFormData({ ...formData, alunoId: e.target.value })
                    // Auto-selecionar responsável do aluno
                    const alunoSelecionado = alunos.find((a: any) => a.id === e.target.value)
                    if (alunoSelecionado) {
                      setFormData((prev) => ({ ...prev, responsavelId: alunoSelecionado.responsavelId }))
                    }
                  }}
                  className="input-field"
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map((aluno: any) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome} - {aluno.turma}
                    </option>
                  ))}
                </select>
              </div>
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
                      {resp.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-black mb-2">
                  Tipo de Plano *
                </label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) => {
                    const tipo = e.target.value as Contrato['tipo']
                    setFormData({ ...formData, tipo })
                    // Ajustar quantidade de parcelas baseado no tipo
                    if (tipo === 'Anual') {
                      setFormData((prev) => ({ ...prev, quantidadeParcelas: '12' }))
                    } else if (tipo === 'Semestral') {
                      setFormData((prev) => ({ ...prev, quantidadeParcelas: '6' }))
                    } else {
                      setFormData((prev) => ({ ...prev, quantidadeParcelas: '1' }))
                    }
                  }}
                  className="input-field"
                  required
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>
              <div>
                <label htmlFor="valorTotal" className="block text-sm font-medium text-black mb-2">
                  Valor Total *
                </label>
                <input
                  id="valorTotal"
                  type="number"
                  step="0.01"
                  value={formData.valorTotal}
                  onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                  className="input-field"
                  placeholder="0,00"
                  required
                />
              </div>
              <div>
                <label htmlFor="quantidadeParcelas" className="block text-sm font-medium text-black mb-2">
                  Quantidade de Parcelas *
                </label>
                <input
                  id="quantidadeParcelas"
                  type="number"
                  min="1"
                  value={formData.quantidadeParcelas}
                  onChange={(e) => setFormData({ ...formData, quantidadeParcelas: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="desconto" className="block text-sm font-medium text-black mb-2">
                  Desconto (R$)
                </label>
                <input
                  id="desconto"
                  type="number"
                  step="0.01"
                  value={formData.desconto}
                  onChange={(e) => setFormData({ ...formData, desconto: e.target.value })}
                  className="input-field"
                  placeholder="0,00"
                />
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

            {valorParcelaCalculado > 0 && (
              <div className="card bg-gray-light">
                <p className="text-sm text-gray-dark mb-1">Valor da parcela:</p>
                <p className="text-2xl font-semibold text-black">
                  R$ {valorParcelaCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-black mb-2">
                Observações
              </label>
              <textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="input-field min-h-[100px] resize-none"
                placeholder="Observações sobre o contrato..."
              />
            </div>

            <button type="submit" className="btn-primary">
              Criar Contrato
            </button>
          </form>
        </div>
      )}

      {/* Filtros */}
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
              <option value="Ativo">Ativo</option>
              <option value="Encerrado">Encerrado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              <option value="Mensal">Mensal</option>
              <option value="Semestral">Semestral</option>
              <option value="Anual">Anual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de contratos */}
      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-medium">
          <h3 className="text-lg font-semibold text-black">
            Contratos ({contratosFiltrados.length})
          </h3>
        </div>
        {contratosFiltrados.length === 0 ? (
          <div className="p-12 text-center text-gray-dark">
            <p>Nenhum contrato encontrado.</p>
            <p className="text-sm mt-2">Clique em "Novo Contrato" para começar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-light border-b border-gray-medium">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Aluno</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Responsável</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Tipo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor Total</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Parcela</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Período</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
                </tr>
              </thead>
              <tbody>
                {contratosFiltrados.map((contrato) => (
                  <tr
                    key={contrato.id}
                    className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-black font-medium">{contrato.alunoNome}</td>
                    <td className="px-6 py-4 text-sm text-gray-dark">{contrato.responsavelNome}</td>
                    <td className="px-6 py-4 text-sm text-gray-dark">{contrato.tipo}</td>
                    <td className="px-6 py-4 text-sm font-medium text-black">
                      R$ {contrato.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {contrato.desconto && (
                        <span className="text-xs text-gray-dark block">
                          (Desconto: R$ {contrato.desconto.toFixed(2).replace('.', ',')})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-dark">
                      R$ {contrato.valorParcela.toFixed(2).replace('.', ',')} ({contrato.quantidadeParcelas}x)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-dark">
                      {new Date(contrato.dataInicio).toLocaleDateString('pt-BR')} até{' '}
                      {new Date(contrato.dataFim).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contrato.status === 'Ativo'
                            ? 'bg-black text-white'
                            : contrato.status === 'Encerrado'
                            ? 'bg-gray-light text-black'
                            : 'bg-white border border-gray-medium text-gray-dark'
                        }`}
                      >
                        {contrato.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={contrato.status}
                        onChange={(e) =>
                          handleAlterarStatus(contrato.id, e.target.value as Contrato['status'])
                        }
                        className="text-xs border border-gray-medium rounded px-2 py-1"
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Encerrado">Encerrado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
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

