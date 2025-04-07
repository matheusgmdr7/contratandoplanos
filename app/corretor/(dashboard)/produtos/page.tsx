"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { buscarProdutosCorretores } from "@/services/produtos-corretores-service"

export default function CorretorProdutosPage() {
  const [produtos, setProdutos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
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
                <Button href="/corretor/tabelas" className="w-full bg-[#168979] hover:bg-[#13786a]">
                  Ver Tabela de Preços
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

