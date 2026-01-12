import { useState } from 'react'

interface Aluno {
  id: string
  nome: string
  dataNascimento: string
  turma: string
  responsavelId: string // Responsável principal (para compatibilidade)
  responsaveisIds: string[] // Múltiplos responsáveis
}

interface Responsavel {
  id: string
  nome: string
  email: string
  telefone: string
  whatsapp: string
  cpf: string
  statusFinanceiro: 'Pagante' | 'Não pagante' | 'Bolsa parcial' | 'Bolsa integral'
  valorMensal: number
  preferenciaPagamento: 'PIX' | 'Boleto' | 'Cartão'
}

export default function Cadastro() {
  const [abaAtiva, setAbaAtiva] = useState<'aluno' | 'responsavel'>('aluno')
  const [mostrarForm, setMostrarForm] = useState(false)

  // Estados do formulário de aluno
  const [formAluno, setFormAluno] = useState({
    nome: '',
    dataNascimento: '',
    turma: '',
    responsavelId: '', // Responsável principal
    responsaveisIds: [] as string[], // Múltiplos responsáveis
  })

  // Estados do formulário de responsável
  const [formResponsavel, setFormResponsavel] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    cpf: '',
    statusFinanceiro: 'Pagante' as Responsavel['statusFinanceiro'],
    valorMensal: '',
    preferenciaPagamento: 'PIX' as Responsavel['preferenciaPagamento'],
  })

  // Carregar responsáveis do localStorage
  const responsaveis: Responsavel[] = JSON.parse(
    localStorage.getItem('responsaveis') || '[]'
  )

  // Carregar alunos do localStorage
  const alunos: Aluno[] = JSON.parse(localStorage.getItem('alunos') || '[]')

  const handleSubmitAluno = (e: React.FormEvent) => {
    e.preventDefault()
    
    const novoAluno: Aluno = {
      id: `AL${Date.now()}`,
      nome: formAluno.nome,
      dataNascimento: formAluno.dataNascimento,
      turma: formAluno.turma,
      responsavelId: formAluno.responsavelId, // Primeiro responsável como principal
      responsaveisIds: formAluno.responsaveisIds.length > 0 
        ? formAluno.responsaveisIds 
        : [formAluno.responsavelId], // Incluir principal se não houver outros
    }

    const novosAlunos = [...alunos, novoAluno]
    localStorage.setItem('alunos', JSON.stringify(novosAlunos))

    // Resetar formulário
    setFormAluno({
      nome: '',
      dataNascimento: '',
      turma: '',
      responsavelId: '',
      responsaveisIds: [],
    })
    setMostrarForm(false)
    alert('Aluno cadastrado com sucesso!')
  }

  const handleSubmitResponsavel = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar WhatsApp (remover formatação)
    const whatsappLimpo = formResponsavel.whatsapp.replace(/\D/g, '')

    const novoResponsavel: Responsavel = {
      id: `RES${Date.now()}`,
      nome: formResponsavel.nome,
      email: formResponsavel.email,
      telefone: formResponsavel.telefone,
      whatsapp: whatsappLimpo,
      cpf: formResponsavel.cpf,
      statusFinanceiro: formResponsavel.statusFinanceiro,
      valorMensal: parseFloat(formResponsavel.valorMensal) || 0,
      preferenciaPagamento: formResponsavel.preferenciaPagamento,
    }

    const novosResponsaveis = [...responsaveis, novoResponsavel]
    localStorage.setItem('responsaveis', JSON.stringify(novosResponsaveis))

    // Resetar formulário
    setFormResponsavel({
      nome: '',
      email: '',
      telefone: '',
      whatsapp: '',
      cpf: '',
      statusFinanceiro: 'Pagante',
      valorMensal: '',
      preferenciaPagamento: 'PIX',
    })
    setMostrarForm(false)
    alert('Responsável cadastrado com sucesso!')
  }

  const handleDeleteAluno = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      const novosAlunos = alunos.filter((a) => a.id !== id)
      localStorage.setItem('alunos', JSON.stringify(novosAlunos))
    }
  }

  const handleDeleteResponsavel = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este responsável?')) {
      const novosResponsaveis = responsaveis.filter((r) => r.id !== id)
      localStorage.setItem('responsaveis', JSON.stringify(novosResponsaveis))
      
      // Remover alunos associados
      const alunosAtualizados = alunos.filter((a) => a.responsavelId !== id)
      localStorage.setItem('alunos', JSON.stringify(alunosAtualizados))
    }
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-semibold text-black mb-2">Cadastro</h2>
          <p className="text-gray-dark">Gerencie alunos e responsáveis</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="btn-primary"
        >
          {mostrarForm ? 'Cancelar' : `+ Novo ${abaAtiva === 'aluno' ? 'Aluno' : 'Responsável'}`}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-3 border-b border-gray-medium">
        <button
          onClick={() => {
            setAbaAtiva('aluno')
            setMostrarForm(false)
          }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            abaAtiva === 'aluno'
              ? 'border-black text-black'
              : 'border-transparent text-gray-dark hover:text-black'
          }`}
        >
          Alunos
        </button>
        <button
          onClick={() => {
            setAbaAtiva('responsavel')
            setMostrarForm(false)
          }}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            abaAtiva === 'responsavel'
              ? 'border-black text-black'
              : 'border-transparent text-gray-dark hover:text-black'
          }`}
        >
          Responsáveis
        </button>
      </div>

      {/* Formulário de Cadastro */}
      {mostrarForm && (
        <div className="card mb-6">
          {abaAtiva === 'aluno' ? (
            <>
              <h3 className="text-lg font-semibold text-black mb-4">Cadastrar Novo Aluno</h3>
              <form onSubmit={handleSubmitAluno} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nomeAluno" className="block text-sm font-medium text-black mb-2">
                      Nome do Aluno *
                    </label>
                    <input
                      id="nomeAluno"
                      type="text"
                      value={formAluno.nome}
                      onChange={(e) => setFormAluno({ ...formAluno, nome: e.target.value })}
                      className="input-field"
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="dataNascimento" className="block text-sm font-medium text-black mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      id="dataNascimento"
                      type="date"
                      value={formAluno.dataNascimento}
                      onChange={(e) => setFormAluno({ ...formAluno, dataNascimento: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="turma" className="block text-sm font-medium text-black mb-2">
                      Turma *
                    </label>
                    <input
                      id="turma"
                      type="text"
                      value={formAluno.turma}
                      onChange={(e) => setFormAluno({ ...formAluno, turma: e.target.value })}
                      className="input-field"
                      placeholder="Ex: 1º Ano A, 2º Ano B"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="responsavelId" className="block text-sm font-medium text-black mb-2">
                      Responsável Principal *
                    </label>
                    <select
                      id="responsavelId"
                      value={formAluno.responsavelId}
                      onChange={(e) => {
                        const novoPrincipal = e.target.value
                        setFormAluno({
                          ...formAluno,
                          responsavelId: novoPrincipal,
                          // Adicionar principal aos responsáveis se não estiver
                          responsaveisIds: formAluno.responsaveisIds.includes(novoPrincipal)
                            ? formAluno.responsaveisIds
                            : [...formAluno.responsaveisIds, novoPrincipal],
                        })
                      }}
                      className="input-field"
                      required
                    >
                      <option value="">Selecione um responsável principal</option>
                      {responsaveis.map((resp) => (
                        <option key={resp.id} value={resp.id}>
                          {resp.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Outros Responsáveis
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-medium rounded-card p-3">
                      {responsaveis.map((resp) => (
                        <label key={resp.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formAluno.responsaveisIds.includes(resp.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormAluno({
                                  ...formAluno,
                                  responsaveisIds: [...formAluno.responsaveisIds, resp.id],
                                })
                              } else {
                                setFormAluno({
                                  ...formAluno,
                                  responsaveisIds: formAluno.responsaveisIds.filter((id) => id !== resp.id),
                                })
                              }
                            }}
                            disabled={resp.id === formAluno.responsavelId}
                            className="w-4 h-4 border-gray-medium rounded text-black focus:ring-black"
                          />
                          <span className="text-sm text-gray-dark">
                            {resp.nome}
                            {resp.id === formAluno.responsavelId && ' (Principal)'}
                          </span>
                        </label>
                      ))}
                    </div>
                    {formAluno.responsaveisIds.length > 0 && (
                      <p className="text-xs text-gray-dark mt-2">
                        {formAluno.responsaveisIds.length} responsável(is) selecionado(s)
                      </p>
                    )}
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Cadastrar Aluno
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-black mb-4">Cadastrar Novo Responsável</h3>
              <form onSubmit={handleSubmitResponsavel} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nomeResponsavel" className="block text-sm font-medium text-black mb-2">
                      Nome Completo *
                    </label>
                    <input
                      id="nomeResponsavel"
                      type="text"
                      value={formResponsavel.nome}
                      onChange={(e) => setFormResponsavel({ ...formResponsavel, nome: e.target.value })}
                      className="input-field"
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-black mb-2">
                      CPF *
                    </label>
                    <input
                      id="cpf"
                      type="text"
                      value={formResponsavel.cpf}
                      onChange={(e) => setFormResponsavel({ ...formResponsavel, cpf: e.target.value })}
                      className="input-field"
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formResponsavel.email}
                      onChange={(e) => setFormResponsavel({ ...formResponsavel, email: e.target.value })}
                      className="input-field"
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-black mb-2">
                      Telefone *
                    </label>
                    <input
                      id="telefone"
                      type="text"
                      value={formResponsavel.telefone}
                      onChange={(e) => setFormResponsavel({ ...formResponsavel, telefone: e.target.value })}
                      className="input-field"
                      placeholder="(11) 98765-4321"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-black mb-2">
                    WhatsApp (para cobranças) *
                  </label>
                  <input
                    id="whatsapp"
                    type="text"
                    value={formResponsavel.whatsapp}
                    onChange={(e) => setFormResponsavel({ ...formResponsavel, whatsapp: e.target.value })}
                    className="input-field"
                    placeholder="5511987654321 (com DDD e código do país)"
                    required
                  />
                  <p className="text-xs text-gray-dark mt-1">
                    Formato: 5511987654321 (sem espaços, parênteses ou hífens)
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="statusFinanceiro" className="block text-sm font-medium text-black mb-2">
                      Status Financeiro *
                    </label>
                    <select
                      id="statusFinanceiro"
                      value={formResponsavel.statusFinanceiro}
                      onChange={(e) =>
                        setFormResponsavel({
                          ...formResponsavel,
                          statusFinanceiro: e.target.value as Responsavel['statusFinanceiro'],
                        })
                      }
                      className="input-field"
                      required
                    >
                      <option value="Pagante">Pagante</option>
                      <option value="Não pagante">Não pagante</option>
                      <option value="Bolsa parcial">Bolsa parcial</option>
                      <option value="Bolsa integral">Bolsa integral</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="valorMensal" className="block text-sm font-medium text-black mb-2">
                      Valor Mensal *
                    </label>
                    <input
                      id="valorMensal"
                      type="number"
                      step="0.01"
                      value={formResponsavel.valorMensal}
                      onChange={(e) => setFormResponsavel({ ...formResponsavel, valorMensal: e.target.value })}
                      className="input-field"
                      placeholder="0,00"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="preferenciaPagamento" className="block text-sm font-medium text-black mb-2">
                      Preferência de Pagamento *
                    </label>
                    <select
                      id="preferenciaPagamento"
                      value={formResponsavel.preferenciaPagamento}
                      onChange={(e) =>
                        setFormResponsavel({
                          ...formResponsavel,
                          preferenciaPagamento: e.target.value as Responsavel['preferenciaPagamento'],
                        })
                      }
                      className="input-field"
                      required
                    >
                      <option value="PIX">PIX</option>
                      <option value="Boleto">Boleto</option>
                      <option value="Cartão">Cartão</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Cadastrar Responsável
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Lista de Alunos */}
      {abaAtiva === 'aluno' && (
        <div className="card p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-medium">
            <h3 className="text-lg font-semibold text-black">Alunos Cadastrados ({alunos.length})</h3>
          </div>
          {alunos.length === 0 ? (
            <div className="p-12 text-center text-gray-dark">
              <p>Nenhum aluno cadastrado ainda.</p>
              <p className="text-sm mt-2">Clique em "Novo Aluno" para começar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-light border-b border-gray-medium">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Nome</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Data de Nascimento</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Turma</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Responsável</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((aluno) => {
                    const responsavelPrincipal = responsaveis.find((r) => r.id === aluno.responsavelId)
                    const outrosResponsaveis = aluno.responsaveisIds
                      ?.filter((id) => id !== aluno.responsavelId)
                      .map((id) => responsaveis.find((r) => r.id === id))
                      .filter(Boolean) || []
                    
                    return (
                      <tr
                        key={aluno.id}
                        className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-black font-medium">{aluno.nome}</td>
                        <td className="px-6 py-4 text-sm text-gray-dark">
                          {new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-dark">{aluno.turma}</td>
                        <td className="px-6 py-4 text-sm text-black">
                          <div>
                            <p className="font-medium">
                              {responsavelPrincipal ? responsavelPrincipal.nome : 'Não encontrado'}
                              {responsavelPrincipal && <span className="text-xs text-gray-dark ml-1">(Principal)</span>}
                            </p>
                            {outrosResponsaveis.length > 0 && (
                              <p className="text-xs text-gray-dark mt-1">
                                + {outrosResponsaveis.length} outro(s)
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDeleteAluno(aluno.id)}
                            className="text-gray-dark hover:text-black font-medium"
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Lista de Responsáveis */}
      {abaAtiva === 'responsavel' && (
        <div className="card p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-medium">
            <h3 className="text-lg font-semibold text-black">Responsáveis Cadastrados ({responsaveis.length})</h3>
          </div>
          {responsaveis.length === 0 ? (
            <div className="p-12 text-center text-gray-dark">
              <p>Nenhum responsável cadastrado ainda.</p>
              <p className="text-sm mt-2">Clique em "Novo Responsável" para começar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-light border-b border-gray-medium">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Nome</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Telefone</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor Mensal</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
                  </tr>
                </thead>
                <tbody>
                  {responsaveis.map((responsavel) => {
                    const alunosDoResponsavel = alunos.filter((a) => a.responsavelId === responsavel.id)
                    return (
                      <tr
                        key={responsavel.id}
                        className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-black font-medium">{responsavel.nome}</td>
                        <td className="px-6 py-4 text-sm text-gray-dark">{responsavel.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-dark">{responsavel.telefone}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-light text-black">
                            {responsavel.statusFinanceiro}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-black">
                          R$ {responsavel.valorMensal.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-3">
                            <span className="text-xs text-gray-dark">
                              {alunosDoResponsavel.length} {alunosDoResponsavel.length === 1 ? 'aluno' : 'alunos'}
                            </span>
                            <button
                              onClick={() => handleDeleteResponsavel(responsavel.id)}
                              className="text-gray-dark hover:text-black font-medium"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

