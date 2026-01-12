import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginResponsavel() {
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { loginResponsavel, isAuthenticated, isResponsavel } = useAuth()

  useEffect(() => {
    if (isAuthenticated && isResponsavel) {
      navigate('/responsavel/dashboard')
    }
  }, [isAuthenticated, isResponsavel, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const success = loginResponsavel(cpf, senha)
    if (success) {
      navigate('/responsavel/dashboard')
    } else {
      setError('CPF ou senha incorretos')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-black tracking-tight mb-1">
              <span className="font-light">Colégio</span>{' '}
              <span className="font-bold">Neck</span>
            </h2>
          </div>
          <h1 className="text-4xl font-bold text-black mb-2">Portal do Responsável</h1>
          <p className="text-gray-dark text-sm">Acesse suas informações financeiras</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-black mb-2">
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="input-field"
              placeholder="000.000.000-00"
              required
            />
          </div>
          
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-black mb-2">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="text-sm text-gray-dark bg-gray-light border border-gray-medium rounded-card p-3">
              {error}
            </div>
          )}
          
          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>
        </form>
        
        <div className="mt-8 p-4 bg-gray-light border border-gray-medium rounded-card">
          <p className="text-xs text-gray-dark mb-2 font-semibold">Primeiro acesso?</p>
          <p className="text-xs text-gray-dark">
            Entre em contato com a secretaria para obter suas credenciais de acesso.
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="/login" className="text-sm text-gray-dark hover:text-black">
            Sou administrador
          </a>
        </div>
      </div>
    </div>
  )
}


