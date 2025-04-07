export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

export function formatarData(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR")
}

export function formatarTelefone(telefone: string): string {
  if (!telefone) return ""

  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, "")

  // Formata conforme o padrão brasileiro
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
  } else if (numeros.length === 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
  }

  return telefone
}

export function formatarCPF(cpf: string): string {
  if (!cpf) return ""

  // Remove caracteres não numéricos
  const numeros = cpf.replace(/\D/g, "")

  // Formata como CPF: 000.000.000-00
  if (numeros.length === 11) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`
  }

  return cpf
}

