import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

type StatusFinanceiro = 'Pagante' | 'Não pagante' | 'Bolsa parcial' | 'Bolsa integral'
type Situacao = 'Em dia' | 'Atrasado'

interface Aluno {
  id: string
  aluno: string
  responsavel: string
  responsavelId: string
  statusFinanceiro: StatusFinanceiro
  valorMensal: number
  situacao: Situacao
}

interface ResponsavelStorage {
  id: string
  nome: string
  statusFinanceiro: StatusFinanceiro
  valorMensal: number
}

interface AlunoStorage {
  id: string
  nome: string
  responsavelId: string
}

export default function AlunosResponsaveis() {
  const [filter, setFilter] = useState<string>('todos')
  const [alunos, setAlunos] = useState<Aluno[]>([])

  useEffect(() => {
    // Carregar alunos e responsáveis do localStorage
    const alunosStorage: AlunoStorage[] = JSON.parse(localStorage.getItem('alunos') || '[]')
    const responsaveisStorage: ResponsavelStorage[] = JSON.parse(
      localStorage.getItem('responsaveis') || '[]'
    )

    // Carregar cobranças para calcular situação
    const cobrancas = JSON.parse(localStorage.getItem('cobrancas') || '[]')
    
    // Combinar dados
    const alunosCombinados: Aluno[] = alunosStorage.map((aluno) => {
      const responsavel = responsaveisStorage.find((r) => r.id === aluno.responsavelId)
      
      // Calcular situação baseado em cobranças pendentes
      const cobrancasPendentes = cobrancas.filter(
        (c: any) => c.responsavelId === aluno.responsavelId && c.status === 'Pendente'
      )
      const temAtraso = cobrancasPendentes.some((c: any) => {
        const vencimento = new Date(c.vencimento)
        const hoje = new Date()
        return vencimento < hoje
      })
      
      return {
        id: aluno.id,
        aluno: aluno.nome,
        responsavel: responsavel?.nome || 'Não encontrado',
        responsavelId: aluno.responsavelId,
        statusFinanceiro: responsavel?.statusFinanceiro || 'Pagante',
        valorMensal: responsavel?.valorMensal || 0,
        situacao: temAtraso ? 'Atrasado' : 'Em dia',
      }
    })

    setAlunos(alunosCombinados)
  }, [])

  const filteredAlunos =
    filter === 'todos'
      ? alunos
      : alunos.filter((a) => {
          if (filter === 'pagantes') return a.statusFinanceiro === 'Pagante'
          if (filter === 'nao-pagantes') return a.statusFinanceiro === 'Não pagante'
          if (filter === 'bolsas') return a.statusFinanceiro.includes('Bolsa')
          if (filter === 'atrasados') return a.situacao === 'Atrasado'
          return true
        })

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Alunos & Responsáveis</h2>
        <p className="text-gray-dark">Gestão completa de alunos e seus responsáveis financeiros</p>
      </div>

      <div className="mb-6 flex gap-3 flex-wrap">
        <button
          onClick={() => setFilter('todos')}
          className={filter === 'todos' ? 'pill-button-active' : 'pill-button'}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('pagantes')}
          className={filter === 'pagantes' ? 'pill-button-active' : 'pill-button'}
        >
          Pagantes
        </button>
        <button
          onClick={() => setFilter('nao-pagantes')}
          className={filter === 'nao-pagantes' ? 'pill-button-active' : 'pill-button'}
        >
          Não pagantes
        </button>
        <button
          onClick={() => setFilter('bolsas')}
          className={filter === 'bolsas' ? 'pill-button-active' : 'pill-button'}
        >
          Bolsas
        </button>
        <button
          onClick={() => setFilter('atrasados')}
          className={filter === 'atrasados' ? 'pill-button-active' : 'pill-button'}
        >
          Atrasados
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light border-b border-gray-medium">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Aluno</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Responsável</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Status financeiro</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor mensal</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Situação</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAlunos.map((aluno) => (
                <tr
                  key={aluno.id}
                  className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-black">{aluno.aluno}</td>
                  <td className="px-6 py-4 text-sm text-black">{aluno.responsavel}</td>
                  <td className="px-6 py-4 text-sm text-gray-dark">{aluno.statusFinanceiro}</td>
                  <td className="px-6 py-4 text-sm text-black font-medium">
                    {aluno.valorMensal > 0 ? `R$ ${aluno.valorMensal.toFixed(2).replace('.', ',')}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        aluno.situacao === 'Em dia'
                          ? 'bg-gray-light text-black'
                          : 'bg-black text-white'
                      }`}
                    >
                      {aluno.situacao}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      to={`/responsavel/${aluno.id}`}
                      className="text-black hover:underline font-medium"
                    >
                      Ver detalhes
                    </Link>
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

