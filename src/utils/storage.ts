// Utilitários para gerenciar localStorage e eventos customizados

export const STORAGE_KEYS = {
  GASTOS: 'gastos',
  USER: 'user',
  RECEBIMENTOS: 'recebimentos',
}

export function emitStorageEvent(key: string) {
  // Disparar evento customizado para atualizar componentes
  window.dispatchEvent(new CustomEvent('storage-update', { detail: { key } }))
}

export function getGastos() {
  const gastos = localStorage.getItem(STORAGE_KEYS.GASTOS)
  return gastos ? JSON.parse(gastos) : []
}

export function saveGastos(gastos: any[]) {
  localStorage.setItem(STORAGE_KEYS.GASTOS, JSON.stringify(gastos))
  emitStorageEvent(STORAGE_KEYS.GASTOS)
}

export function getNotasFiscaisProfessores() {
  const notas = localStorage.getItem('notasFiscaisProfessores')
  return notas ? JSON.parse(notas) : []
}

export function addNotaFiscalProfessor(nota: any) {
  const notas = getNotasFiscaisProfessores()
  const novasNotas = [...notas, nota]
  localStorage.setItem('notasFiscaisProfessores', JSON.stringify(novasNotas))
  emitStorageEvent('notasFiscaisProfessores')
}

export function getAlunos() {
  const alunos = localStorage.getItem('alunos')
  return alunos ? JSON.parse(alunos) : []
}

export function addAluno(aluno: any) {
  const alunos = getAlunos()
  const novosAlunos = [...alunos, aluno]
  localStorage.setItem('alunos', JSON.stringify(novosAlunos))
  emitStorageEvent('alunos')
}

export function deleteAluno(id: string) {
  const alunos = getAlunos()
  const alunosFiltrados = alunos.filter((a: any) => a.id !== id)
  localStorage.setItem('alunos', JSON.stringify(alunosFiltrados))
  emitStorageEvent('alunos')
}

export function getResponsaveis() {
  const responsaveis = localStorage.getItem('responsaveis')
  return responsaveis ? JSON.parse(responsaveis) : []
}

export function addResponsavel(responsavel: any) {
  const responsaveis = getResponsaveis()
  const novosResponsaveis = [...responsaveis, responsavel]
  localStorage.setItem('responsaveis', JSON.stringify(novosResponsaveis))
  emitStorageEvent('responsaveis')
}

export function deleteResponsavel(id: string) {
  const responsaveis = getResponsaveis()
  const responsaveisFiltrados = responsaveis.filter((r: any) => r.id !== id)
  localStorage.setItem('responsaveis', JSON.stringify(responsaveisFiltrados))
  emitStorageEvent('responsaveis')
}

export function addGasto(gasto: any) {
  const gastos = getGastos()
  const novosGastos = [...gastos, gasto]
  localStorage.setItem(STORAGE_KEYS.GASTOS, JSON.stringify(novosGastos))
  emitStorageEvent(STORAGE_KEYS.GASTOS)
}

export function deleteGasto(id: string) {
  const gastos = getGastos()
  const gastosFiltrados = gastos.filter((g: any) => g.id !== id)
  localStorage.setItem(STORAGE_KEYS.GASTOS, JSON.stringify(gastosFiltrados))
  emitStorageEvent(STORAGE_KEYS.GASTOS)
}

