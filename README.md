# Colégio Neck - Gerenciador de Pagamentos

Sistema financeiro escolar premium do **Colégio Neck** que substitui planilhas Excel, permitindo gestão completa de pais pagantes e não pagantes, emissão e controle de cobranças, conciliação automática de pagamentos, gestão de gastos e controle de notas fiscais de professores PJ.

## Características Principais

- **Interface minimalista e elegante** seguindo o style guide Private Label
- **Sistema de autenticação** com login mocado (pronto para integração com backend)
- **Dashboard financeiro completo** com saldo atual em tempo real
- **Gestão de alunos e responsáveis** com status financeiro detalhado
- **Geração de cobranças** (PIX, Boleto, Cartão)
- **Conciliação automática** de pagamentos
- **Gestão de gastos e despesas** com categorização e filtros
- **Controle de Notas Fiscais** dos professores PJ
- **Relatórios completos** com exportação CSV e PDF

## Style Guide

- **Cores**: Preto (#000000), Branco (#FFFFFF), Cinza claro (#F5F5F5), Cinza médio (#D9D9D9), Cinza escuro (#666666)
- **Fonte**: Inter ou Satoshi
- **Layout**: Cards com borda 1px, border-radius 12px, muito espaço em branco
- **Design**: Minimalista, sem gradientes, sem cores extras, sem efeitos chamativos

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Estrutura de Telas

### Área Administrativa
1. **Login Admin** - Autenticação para administradores
2. **Dashboard Financeiro** - Visão geral com saldo atual, recebimentos e gastos
3. **Alunos & Responsáveis** - Tabela completa com filtros
4. **Detalhe do Responsável** - Informações detalhadas e histórico
5. **Geração de Cobrança** - Criação de cobranças com preview
6. **Gestão de Gastos** - Controle completo de despesas com categorização
7. **Notas Fiscais** - Gestão de NF dos professores PJ (visualiza todas as NF enviadas)
8. **Conciliação de Pagamentos** - Controle automático e manual
9. **Relatórios** - Análise completa com exportação

### Portal do Professor
1. **Login Professor** - Autenticação específica para professores
2. **Dashboard Professor** - Visão geral das notas fiscais do professor
3. **Enviar Nota Fiscal** - Upload de NF com formulário completo
4. **Minhas Notas Fiscais** - Visualização e acompanhamento das NF enviadas

## Credenciais de Teste

### Administradores
- **Admin**: admin@escola.com / admin123
- **Financeiro**: financeiro@escola.com / financeiro123
- **Diretor**: diretor@escola.com / diretor123
- **Coordenador**: coordenador@escola.com / coordenador123
  - *Acesso limitado: não visualiza gastos do mês nem saldo atual no dashboard*

### Professores
- **Prof. João Silva**: joao.silva@escola.com / prof123
- **Prof. Maria Santos**: maria.santos@escola.com / prof123
- **Prof. Carlos Oliveira**: carlos.oliveira@escola.com / prof123
- **Prof. Ana Costa**: ana.costa@escola.com / prof123
- **Prof. Pedro Lima**: pedro.lima@escola.com / prof123

## Funcionalidades Avançadas

### Gestão de Gastos
- Adicionar gastos com valor, descrição, data e categoria
- Filtros por categoria e mês
- Visualização de gastos por categoria
- Cálculo automático do total
- Integração com Dashboard (atualiza saldo em tempo real)

### Notas Fiscais
- Visualização de todas as NF dos professores PJ
- Filtros por status e professor
- Totais de pendente, pago e vencido
- Marcação de NF como paga
- Informações completas: CNPJ, valores, datas
- Integração com portal do professor (NF enviadas aparecem automaticamente)

### Portal do Professor
- **Login separado** para professores PJ
- **Upload de notas fiscais** com formulário completo
- **Visualização das próprias NF** com status e valores
- **Dashboard personalizado** com métricas do professor
- **Interface simplificada** focada apenas em gestão de NF
- Notas enviadas pelos professores aparecem automaticamente na área administrativa

### Dashboard Melhorado
- **Saldo atual** destacado (Recebido - Gastos)
- Total de gastos do mês
- Atualização automática quando gastos são adicionados
- Métricas financeiras completas





