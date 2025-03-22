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

