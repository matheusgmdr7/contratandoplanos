import { supabase } from "@/lib/supabase"
import type { Corretor } from "@/types/corretores"

// Interface para dados de login
export interface LoginData {
  email: string
  senha: string
}

// Interface para resultado de autenticação
export interface AuthResult {
  success: boolean
  message: string
  corretor?: Corretor
}

/**
 * Função simplificada para autenticação de corretores
 */
export async function autenticarCorretor(loginData: LoginData): Promise<AuthResult> {
  try {
    // 1. Buscar corretor pelo email
    const { data: corretor, error } = await supabase
      .from("corretores")
      .select("*")
      .eq("email", loginData.email)
      .single()

    // 2. Verificar se o corretor existe
    if (error || !corretor) {
      return {
        success: false,
        message: "Corretor não encontrado. Verifique seu email ou faça seu cadastro.",
      }
    }

    // 3. Em ambiente de desenvolvimento, não verificamos a senha
    const isDev =
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))

    if (!isDev) {
      // Em produção, verificar senha
      const senhaCorreta = corretor.senha === loginData.senha

      if (!senhaCorreta) {
        return {
          success: false,
          message: "Credenciais inválidas. Verifique seu email e senha.",
        }
      }
    }

    // 4. Verificar status do corretor
    if (corretor.status !== "aprovado") {
      return {
        success: true,
        message: "Login realizado com sucesso, aguardando aprovação.",
        corretor,
      }
    }

    // 5. Login bem-sucedido

    // 6. Salvar dados no localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "corretorLogado",
        JSON.stringify({
          ...corretor,
          // Criar uma sessão fictícia para compatibilidade
          session: {
            access_token: `token_${corretor.id}`,
            expires_at: Date.now() + 86400000, // 24 horas
            refresh_token: `refresh_${corretor.id}`,
          },
        }),
      )
    }

    return {
      success: true,
      message: "Login realizado com sucesso!",
      corretor,
    }
  } catch (error) {
    return {
      success: false,
      message: "Ocorreu um erro ao fazer login. Tente novamente.",
    }
  }
}

/**
 * Função para obter os dados do corretor autenticado
 * Esta função busca os dados atualizados do corretor no banco de dados
 */
export async function obterCorretorAutenticado(): Promise<Corretor | null> {
  try {
    // Verificar se o corretor está autenticado
    const { autenticado, corretor: corretorLocal } = verificarAutenticacao()

    if (!autenticado || !corretorLocal || !corretorLocal.id) {
      return null
    }

    // Buscar dados atualizados do corretor no banco de dados
    const { data: corretorAtualizado, error } = await supabase
      .from("corretores")
      .select("*")
      .eq("id", corretorLocal.id)
      .single()

    if (error || !corretorAtualizado) {
      console.error("Erro ao buscar dados do corretor:", error)
      return corretorLocal // Retorna os dados do localStorage como fallback
    }

    return corretorAtualizado
  } catch (error) {
    console.error("Erro ao obter corretor autenticado:", error)
    return null
  }
}

// Função para verificar se o corretor está autenticado
export function verificarAutenticacao(): { autenticado: boolean; corretor?: Corretor } {
  try {
    if (typeof window === "undefined") {
      return { autenticado: false }
    }

    // Verificar dados no localStorage
    const corretorLogadoStr = localStorage.getItem("corretorLogado")
    if (!corretorLogadoStr) {
      return { autenticado: false }
    }

    // Converter dados do localStorage
    const corretorLogado = JSON.parse(corretorLogadoStr)

    // Verificar se os dados são válidos
    if (!corretorLogado || !corretorLogado.id || !corretorLogado.email) {
      localStorage.removeItem("corretorLogado")
      return { autenticado: false }
    }

    return {
      autenticado: true,
      corretor: corretorLogado,
    }
  } catch (error) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("corretorLogado")
    }
    return { autenticado: false }
  }
}

// Função para fazer login (alias para compatibilidade)
export async function login(email: string, senha: string) {
  const result = await autenticarCorretor({ email, senha })
  return {
    sucesso: result.success,
    mensagem: result.message,
    corretor: result.corretor,
  }
}

// Função para fazer logout
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("corretorLogado")
  }
}
