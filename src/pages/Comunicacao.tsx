import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface Comunicacao {
  id: string
  responsavelId: string
  responsavelNome: string
  tipo: 'WhatsApp' | 'Email' | 'Telefone' | 'Presencial'
  assunto: string
  mensagem: string
  data: string
  status: 'Enviada' | 'Recebida' | 'Lida' | 'Respondida'
  usuario: string
  anexos?: string[]
}

export default function Comunicacao() {
  const [comunicacoes, setComunicacoes] = useState<Comunicacao[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')
  const [formData, setFormData] = useState({
    responsavelId: '',
    tipo: 'WhatsApp' as Comunicacao['tipo'],
    assunto: '',
    mensagem: '',
  })

  useEffect(() => {
    // Carregar comunicações do localStorage
    const comunicacoesSalvas = JSON.parse(localStorage.getItem('comunicacoes') || '[]')
    setComunicacoes(comunicacoesSalvas)
  }, [])

  // Carregar responsáveis
  const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
  const { user } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const responsavel = responsaveis.find((r: any) => r.id === formData.responsavelId)

    if (!responsavel) {
      alert('Responsável não encontrado')
      return
    }

    const novaComunicacao: Comunicacao = {
      id: `COM${Date.now()}`,
      responsavelId: formData.responsavelId,
      responsavelNome: responsavel.nome,
      tipo: formData.tipo,
      assunto: formData.assunto,
      mensagem: formData.mensagem,
      data: new Date().toISOString(),
      status: 'Enviada',
      usuario: user?.name || 'Sistema',
    }

    const novasComunicacoes = [novaComunicacao, ...comunicacoes]
    setComunicacoes(novasComunicacoes)
    localStorage.setItem('comunicacoes', JSON.stringify(novasComunicacoes))

    // Resetar formulário
    setFormData({
      responsavelId: '',
      tipo: 'WhatsApp',
      assunto: '',
      mensagem: '',
    })
    setMostrarForm(false)
    alert('Comunicação registrada com sucesso!')
  }

  const handleAlterarStatus = (id: string, novoStatus: Comunicacao['status']) => {
    const novasComunicacoes = comunicacoes.map((c) =>
      c.id === id ? { ...c, status: novoStatus } : c
    )
    setComunicacoes(novasComunicacoes)
    localStorage.setItem('comunicacoes', JSON.stringify(novasComunicacoes))
  }

  const comunicacoesFiltradas = comunicacoes.filter((c) => {
    const matchTipo = filtroTipo === 'todos' || c.tipo === filtroTipo
    const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus
    return matchTipo && matchStatus
  })

  const gerarLinkWhatsApp = (comunicacao: Comunicacao) => {
    const responsavel = responsaveis.find((r: any) => r.id === comunicacao.responsavelId)
    if (!responsavel) return '#'

    const mensagem = encodeURIComponent(comunicacao.mensagem)
    return `https://wa.me/${responsavel.whatsapp}?text=${mensagem}`
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-semibold text-black mb-2">Histórico de Comunicação</h2>
          <p className="text-gray-dark">Registre e acompanhe todas as comunicações com responsáveis</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
          {mostrarForm ? 'Cancelar' : '+ Nova Comunicação'}
        </button>
      </div>

      {mostrarForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Registrar Nova Comunicação</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-black mb-2">
                  Tipo de Comunicação *
                </label>
                <select
                  id="tipo"
                  value={formData.tipo}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo: e.target.value as Comunicacao['tipo'] })
                  }
                  className="input-field"
                  required
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Telefone">Telefone</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="assunto" className="block text-sm font-medium text-black mb-2">
                Assunto *
              </label>
              <input
                id="assunto"
                type="text"
                value={formData.assunto}
                onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                className="input-field"
                placeholder="Ex: Cobrança pendente, Renegociação, etc."
                required
              />
            </div>

            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-black mb-2">
                Mensagem / Observações *
              </label>
              <textarea
                id="mensagem"
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                className="input-field min-h-[150px] resize-none"
                placeholder="Descreva a comunicação realizada..."
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Registrar Comunicação
            </button>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="Telefone">Telefone</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Status</label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              <option value="Enviada">Enviada</option>
              <option value="Recebida">Recebida</option>
              <option value="Lida">Lida</option>
              <option value="Respondida">Respondida</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de comunicações */}
      <div className="space-y-4">
        {comunicacoesFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-dark">Nenhuma comunicação registrada.</p>
            <p className="text-sm mt-2">Clique em "Nova Comunicação" para começar.</p>
          </div>
        ) : (
          comunicacoesFiltradas
            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
            .map((comunicacao) => (
              <div key={comunicacao.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          comunicacao.tipo === 'WhatsApp'
                            ? 'bg-black text-white'
                            : comunicacao.tipo === 'Email'
                            ? 'bg-gray-light text-black'
                            : comunicacao.tipo === 'Telefone'
                            ? 'bg-gray-medium text-black'
                            : 'bg-white border border-gray-medium text-black'
                        }`}
                      >
                        {comunicacao.tipo}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          comunicacao.status === 'Respondida'
                            ? 'bg-gray-light text-black'
                            : comunicacao.status === 'Lida'
                            ? 'bg-black text-white'
                            : 'bg-white border border-gray-medium text-gray-dark'
                        }`}
                      >
                        {comunicacao.status}
                      </span>
                    </div>
                    <p className="font-semibold text-black mb-1">{comunicacao.assunto}</p>
                    <p className="text-sm text-gray-dark mb-2">
                      {comunicacao.responsavelNome} • {new Date(comunicacao.data).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-black">{comunicacao.mensagem}</p>
                    <p className="text-xs text-gray-dark mt-2">Registrado por: {comunicacao.usuario}</p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {comunicacao.tipo === 'WhatsApp' && (
                      <a
                        href={gerarLinkWhatsApp(comunicacao)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-black hover:underline font-medium"
                      >
                        Abrir WhatsApp →
                      </a>
                    )}
                    <select
                      value={comunicacao.status}
                      onChange={(e) =>
                        handleAlterarStatus(comunicacao.id, e.target.value as Comunicacao['status'])
                      }
                      className="text-xs border border-gray-medium rounded px-2 py-1"
                    >
                      <option value="Enviada">Enviada</option>
                      <option value="Recebida">Recebida</option>
                      <option value="Lida">Lida</option>
                      <option value="Respondida">Respondida</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

