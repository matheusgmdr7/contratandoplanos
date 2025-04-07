export interface Corretor {
  id: string
  nome: string
  email: string
  telefone: string
  cpf: string
  status: string
  foto_url?: string
  cidade: string
  estado: string
  created_at: string
  updated_at: string
}

export interface PropostaCorretor {
  id: string
  corretor_id: string
  cliente: string
  email_cliente?: string
  whatsapp_cliente?: string
  produto: string
  status: string
  valor: number
  comissao: number
  data: string
  motivo_rejeicao?: string
  created_at: string
  corretores?: Corretor
  documentos_propostas_corretores?: DocumentoProposta[]
  valor_proposta?: number
  plano_nome?: string
  plano_id?: string
  produto_id?: string
}

export interface DocumentoProposta {
  id: string
  proposta_id: string
  nome: string
  url: string
  tipo?: string
  created_at: string
}

export interface ProdutoCorretor {
  id: string
  nome: string
  operadora: string
  tipo: string
  descricao: string
  comissao: string
  logo?: string
  disponivel: boolean
  created_at: string
  percentual_comissao?: string
  caracteristicas?: string[]
}

export interface Comissao {
  id: string
  corretor_id: string
  proposta_id: string
  valor: number
  percentual: string
  data: string
  status: string
  data_pagamento?: string
  created_at: string
  corretores?: Corretor
  propostas_corretores?: PropostaCorretor
  descricao?: string
  data_prevista?: string
}

export interface ResumoComissoes {
  totalPendente: number
  totalPago: number
  porMes: { [mes: string]: number }
}

