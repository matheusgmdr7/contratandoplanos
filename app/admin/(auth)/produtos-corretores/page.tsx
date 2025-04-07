"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  buscarProdutosCorretores,
  criarProdutoCorretor,
  atualizarProdutoCorretor,
  alterarDisponibilidadeProdutoCorretor,
  deletarProdutoCorretor,
} from "@/services/produtos-corretores-service"
import type { ProdutoCorretor } from "@/types/corretores"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { AlertCircle, CheckCircle, PlusCircle, Search } from "lucide-react"

export default function ProdutosCorretoresPage() {
  const [produtos, setProdutos] = useState<ProdutoCorretor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtro, setFiltro] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editandoProduto, setEditandoProduto] = useState<ProdutoCorretor | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    operadora: "",
    tipo: "",
    descricao: "",
    comissao: "",
    logo: "",
    disponivel: true,
  })

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    try {
      setLoading(true)
      setError(null)
      const data = await buscarProdutosCorretores()
      setProdutos(data)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setError("Não foi possível carregar os produtos. Tente novamente mais tarde.")
      toast.error("Erro ao carregar produtos")
    } finally {
      setLoading(false)
    }
  }

  function abrirModalCriar() {
    setFormData({
      nome: "",
      operadora: "",
      tipo: "",
      descricao: "",
      comissao: "",
      logo: "",
      disponivel: true,
    })
    setEditandoProduto(null)
    setShowModal(true)
  }

  function abrirModalEditar(produto: ProdutoCorretor) {
    setFormData({
      nome: produto.nome,
      operadora: produto.operadora,
      tipo: produto.tipo,
      descricao: produto.descricao || "",
      comissao: produto.comissao,
      logo: produto.logo || "",
      disponivel: produto.disponivel,
    })
    setEditandoProduto(produto)
    setShowModal(true)
  }

  async function salvarProduto() {
    try {
      if (editandoProduto) {
        await atualizarProdutoCorretor(editandoProduto.id, formData)
        toast.success("Produto atualizado com sucesso")
      } else {
        await criarProdutoCorretor(formData)
        toast.success("Produto criado com sucesso")
      }
      setShowModal(false)
      carregarProdutos()
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      toast.error("Erro ao salvar produto")
    }
  }

  async function alterarDisponibilidade(id: string, disponivel: boolean) {
    try {
      await alterarDisponibilidadeProdutoCorretor(id, disponivel)
      toast.success(disponivel ? "Produto ativado com sucesso" : "Produto desativado com sucesso")
      carregarProdutos()
    } catch (error) {
      console.error("Erro ao alterar disponibilidade:", error)
      toast.error("Erro ao alterar disponibilidade")
    }
  }

  async function excluirProduto(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return

    try {
      await deletarProdutoCorretor(id)
      toast.success("Produto excluído com sucesso")
      carregarProdutos()
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      toast.error("Erro ao excluir produto")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      produto.operadora.toLowerCase().includes(filtro.toLowerCase()) ||
      produto.tipo.toLowerCase().includes(filtro.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos para Corretores</h1>
        <button
          onClick={abrirModalCriar}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Adicionar Produto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Resumo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de Produtos</p>
            <p className="text-2xl font-bold">{produtos.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Produtos Ativos</p>
            <p className="text-2xl font-bold">{produtos.filter((p) => p.disponivel).length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Produtos Inativos</p>
            <p className="text-2xl font-bold">{produtos.filter((p) => !p.disponivel).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-lg font-semibold">Lista de Produtos</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produto..."
              className="border rounded-md pl-9 pr-3 py-2 w-64"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
            <p className="text-red-500">{error}</p>
            <button onClick={carregarProdutos} className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map((produto) => (
                <div
                  key={produto.id}
                  className={`border rounded-lg overflow-hidden ${produto.disponivel ? "border-gray-200" : "border-gray-300 bg-gray-50"}`}
                >
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      {produto.logo ? (
                        <img
                          src={produto.logo || "/placeholder.svg"}
                          alt={produto.operadora}
                          className="w-10 h-10 object-contain mr-3"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                            ;(e.target as HTMLImageElement).alt = "Logo indisponível"
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                          <span className="text-gray-500 text-xs">
                            {produto.operadora.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{produto.nome}</h3>
                        <p className="text-sm text-gray-600">{produto.operadora}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm">
                        <span className="text-gray-600">Tipo:</span> {produto.tipo}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-600">Comissão:</span> {produto.comissao}
                      </p>
                    </div>

                    {produto.descricao && <p className="text-sm text-gray-700 mb-3">{produto.descricao}</p>}

                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                          produto.disponivel ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {produto.disponivel ? (
                          <>
                            <CheckCircle size={12} />
                            Ativo
                          </>
                        ) : (
                          <>
                            <AlertCircle size={12} />
                            Inativo
                          </>
                        )}
                      </span>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => alterarDisponibilidade(produto.id, !produto.disponivel)}
                          className={`text-xs px-2 py-1 rounded ${
                            produto.disponivel ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {produto.disponivel ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          onClick={() => abrirModalEditar(produto)}
                          className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluirProduto(produto.id)}
                          className="text-xs px-2 py-1 rounded bg-red-100 text-red-800"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-gray-500">
                {filtro ? (
                  <>
                    <p>Nenhum produto encontrado para "{filtro}"</p>
                    <button onClick={() => setFiltro("")} className="mt-2 text-primary hover:underline">
                      Limpar filtro
                    </button>
                  </>
                ) : (
                  <>
                    <p>Nenhum produto cadastrado</p>
                    <button onClick={abrirModalCriar} className="mt-2 text-primary hover:underline">
                      Adicionar primeiro produto
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editandoProduto ? "Editar Produto" : "Adicionar Produto"}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operadora *</label>
                <input
                  type="text"
                  name="operadora"
                  value={formData.operadora}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Selecione um tipo</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Odontológico">Odontológico</option>
                  <option value="Vida">Vida</option>
                  <option value="Previdência">Previdência</option>
                  <option value="Residencial">Residencial</option>
                  <option value="Automóvel">Automóvel</option>
                  <option value="Viagem">Viagem</option>
                  <option value="Empresarial">Empresarial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comissão *</label>
                <input
                  type="text"
                  name="comissao"
                  value={formData.comissao}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Ex: 10%, R$ 100,00, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="disponivel"
                  name="disponivel"
                  checked={formData.disponivel}
                  onChange={(e) => setFormData((prev) => ({ ...prev, disponivel: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-700">
                  Disponível para corretores
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={salvarProduto}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                disabled={!formData.nome || !formData.operadora || !formData.tipo || !formData.comissao}
              >
                {editandoProduto ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

