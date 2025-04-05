import { supabase } from "@/lib/supabase"
import type { TabelaPreco, TabelaPrecoFaixa } from "@/types/tabelas"

/**
 * Obtém todas as tabelas de preços ativas
 */
export async function obterTabelasPrecos() {
  const { data, error } = await supabase
    .from("tabelas_precos")
    .select("*")
    .eq("ativo", true)
    .order("titulo", { ascending: true })

  if (error) {
    console.error("Erro ao obter tabelas de preços:", error)
    throw new Error("Não foi possível obter as tabelas de preços")
  }

  return data as TabelaPreco[]
}

/**
 * Obtém uma tabela de preços específica com suas faixas etárias
 */
export async function obterTabelaPrecoDetalhada(id: string) {
  // Obter a tabela
  const { data: tabela, error: tabelaError } = await supabase.from("tabelas_precos").select("*").eq("id", id).single()

  if (tabelaError) {
    console.error("Erro ao obter tabela de preço:", tabelaError)
    throw new Error("Não foi possível obter a tabela de preço")
  }

  // Obter as faixas etárias
  const { data: faixas, error: faixasError } = await supabase
    .from("tabelas_precos_faixas")
    .select("*")
    .eq("tabela_id", id)
    .order("faixa_etaria", { ascending: true })

  if (faixasError) {
    console.error("Erro ao obter faixas etárias:", faixasError)
    throw new Error("Não foi possível obter as faixas etárias")
  }

  return {
    tabela: tabela as TabelaPreco,
    faixas: faixas as TabelaPrecoFaixa[],
  }
}

/**
 * Cria uma nova tabela de preços
 */
export async function criarTabelaPreco(tabela: Omit<TabelaPreco, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase.from("tabelas_precos").insert(tabela).select().single()

  if (error) {
    console.error("Erro ao criar tabela de preço:", error)
    throw new Error("Não foi possível criar a tabela de preço")
  }

  return data as TabelaPreco
}

/**
 * Adiciona faixas etárias a uma tabela de preços
 */
export async function adicionarFaixasEtarias(faixas: Omit<TabelaPrecoFaixa, "id" | "created_at">[]) {
  const { data, error } = await supabase.from("tabelas_precos_faixas").insert(faixas).select()

  if (error) {
    console.error("Erro ao adicionar faixas etárias:", error)
    throw new Error("Não foi possível adicionar as faixas etárias")
  }

  return data as TabelaPrecoFaixa[]
}

/**
 * Atualiza uma tabela de preços
 */
export async function atualizarTabelaPreco(id: string, tabela: Partial<TabelaPreco>) {
  const { data, error } = await supabase.from("tabelas_precos").update(tabela).eq("id", id).select().single()

  if (error) {
    console.error("Erro ao atualizar tabela de preço:", error)
    throw new Error("Não foi possível atualizar a tabela de preço")
  }

  return data as TabelaPreco
}

/**
 * Exclui uma tabela de preços e suas faixas etárias
 */
export async function excluirTabelaPreco(id: string) {
  // As faixas serão excluídas automaticamente devido à restrição ON DELETE CASCADE
  const { error } = await supabase.from("tabelas_precos").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir tabela de preço:", error)
    throw new Error("Não foi possível excluir a tabela de preço")
  }

  return true
}

/**
 * Atualiza o status de uma tabela de preços (ativo/inativo)
 */
export async function atualizarStatusTabelaPreco(id: string, ativo: boolean) {
  const { data, error } = await supabase.from("tabelas_precos").update({ ativo }).eq("id", id).select().single()

  if (error) {
    console.error("Erro ao atualizar status da tabela de preço:", error)
    throw new Error("Não foi possível atualizar o status da tabela de preço")
  }

  return data as TabelaPreco
}

