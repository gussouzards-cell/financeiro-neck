import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirecionar se já estiver autenticado
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const success = login(email, password)
    if (success) {
      navigate('/dashboard')
    } else {
      setError('Email ou senha incorretos')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-black mb-3 tracking-tight">
            <span className="font-light">Colégio</span>{' '}
            <span className="font-bold">Neck</span>
          </h1>
          <p className="text-gray-dark text-sm">Financeiro sem fricção. Controle total. Zero planilhas.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <p className="text-xs text-gray-dark mb-2 font-semibold">Credenciais de teste:</p>
          <div className="text-xs text-gray-dark space-y-1">
            <p>admin@escola.com / admin123</p>
            <p>financeiro@escola.com / financeiro123</p>
            <p>diretor@escola.com / diretor123</p>
            <p>coordenador@escola.com / coordenador123</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-medium">
          <div className="card bg-gray-light border-2 border-black">
            <div className="text-center">
              <p className="text-sm font-semibold text-black mb-2">Professor?</p>
              <p className="text-xs text-gray-dark mb-4">Acesse o portal para enviar suas notas fiscais</p>
              <a 
                href="/login-professor" 
                className="btn-primary inline-block w-full"
              >
                Acessar Portal do Professor
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





