"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users2, MessageSquare, Phone, TrendingUp } from "lucide-react"
import { buscarLeads } from "@/services/leads-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [periodo, setPeriodo] = useState("hoje")

  useEffect(() => {
    carregarLeads()
  }, [])

  const carregarLeads = async () => {
    try {
      const dados = await buscarLeads()
      setLeads(dados)
    } catch (error) {
      setErro("Erro ao carregar leads")
      console.error("Erro ao carregar leads:", error)
    } finally {
      setCarregando(false)
    }
  }

  const filtrarLeadsPorPeriodo = (leads: any[], periodo: string) => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const inicioPeriodo = new Date(hoje)

    switch (periodo) {
      case "hoje":
        // Já está configurado para hoje
        break
      case "semana":
        inicioPeriodo.setDate(hoje.getDate() - 7)
        break
      case "mes":
        inicioPeriodo.setMonth(hoje.getMonth() - 1)
        break
      case "ano":
        inicioPeriodo.setFullYear(hoje.getFullYear() - 1)
        break
      case "todos":
        return leads
    }

    return leads.filter((lead) => {
      const dataLead = new Date(lead.data_registro)
      return dataLead >= inicioPeriodo && dataLead <= new Date()
    })
  }

  const leadsFiltrados = filtrarLeadsPorPeriodo(leads, periodo)
  const totalLeads = leadsFiltrados.length
  const leadsNovos = leadsFiltrados.filter((lead) => lead.status === "Novo").length
  const leadsEmContato = leadsFiltrados.filter((lead) => lead.status === "Em contato").length
  const leadsConvertidos = leadsFiltrados.filter((lead) => lead.status === "Convertido").length

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-full sm:w-[180px] text-sm md:text-base">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hoje" className="text-sm md:text-base">
              Hoje
            </SelectItem>
            <SelectItem value="semana" className="text-sm md:text-base">
              Últimos 7 dias
            </SelectItem>
            <SelectItem value="mes" className="text-sm md:text-base">
              Último mês
            </SelectItem>
            <SelectItem value="ano" className="text-sm md:text-base">
              Último ano
            </SelectItem>
            <SelectItem value="todos" className="text-sm md:text-base">
              Todos os períodos
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total de Leads</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {periodo === "hoje"
                ? "Hoje"
                : periodo === "semana"
                  ? "Últimos 7 dias"
                  : periodo === "mes"
                    ? "Último mês"
                    : periodo === "ano"
                      ? "Último ano"
                      : "Todos os períodos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Leads Novos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{leadsNovos}</div>
            <p className="text-xs text-muted-foreground">
              {periodo === "hoje"
                ? "Hoje"
                : periodo === "semana"
                  ? "Últimos 7 dias"
                  : periodo === "mes"
                    ? "Último mês"
                    : periodo === "ano"
                      ? "Último ano"
                      : "Todos os períodos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Em Contato</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{leadsEmContato}</div>
            <p className="text-xs text-muted-foreground">
              {periodo === "hoje"
                ? "Hoje"
                : periodo === "semana"
                  ? "Últimos 7 dias"
                  : periodo === "mes"
                    ? "Último mês"
                    : periodo === "ano"
                      ? "Último ano"
                      : "Todos os períodos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Convertidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{leadsConvertidos}</div>
            <p className="text-xs text-muted-foreground">
              {periodo === "hoje"
                ? "Hoje"
                : periodo === "semana"
                  ? "Últimos 7 dias"
                  : periodo === "mes"
                    ? "Último mês"
                    : periodo === "ano"
                      ? "Último ano"
                      : "Todos os períodos"}
            </p>
          </CardContent>
        </Card>
      </div>

      {carregando && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#168979]"></div>
        </div>
      )}
      {erro && <div className="text-red-500 text-sm md:text-base text-center py-4">{erro}</div>}
    </div>
  )
}

