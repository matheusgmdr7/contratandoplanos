import { createClient } from "@supabase/supabase-js"

// Valores padrão para desenvolvimento (não use em produção)
const defaultUrl =
  process.env.NODE_ENV === "production"
    ? "" // Em produção, deve ser configurado na plataforma
    : "https://jtzbuxoslaotpnwsphqv.supabase.co" // Valor para desenvolvimento

const defaultAnonKey =
  process.env.NODE_ENV === "production"
    ? "" // Em produção, deve ser configurado na plataforma
    : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0emJ1eG9zbGFvdHBud3NwaHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MDU5MDEsImV4cCI6MjA1ODA4MTkwMX0.jmI-h8pKW00TN5uNpo3Q16GaZzOpFAnPUVO0yyNq54U" // Valor para desenvolvimento

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey

// Verificação mais suave para ambiente de produção
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error("AVISO: NEXT_PUBLIC_SUPABASE_URL não está definida em produção")
}

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("AVISO: NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida em produção")
}

console.log("Inicializando cliente Supabase com URL:", supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Teste de conexão
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("planos").select("count").limit(1)

    if (error) {
      console.error("Erro na conexão inicial com Supabase:", error)
    } else {
      console.log("Conexão com Supabase estabelecida com sucesso")
    }
  } catch (error) {
    console.error("Erro ao testar conexão com Supabase:", error)
  }
}

// Só testa a conexão se as credenciais estiverem disponíveis
if (supabaseUrl && supabaseAnonKey) {
  testConnection()
}

