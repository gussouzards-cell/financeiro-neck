import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginProfessor() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { loginProfessor, isAuthenticated, isProfessor } = useAuth()

  useEffect(() => {
    // Redirecionar se já estiver autenticado como professor
    if (isAuthenticated && isProfessor) {
      navigate('/professor/dashboard')
    }
  }, [isAuthenticated, isProfessor, navigate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const success = loginProfessor(email, password)
    if (success) {
      navigate('/professor/dashboard')
    } else {
      setError('Email ou senha incorretos')
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
          <h1 className="text-4xl font-bold text-black mb-2">Portal do Professor</h1>
          <p className="text-gray-dark text-sm">Acesse para enviar suas notas fiscais</p>
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
            <p>joao.silva@escola.com / prof123</p>
            <p>maria.santos@escola.com / prof123</p>
            <p>carlos.oliveira@escola.com / prof123</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-medium">
          <div className="card bg-gray-light border border-gray-medium">
            <div className="text-center">
              <p className="text-sm font-semibold text-black mb-2">Administrador?</p>
              <p className="text-xs text-gray-dark mb-4">Acesse a área administrativa do sistema</p>
              <a 
                href="/login" 
                className="btn-outline inline-block w-full"
              >
                Acessar Área Administrativa
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

