import { supabase } from "@/lib/supabase"
import type { Comissao, ResumoComissoes, Corretor } from "@/types/corretores"

export async function buscarComissoes(): Promise<Comissao[]> {
  try {
    const { data, error } = await supabase
      .from("comissoes")
      .select(`
        *,
        corretores (
          id,
          nome,
          email,
          whatsapp
        ),
        propostas_corretores (
          id,
          cliente,
          produto,
          valor
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar comissões:", error)
      throw new Error(`Erro ao buscar comissões: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar comissões:", error)
    throw error
  }
}

export async function buscarComissoesPorCorretor(corretorId: string): Promise<Comissao[]> {
  try {
    const { data, error } = await supabase
      .from("comissoes")
      .select(`
        *,
        propostas_corretores (
          id,
          cliente,
          produto,
          valor
        )
      `)
      .eq("corretor_id", corretorId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar comissões do corretor:", error)
      throw new Error(`Erro ao buscar comissões do corretor: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar comissões do corretor:", error)
    throw error
  }
}

export async function atualizarStatusComissao(id: string, status: string, dataPagamento?: string): Promise<Comissao> {
  try {
    const updateData: any = { status }
    if (dataPagamento) {
      updateData.data_pagamento = dataPagamento
    }

    const { data, error } = await supabase.from("comissoes").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Erro ao atualizar status da comissão:", error)
      throw new Error(`Erro ao atualizar status da comissão: ${error.message}`)
    }

    if (!data) {
      throw new Error("Erro ao atualizar status da comissão: Dados não retornados")
    }

    return data
  } catch (error) {
    console.error("Erro ao atualizar status da comissão:", error)
    throw error
  }
}

export async function buscarResumoComissoes(): Promise<ResumoComissoes> {
  try {
    const { data, error } = await supabase.rpc("resumo_comissoes")

    if (error) {
      console.error("Erro ao buscar resumo de comissões:", error)
      throw new Error(`Erro ao buscar resumo de comissões: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao buscar resumo de comissões:", error)
    throw error
  }
}

export async function criarComissaoManual(comissao: any): Promise<Comissao> {
  try {
    const { data, error } = await supabase
      .from("comissoes")
      .insert([
        {
          corretor_id: comissao.corretor_id,
          descricao: comissao.descricao,
          valor: comissao.valor,
          percentual: comissao.percentual,
          data_prevista: comissao.data_prevista,
          status: "pendente",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar comissão manual:", error)
      throw new Error(`Erro ao criar comissão manual: ${error.message}`)
    }

    if (!data) {
      throw new Error("Erro ao criar comissão manual: Dados não retornados")
    }

    return data
  } catch (error) {
    console.error("Erro ao criar comissão manual:", error)
    throw error
  }
}

export async function buscarCorretores(): Promise<Corretor[]> {
  try {
    const { data, error } = await supabase.from("corretores").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar corretores:", error)
      throw new Error(`Erro ao buscar corretores: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar corretores:", error)
    throw error
  }
}

