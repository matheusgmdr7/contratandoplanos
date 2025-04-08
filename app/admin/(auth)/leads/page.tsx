"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye, Mail, Phone } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { buscarLeads, atualizarLead } from "@/services/leads-service"
import type { Lead } from "@/services/leads-service"
import * as XLSX from "xlsx"

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("Todos")
  const [filtroData, setFiltroData] = useState("Todos")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [filtroFaixaEtaria, setFiltroFaixaEtaria] = useState("Todos")
  const [filtroOperadora, setFiltroOperadora] = useState("Todos")
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [carregando, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    carregarLeads()
  }, [])

  async function carregarLeads() {
    try {
      const dados = await buscarLeads()
      setLeads(dados)
    } catch (error) {
      console.error("Erro ao carregar leads:", error)
      setErro("Falha ao carregar os leads. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewLead = (lead: Lead) => {
    setLeadSelecionado(lead)
    setIsDialogOpen(true)
  }

  const handleStatusChange = async (leadId: number, novoStatus: string) => {
    try {
      await atualizarLead(leadId.toString(), { status: novoStatus })
      await carregarLeads()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      setErro("Falha ao atualizar o status. Por favor, tente novamente.")
    }
  }

  const leadsFiltrados = leads.filter((lead) => {
    const matchesSearch =
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm)
    const matchesStatus = filtroStatus === "Todos" || lead.status === filtroStatus
    const matchesEstado = filtroEstado === "Todos" || lead.estado === filtroEstado
    const matchesFaixaEtaria = filtroFaixaEtaria === "Todos" || lead.faixa_etaria === filtroFaixaEtaria
    const matchesOperadora = filtroOperadora === "Todos" || lead.plano_operadora === filtroOperadora

    // Filtro de data
    let matchesData = true
    if (filtroData !== "Todos") {
      const hoje = new Date()
      const dataLead = new Date(lead.data_registro)
      const diffTime = Math.abs(hoje.getTime() - dataLead.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      switch (filtroData) {
        case "Hoje":
          matchesData = diffDays === 0
          break
        case "Esta semana":
          matchesData = diffDays <= 7
          break
        case "Este mês":
          matchesData = diffDays <= 30
          break
        case "Este ano":
          matchesData = diffDays <= 365
          break
      }
    }

    return matchesSearch && matchesStatus && matchesEstado && matchesFaixaEtaria && matchesOperadora && matchesData
  })

  // Extrair valores únicos para os filtros
  const estados = Array.from(new Set(leads.map((lead) => lead.estado)))
  const faixasEtarias = Array.from(new Set(leads.map((lead) => lead.faixa_etaria)))
  const operadoras = Array.from(new Set(leads.map((lead) => lead.plano_operadora)))

  const exportarParaExcel = () => {
    // Preparar dados para exportação
    const dadosParaExportar = leads.map((lead) => ({
      Nome: lead.nome,
      Email: lead.email,
      WhatsApp: lead.whatsapp,
      Plano: lead.plano_nome,
      Operadora: lead.plano_operadora,
      "Faixa Etária": lead.faixa_etaria,
      Estado: lead.estado,
      "Data de Registro": new Date(lead.data_registro).toLocaleDateString(),
      Status: lead.status,
      Observações: lead.observacoes || "",
    }))

    // Criar planilha
    const ws = XLSX.utils.json_to_sheet(dadosParaExportar)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Leads")

    // Gerar arquivo
    XLSX.writeFile(wb, "leads.xlsx")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Leads</h1>
        <div className="flex gap-4">
          <Button onClick={exportarParaExcel} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
          <CardDescription>Visualize e gerencie todos os leads cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os status</SelectItem>
                  <SelectItem value="Novo">Novo</SelectItem>
                  <SelectItem value="Em contato">Em contato</SelectItem>
                  <SelectItem value="Convertido">Convertido</SelectItem>
                  <SelectItem value="Perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroData} onValueChange={setFiltroData}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os períodos</SelectItem>
                  <SelectItem value="Hoje">Hoje</SelectItem>
                  <SelectItem value="Esta semana">Esta semana</SelectItem>
                  <SelectItem value="Este mês">Este mês</SelectItem>
                  <SelectItem value="Este ano">Este ano</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os estados</SelectItem>
                  {estados.map((estado) => (
                    <SelectItem key={estado} value={estado || "N/A"}>
                      {estado}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filtroFaixaEtaria} onValueChange={setFiltroFaixaEtaria}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Faixa Etária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todas as faixas</SelectItem>
                  {faixasEtarias.map((faixa) => (
                    <SelectItem key={faixa} value={faixa || "N/A"}>
                      {faixa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filtroOperadora} onValueChange={setFiltroOperadora}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Operadora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos as operadoras</SelectItem>
                  {operadoras.map((operadora) => (
                    <SelectItem key={operadora} value={operadora || "N/A"}>
                      {operadora}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Faixa Etária</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data de Registro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : erro ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-red-500">
                      {erro}
                    </TableCell>
                  </TableRow>
                ) : leadsFiltrados.length > 0 ? (
                  leadsFiltrados.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.nome}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" /> {lead.email}
                          </span>
                          <span className="flex items-center mt-1">
                            <Phone className="h-3 w-3 mr-1" /> {lead.whatsapp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{lead.plano_nome}</span>
                          <span className="text-sm text-gray-500">{lead.plano_operadora}</span>
                        </div>
                      </TableCell>
                      <TableCell>{lead.faixa_etaria}</TableCell>
                      <TableCell>{lead.estado}</TableCell>
                      <TableCell>{new Date(lead.data_registro).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder={lead.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Novo">Novo</SelectItem>
                            <SelectItem value="Em contato">Em contato</SelectItem>
                            <SelectItem value="Convertido">Convertido</SelectItem>
                            <SelectItem value="Perdido">Perdido</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewLead(lead)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalhes</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Nenhum lead encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>Informações completas do lead selecionado.</DialogDescription>
          </DialogHeader>

          {leadSelecionado && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nome completo</h3>
                  <p className="mt-1">{leadSelecionado.nome}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        leadSelecionado.status === "Novo"
                          ? "bg-blue-100 text-blue-800"
                          : leadSelecionado.status === "Em contato"
                            ? "bg-yellow-100 text-yellow-800"
                            : leadSelecionado.status === "Convertido"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {leadSelecionado.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">E-mail</h3>
                  <p className="mt-1">{leadSelecionado.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">WhatsApp</h3>
                  <p className="mt-1">{leadSelecionado.whatsapp}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Plano selecionado</h3>
                  <p className="mt-1">{leadSelecionado.plano_nome}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Operadora</h3>
                  <p className="mt-1">{leadSelecionado.plano_operadora}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Faixa Etária</h3>
                <p className="mt-1">{leadSelecionado.faixa_etaria}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Estado</h3>
                <p className="mt-1">{leadSelecionado.estado}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Data de registro</h3>
                <p className="mt-1">{new Date(leadSelecionado.data_registro).toLocaleDateString()}</p>
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" asChild>
                  <a href={`mailto:${leadSelecionado.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar e-mail
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={`https://wa.me/${leadSelecionado.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contatar via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
