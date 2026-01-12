import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function GerarCobranca() {
  const { responsavelId } = useParams()
  const navigate = useNavigate()
  
  const [valor, setValor] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [tipo, setTipo] = useState<'PIX' | 'Boleto' | 'Cartão'>('PIX')
  const [recorrente, setRecorrente] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulação de geração de cobrança
    alert('Cobrança gerada com sucesso!')
    navigate(`/responsavel/${responsavelId}`)
  }

  return (
    <div>
      <div className="mb-8">
        <button
          onClick={() => navigate(`/responsavel/${responsavelId}`)}
          className="text-gray-dark hover:text-black mb-4 inline-block"
        >
          ← Voltar
        </button>
        <h2 className="text-3xl font-semibold text-black mb-2">Gerar cobrança</h2>
        <p className="text-gray-dark">Crie uma nova cobrança para o responsável</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-black mb-2">
              Valor
            </label>
            <input
              id="valor"
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="input-field"
              placeholder="0,00"
              required
            />
          </div>

          <div>
            <label htmlFor="vencimento" className="block text-sm font-medium text-black mb-2">
              Vencimento
            </label>
            <input
              id="vencimento"
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Tipo de pagamento
            </label>
            <div className="flex gap-3">
              {(['PIX', 'Boleto', 'Cartão'] as const).map((tipoOption) => (
                <button
                  key={tipoOption}
                  type="button"
                  onClick={() => setTipo(tipoOption)}
                  className={`flex-1 py-3 rounded-card border font-medium transition-colors ${
                    tipo === tipoOption
                      ? 'border-black bg-black text-white'
                      : 'border-gray-medium text-gray-dark hover:border-black hover:text-black'
                  }`}
                >
                  {tipoOption}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="recorrente"
              type="checkbox"
              checked={recorrente}
              onChange={(e) => setRecorrente(e.target.checked)}
              className="w-5 h-5 border-gray-medium rounded text-black focus:ring-black"
            />
            <label htmlFor="recorrente" className="text-sm text-black">
              Cobrança recorrente (mensal)
            </label>
          </div>

          {valor && vencimento && (
            <div className="card bg-gray-light border-gray-medium">
              <h3 className="text-sm font-semibold text-black mb-4">Preview da cobrança</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-dark">Valor:</span>
                  <span className="font-semibold text-black">
                    R$ {parseFloat(valor || '0').toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-dark">Vencimento:</span>
                  <span className="text-black">
                    {vencimento ? new Date(vencimento).toLocaleDateString('pt-BR') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-dark">Tipo:</span>
                  <span className="text-black">{tipo}</span>
                </div>
                {tipo === 'PIX' && (
                  <div className="mt-4 p-4 bg-white border border-gray-medium rounded-card">
                    <p className="text-xs text-gray-dark mb-2">Chave PIX</p>
                    <p className="text-xs font-mono text-black break-all">
                      escola@pagamento.com.br
                    </p>
                  </div>
                )}
                {tipo === 'Boleto' && (
                  <div className="mt-4 p-4 bg-white border border-gray-medium rounded-card">
                    <p className="text-xs text-gray-dark mb-2">Código de barras</p>
                    <p className="text-xs font-mono text-black">
                      34191.79001 01043.510047 91020.150008 1 98760000012000
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(`/responsavel/${responsavelId}`)}
              className="btn-outline flex-1"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1">
              Gerar cobrança
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

