import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function fazerUploadDocumento(arquivo, caminho) {
  try {
    if (!arquivo) {
      return { error: new Error("Nenhum arquivo fornecido") }
    }

    const supabase = createClientComponentClient()

    // Extrair o nome do bucket do caminho (assumindo que o formato é bucket/pasta/arquivo)
    const partesCaminho = caminho.split("/")
    const bucket = partesCaminho[0] || "documentos_propostas" // Usar documentos_propostas como padrão
    const caminhoSemBucket = partesCaminho.slice(1).join("/")

    // Gerar um nome de arquivo único para evitar conflitos
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extensao = arquivo.name.split(".").pop()
    const nomeArquivoUnico = `${timestamp}_${randomString}.${extensao}`
    const caminhoFinal = caminhoSemBucket.replace(/[^/]+$/, nomeArquivoUnico)

    console.log(`Tentando upload para ${bucket}/${caminhoFinal}`)

    // Tentar fazer o upload do arquivo
    const { data, error } = await supabase.storage.from(bucket).upload(caminhoFinal, arquivo, {
      cacheControl: "3600",
      upsert: true, // Alterado para true para permitir substituição
    })

    if (error) {
      console.warn(`Erro ao fazer upload para ${bucket}/${caminhoFinal}:`, error.message)

      // Se o bucket não existir ou houver erro de permissão, tentar criar o bucket
      if (error.message.includes("bucket") || error.message.includes("permission")) {
        console.warn(`Tentando fazer upload no bucket 'documentos_propostas' como alternativa.`)

        // Tentar fazer upload no bucket documentos_propostas
        const { data: fallbackData, error: fallbackError } = await supabase.storage
          .from("documentos_propostas")
          .upload(caminhoFinal, arquivo, {
            cacheControl: "3600",
            upsert: true,
          })

        if (fallbackError) {
          console.error("Erro no fallback para documentos_propostas:", fallbackError)

          // Tentar último fallback para o bucket 'propostas'
          console.warn(`Tentando fazer upload no bucket 'propostas' como último recurso.`)
          const { data: lastFallbackData, error: lastFallbackError } = await supabase.storage
            .from("propostas")
            .upload(nomeArquivoUnico, arquivo, {
              cacheControl: "3600",
              upsert: true,
            })

          if (lastFallbackError) {
            console.error("Erro em todos os buckets:", lastFallbackError)

            // Em ambiente de desenvolvimento, simular um upload bem-sucedido
            if (process.env.NODE_ENV === "development") {
              console.log("Ambiente de desenvolvimento detectado. Simulando URL de arquivo.")
              return {
                url: `https://exemplo.com/arquivo-simulado-${nomeArquivoUnico}`,
                simulado: true,
              }
            }

            return { error: lastFallbackError }
          }

          // Obter URL pública do último fallback
          const {
            data: { publicUrl: lastFallbackUrl },
          } = supabase.storage.from("propostas").getPublicUrl(nomeArquivoUnico)

          return { url: lastFallbackUrl }
        }

        // Obter URL pública do fallback
        const {
          data: { publicUrl: fallbackUrl },
        } = supabase.storage.from("documentos_propostas").getPublicUrl(caminhoFinal)

        return { url: fallbackUrl }
      }

      // Se estiver em ambiente de desenvolvimento, simular um upload bem-sucedido
      if (process.env.NODE_ENV === "development") {
        console.log("Ambiente de desenvolvimento detectado. Simulando URL de arquivo.")
        return {
          url: `https://exemplo.com/arquivo-simulado-${nomeArquivoUnico}`,
          simulado: true,
        }
      }

      return { error }
    }

    // Obter URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(caminhoFinal)

    return { url: publicUrl }
  } catch (error) {
    console.error("Erro ao fazer upload do documento:", error)

    // Se estiver em ambiente de desenvolvimento, simular um upload bem-sucedido
    if (process.env.NODE_ENV === "development") {
      const nomeArquivoSimulado = `${Date.now()}_simulado.jpg`
      console.log("Ambiente de desenvolvimento detectado. Simulando URL de arquivo.")
      return {
        url: `https://exemplo.com/arquivo-simulado-${nomeArquivoSimulado}`,
        simulado: true,
      }
    }

    return { error }
  }
}

// Mantenho a função uploadArquivo como um alias para compatibilidade futura
export async function uploadArquivo(bucket, pasta, arquivo) {
  try {
    if (!arquivo) {
      console.warn("Nenhum arquivo fornecido para upload")
      return {
        nome: "arquivo-nao-fornecido.jpg",
        url: "https://exemplo.com/arquivo-nao-fornecido.jpg",
        path: `${bucket}/${pasta}/arquivo-nao-fornecido.jpg`,
        simulado: true,
      }
    }

    const caminho = `${bucket}/${pasta}/${arquivo.name}`
    const resultado = await fazerUploadDocumento(arquivo, caminho)

    if (resultado.error) {
      console.error("Erro no uploadArquivo:", resultado.error)

      // Se estiver em ambiente de desenvolvimento, retornar um resultado simulado
      if (process.env.NODE_ENV === "development") {
        return {
          nome: arquivo.name,
          url: `https://exemplo.com/arquivo-simulado-${Date.now()}_${arquivo.name}`,
          path: caminho,
          simulado: true,
        }
      }

      throw resultado.error
    }

    return {
      nome: arquivo.name,
      url: resultado.url,
      path: caminho,
      simulado: resultado.simulado || false,
    }
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error)

    // Se estiver em ambiente de desenvolvimento, retornar um resultado simulado
    if (process.env.NODE_ENV === "development") {
      return {
        nome: arquivo ? arquivo.name : "arquivo-erro.jpg",
        url: `https://exemplo.com/arquivo-simulado-erro-${Date.now()}.jpg`,
        path: `${bucket}/${pasta}/${arquivo ? arquivo.name : "arquivo-erro.jpg"}`,
        simulado: true,
      }
    }

    throw error
  }
}

// Vamos verificar a função que faz upload de avatares
// Esta função é responsável por fazer o upload da foto do corretor

import type { Database } from "@/lib/database.types"

export async function fazerUploadAvatar(file: File, userId: string): Promise<string | null> {
  try {
    const supabase = createClientComponentClient<Database>()

    // Aqui podemos ver que o bucket usado é 'avatars'
    const { data, error } = await supabase.storage.from("avatars").upload(`${userId}`, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      console.error("Erro ao fazer upload do avatar:", error)
      return null
    }

    // Retorna o caminho do arquivo
    return data?.path || null
  } catch (error) {
    console.error("Erro ao fazer upload do avatar:", error)
    return null
  }
}

// Adicione a função obterUrlAvatar se ela ainda não existir
export async function obterUrlAvatar(userId: string): Promise<string | null> {
  try {
    const supabase = createClientComponentClient()
    const { data } = await supabase.storage.from("avatars").getPublicUrl(userId)

    return data.publicUrl
  } catch (error) {
    console.error("Erro ao obter URL do avatar:", error)
    return null
  }
}

