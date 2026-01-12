import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function EnviarNotaFiscal() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    numero: '',
    valor: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    dataVencimento: '',
    descricao: '',
    arquivo: null as File | null,
  })
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, arquivo: e.target.files[0] })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)

    // Simular upload (em produção, enviaria para servidor)
    setTimeout(() => {
      // Buscar notas fiscais existentes
      const notasExistentes = JSON.parse(
        localStorage.getItem('notasFiscaisProfessores') || '[]'
      )

      // Criar nova nota fiscal
      const novaNF = {
        id: `NF${Date.now()}`,
        numero: formData.numero,
        professor: user?.name || '',
        email: user?.email || '',
        cnpj: user?.cnpj || '',
        valor: parseFloat(formData.valor),
        dataEmissao: formData.dataEmissao,
        dataVencimento: formData.dataVencimento,
        dataEnvio: new Date().toISOString(),
        descricao: formData.descricao,
        status: 'Pendente',
        arquivo: formData.arquivo?.name || '',
      }

      // Salvar no localStorage
      const novasNF = [...notasExistentes, novaNF]
      localStorage.setItem('notasFiscaisProfessores', JSON.stringify(novasNF))

      setEnviando(false)
      setSucesso(true)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/professor/notas-fiscais')
      }, 2000)
    }, 1500)
  }

  if (sucesso) {
    return (
      <div>
        <div className="card bg-gray-light border-2 border-black text-center py-12">
          <h3 className="text-2xl font-semibold text-black mb-4">Nota fiscal enviada com sucesso!</h3>
          <p className="text-gray-dark">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-black mb-2">Enviar Nota Fiscal</h2>
        <p className="text-gray-dark">Preencha os dados da sua nota fiscal</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-black mb-2">
                Número da NF
              </label>
              <input
                id="numero"
                type="text"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                className="input-field"
                placeholder="000001"
                required
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dataEmissao" className="block text-sm font-medium text-black mb-2">
                Data de emissão
              </label>
              <input
                id="dataEmissao"
                type="date"
                value={formData.dataEmissao}
                onChange={(e) => setFormData({ ...formData, dataEmissao: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="dataVencimento" className="block text-sm font-medium text-black mb-2">
                Data de vencimento
              </label>
              <input
                id="dataVencimento"
                type="date"
                value={formData.dataVencimento}
                onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                className="input-field"
                required
              />
            </div>
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
              placeholder="Ex: Aula de Matemática - Novembro 2024"
              required
            />
          </div>

          <div>
            <label htmlFor="arquivo" className="block text-sm font-medium text-black mb-2">
              Anexar PDF da nota fiscal
            </label>
            <input
              id="arquivo"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="input-field"
            />
            {formData.arquivo && (
              <p className="text-sm text-gray-dark mt-2">
                Arquivo selecionado: {formData.arquivo.name}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/professor/dashboard')}
              className="btn-outline flex-1"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar nota fiscal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


