import { supabase } from "@/lib/supabase"
import type { ProdutoCorretor } from "@/types/corretores"

// Função para buscar todos os produtos para corretores (incluindo inativos)
export async function buscarProdutosCorretores(): Promise<ProdutoCorretor[]> {
  try {
    const { data, error } = await supabase
      .from("produtos_corretores")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar produtos para corretores:", error)
      throw new Error(`Erro ao buscar produtos para corretores: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar produtos para corretores:", error)
    throw error
  }
}

// Função para buscar apenas produtos ativos para corretores
export async function buscarProdutosCorretoresAtivos(): Promise<ProdutoCorretor[]> {
  try {
    const { data, error } = await supabase
      .from("produtos_corretores")
      .select("*")
      .eq("disponivel", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar produtos ativos para corretores:", error)
      throw new Error(`Erro ao buscar produtos ativos para corretores: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar produtos ativos para corretores:", error)
    throw error
  }
}

// Função para criar um novo produto para corretores
export async function criarProdutoCorretor(
  produto: Omit<ProdutoCorretor, "id" | "created_at">,
): Promise<ProdutoCorretor> {
  try {
    const { data, error } = await supabase.from("produtos_corretores").insert([produto]).select().single()

    if (error) {
      console.error("Erro ao criar produto para corretores:", error)
      throw new Error(`Erro ao criar produto para corretores: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao criar produto para corretores:", error)
    throw error
  }
}

// Função para atualizar um produto existente
export async function atualizarProdutoCorretor(
  id: string,
  produto: Partial<Omit<ProdutoCorretor, "id" | "created_at">>,
): Promise<ProdutoCorretor> {
  try {
    const { data, error } = await supabase.from("produtos_corretores").update(produto).eq("id", id).select().single()

    if (error) {
      console.error("Erro ao atualizar produto para corretores:", error)
      throw new Error(`Erro ao atualizar produto para corretores: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao atualizar produto para corretores:", error)
    throw error
  }
}

// Função para alterar a disponibilidade de um produto
export async function alterarDisponibilidadeProdutoCorretor(id: string, disponivel: boolean): Promise<void> {
  try {
    const { error } = await supabase.from("produtos_corretores").update({ disponivel }).eq("id", id)

    if (error) {
      console.error("Erro ao alterar disponibilidade do produto:", error)
      throw new Error(`Erro ao alterar disponibilidade do produto: ${error.message}`)
    }
  } catch (error) {
    console.error("Erro ao alterar disponibilidade do produto:", error)
    throw error
  }
}

// Função para deletar um produto
export async function deletarProdutoCorretor(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("produtos_corretores").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar produto para corretores:", error)
      throw new Error(`Erro ao deletar produto para corretores: ${error.message}`)
    }
  } catch (error) {
    console.error("Erro ao deletar produto para corretores:", error)
    throw error
  }
}

