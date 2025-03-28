"use client"

import { useState, useEffect } from "react"
import { buscarCorretores, atualizarCorretor } from "@/services/corretores-service"
import type { Corretor } from "@/types/corretores"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export default function CorretoresPage() {
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<string>("todos")

  useEffect(() => {
    carregarCorretores()
  }, [])

  async function carregarCorretores() {
    try {
      setLoading(true)
      const data = await buscarCorretores()
      setCorretores(data)
    } catch (error) {
      console.error("Erro ao carregar corretores:", error)
      toast.error("Erro ao carregar corretores")
    } finally {
      setLoading(false)
    }
  }

  async function aprovarCorretor(id: string) {
    try {
      await atualizarCorretor(id, { status: "aprovado" })
      toast.success("Corretor aprovado com sucesso")
      carregarCorretores()
    } catch (error) {
      console.error("Erro ao aprovar corretor:", error)
      toast.error("Erro ao aprovar corretor")
    }
  }

  async function rejeitarCorretor(id: string) {
    try {
      await atualizarCorretor(id, { status: "rejeitado" })
      toast.success("Corretor rejeitado com sucesso")
      carregarCorretores()
    } catch (error) {
      console.error("Erro ao rejeitar corretor:", error)
      toast.error("Erro ao rejeitar corretor")
    }
  }

  const corretoresFiltrados = corretores.filter((corretor) => {
    const matchFiltro =
      corretor.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      corretor.email.toLowerCase().includes(filtro.toLowerCase()) ||
      corretor.cidade.toLowerCase().includes(filtro.toLowerCase())

    if (statusFiltro === "todos") return matchFiltro
    return matchFiltro && corretor.status === statusFiltro
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Corretores</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Resumo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de Corretores</p>
            <p className="text-2xl font-bold">{corretores.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Pendentes de Aprovação</p>
            <p className="text-2xl font-bold">{corretores.filter((c) => c.status === "pendente").length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Corretores Ativos</p>
            <p className="text-2xl font-bold">{corretores.filter((c) => c.status === "aprovado").length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <h2 className="text-lg font-semibold mb-4 md:mb-0">Lista de Corretores</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <input
                type="text"
                placeholder="Buscar corretor..."
                className="border rounded-md px-3 py-2 w-full"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div>
              <select
                className="border rounded-md px-3 py-2 w-full"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="pendente">Pendentes</option>
                <option value="aprovado">Aprovados</option>
                <option value="rejeitado">Rejeitados</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Telefone</th>
                  <th className="py-3 px-4 text-left">Localização</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {corretoresFiltrados.length > 0 ? (
                  corretoresFiltrados.map((corretor) => (
                    <tr key={corretor.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {corretor.foto_url ? (
                            <img
                              src={corretor.foto_url || "/placeholder.svg"}
                              alt={corretor.nome}
                              className="w-8 h-8 rounded-full mr-3 object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                              {corretor.nome.charAt(0)}
                            </div>
                          )}
                          {corretor.nome}
                        </div>
                      </td>
                      <td className="py-3 px-4">{corretor.email}</td>
                      <td className="py-3 px-4">{corretor.telefone}</td>
                      <td className="py-3 px-4">
                        {corretor.cidade}, {corretor.estado}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            corretor.status === "aprovado"
                              ? "bg-green-100 text-green-800"
                              : corretor.status === "rejeitado"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {corretor.status === "aprovado"
                            ? "Aprovado"
                            : corretor.status === "rejeitado"
                              ? "Rejeitado"
                              : "Pendente"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {corretor.status === "pendente" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => aprovarCorretor(corretor.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => rejeitarCorretor(corretor.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                        {corretor.status === "rejeitado" && (
                          <button
                            onClick={() => aprovarCorretor(corretor.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                          >
                            Aprovar
                          </button>
                        )}
                        {corretor.status === "aprovado" && (
                          <button
                            onClick={() => rejeitarCorretor(corretor.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                          >
                            Desativar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      Nenhum corretor encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
