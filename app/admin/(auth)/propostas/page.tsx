"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/components/ui/use-toast"
import { downloadFile, getPropostas, exportToExcel } from "@/utils/supabase"
import { Download, FileText, Table } from "lucide-react"

interface Proposta {
  id: string
  nome: string
  email: string
  whatsapp: string
  cpf: string
  created_at: string
  operadora: string
  plano: string
  valor: number
  documentos: Array<{
    tipo: string
    arquivo_url: string
    arquivo_nome: string
  }>
}

export default function PropostasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const { toast } = useToast()

  useEffect(() => {
    carregarPropostas()
  }, [])

  async function carregarPropostas() {
    try {
      const data = await getPropostas()
      setPropostas(data)
    } catch (error) {
      console.error("Erro ao carregar propostas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar as propostas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDownload(url: string, fileName: string) {
    try {
      await downloadFile(url, fileName)
      toast({
        title: "Sucesso",
        description: "Download iniciado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao fazer download:", error)
      toast({
        title: "Erro",
        description: "Não foi possível fazer o download do arquivo.",
        variant: "destructive",
      })
    }
  }

  async function handleExportExcel() {
    try {
      await exportToExcel(propostas)
      toast({
        title: "Sucesso",
        description: "Dados exportados para Excel com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      })
    }
  }

  const propostasFiltradas = propostas.filter((proposta) => {
    const matchesSearch =
      proposta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.cpf.includes(searchTerm)

    if (filtroStatus === "todos") return matchesSearch
    return matchesSearch
  })

  return (
    <main className="p-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Propostas</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Input
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px]"
            />
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovada">Aprovada</SelectItem>
                <SelectItem value="rejeitada">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportExcel} className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="w-8 h-8" />
          </div>
        ) : propostasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <FileText className="w-12 h-12 mb-4" />
            <p>Nenhuma proposta encontrada</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {propostasFiltradas.map((proposta) => (
              <Card key={proposta.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{proposta.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Email:</div>
                      <div>{proposta.email}</div>
                      <div className="text-muted-foreground">WhatsApp:</div>
                      <div>{proposta.whatsapp}</div>
                      <div className="text-muted-foreground">CPF:</div>
                      <div>{proposta.cpf}</div>
                      <div className="text-muted-foreground">Operadora:</div>
                      <div>{proposta.operadora}</div>
                      <div className="text-muted-foreground">Plano:</div>
                      <div>{proposta.plano}</div>
                      <div className="text-muted-foreground">Valor:</div>
                      <div>R$ {proposta.valor.toFixed(2)}</div>
                      <div className="text-muted-foreground">Data:</div>
                      <div>{new Date(proposta.created_at).toLocaleDateString()}</div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Documentos:</h4>
                      <div className="space-y-2">
                        {proposta.documentos?.map((doc) => (
                          <Button
                            key={doc.arquivo_url}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleDownload(doc.arquivo_url, doc.arquivo_nome)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {doc.tipo}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

