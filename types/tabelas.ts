export interface TabelaPreco {
  id: string
  titulo: string
  corretora: string
  descricao?: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface TabelaPrecoFaixa {
  id: string
  tabela_id: string
  faixa_etaria: string
  valor: number
  created_at: string
}

export interface TabelaPrecoDetalhada {
  tabela: TabelaPreco
  faixas: TabelaPrecoFaixa[]
}

