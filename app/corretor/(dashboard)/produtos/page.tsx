"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, FileText, Download } from "lucide-react"
import { buscarProdutosCorretores } from "@/services/produtos-corretores-service"

export default function CorretorProdutosPage() {
  const [produtos, setProdutos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const produtosData = await buscarProdutosCorretores()
        setProdutos(produtosData)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setErro("Não foi possível carregar os produtos. Por favor, tente novamente.")
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  const handleVerDetalhes = (produto) => {
    setProdutoSelecionado(produto)
    setIsDialogOpen(true)
  }

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.operadora?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.tipo?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (erro) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Produtos</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-4">
              <p className="text-red-500">{erro}</p>
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
        <h1 className="text-2xl font-bold">Produtos</h1>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {searchTerm ? "Nenhum produto encontrado com os filtros aplicados" : "Nenhum produto disponível no momento"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtosFiltrados.map((produto) => (
            <Card key={produto.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    {produto.logo ? (
                      <img
                        src={produto.logo || "/placeholder.svg?height=80&width=80"}
                        alt={produto.operadora || "Logo"}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=80&width=80"
                          e.target.alt = "Logo indisponível"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-xs">
                          {produto.operadora ? produto.operadora.substring(0, 2).toUpperCase() : "PL"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{produto.nome}</CardTitle>
                    <CardDescription>
                      {produto.operadora} - {produto.tipo || "Plano de Saúde"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-4">{produto.descricao || "Sem descrição disponível"}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Comissão:</span>
                  <span className="text-[#168979] font-bold">{produto.comissao || "A definir"}</span>
                  {/* O código atual está correto e busca o percentual_comissao da tabela produtos_corretores. */}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button onClick={() => handleVerDetalhes(produto)} className="w-full bg-[#168979] hover:bg-[#13786a]">
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {produtoSelecionado && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{produtoSelecionado.nome}</DialogTitle>
                <DialogDescription>
                  {produtoSelecionado.operadora} - {produtoSelecionado.tipo || "Plano de Saúde"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 relative mb-4">
                    {produtoSelecionado.logo ? (
                      <img
                        src={produtoSelecionado.logo || "/placeholder.svg?height=128&width=128"}
                        alt={produtoSelecionado.operadora || "Logo"}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=128&width=128"
                          e.target.alt = "Logo indisponível"
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                          {produtoSelecionado.operadora
                            ? produtoSelecionado.operadora.substring(0, 2).toUpperCase()
                            : "PL"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Comissão</p>
                    <p className="text-2xl font-bold text-[#168979]">{produtoSelecionado.comissao || "A definir"}</p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Descrição</h3>
                    <p className="text-gray-600">{produtoSelecionado.descricao || "Sem descrição disponível"}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Características</h3>
                    {/* 
                      Nota: As características são definidas na tabela "produtos_corretores" no Supabase.
                      Você pode editar estas informações de duas formas:
                      1. No painel de administração em /admin/produtos-corretores
                      2. Diretamente no Supabase Dashboard na tabela "produtos_corretores"
                      
                      O campo "caracteristicas" deve ser um array de strings.
                      Se não houver características definidas, o sistema exibirá as características padrão abaixo.
                    */}
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {produtoSelecionado.caracteristicas ? (
                        produtoSelecionado.caracteristicas.map((caracteristica, index) => (
                          <li key={index}>{caracteristica}</li>
                        ))
                      ) : (
                        <>
                          <li>Cobertura nacional</li>
                          <li>Rede credenciada de qualidade</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1 bg-[#168979] hover:bg-[#13786a]">
                      <FileText className="mr-2 h-4 w-4" />
                      Gerar Proposta
                    </Button>
                    {produtoSelecionado.material_url && (
                      <a
                        href={produtoSelecionado.material_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Material
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

