"use client"

import { useState, useEffect } from "react"
import { buscarPropostas, atualizarStatusProposta } from "@/services/propostas-service"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { formatarMoeda } from "@/utils/formatters"
import { PageHeader } from "@/components/admin/page-header"

export default function PropostasPage() {
  const [propostas, setPropostas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("")
  const [statusFiltro, setStatusFiltro] = useState("todos")
  const [propostaDetalhada, setPropostaDetalhada] = useState(null)
  const [motivoRejeicao, setMotivoRejeicao] = useState("")
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    carregarPropostas()
  }, [])

  async function carregarPropostas() {
    try {
      setLoading(true)
      const data = await buscarPropostas()
      setPropostas(data)
    } catch (error) {
      console.error("Erro ao carregar propostas:", error)
      toast.error("Erro ao carregar propostas")
    } finally {
      setLoading(false)
    }
  }

  async function aprovarProposta(id) {
    try {
      await atualizarStatusProposta(id, "aprovada")
      toast.success("Proposta aprovada com sucesso")
      carregarPropostas()
    } catch (error) {
      console.error("Erro ao aprovar proposta:", error)
      toast.error("Erro ao aprovar proposta")
    }
  }

  async function rejeitarProposta() {
    if (!propostaDetalhada) return

    try {
      await atualizarStatusProposta(propostaDetalhada.id, "rejeitada", motivoRejeicao)
      toast.success("Proposta rejeitada com sucesso")
      setShowModal(false)
      setMotivoRejeicao("")
      setPropostaDetalhada(null)
      carregarPropostas()
    } catch (error) {
      console.error("Erro ao rejeitar proposta:", error)
      toast.error("Erro ao rejeitar proposta")
    }
  }

  function abrirModalRejeicao(proposta) {
    setPropostaDetalhada(proposta)
    setShowModal(true)
  }

  const propostasFiltradas = propostas.filter((proposta) => {
    const matchFiltro =
      proposta.nome_cliente?.toLowerCase().includes(filtro.toLowerCase()) ||
      proposta.plano?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      proposta.corretor_id?.toLowerCase().includes(filtro.toLowerCase())

    if (statusFiltro === "todos") return matchFiltro
    return matchFiltro && proposta.status === statusFiltro
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Propostas" description="Gerencie as propostas de planos de saúde." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total de Propostas</p>
          <p className="text-2xl font-bold">{propostas.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Pendentes de Aprovação</p>
          <p className="text-2xl font-bold text-amber-600">{propostas.filter((p) => p.status === "pendente").length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Valor Total Aprovado</p>
          <p className="text-2xl font-bold text-green-600">
            {formatarMoeda(
              propostas.filter((p) => p.status === "aprovada").reduce((acc, p) => acc + Number(p.valor || 0), 0),
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <h2 className="text-lg font-semibold mb-4 md:mb-0">Lista de Propostas</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <input
                type="text"
                placeholder="Buscar proposta..."
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
                <option value="aprovada">Aprovadas</option>
                <option value="rejeitada">Rejeitadas</option>
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
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left">Cliente</th>
                  <th className="py-3 px-4 text-left">Plano</th>
                  <th className="py-3 px-4 text-left">Corretor</th>
                  <th className="py-3 px-4 text-left">Valor</th>
                  <th className="py-3 px-4 text-left">Data</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {propostasFiltradas.length > 0 ? (
                  propostasFiltradas.map((proposta) => (
                    <tr key={proposta.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{proposta.nome_cliente}</td>
                      <td className="py-3 px-4">{proposta.plano?.nome || "N/A"}</td>
                      <td className="py-3 px-4">{proposta.corretor_nome || "Direto"}</td>
                      <td className="py-3 px-4">{formatarMoeda(proposta.valor || 0)}</td>
                      <td className="py-3 px-4">{new Date(proposta.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
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
                      </td>
                      <td className="py-3 px-4">
                        {proposta.status === "pendente" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => aprovarProposta(proposta.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => abrirModalRejeicao(proposta)}
                              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                            >
                              Rejeitar
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => setPropostaDetalhada(proposta)}
                          className="text-blue-500 underline text-sm ml-2"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      Nenhuma proposta encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Rejeição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rejeitar Proposta</h3>
            <p className="mb-4">Informe o motivo da rejeição:</p>
            <textarea
              className="w-full border rounded-md p-2 mb-4"
              rows={4}
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
              placeholder="Motivo da rejeição..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setMotivoRejeicao("")
                  setPropostaDetalhada(null)
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={rejeitarProposta}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                disabled={!motivoRejeicao.trim()}
              >
                Rejeitar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {propostaDetalhada && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Detalhes da Proposta</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium">{propostaDetalhada.nome_cliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{propostaDetalhada.email_cliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium">{propostaDetalhada.telefone_cliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plano</p>
                <p className="font-medium">{propostaDetalhada.plano?.nome || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Operadora</p>
                <p className="font-medium">{propostaDetalhada.plano?.operadora || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor</p>
                <p className="font-medium">{formatarMoeda(propostaDetalhada.valor || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      propostaDetalhada.status === "aprovada"
                        ? "bg-green-100 text-green-800"
                        : propostaDetalhada.status === "rejeitada"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {propostaDetalhada.status === "aprovada"
                      ? "Aprovada"
                      : propostaDetalhada.status === "rejeitada"
                        ? "Rejeitada"
                        : "Pendente"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-medium">{new Date(propostaDetalhada.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {propostaDetalhada.status === "rejeitada" && propostaDetalhada.motivo_rejeicao && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Motivo da Rejeição</p>
                <p className="font-medium">{propostaDetalhada.motivo_rejeicao}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button onClick={() => setPropostaDetalhada(null)} className="px-4 py-2 bg-gray-200 rounded-md">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
