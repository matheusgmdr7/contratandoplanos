import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Valores padrão para desenvolvimento (não use em produção)
const defaultUrl =
  process.env.NODE_ENV === "production"
    ? undefined // Em produção, deve ser configurado na plataforma
    : "https://jtzbuxoslaotpnwsphqv.supabase.co" // Valor para desenvolvimento

const defaultAnonKey =
  process.env.NODE_ENV === "production"
    ? undefined // Em produção, deve ser configurado na plataforma
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0emJ1eG9zbGFvdHBud3NwaHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MDU5MDEsImV4cCI6MjA1ODA4MTkwMX0.jmI-h8pKW00TN5uNpo3Q16GaZzOpFAnPUVO0yyNq54U" // Valor para desenvolvimento

// Criar o cliente com opções explícitas
export const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey,
  options: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
})

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  // Verificar se o usuário tem a função de administrador
  const user = data.user
  const isAdmin = user?.user_metadata?.role === "admin"

  if (!isAdmin) {
    // Se o usuário não for administrador, faça logout e lance um erro
    await supabase.auth.signOut()
    throw new Error("Usuário não tem permissão de administrador")
  }

  return data
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return session
}

// Nova função para verificar se o usuário atual é administrador
export async function isCurrentUserAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.user_metadata?.role === "admin"
}

// Nova função para atribuir função de administrador a um usuário
export async function setUserAsAdmin(userId: string) {
  // Esta função só pode ser chamada por um usuário que já é administrador
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) {
    throw new Error("Apenas administradores podem atribuir funções de administrador")
  }

  // Atualizar os metadados do usuário
  const { data, error } = await supabase.auth.admin.updateUserById(userId, { user_metadata: { role: "admin" } })

  if (error) {
    throw new Error(`Erro ao atribuir função de administrador: ${error.message}`)
  }

  return data
}

export async function createAdminUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          role: "admin",
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error: any) {
    console.error("Erro ao criar usuário admin:", error)
    throw error
  }
}
