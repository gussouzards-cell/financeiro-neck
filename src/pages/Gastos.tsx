import { useState, useEffect } from 'react'
import { getGastos, saveGastos } from '../utils/storage'

interface Gasto {
  id: string
  valor: number
  descricao: string
  data: string
  categoria: string
}

export default function Gastos() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [formData, setFormData] = useState({
    valor: '',
    descricao: '',
    data: new Date().toISOString().split('T')[0],
    categoria: 'Outros',
  })
  const [filtroCategoria, setFiltroCategoria] = useState('todos')
  const [filtroMes, setFiltroMes] = useState('todos')

  const categorias = [
    'Salários',
    'Material Escolar',
    'Manutenção',
    'Serviços',
    'Alimentação',
    'Transporte',
    'Outros',
  ]

  useEffect(() => {
    // Carregar gastos do localStorage
    const gastosSalvos = getGastos()
    setGastos(gastosSalvos)
  }, [])

  const salvarGastosLocal = (novosGastos: Gasto[]) => {
    setGastos(novosGastos)
    saveGastos(novosGastos)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const novoGasto: Gasto = {
      id: Date.now().toString(),
      valor: parseFloat(formData.valor),
      descricao: formData.descricao,
      data: formData.data,
      categoria: formData.categoria,
    }

    const novosGastos = [...gastos, novoGasto]
    salvarGastosLocal(novosGastos)

    // Resetar formulário
    setFormData({
      valor: '',
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      categoria: 'Outros',
    })
    setMostrarForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este gasto?')) {
      const novosGastos = gastos.filter((g) => g.id !== id)
      salvarGastosLocal(novosGastos)
    }
  }

  const gastosFiltrados = gastos.filter((gasto) => {
    const matchCategoria = filtroCategoria === 'todos' || gasto.categoria === filtroCategoria
    const matchMes =
      filtroMes === 'todos' ||
      new Date(gasto.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) === filtroMes
    return matchCategoria && matchMes
  })

  const totalGastos = gastosFiltrados.reduce((acc, g) => acc + g.valor, 0)

  const gastosPorCategoria = categorias.map((cat) => ({
    categoria: cat,
    total: gastosFiltrados.filter((g) => g.categoria === cat).reduce((acc, g) => acc + g.valor, 0),
  }))

  const mesesDisponiveis = Array.from(
    new Set(
      gastos.map((g) =>
        new Date(g.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      )
    )
  )

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-semibold text-black mb-2">Gestão de Gastos</h2>
          <p className="text-gray-dark">Controle completo de despesas da escola</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-primary">
          {mostrarForm ? 'Cancelar' : '+ Novo gasto'}
        </button>
      </div>

      {mostrarForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Adicionar novo gasto</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="valor" className="block text-sm font-medium text-black mb-2">
                  Valor
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
                <label htmlFor="data" className="block text-sm font-medium text-black mb-2">
                  Data
                </label>
                <input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-black mb-2">
                Categoria
              </label>
              <select
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="input-field"
                required
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="descricao" className="block text-sm font-medium text-black mb-2">
                Descrição
              </label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="input-field min-h-[100px] resize-none"
                placeholder="Descreva o gasto..."
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Adicionar gasto
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <p className="text-sm text-gray-dark mb-2">Total de gastos</p>
          <p className="text-3xl font-semibold text-black">
            R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-dark mt-2">
            {gastosFiltrados.length} {gastosFiltrados.length === 1 ? 'gasto' : 'gastos'} registrado
            {gastosFiltrados.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-black mb-4">Gastos por categoria</h3>
          <div className="space-y-3">
            {gastosPorCategoria
              .filter((item) => item.total > 0)
              .map((item) => (
                <div key={item.categoria}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-dark">{item.categoria}</span>
                    <span className="text-sm font-medium text-black">
                      R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{
                        width: `${totalGastos > 0 ? (item.total / totalGastos) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-black mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Categoria</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todas</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Mês</label>
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              {mesesDisponiveis.map((mes) => (
                <option key={mes} value={mes}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light border-b border-gray-medium">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Data</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Descrição</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Categoria</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Valor</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black"></th>
              </tr>
            </thead>
            <tbody>
              {gastosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-dark">
                    Nenhum gasto registrado ainda.
                  </td>
                </tr>
              ) : (
                gastosFiltrados
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((gasto) => (
                    <tr
                      key={gasto.id}
                      className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-dark">
                        {new Date(gasto.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-black">{gasto.descricao}</td>
                      <td className="px-6 py-4 text-sm text-gray-dark">{gasto.categoria}</td>
                      <td className="px-6 py-4 text-sm font-medium text-black">
                        R$ {gasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDelete(gasto.id)}
                          className="text-gray-dark hover:text-black font-medium"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

