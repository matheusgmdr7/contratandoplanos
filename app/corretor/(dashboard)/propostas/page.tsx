"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileUp, Download, Search, AlertCircle, Home, CreditCard } from "lucide-react"
import { toast } from "sonner"
import {
  buscarPropostasPorCorretor,
  criarPropostaCorretor,
  adicionarDocumentoPropostaCorretor,
} from "@/services/propostas-corretores-service"
import { buscarProdutosCorretores } from "@/services/produtos-corretores-service"
import { verificarAutenticacao } from "@/services/auth-corretores-simples"
import { Spinner } from "@/components/ui/spinner"
import { formatarMoeda } from "@/utils/formatters"
import { fazerUploadDocumento } from "@/services/storage-service"

export default function CorretorPropostasPage() {
  const [propostas, setPropostas] = useState([])
  const [produtos, setProdutos] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("Todos")
  const [novaProposta, setNovaProposta] = useState({
    cliente: "",
    email_cliente: "",
    whatsapp_cliente: "",
    produto: "",
    arquivo: null as File | null,
    rg_frente: null as File | null,
    rg_verso: null as File | null,
    comprovante_residencia: null as File | null,
  })
  const [carregando, setCarregando] = useState(true)
  const [carregandoEnvio, setCarregandoEnvio] = useState(false)
  const [erro, setErro] = useState(null)
  const [activeTab, setActiveTab] = useState("dados")

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true)
        setErro(null)

        // Verificar autenticação
        const { autenticado, corretor } = verificarAutenticacao()
        if (!autenticado || !corretor) {
          setErro("Usuário não autenticado. Por favor, faça login novamente.")
          return
        }

        // Carregar propostas
        const propostasData = await buscarPropostasPorCorretor(corretor.id)
        setPropostas(propostasData)

        // Carregar produtos
        const produtosData = await buscarProdutosCorretores()
        setProdutos(produtosData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setErro("Não foi possível carregar os dados. Por favor, tente novamente.")
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  const handleAddProposta = () => {
    setNovaProposta({
      cliente: "",
      email_cliente: "",
      whatsapp_cliente: "",
      produto: "",
      arquivo: null,
      rg_frente: null,
      rg_verso: null,
      comprovante_residencia: null,
    })
    setActiveTab("dados")
    setIsDialogOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setNovaProposta({
        ...novaProposta,
        [field]: e.target.files[0],
      })
    }
  }

  const formatarWhatsApp = (valor: string) => {
    // Remove todos os caracteres não numéricos
    const apenasNumeros = valor.replace(/\D/g, "")

    // Aplica a máscara (XX) XXXXX-XXXX
    if (apenasNumeros.length <= 2) {
      return apenasNumeros
    } else if (apenasNumeros.length <= 7) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`
    } else if (apenasNumeros.length <= 11) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`
    } else {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`
    }
  }

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarWhatsApp(e.target.value)
    setNovaProposta({
      ...novaProposta,
      whatsapp_cliente: valorFormatado,
    })
  }

  const handleSubmit = async () => {
    if (
      !novaProposta.cliente ||
      !novaProposta.email_cliente ||
      !novaProposta.whatsapp_cliente ||
      !novaProposta.produto
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    // Validar se os documentos obrigatórios foram anexados
    if (!novaProposta.rg_frente || !novaProposta.rg_verso || !novaProposta.comprovante_residencia) {
      toast.error("Por favor, anexe todos os documentos obrigatórios")
      setActiveTab("documentos")
      return
    }

    setCarregandoEnvio(true)

    try {
      // Verificar autenticação
      const { autenticado, corretor } = verificarAutenticacao()
      if (!autenticado || !corretor) {
        throw new Error("Usuário não autenticado")
      }

      // Criar proposta
      const novaProp = await criarPropostaCorretor({
        corretor_id: corretor.id,
        cliente: novaProposta.cliente,
        email_cliente: novaProposta.email_cliente,
        whatsapp_cliente: novaProposta.whatsapp_cliente,
        produto: novaProposta.produto,
        status: "pendente",
        valor: 0,
        comissao: 0,
        data: new Date().toISOString(),
      })

      // Upload do RG/CNH (frente)
      if (novaProposta.rg_frente) {
        const { url: urlRgFrente, error: errorRgFrente } = await fazerUploadDocumento(
          novaProposta.rg_frente,
          `documentos_propostas/${novaProp.id}/rg_frente/${novaProposta.rg_frente.name}`,
        )

        if (errorRgFrente) {
          console.error("Erro ao fazer upload do RG/CNH (frente):", errorRgFrente)
          toast.error(`Erro ao fazer upload do RG/CNH (frente): ${errorRgFrente.message}`)
        } else if (urlRgFrente) {
          await adicionarDocumentoPropostaCorretor({
            proposta_id: novaProp.id,
            nome: `RG/CNH (frente) - ${novaProposta.rg_frente.name}`,
            url: urlRgFrente,
            // Removido o campo tipo para compatibilidade
          })
        }
      }

      // Upload do RG/CNH (verso)
      if (novaProposta.rg_verso) {
        const { url: urlRgVerso, error: errorRgVerso } = await fazerUploadDocumento(
          novaProposta.rg_verso,
          `documentos_propostas/${novaProp.id}/rg_verso/${novaProposta.rg_verso.name}`,
        )

        if (errorRgVerso) {
          console.error("Erro ao fazer upload do RG/CNH (verso):", errorRgVerso)
          toast.error(`Erro ao fazer upload do RG/CNH (verso): ${errorRgVerso.message}`)
        } else if (urlRgVerso) {
          await adicionarDocumentoPropostaCorretor({
            proposta_id: novaProp.id,
            nome: `RG/CNH (verso) - ${novaProposta.rg_verso.name}`,
            url: urlRgVerso,
            // Removido o campo tipo para compatibilidade
          })
        }
      }

      // Upload do comprovante de residência
      if (novaProposta.comprovante_residencia) {
        const { url: urlComprovante, error: errorComprovante } = await fazerUploadDocumento(
          novaProposta.comprovante_residencia,
          `documentos_propostas/${novaProp.id}/comprovante/${novaProposta.comprovante_residencia.name}`,
        )

        if (errorComprovante) {
          console.error("Erro ao fazer upload do comprovante de residência:", errorComprovante)
          toast.error(`Erro ao fazer upload do comprovante de residência: ${errorComprovante.message}`)
        } else if (urlComprovante) {
          await adicionarDocumentoPropostaCorretor({
            proposta_id: novaProp.id,
            nome: `Comprovante de Residência - ${novaProposta.comprovante_residencia.name}`,
            url: urlComprovante,
            // Removido o campo tipo para compatibilidade
          })
        }
      }

      // Upload da proposta assinada (se houver)
      if (novaProposta.arquivo) {
        const { url, error: uploadError } = await fazerUploadDocumento(
          novaProposta.arquivo,
          `documentos_propostas/${novaProp.id}/proposta/${novaProposta.arquivo.name}`,
        )

        if (uploadError) {
          console.error("Erro ao fazer upload da proposta:", uploadError)
          toast.error(`Erro ao fazer upload da proposta: ${uploadError.message}`)
        } else if (url) {
          await adicionarDocumentoPropostaCorretor({
            proposta_id: novaProp.id,
            nome: `Proposta - ${novaProposta.arquivo.name}`,
            url: url,
            // Removido o campo tipo para compatibilidade
          })
        }
      }

      // Atualizar lista de propostas
      setPropostas([novaProp, ...propostas])
      setIsDialogOpen(false)
      toast.success("Proposta enviada com sucesso!")
    } catch (error) {
      console.error("Erro ao enviar proposta:", error)
      toast.error(`Erro ao enviar proposta: ${error.message || "Tente novamente."}`)
    } finally {
      setCarregandoEnvio(false)
    }
  }

  const propostasFiltradas = propostas.filter((proposta) => {
    const matchSearch =
      proposta.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.produto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.email_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposta.whatsapp_cliente?.includes(searchTerm)

    const matchStatus = filtroStatus === "Todos" || proposta.status === filtroStatus
    return matchSearch && matchStatus
  })

  if (erro) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Propostas</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-red-500 font-medium">{erro}</p>
              <Button onClick={() => window.location.reload()} className="bg-[#168979] hover:bg-[#13786a]">
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Propostas</h1>
        <Button onClick={handleAddProposta} className="bg-[#168979] hover:bg-[#13786a]">
          <Plus className="mr-2 h-4 w-4" />
          Nova Proposta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Propostas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente, email, WhatsApp ou produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="aprovada">Aprovadas</SelectItem>
                <SelectItem value="rejeitada">Rejeitadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex justify-center">
                        <Spinner />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Carregando propostas...</p>
                    </TableCell>
                  </TableRow>
                ) : propostasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {searchTerm || filtroStatus !== "Todos"
                        ? "Nenhuma proposta encontrada com os filtros aplicados"
                        : "Você ainda não possui propostas cadastradas"}
                    </TableCell>
                  </TableRow>
                ) : (
                  propostasFiltradas.map((proposta) => (
                    <TableRow key={proposta.id}>
                      <TableCell>{proposta.cliente}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Email:</span>
                          <span>{proposta.email_cliente || "-"}</span>
                          <span className="text-xs text-gray-500 mt-1">WhatsApp:</span>
                          <span>{proposta.whatsapp_cliente || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{proposta.produto}</TableCell>
                      <TableCell>
                        {proposta.created_at
                          ? new Date(proposta.created_at).toLocaleDateString("pt-BR")
                          : proposta.data
                            ? new Date(proposta.data).toLocaleDateString("pt-BR")
                            : "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            proposta.status === "aprovada"
                              ? "bg-green-100 text-green-800"
                              : proposta.status === "rejeitada"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {proposta.status === "aprovada"
                            ? "Aprovada"
                            : proposta.status === "rejeitada"
                              ? "Rejeitada"
                              : "Pendente"}
                        </span>
                      </TableCell>
                      <TableCell>{proposta.comissao > 0 ? formatarMoeda(proposta.comissao) : "-"}</TableCell>
                      <TableCell>
                        {proposta.documentos_propostas_corretores?.length > 0 && (
                          <div className="tooltip" data-tip="Ver documentos">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Proposta</DialogTitle>
            <DialogDescription>Preencha os dados da proposta para o cliente.</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dados">Dados do Cliente</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Nome do Cliente *</Label>
                <Input
                  id="cliente"
                  value={novaProposta.cliente}
                  onChange={(e) => setNovaProposta({ ...novaProposta, cliente: e.target.value })}
                  placeholder="Nome completo do cliente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email_cliente">Email do Cliente *</Label>
                <Input
                  id="email_cliente"
                  type="email"
                  value={novaProposta.email_cliente}
                  onChange={(e) => setNovaProposta({ ...novaProposta, email_cliente: e.target.value })}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp_cliente">WhatsApp do Cliente *</Label>
                <Input
                  id="whatsapp_cliente"
                  type="tel"
                  value={novaProposta.whatsapp_cliente}
                  onChange={handleWhatsAppChange}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="produto">Produto *</Label>
                <Select
                  value={novaProposta.produto}
                  onValueChange={(value) => setNovaProposta({ ...novaProposta, produto: value })}
                >
                  <SelectTrigger id="produto">
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.length === 0 ? (
                      <SelectItem value="carregando" disabled>
                        Carregando produtos...
                      </SelectItem>
                    ) : (
                      produtos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.nome}>
                          {produto.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setActiveTab("documentos")}
                  className="bg-[#168979] hover:bg-[#13786a]"
                >
                  Próximo: Documentos
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rg_frente" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    RG/CNH (Frente) *
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rg_frente"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileChange(e, "rg_frente")}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("rg_frente")?.click()}
                      className={`w-full flex items-center justify-center gap-2 ${!novaProposta.rg_frente ? "border-red-200" : ""}`}
                    >
                      <FileUp className="h-4 w-4" />
                      {novaProposta.rg_frente ? novaProposta.rg_frente.name : "Selecionar arquivo"}
                    </Button>
                    {novaProposta.rg_frente && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setNovaProposta({ ...novaProposta, rg_frente: null })}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rg_verso" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    RG/CNH (Verso) *
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rg_verso"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFileChange(e, "rg_verso")}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("rg_verso")?.click()}
                      className={`w-full flex items-center justify-center gap-2 ${!novaProposta.rg_verso ? "border-red-200" : ""}`}
                    >
                      <FileUp className="h-4 w-4" />
                      {novaProposta.rg_verso ? novaProposta.rg_verso.name : "Selecionar arquivo"}
                    </Button>
                    {novaProposta.rg_verso && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setNovaProposta({ ...novaProposta, rg_verso: null })}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comprovante_residencia" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Comprovante de Residência *
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="comprovante_residencia"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileChange(e, "comprovante_residencia")}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("comprovante_residencia")?.click()}
                    className={`w-full flex items-center justify-center gap-2 ${!novaProposta.comprovante_residencia ? "border-red-200" : ""}`}
                  >
                    <FileUp className="h-4 w-4" />
                    {novaProposta.comprovante_residencia
                      ? novaProposta.comprovante_residencia.name
                      : "Selecionar arquivo"}
                  </Button>
                  {novaProposta.comprovante_residencia && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNovaProposta({ ...novaProposta, comprovante_residencia: null })}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="arquivo" className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  Proposta Assinada (PDF) <span className="text-gray-500 text-xs">(opcional)</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="arquivo"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, "arquivo")}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("arquivo")?.click()}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <FileUp className="h-4 w-4" />
                    {novaProposta.arquivo ? novaProposta.arquivo.name : "Selecionar arquivo"}
                  </Button>
                  {novaProposta.arquivo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNovaProposta({ ...novaProposta, arquivo: null })}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("dados")}>
                  Voltar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    carregandoEnvio ||
                    !novaProposta.cliente ||
                    !novaProposta.email_cliente ||
                    !novaProposta.whatsapp_cliente ||
                    !novaProposta.produto ||
                    !novaProposta.rg_frente ||
                    !novaProposta.rg_verso ||
                    !novaProposta.comprovante_residencia
                  }
                  className="bg-[#168979] hover:bg-[#13786a]"
                >
                  {carregandoEnvio ? "Enviando..." : "Enviar Proposta"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
