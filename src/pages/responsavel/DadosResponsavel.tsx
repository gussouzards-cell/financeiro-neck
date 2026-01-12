import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function DadosResponsavel() {
  const { user } = useAuth()
  const [responsavel, setResponsavel] = useState<any>(null)
  const [alunos, setAlunos] = useState<any[]>([])

  useEffect(() => {
    // Carregar dados do responsável
    const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
    const responsavelEncontrado = responsaveis.find((r: any) => r.id === user?.responsavelId)
    setResponsavel(responsavelEncontrado)

    // Carregar alunos do responsável
    const alunosStorage = JSON.parse(localStorage.getItem('alunos') || '[]')
    const alunosDoResponsavel = alunosStorage.filter(
      (a: any) => a.responsavelId === user?.responsavelId
    )
    setAlunos(alunosDoResponsavel)
  }, [user?.responsavelId])

  if (!responsavel) {
    return (
      <div>
        <p className="text-gray-dark">Carregando dados...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Meus Dados</h2>
        <p className="text-gray-dark">Visualize e gerencie suas informações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-black mb-6">Dados Pessoais</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-dark mb-1">Nome completo</p>
              <p className="text-black font-medium">{responsavel.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-dark mb-1">CPF</p>
              <p className="text-black">{responsavel.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-gray-dark mb-1">Email</p>
              <p className="text-black">{responsavel.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-dark mb-1">Telefone</p>
              <p className="text-black">{responsavel.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-dark mb-1">WhatsApp</p>
              <p className="text-black">{responsavel.whatsapp}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-black mb-6">Informações Financeiras</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-dark mb-1">Status financeiro</p>
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
      </div>

      {alunos.length > 0 && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-black mb-6">Alunos Vinculados</h3>
          <div className="space-y-4">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="border border-gray-medium rounded-card p-4">
                <p className="font-semibold text-black mb-1">{aluno.nome}</p>
                <div className="text-sm text-gray-dark space-y-1">
                  <p>Turma: {aluno.turma}</p>
                  <p>
                    Data de nascimento: {new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card mt-6 bg-gray-light">
        <p className="text-sm text-gray-dark">
          <strong className="text-black">Observação:</strong> Para alterar seus dados, entre em
          contato com a secretaria da escola.
        </p>
      </div>
    </div>
  )
}


