import { supabase } from "@/lib/supabase"

export async function buscarPropostas() {
  try {
    const { data, error } = await supabase
      .from("propostas")
      .select(`
        *,
        plano:plano_id (
          id,
          nome,
          operadora
        )
      `)
      .order("created_at", { ascending: false })

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

export async function atualizarStatusProposta(id, status, motivoRejeicao) {
  try {
    const updateData = { status }
    if (motivoRejeicao) {
      updateData.motivo_rejeicao = motivoRejeicao
    }

    const { data, error } = await supabase.from("propostas").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("Erro ao atualizar status da proposta:", error)
      throw new Error(`Erro ao atualizar status da proposta: ${error.message}`)
    }

    // Se a proposta foi aprovada, verificamos se há um corretor associado
    // para criar automaticamente uma comissão
    if (status === "aprovada" && data.corretor_id) {
      await criarComissaoAutomatica(data)
    }

    return data
  } catch (error) {
    console.error("Erro ao atualizar status da proposta:", error)
    throw error
  }
}

// Função para criar automaticamente uma comissão quando uma proposta é aprovada
async function criarComissaoAutomatica(proposta) {
  try {
    // Primeiro, verificamos se o produto do corretor existe para esta proposta
    const { data: produtoCorretor, error: errorProduto } = await supabase
      .from("produtos_corretores")
      .select("*")
      .eq("corretor_id", proposta.corretor_id)
      .eq("nome", proposta.plano?.nome || "")
      .single()

    if (errorProduto && errorProduto.code !== "PGRST116") {
      console.error("Erro ao buscar produto do corretor:", errorProduto)
      return
    }

    // Calculamos a comissão com base no produto do corretor ou um valor padrão
    const percentualComissao = produtoCorretor ? Number.parseFloat(produtoCorretor.comissao) : 5
    const valorComissao = (proposta.valor * percentualComissao) / 100

    // Criamos a comissão
    const comissaoData = {
      corretor_id: proposta.corretor_id,
      proposta_id: proposta.id,
      valor: valorComissao,
      percentual: `${percentualComissao}%`,
      data: new Date().toISOString(),
      status: "pendente",
    }

    const { error: errorComissao } = await supabase.from("comissoes").insert([comissaoData])

    if (errorComissao) {
      console.error("Erro ao criar comissão automática:", errorComissao)
    }
  } catch (error) {
    console.error("Erro ao criar comissão automática:", error)
  }
}

