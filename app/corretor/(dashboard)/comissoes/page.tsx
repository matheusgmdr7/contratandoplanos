"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buscarComissoesPorCorretor } from "@/services/comissoes-service"
import { Spinner } from "@/components/ui/spinner"
import { formatarMoeda } from "@/utils/formatters"
import { verificarAutenticacao } from "@/services/auth-corretores-simples"

export default function ComissoesPage() {
  const [comissoes, setComissoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [resumo, setResumo] = useState({
    total: 0,
    pagas: 0,
    pendentes: 0,
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    async function carregarComissoes() {
      try {
        setLoading(true)

        // Usar o sistema de autenticação simplificado
        const { autenticado, corretor } = verificarAutenticacao()

        if (!autenticado || !corretor) {
          setError("Usuário não autenticado. Por favor, faça login novamente.")
          return
        }

        const data = await buscarComissoesPorCorretor(corretor.id)
        setComissoes(data)

        // Calcular resumo
        const total = data.reduce((acc, comissao) => acc + Number(comissao.valor), 0)
        const pagas = data
          .filter((comissao) => comissao.status === "pago")
          .reduce((acc, comissao) => acc + Number(comissao.valor), 0)
        const pendentes = data
          .filter((comissao) => comissao.status === "pendente")
          .reduce((acc, comissao) => acc + Number(comissao.valor), 0)

        setResumo({ total, pagas, pendentes })
      } catch (error) {
        setError("Erro ao carregar comissões. Por favor, tente novamente.")
      } finally {
        setLoading(false)
      }
    }

    carregarComissoes()
  }, [])

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Minhas Comissões</h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Minhas Comissões</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Comissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatarMoeda(resumo.total)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comissões Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatarMoeda(resumo.pagas)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comissões Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatarMoeda(resumo.pendentes)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : comissoes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Descrição</th>
                    <th className="text-left py-3 px-4">Valor</th>
                    <th className="text-left py-3 px-4">Data Prevista</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {comissoes.map((comissao) => (
                    <tr key={comissao.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {comissao.descricao ||
                          (comissao.propostas_corretores?.cliente
                            ? `Proposta: ${comissao.propostas_corretores.cliente} - ${comissao.propostas_corretores.produto}`
                            : "Comissão")}
                      </td>
                      <td className="py-3 px-4">{formatarMoeda(comissao.valor)}</td>
                      <td className="py-3 px-4">
                        {comissao.data_prevista
                          ? new Date(comissao.data_prevista).toLocaleDateString()
                          : "Não definida"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            comissao.status === "pago" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {comissao.status === "pago" ? "Pago" : "Pendente"}
                        </span>
                        {comissao.status === "pago" && comissao.data_pagamento && (
                          <span className="text-xs text-gray-500 block mt-1">
                            Pago em {new Date(comissao.data_pagamento).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">Nenhuma comissão encontrada</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

