import { useState, useEffect } from 'react'
import { getGastos } from '../utils/storage'
import { useAuth } from '../contexts/AuthContext'

interface Gasto {
  id: string
  valor: number
  descricao: string
  data: string
}

export default function Dashboard() {
  const { isCoordenador } = useAuth()
  const [saldoAtual, setSaldoAtual] = useState(0)
  const [totalGastos, setTotalGastos] = useState(0)

  const calcularGastos = () => {
    const gastos: Gasto[] = getGastos()
    const total = gastos.reduce((acc, g) => acc + g.valor, 0)
    setTotalGastos(total)
    // Calcular saldo baseado em recebimentos (mockado por enquanto)
    const totalRecebido = 189450
    setSaldoAtual(totalRecebido - total)
  }

  useEffect(() => {
    calcularGastos()

    // Listener para atualizar quando gastos mudarem
    const handleStorageUpdate = (e: CustomEvent) => {
      if (e.detail.key === 'gastos') {
        calcularGastos()
      }
    }

    window.addEventListener('storage-update', handleStorageUpdate as EventListener)
    return () => {
      window.removeEventListener('storage-update', handleStorageUpdate as EventListener)
    }
  }, [])

  interface StatCard {
    title: string
    value: string
    description: string
    highlight?: boolean
  }

  // Stats base - todos os usuários veem
  const statsBase: StatCard[] = [
    {
      title: 'Total a receber',
      value: 'R$ 245.890,00',
      description: 'Cobranças pendentes',
    },
    {
      title: 'Recebido no mês',
      value: 'R$ 189.450,00',
      description: 'Novembro 2024',
    },
    {
      title: 'Inadimplência',
      value: 'R$ 56.440,00',
      description: '23% do total',
    },
    {
      title: 'Previsão próximos 30 dias',
      value: 'R$ 312.000,00',
      description: 'Baseado em histórico',
    },
  ]

  // Stats que apenas admin vê (não coordenador)
  const statsAdmin: StatCard[] = [
    {
      title: 'Saldo atual',
      value: `R$ ${saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Recebido - Gastos',
      highlight: true,
    },
    {
      title: 'Gastos no mês',
      value: `R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Total de despesas',
    },
  ]

  // Combinar stats baseado no tipo de usuário
  const stats = isCoordenador ? statsBase : [...statsAdmin, ...statsBase]

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-3xl font-semibold text-black mb-2">Dashboard Financeiro</h2>
        <p className="text-gray-dark">Visão geral do financeiro da escola</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`card ${stat.highlight ? 'border-2 border-black' : ''}`}
          >
            <p className="text-sm text-gray-dark mb-2">{stat.title}</p>
            <p className="text-3xl font-semibold text-black mb-1">{stat.value}</p>
            <p className="text-xs text-gray-dark">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-black mb-6">Recebimentos por mês</h3>
          <div className="space-y-4">
            {['Nov', 'Out', 'Set', 'Ago', 'Jul'].map((month, index) => (
              <div key={month} className="flex items-center gap-4">
                <div className="w-16 text-sm text-gray-dark">{month}</div>
                <div className="flex-1 h-8 bg-gray-light rounded-card relative overflow-hidden">
                  <div
                    className="h-full bg-black rounded-card"
                    style={{ width: `${75 - index * 5}%` }}
                  />
                </div>
                <div className="w-24 text-right text-sm font-medium text-black">
                  R$ {180000 - index * 5000},00
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-black mb-6">Status de pagamentos</h3>
          <div className="space-y-4">
            {[
              { label: 'Em dia', value: 156, total: 200 },
              { label: 'Atrasado', value: 32, total: 200 },
              { label: 'Pendente', value: 12, total: 200 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-dark">{item.label}</span>
                  <span className="text-sm font-medium text-black">
                    {item.value} de {item.total}
                  </span>
                </div>
                <div className="h-2 bg-gray-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

