// Sistema de dados mockados para popular o sistema

export function initializeMockData() {
  // Verificar se já foi inicializado
  if (localStorage.getItem('mockDataInitialized') === 'true') {
    return // Já foi inicializado, não precisa popular novamente
  }

  // ============================================
  // RESPONSÁVEIS
  // ============================================
  const responsaveis = [
    {
      id: 'RESP001',
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 98765-4321',
      whatsapp: '5511987654321',
      cpf: '123.456.789-00',
      preferenciaPagamento: 'PIX',
      statusFinanceiro: 'Pagante',
      valorMensal: 1200,
    },
    {
      id: 'RESP002',
      nome: 'Ana Santos',
      email: 'ana.santos@email.com',
      telefone: '(11) 97654-3210',
      whatsapp: '5511976543210',
      cpf: '234.567.890-11',
      preferenciaPagamento: 'Boleto',
      statusFinanceiro: 'Pagante',
      valorMensal: 1200,
    },
    {
      id: 'RESP003',
      nome: 'Carlos Oliveira',
      email: 'carlos.oliveira@email.com',
      telefone: '(11) 96543-2109',
      whatsapp: '5511965432109',
      cpf: '345.678.901-22',
      preferenciaPagamento: 'PIX',
      statusFinanceiro: 'Bolsa parcial',
      valorMensal: 600,
    },
    {
      id: 'RESP004',
      nome: 'Fernanda Costa',
      email: 'fernanda.costa@email.com',
      telefone: '(11) 95432-1098',
      whatsapp: '5511954321098',
      cpf: '456.789.012-33',
      preferenciaPagamento: 'Cartão',
      statusFinanceiro: 'Não pagante',
      valorMensal: 0,
    },
    {
      id: 'RESP005',
      nome: 'Patricia Lima',
      email: 'patricia.lima@email.com',
      telefone: '(11) 94321-0987',
      whatsapp: '5511943210987',
      cpf: '567.890.123-44',
      preferenciaPagamento: 'PIX',
      statusFinanceiro: 'Pagante',
      valorMensal: 1200,
    },
    {
      id: 'RESP006',
      nome: 'Roberto Alves',
      email: 'roberto.alves@email.com',
      telefone: '(11) 93210-9876',
      whatsapp: '5511932109876',
      cpf: '678.901.234-55',
      preferenciaPagamento: 'Boleto',
      statusFinanceiro: 'Pagante',
      valorMensal: 1500,
    },
    {
      id: 'RESP007',
      nome: 'Mariana Souza',
      email: 'mariana.souza@email.com',
      telefone: '(11) 92109-8765',
      whatsapp: '5511921098765',
      cpf: '789.012.345-66',
      preferenciaPagamento: 'PIX',
      statusFinanceiro: 'Bolsa integral',
      valorMensal: 0,
    },
    {
      id: 'RESP008',
      nome: 'Paulo Ferreira',
      email: 'paulo.ferreira@email.com',
      telefone: '(11) 91098-7654',
      whatsapp: '5511910987654',
      cpf: '890.123.456-77',
      preferenciaPagamento: 'Cartão',
      statusFinanceiro: 'Pagante',
      valorMensal: 1200,
    },
  ]

  // ============================================
  // ALUNOS
  // ============================================
  const alunos = [
    {
      id: 'ALU001',
      nome: 'Maria Silva',
      responsavelId: 'RESP001',
      turma: '1º Ano A',
      dataNascimento: '2015-03-15',
    },
    {
      id: 'ALU002',
      nome: 'Pedro Santos',
      responsavelId: 'RESP002',
      turma: '2º Ano B',
      dataNascimento: '2014-07-22',
    },
    {
      id: 'ALU003',
      nome: 'Lucas Oliveira',
      responsavelId: 'RESP003',
      turma: '3º Ano A',
      dataNascimento: '2013-11-08',
    },
    {
      id: 'ALU004',
      nome: 'Julia Costa',
      responsavelId: 'RESP004',
      turma: '1º Ano B',
      dataNascimento: '2015-05-30',
    },
    {
      id: 'ALU005',
      nome: 'Rafael Lima',
      responsavelId: 'RESP005',
      turma: '4º Ano A',
      dataNascimento: '2012-09-14',
    },
    {
      id: 'ALU006',
      nome: 'Gabriel Alves',
      responsavelId: 'RESP006',
      turma: '5º Ano B',
      dataNascimento: '2011-12-03',
    },
    {
      id: 'ALU007',
      nome: 'Isabella Souza',
      responsavelId: 'RESP007',
      turma: '2º Ano A',
      dataNascimento: '2014-01-18',
    },
    {
      id: 'ALU008',
      nome: 'Enzo Ferreira',
      responsavelId: 'RESP008',
      turma: '3º Ano B',
      dataNascimento: '2013-06-25',
    },
  ]

  // ============================================
  // COBRANÇAS
  // ============================================
  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1
  const anoAtual = hoje.getFullYear()

  const cobrancas = [
    {
      id: 'COB001',
      responsavelId: 'RESP001',
      valor: 1200,
      vencimento: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-05`,
      tipo: 'PIX',
      status: 'Pendente',
      idExterno: 'PIX-2024-10-001',
      descricao: 'Mensalidade - Outubro',
    },
    {
      id: 'COB002',
      responsavelId: 'RESP002',
      valor: 1200,
      vencimento: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-05`,
      tipo: 'Boleto',
      status: 'Paga',
      idExterno: 'BLT-2024-10-002',
      descricao: 'Mensalidade - Outubro',
    },
    {
      id: 'COB003',
      responsavelId: 'RESP003',
      valor: 600,
      vencimento: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-05`,
      tipo: 'PIX',
      status: 'Paga',
      idExterno: 'PIX-2024-10-003',
      descricao: 'Mensalidade - Outubro (Bolsa)',
    },
    {
      id: 'COB004',
      responsavelId: 'RESP005',
      valor: 1200,
      vencimento: `${anoAtual}-${String(mesAtual - 2).padStart(2, '0')}-05`,
      tipo: 'PIX',
      status: 'Pendente',
      idExterno: 'PIX-2024-09-005',
      descricao: 'Mensalidade - Setembro',
    },
    {
      id: 'COB005',
      responsavelId: 'RESP001',
      valor: 1200,
      vencimento: `${anoAtual}-${String(mesAtual).padStart(2, '0')}-05`,
      tipo: 'PIX',
      status: 'Pendente',
      idExterno: `PIX-${anoAtual}-${String(mesAtual).padStart(2, '0')}-001`,
      descricao: `Mensalidade - ${mesAtual === 1 ? 'Janeiro' : mesAtual === 2 ? 'Fevereiro' : mesAtual === 3 ? 'Março' : mesAtual === 4 ? 'Abril' : mesAtual === 5 ? 'Maio' : mesAtual === 6 ? 'Junho' : mesAtual === 7 ? 'Julho' : mesAtual === 8 ? 'Agosto' : mesAtual === 9 ? 'Setembro' : mesAtual === 10 ? 'Outubro' : mesAtual === 11 ? 'Novembro' : 'Dezembro'}`,
    },
    {
      id: 'COB006',
      responsavelId: 'RESP006',
      valor: 1500,
      vencimento: `${anoAtual}-${String(mesAtual).padStart(2, '0')}-10`,
      tipo: 'Boleto',
      status: 'Pendente',
      idExterno: `BLT-${anoAtual}-${String(mesAtual).padStart(2, '0')}-006`,
      descricao: 'Mensalidade - Novembro',
    },
    {
      id: 'COB007',
      responsavelId: 'RESP008',
      valor: 1200,
      vencimento: `${anoAtual}-${String(mesAtual).padStart(2, '0')}-15`,
      tipo: 'Cartão',
      status: 'Pendente',
      idExterno: `CRT-${anoAtual}-${String(mesAtual).padStart(2, '0')}-008`,
      descricao: 'Mensalidade - Novembro',
    },
  ]

  // ============================================
  // PAGAMENTOS
  // ============================================
  const pagamentos = [
    {
      id: 'PAG001',
      responsavelId: 'RESP002',
      valor: 1200,
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-03`,
      tipo: 'Boleto',
      status: 'Conciliado',
      cobrancaId: 'COB002',
      origem: 'Banco XYZ',
    },
    {
      id: 'PAG002',
      responsavelId: 'RESP003',
      valor: 600,
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-01`,
      tipo: 'PIX',
      status: 'Conciliado',
      cobrancaId: 'COB003',
      origem: 'Banco ABC',
    },
    {
      id: 'PAG003',
      responsavelId: 'RESP001',
      valor: 1200,
      data: `${anoAtual}-${String(mesAtual - 2).padStart(2, '0')}-05`,
      tipo: 'PIX',
      status: 'Conciliado',
      cobrancaId: 'COB001',
      origem: 'Banco ABC',
    },
    {
      id: 'PAG004',
      responsavelId: 'RESP006',
      valor: 1500,
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-08`,
      tipo: 'Boleto',
      status: 'Conciliado',
      origem: 'Banco XYZ',
    },
    {
      id: 'PAG005',
      responsavelId: 'RESP008',
      valor: 1200,
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-12`,
      tipo: 'Cartão',
      status: 'Conciliado',
      origem: 'Gateway PagSeguro',
    },
  ]

  // ============================================
  // GASTOS
  // ============================================
  const gastos = [
    {
      id: 'GAS001',
      valor: 5000,
      descricao: 'Salário professores - Outubro',
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-05`,
      categoria: 'Folha de Pagamento',
    },
    {
      id: 'GAS002',
      valor: 1200,
      descricao: 'Material de limpeza',
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-10`,
      categoria: 'Manutenção',
    },
    {
      id: 'GAS003',
      valor: 800,
      descricao: 'Conta de luz',
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-15`,
      categoria: 'Utilidades',
    },
    {
      id: 'GAS004',
      valor: 3000,
      descricao: 'Material didático',
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-20`,
      categoria: 'Educacional',
    },
    {
      id: 'GAS005',
      valor: 1500,
      descricao: 'Manutenção ar condicionado',
      data: `${anoAtual}-${String(mesAtual).padStart(2, '0')}-02`,
      categoria: 'Manutenção',
    },
  ]

  // ============================================
  // NOTAS FISCAIS PROFESSORES
  // ============================================
  const notasFiscais = [
    {
      id: 'NF001',
      professorId: 'PROF001',
      professorNome: 'Prof. Ana Paula',
      numero: '000001',
      valor: 3500,
      dataEmissao: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-01`,
      dataVencimento: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-10`,
      status: 'Paga',
      arquivo: 'nf-001.pdf',
    },
    {
      id: 'NF002',
      professorId: 'PROF002',
      professorNome: 'Prof. Carlos Mendes',
      numero: '000002',
      valor: 3200,
      dataEmissao: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-01`,
      dataVencimento: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-10`,
      status: 'Paga',
      arquivo: 'nf-002.pdf',
    },
    {
      id: 'NF003',
      professorId: 'PROF003',
      professorNome: 'Prof. Mariana Costa',
      numero: '000003',
      valor: 2800,
      dataEmissao: `${anoAtual}-${String(mesAtual).padStart(2, '0')}-01`,
      dataVencimento: `${anoAtual}-${String(mesAtual).padStart(2, '0')}-10`,
      status: 'Pendente',
      arquivo: 'nf-003.pdf',
    },
  ]

  // ============================================
  // CONTRATOS
  // ============================================
  const contratos = [
    {
      id: 'CONT001',
      alunoId: 'ALU001',
      alunoNome: 'Maria Silva',
      responsavelId: 'RESP001',
      responsavelNome: 'João Silva',
      tipo: 'Mensal',
      valorTotal: 1200,
      valorParcela: 1200,
      quantidadeParcelas: 12,
      dataInicio: `${anoAtual - 1}-02-01`,
      dataFim: `${anoAtual}-01-31`,
      status: 'Ativo',
      desconto: 0,
      observacoes: 'Contrato anual renovado',
      dataCriacao: `${anoAtual - 1}-01-15`,
    },
    {
      id: 'CONT002',
      alunoId: 'ALU003',
      alunoNome: 'Lucas Oliveira',
      responsavelId: 'RESP003',
      responsavelNome: 'Carlos Oliveira',
      tipo: 'Mensal',
      valorTotal: 600,
      valorParcela: 600,
      quantidadeParcelas: 12,
      dataInicio: `${anoAtual - 1}-02-01`,
      dataFim: `${anoAtual}-01-31`,
      status: 'Ativo',
      desconto: 50,
      observacoes: 'Bolsa de 50%',
      dataCriacao: `${anoAtual - 1}-01-20`,
    },
    {
      id: 'CONT003',
      alunoId: 'ALU006',
      alunoNome: 'Gabriel Alves',
      responsavelId: 'RESP006',
      responsavelNome: 'Roberto Alves',
      tipo: 'Anual',
      valorTotal: 15000,
      valorParcela: 1500,
      quantidadeParcelas: 10,
      dataInicio: `${anoAtual}-02-01`,
      dataFim: `${anoAtual + 1}-01-31`,
      status: 'Ativo',
      desconto: 0,
      observacoes: 'Pagamento em 10x',
      dataCriacao: `${anoAtual - 1}-12-10`,
    },
  ]

  // ============================================
  // COBRANÇAS AUTOMÁTICAS
  // ============================================
  const cobrancasAutomaticas = [
    {
      id: 'COBAUTO001',
      responsavelId: 'RESP001',
      responsavelNome: 'João Silva',
      valor: 1200,
      diaVencimento: 5,
      tipo: 'PIX',
      ativa: true,
      descricao: 'Mensalidade mensal',
      dataInicio: `${anoAtual - 1}-01-01`,
      dataFim: undefined,
    },
    {
      id: 'COBAUTO002',
      responsavelId: 'RESP002',
      responsavelNome: 'Ana Santos',
      valor: 1200,
      diaVencimento: 5,
      tipo: 'Boleto',
      ativa: true,
      descricao: 'Mensalidade mensal',
      dataInicio: `${anoAtual - 1}-01-01`,
      dataFim: undefined,
    },
    {
      id: 'COBAUTO003',
      responsavelId: 'RESP006',
      responsavelNome: 'Roberto Alves',
      valor: 1500,
      diaVencimento: 10,
      tipo: 'Boleto',
      ativa: true,
      descricao: 'Mensalidade mensal',
      dataInicio: `${anoAtual}-02-01`,
      dataFim: undefined,
    },
  ]

  // ============================================
  // COMUNICAÇÕES
  // ============================================
  const comunicacoes = [
    {
      id: 'COM001',
      responsavelId: 'RESP005',
      responsavelNome: 'Patricia Lima',
      tipo: 'WhatsApp',
      assunto: 'Cobrança pendente',
      mensagem: 'Olá! Gostaria de lembrar sobre a mensalidade de setembro que está pendente. Valor: R$ 1.200,00. Vencimento: 05/09/2024',
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-10`,
      status: 'Enviada',
      usuario: 'Sistema',
    },
    {
      id: 'COM002',
      responsavelId: 'RESP001',
      responsavelNome: 'João Silva',
      tipo: 'Email',
      assunto: 'Confirmação de pagamento',
      mensagem: 'Pagamento de R$ 1.200,00 confirmado. Obrigado!',
      data: `${anoAtual}-${String(mesAtual - 2).padStart(2, '0')}-06`,
      status: 'Enviada',
      usuario: 'Sistema',
    },
    {
      id: 'COM003',
      responsavelId: 'RESP002',
      responsavelNome: 'Ana Santos',
      tipo: 'Telefone',
      assunto: 'Renegociação',
      mensagem: 'Ligação realizada para discutir opções de pagamento. Cliente interessado em parcelar.',
      data: `${anoAtual}-${String(mesAtual - 1).padStart(2, '0')}-15`,
      status: 'Respondida',
      usuario: 'Financeiro',
    },
  ]

  // ============================================
  // COMPROVANTES
  // ============================================
  const comprovantes = pagamentos.map((pagamento) => {
    const responsavel = responsaveis.find((r) => r.id === pagamento.responsavelId)
    const aluno = alunos.find((a) => a.responsavelId === pagamento.responsavelId)
    return {
      id: `COMP${pagamento.id}`,
      pagamentoId: pagamento.id,
      responsavelId: pagamento.responsavelId,
      responsavelNome: responsavel?.nome || 'Não encontrado',
      alunoNome: aluno?.nome || 'Não encontrado',
      valor: pagamento.valor,
      dataPagamento: pagamento.data,
      tipoPagamento: pagamento.tipo,
      numeroDocumento: `COMP-${pagamento.id}-${new Date(pagamento.data).getFullYear()}`,
      dataGeracao: pagamento.data,
    }
  })

  // ============================================
  // SALVAR NO LOCALSTORAGE
  // ============================================
  localStorage.setItem('responsaveis', JSON.stringify(responsaveis))
  localStorage.setItem('alunos', JSON.stringify(alunos))
  localStorage.setItem('cobrancas', JSON.stringify(cobrancas))
  localStorage.setItem('pagamentos', JSON.stringify(pagamentos))
  localStorage.setItem('gastos', JSON.stringify(gastos))
  localStorage.setItem('notasFiscaisProfessores', JSON.stringify(notasFiscais))
  localStorage.setItem('contratos', JSON.stringify(contratos))
  localStorage.setItem('cobrancasAutomaticas', JSON.stringify(cobrancasAutomaticas))
  localStorage.setItem('comunicacoes', JSON.stringify(comunicacoes))
  localStorage.setItem('comprovantes', JSON.stringify(comprovantes))

  // Marcar como inicializado
  localStorage.setItem('mockDataInitialized', 'true')
}

// Função para resetar dados mockados (útil para testes)
export function resetMockData() {
  localStorage.removeItem('mockDataInitialized')
  initializeMockData()
}

