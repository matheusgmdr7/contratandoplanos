"use client"

import { useState, useEffect } from "react"
import {
  buscarComissoes,
  atualizarStatusComissao,
  buscarResumoComissoes,
  criarComissaoManual,
  buscarCorretores,
} from "@/services/comissoes-service"
import type { Comissao, ResumoComissoes, Corretor } from "@/types/corretores"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { formatarMoeda } from "@/utils/formatters"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function ComissoesPage() {
  const [comissoes, setComissoes] = useState<Comissao[]>([])
  const [resumo, setResumo] = useState<ResumoComissoes | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState("")
  const [statusFiltro, setStatusFiltro] = useState<string>("todos")
  const [comissaoDetalhada, setComissaoDetalhada] = useState<Comissao | null>(null)
  const [dataPagamento, setDataPagamento] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showNovaComissaoModal, setShowNovaComissaoModal] = useState(false)
  const [corretores, setCorretores] = useState<Corretor[]>([])

  // Estado para nova comissão manual
  const [novaComissao, setNovaComissao] = useState({
    corretor_id: "",
    descricao: "",
    valor: "",
    percentual: "",
    data_prevista: "",
  })

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      setLoading(true)
      const [comissoesData, resumoData, corretoresData] = await Promise.all([
        buscarComissoes(),
        buscarResumoComissoes(),
        buscarCorretores(),
      ])
      setComissoes(comissoesData)
      setResumo(resumoData)
      setCorretores(corretoresData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  async function pagarComissao() {
    if (!comissaoDetalhada) return

    try {
      await atualizarStatusComissao(comissaoDetalhada.id, "pago", dataPagamento)
      toast.success("Comissão marcada como paga com sucesso")
      setShowModal(false)
      setDataPagamento("")
      setComissaoDetalhada(null)
      carregarDados()
    } catch (error) {
      console.error("Erro ao pagar comissão:", error)
      toast.error("Erro ao pagar comissão")
    }
  }

  async function adicionarComissaoManual() {
    try {
      if (!novaComissao.corretor_id || !novaComissao.valor || !novaComissao.data_prevista) {
        toast.error("Preencha todos os campos obrigatórios")
        return
      }

      await criarComissaoManual({
        ...novaComissao,
        valor: Number.parseFloat(novaComissao.valor),
      })

      toast.success("Comissão adicionada com sucesso")
      setShowNovaComissaoModal(false)
      setNovaComissao({
        corretor_id: "",
        descricao: "",
        valor: "",
        percentual: "",
        data_prevista: "",
      })
      carregarDados()
    } catch (error) {
      console.error("Erro ao adicionar comissão:", error)
      toast.error("Erro ao adicionar comissão")
    }
  }

  function abrirModalPagamento(comissao: Comissao) {
    setComissaoDetalhada(comissao)
    setDataPagamento(new Date().toISOString().split("T")[0])
    setShowModal(true)
  }

  function abrirModalNovaComissao() {
    setShowNovaComissaoModal(true)
    setNovaComissao({
      ...novaComissao,
      data_prevista: new Date().toISOString().split("T")[0],
    })
  }

  function handleNovaComissaoChange(e) {
    const { name, value } = e.target
    setNovaComissao((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const comissoesFiltradas = comissoes.filter((comissao) => {
    const matchFiltro =
      comissao.corretores?.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      comissao.propostas_corretores?.cliente?.toLowerCase().includes(filtro.toLowerCase()) ||
      comissao.propostas_corretores?.produto?.toLowerCase().includes(filtro.toLowerCase()) ||
      comissao.descricao?.toLowerCase().includes(filtro.toLowerCase())

    if (statusFiltro === "todos") return matchFiltro
    return matchFiltro && comissao.status === statusFiltro
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciamento de Comissões"
        description="Gerencie as comissões dos corretores parceiros."
        action={
          <Button onClick={abrirModalNovaComissao} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Nova Comissão
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Comissões Pendentes</p>
          <p className="text-2xl font-bold text-amber-600">{formatarMoeda(resumo?.totalPendente || 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Comissões Pagas</p>
          <p className="text-2xl font-bold text-green-600">{formatarMoeda(resumo?.totalPago || 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-sm text-gray-600">Total de Comissões</p>
          <p className="text-2xl font-bold">{formatarMoeda((resumo?.totalPendente || 0) + (resumo?.totalPago || 0))}</p>
        </div>
      </div>

      {resumo?.porMes && Object.keys(resumo.porMes).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <h3 className="text-md font-semibold mb-3">Comissões por Mês</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {Object.entries(resumo.porMes).map(([mes, valor]) => (
              <div key={mes} className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-600">{mes}</p>
                <p className="text-sm font-semibold">{formatarMoeda(valor)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <h2 className="text-lg font-semibold mb-4 md:mb-0">Lista de Comissões</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <input
                type="text"
                placeholder="Buscar comissão..."
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
                <option value="pago">Pagas</option>
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
                  <th className="py-3 px-4 text-left">Corretor</th>
                  <th className="py-3 px-4 text-left">Descrição/Cliente</th>
                  <th className="py-3 px-4 text-left">Valor</th>
                  <th className="py-3 px-4 text-left">Data Prevista</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {comissoesFiltradas.length > 0 ? (
                  comissoesFiltradas.map((comissao) => (
                    <tr key={comissao.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{comissao.corretores?.nome || "N/A"}</td>
                      <td className="py-3 px-4">
                        {comissao.descricao || comissao.propostas_corretores?.cliente || "N/A"}
                      </td>
                      <td className="py-3 px-4">{formatarMoeda(comissao.valor)}</td>
                      <td className="py-3 px-4">
                        {comissao.data_prevista
                          ? new Date(comissao.data_prevista).toLocaleDateString()
                          : comissao.data
                            ? new Date(comissao.data).toLocaleDateString()
                            : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            comissao.status === "pago" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {comissao.status === "pago" ? "Pago" : "Pendente"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {comissao.status === "pendente" && (
                          <button
                            onClick={() => abrirModalPagamento(comissao)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                          >
                            Pagar
                          </button>
                        )}
                        {comissao.status === "pago" && comissao.data_pagamento && (
                          <span className="text-sm text-gray-600">
                            Pago em {new Date(comissao.data_pagamento).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      Nenhuma comissão encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Pagamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Registrar Pagamento de Comissão</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Corretor</p>
              <p className="font-medium">{comissaoDetalhada?.corretores?.nome}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Valor da Comissão</p>
              <p className="font-medium">{formatarMoeda(comissaoDetalhada?.valor || 0)}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data do Pagamento</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowModal(false)
                  setDataPagamento("")
                  setComissaoDetalhada(null)
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={pagarComissao}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                disabled={!dataPagamento}
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nova Comissão */}
      {showNovaComissaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Adicionar Nova Comissão</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Corretor</label>
                <select
                  name="corretor_id"
                  value={novaComissao.corretor_id}
                  onChange={handleNovaComissaoChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">Selecione um corretor</option>
                  {corretores.map((corretor) => (
                    <option key={corretor.id} value={corretor.id}>
                      {corretor.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  value={novaComissao.descricao}
                  onChange={handleNovaComissaoChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Ex: Comissão por venda direta"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  name="valor"
                  value={novaComissao.valor}
                  onChange={handleNovaComissaoChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Percentual</label>
                <input
                  type="text"
                  name="percentual"
                  value={novaComissao.percentual}
                  onChange={handleNovaComissaoChange}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Ex: 5%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Prevista</label>
                <input
                  type="date"
                  name="data_prevista"
                  value={novaComissao.data_prevista}
                  onChange={handleNovaComissaoChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowNovaComissaoModal(false)
                  setNovaComissao({
                    corretor_id: "",
                    descricao: "",
                    valor: "",
                    percentual: "",
                    data_prevista: "",
                  })
                }}
                className="px-4 py-2 border rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarComissaoManual}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                disabled={!novaComissao.corretor_id || !novaComissao.valor || !novaComissao.data_prevista}
              >
                Adicionar Comissão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
