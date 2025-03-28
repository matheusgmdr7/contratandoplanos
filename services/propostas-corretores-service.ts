import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { PropostaCorretor } from "@/types/corretores"

export async function buscarPropostasCorretores(): Promise<PropostaCorretor[]> {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase
      .from("propostas_corretores")
      .select(`
        *,
        corretores (
          id,
          nome,
          email,
          whatsapp
        ),
        documentos_propostas_corretores (*)
      `)
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

export async function buscarPropostasPorCorretor(corretorId: string): Promise<PropostaCorretor[]> {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase
      .from("propostas_corretores")
      .select(`
        *,
        corretores (
          id,
          nome,
          email,
          whatsapp
        ),
        documentos_propostas_corretores (*)
      `)
      .eq("corretor_id", corretorId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar propostas do corretor:", error)
      throw new Error(`Erro ao buscar propostas do corretor: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar propostas do corretor:", error)
    throw error
  }
}

export async function atualizarStatusPropostaCorretor(
  id: string,
  status: string,
  motivoRejeicao?: string,
): Promise<PropostaCorretor> {
  try {
    const supabase = createClientComponentClient()

    const updateData: any = { status }
    if (motivoRejeicao) {
      updateData.motivo_rejeicao = motivoRejeicao
    }

    const { data, error } = await supabase
      .from("propostas_corretores")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar status da proposta do corretor:", error)
      throw new Error(`Erro ao atualizar status da proposta do corretor: ${error.message}`)
    }

    if (!data) {
      throw new Error("Erro ao atualizar status da proposta do corretor: Dados não retornados")
    }

    return data
  } catch (error) {
    console.error("Erro ao atualizar status da proposta do corretor:", error)
    throw error
  }
}

export async function criarPropostaCorretor(
  proposta: Omit<PropostaCorretor, "id" | "created_at">,
): Promise<PropostaCorretor> {
  try {
    const supabase = createClientComponentClient()

    const { data, error } = await supabase.from("propostas_corretores").insert([proposta]).select().single()

    if (error) {
      console.error("Erro ao criar proposta do corretor:", error)
      throw new Error(`Erro ao criar proposta do corretor: ${error.message}`)
    }

    if (!data) {
      throw new Error("Erro ao criar proposta do corretor: Dados não retornados")
    }

    return data
  } catch (error) {
    console.error("Erro ao criar proposta do corretor:", error)
    throw error
  }
}

export async function adicionarDocumentoPropostaCorretor(documento: {
  proposta_id: string
  nome: string
  url: string
  tipo?: string
}): Promise<any> {
  try {
    const supabase = createClientComponentClient()

    // Remover o campo tipo se ele existir, para compatibilidade com bancos de dados que não têm essa coluna
    const { tipo, ...documentoSemTipo } = documento

    const { data, error } = await supabase
      .from("documentos_propostas_corretores")
      .insert([documentoSemTipo])
      .select()
      .single()

    if (error) {
      console.error("Erro ao adicionar documento à proposta:", error)
      throw new Error(`Erro ao adicionar documento à proposta: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Erro ao adicionar documento à proposta:", error)
    throw error
  }
}

