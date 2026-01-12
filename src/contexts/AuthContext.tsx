import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserType = 'admin' | 'professor' | 'coordenador' | 'responsavel'

interface User {
  email?: string
  name: string
  type: UserType
  cnpj?: string // Para professores PJ
  cpf?: string // Para responsáveis
  responsavelId?: string // ID do responsável no sistema
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  loginProfessor: (email: string, password: string) => boolean
  loginResponsavel: (cpf: string, senha: string) => boolean
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isProfessor: boolean
  isCoordenador: boolean
  isResponsavel: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuários admin mocados para demonstração
const MOCKED_ADMIN_USERS = [
  { email: 'admin@escola.com', password: 'admin123', name: 'Administrador', type: 'admin' as UserType },
  { email: 'financeiro@escola.com', password: 'financeiro123', name: 'Financeiro', type: 'admin' as UserType },
  { email: 'diretor@escola.com', password: 'diretor123', name: 'Diretor', type: 'admin' as UserType },
  { email: 'coordenador@escola.com', password: 'coordenador123', name: 'Coordenador', type: 'coordenador' as UserType },
]

// Professores mocados para demonstração
const MOCKED_PROFESSORES = [
  { email: 'joao.silva@escola.com', password: 'prof123', name: 'Prof. João Silva', type: 'professor' as UserType, cnpj: '12.345.678/0001-90' },
  { email: 'maria.santos@escola.com', password: 'prof123', name: 'Prof. Maria Santos', type: 'professor' as UserType, cnpj: '98.765.432/0001-10' },
  { email: 'carlos.oliveira@escola.com', password: 'prof123', name: 'Prof. Carlos Oliveira', type: 'professor' as UserType, cnpj: '11.222.333/0001-44' },
  { email: 'ana.costa@escola.com', password: 'prof123', name: 'Prof. Ana Costa', type: 'professor' as UserType, cnpj: '55.666.777/0001-88' },
  { email: 'pedro.lima@escola.com', password: 'prof123', name: 'Prof. Pedro Lima', type: 'professor' as UserType, cnpj: '99.888.777/0001-66' },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    // Verificar credenciais admin e coordenador mocadas
    const foundUser = MOCKED_ADMIN_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      const userData: User = { 
        email: foundUser.email, 
        name: foundUser.name,
        type: foundUser.type
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }

    return false
  }

  const loginProfessor = (email: string, password: string): boolean => {
    // Verificar credenciais de professor mocadas
    const foundProfessor = MOCKED_PROFESSORES.find(
      (p) => p.email === email && p.password === password
    )

    if (foundProfessor) {
      const userData: User = {
        email: foundProfessor.email,
        name: foundProfessor.name,
        type: foundProfessor.type,
        cnpj: foundProfessor.cnpj,
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }

    return false
  }

  const loginResponsavel = (cpf: string, senha: string): boolean => {
    // Buscar responsáveis do localStorage
    const responsaveis = JSON.parse(localStorage.getItem('responsaveis') || '[]')
    
    // CPF limpo para comparação
    const cpfLimpo = cpf.replace(/\D/g, '')
    
    // Buscar responsável pelo CPF (senha padrão: últimos 4 dígitos do CPF)
    const responsavel = responsaveis.find((r: any) => {
      const responsavelCpfLimpo = r.cpf.replace(/\D/g, '')
      return responsavelCpfLimpo === cpfLimpo
    })

    if (responsavel) {
      // Senha padrão: últimos 4 dígitos do CPF ou senha customizada
      const senhaPadrao = responsavel.cpf.replace(/\D/g, '').slice(-4)
      if (senha === senhaPadrao || senha === '1234') {
        const userData: User = {
          name: responsavel.nome,
          type: 'responsavel' as UserType,
          cpf: responsavel.cpf,
          responsavelId: responsavel.id,
          email: responsavel.email,
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return true
      }
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginProfessor,
        loginResponsavel,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.type === 'admin',
        isProfessor: user?.type === 'professor',
        isCoordenador: user?.type === 'coordenador',
        isResponsavel: user?.type === 'responsavel',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

