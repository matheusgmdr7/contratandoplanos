import { supabase } from "@/lib/supabase"
import type { Corretor } from "@/types/corretores"

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

export async function criarCorretor(corretor: Omit<Corretor, "id" | "created_at">): Promise<Corretor> {
  try {
    const { data, error } = await supabase.from("corretores").insert([corretor]).select().single()

    if (error) {
      console.error("Erro ao criar corretor:", error)
      throw new Error(`Erro ao criar corretor: ${error.message}`)
    }

    if (!data) {
      throw new Error("Erro ao criar corretor: Dados não retornados")
    }

    return data
  } catch (error) {
    console.error("Erro ao criar corretor:", error)
    throw error
  }
}

export async function atualizarCorretor(id: string, corretor: Partial<Corretor>): Promise<Corretor> {
  try {
    const { data, error } = await supabase.from("corretores").update(corretor).eq("id", id).select().single()

    if (error) {
      console.error("Erro ao atualizar corretor:", error)
      throw new Error(`Erro ao atualizar corretor: ${error.message}`)
    }

    if (!data) {
      throw new Error("Erro ao atualizar corretor: Dados não retornados")
    }

    return data
  } catch (error) {
    console.error("Erro ao atualizar corretor:", error)
    throw error
  }
}

export async function deletarCorretor(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("corretores").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar corretor:", error)
      throw new Error(`Erro ao deletar corretor: ${error.message}`)
    }
  } catch (error) {
    console.error("Erro ao deletar corretor:", error)
    throw error
  }
}

