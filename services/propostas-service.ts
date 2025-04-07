import { supabase } from "@/lib/supabase"

export async function buscarPropostas() {
  try {
    const { data, error } = await supabase.from("propostas").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar propostas:", error)
      throw new Error(`Erro ao buscar propostas: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar propostas:", error)
    throw error
  }
}

// Nova função para buscar propostas de corretores
export async function buscarPropostasCorretores() {
  try {
    const { data, error } = await supabase
      .from("propostas_corretores")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar propostas de corretores:", error)
      throw new Error(`Erro ao buscar propostas de corretores: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar propostas de corretores:", error)
    throw error
  }
}

