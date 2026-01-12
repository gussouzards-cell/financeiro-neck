import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import LoginProfessor from './pages/LoginProfessor'
import LoginResponsavel from './pages/responsavel/LoginResponsavel'
import Dashboard from './pages/Dashboard'
import AlunosResponsaveis from './pages/AlunosResponsaveis'
import DetalheResponsavel from './pages/DetalheResponsavel'
import GerarCobranca from './pages/GerarCobranca'
import Conciliacao from './pages/Conciliacao'
import Relatorios from './pages/Relatorios'
import NotasFiscais from './pages/NotasFiscais'
import Gastos from './pages/Gastos'
import Cadastro from './pages/Cadastro'
import CobrancasAutomaticas from './pages/CobrancasAutomaticas'
import Inadimplencia from './pages/Inadimplencia'
import Contratos from './pages/Contratos'
import Comunicacao from './pages/Comunicacao'
import Comprovantes from './pages/Comprovantes'
import CalendarioFinanceiro from './pages/CalendarioFinanceiro'
import FluxoCaixa from './pages/FluxoCaixa'
import Layout from './components/Layout'
import LayoutProfessor from './components/LayoutProfessor'
import LayoutResponsavel from './components/LayoutResponsavel'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedRouteProfessor from './components/ProtectedRouteProfessor'
import ProtectedRouteResponsavel from './components/ProtectedRouteResponsavel'
import ProtectedRouteAdmin from './components/ProtectedRouteAdmin'
import DashboardProfessor from './pages/professor/DashboardProfessor'
import EnviarNotaFiscal from './pages/professor/EnviarNotaFiscal'
import MinhasNotasFiscais from './pages/professor/MinhasNotasFiscais'
import DashboardResponsavel from './pages/responsavel/DashboardResponsavel'
import CobrancasResponsavel from './pages/responsavel/CobrancasResponsavel'
import PagamentosResponsavel from './pages/responsavel/PagamentosResponsavel'
import DadosResponsavel from './pages/responsavel/DadosResponsavel'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-professor" element={<LoginProfessor />} />
          <Route path="/login-responsavel" element={<LoginResponsavel />} />
          
          {/* Rotas admin */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="alunos" element={<AlunosResponsaveis />} />
            <Route path="contratos" element={<Contratos />} />
            <Route path="comunicacao" element={<Comunicacao />} />
            <Route path="comprovantes" element={<Comprovantes />} />
            <Route path="calendario" element={<CalendarioFinanceiro />} />
            <Route path="fluxo-caixa" element={<FluxoCaixa />} />
            <Route path="responsavel/:id" element={<DetalheResponsavel />} />
            <Route path="cobranca/:responsavelId" element={<GerarCobranca />} />
            <Route path="cadastro" element={<Cadastro />} />
            <Route path="cobrancas-automaticas" element={<CobrancasAutomaticas />} />
            <Route path="inadimplencia" element={<Inadimplencia />} />
            <Route path="conciliacao" element={<Conciliacao />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="notas-fiscais" element={<NotasFiscais />} />
            <Route
              path="gastos"
              element={
                <ProtectedRouteAdmin>
                  <Gastos />
                </ProtectedRouteAdmin>
              }
            />
          </Route>

          {/* Rotas professor */}
          <Route
            path="/professor"
            element={
              <ProtectedRouteProfessor>
                <LayoutProfessor />
              </ProtectedRouteProfessor>
            }
          >
            <Route index element={<Navigate to="/professor/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardProfessor />} />
            <Route path="enviar-nf" element={<EnviarNotaFiscal />} />
            <Route path="notas-fiscais" element={<MinhasNotasFiscais />} />
          </Route>

          {/* Rotas responsável */}
          <Route
            path="/responsavel"
            element={
              <ProtectedRouteResponsavel>
                <LayoutResponsavel />
              </ProtectedRouteResponsavel>
            }
          >
            <Route index element={<Navigate to="/responsavel/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardResponsavel />} />
            <Route path="cobrancas" element={<CobrancasResponsavel />} />
            <Route path="pagamentos" element={<PagamentosResponsavel />} />
            <Route path="dados" element={<DadosResponsavel />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App





