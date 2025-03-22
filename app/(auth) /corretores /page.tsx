"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { buscarCorretores, criarCorretor, atualizarCorretor, deletarCorretor } from "@/services/corretores-service"
import type { Corretor } from "@/types/corretores"

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export default function CorretoresAdminPage() {
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [corretorAtual, setCorretorAtual] = useState<Partial<Corretor>>({
    nome: "",
    email: "",
    whatsapp: "",
    estado: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    carregarCorretores()
  }, [])

  async function carregarCorretores() {
    setCarregando(true)
    setErro(null)

    try {
      const resultados = await buscarCorretores()
      setCorretores(resultados)
    } catch (error) {
      console.error("Erro ao carregar corretores:", error)
      setErro("Falha ao carregar os corretores. Por favor, tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  const handleAddCorretor = () => {
    setIsEditing(false)
    setCorretorAtual({
      nome: "",
      email: "",
      whatsapp: "",
      estado: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditCorretor = (corretor: Corretor) => {
    setIsEditing(true)
    setCorretorAtual(corretor)
    setIsDialogOpen(true)
  }

  const handleDeleteCorretor = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este corretor?")) {
      try {
        await deletarCorretor(id.toString())
        setCorretores(corretores.filter((corretor) => corretor.id !== id))
      } catch (error) {
        console.error("Erro ao excluir corretor:", error)
        alert("Erro ao excluir corretor. Por favor, tente novamente.")
      }
    }
  }

  const handleSaveCorretor = async () => {
    try {
      setCarregando(true)
      setErro(null)

      // Validar campos obrigatórios
      if (!corretorAtual.nome || !corretorAtual.email || !corretorAtual.whatsapp || !corretorAtual.estado) {
        setErro("Por favor, preencha todos os campos obrigatórios.")
        return
      }

      if (isEditing && corretorAtual.id) {
        await atualizarCorretor(corretorAtual.id.toString(), corretorAtual)
      } else {
        await criarCorretor(corretorAtual as Omit<Corretor, "id" | "created_at">)
      }

      await carregarCorretores()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar corretor:", error)
      setErro(error instanceof Error ? error.message : "Erro ao salvar corretor. Por favor, tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  const corretoresFiltrados = corretores.filter((corretor) => {
    const matchSearch =
      corretor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      corretor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEstado = filtroEstado === "Todos" || corretor.estado === filtroEstado
    return matchSearch && matchEstado
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Corretores</h1>
        <Button onClick={handleAddCorretor}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Corretor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Corretores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Buscar corretores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {ESTADOS.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {carregando ? (
            <div className="text-center py-4">Carregando corretores...</div>
          ) : erro ? (
            <div className="text-center py-4 text-red-500">{erro}</div>
          ) : corretoresFiltrados.length === 0 ? (
            <div className="text-center py-4">Nenhum corretor encontrado.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {corretoresFiltrados.map((corretor) => (
                  <TableRow key={corretor.id}>
                    <TableCell>{corretor.nome}</TableCell>
                    <TableCell>{corretor.email}</TableCell>
                    <TableCell>{corretor.whatsapp}</TableCell>
                    <TableCell>{corretor.estado}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditCorretor(corretor)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteCorretor(corretor.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Corretor" : "Novo Corretor"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite as informações do corretor abaixo."
                : "Preencha as informações do novo corretor abaixo."}
            </DialogDescription>
          </DialogHeader>

          {erro && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">{erro}</div>}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={corretorAtual.nome}
                  onChange={(e) => setCorretorAtual({ ...corretorAtual, nome: e.target.value })}
                  placeholder="Nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={corretorAtual.email}
                  onChange={(e) => setCorretorAtual({ ...corretorAtual, email: e.target.value })}
                  placeholder="exemplo@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  value={corretorAtual.whatsapp}
                  onChange={(e) => setCorretorAtual({ ...corretorAtual, whatsapp: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Select
                  value={corretorAtual.estado}
                  onValueChange={(value) => setCorretorAtual({ ...corretorAtual, estado: value })}
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCorretor} disabled={carregando}>
              {carregando ? "Salvando..." : isEditing ? "Salvar Alterações" : "Adicionar Corretor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

