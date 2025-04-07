"use client"

import { useEffect, useState } from "react"
import PageHeader from "@/components/admin/page-header"
import StatCard from "@/components/admin/stat-card"
import { Users, FileText, Package, DollarSign, BarChart3, TrendingUp } from 'lucide-react'
import Link from "next/link"
import { buscarLeads } from "@/services/leads-service"
import { buscarPropostasCorretores } from "@/services/propostas-service"
import { buscarCorretores } from "@/services/corretores-service"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [leadsRecebidos, setLeadsRecebidos] = useState(0)
  const [propostasRecebidas, setPropostasRecebidas] = useState(0)
  const [propostasAprovadas, setPropostasAprovadas] = useState(0)
  const [corretoresAtivos, setCorretoresAtivos] = useState(0)
  const [corretores, setCorretores] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch Leads
        const leads = await buscarLeads()
        setLeadsRecebidos(leads.length)

        // Fetch Propostas de Corretores
        const propostasCorretores = await buscarPropostasCorretores()
        setPropostasRecebidas(propostasCorretores.length)

        // Filtra propostas aprovadas
        const aprovadas = propostasCorretores.filter((p) => p.status === "aprovada").length
        setPropostasAprovadas(aprovadas)

        // Fetch Corretores
        const corretoresData = await buscarCorretores()
        // Verificando se o campo status existe antes de filtrar
        const ativos = corretoresData.filter((c) => c.status === "aprovado").length
        setCorretoresAtivos(ativos)
        setCorretores(corretoresData)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Definindo valores padrão em caso de erro
        setLeadsRecebidos(0)
        setPropostasRecebidas(0)
        setPropostasAprovadas(0)
        setCorretoresAtivos(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#168979]"></div>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Bem-vindo ao painel administrativo da Contratandoplanos."
        actions={
          <button className="px-4 py-2 bg-[#168979] text-white rounded-md hover:bg-[#13786a] transition-colors">
            Gerar Relatório
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Leads Recebidos"
          value={leadsRecebidos}
          icon={Users}
          trend="up"
          trendValue="Total"
          color="primary"
        />
        <StatCard
          title="Propostas Recebidas"
          value={propostasRecebidas}
          icon={FileText}
          trend="neutral"
          trendValue="Total"
          color="info"
        />
        <StatCard
          title="Propostas Aprovadas"
          value={propostasAprovadas}
          icon={Package}
          trend="up"
          trendValue="Total"
          color="success"
        />
        <StatCard
          title="Corretores Ativos"
          value={corretoresAtivos}
          icon={DollarSign}
          trend="up"
          trendValue="Total"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Vendas Recentes</h3>
            <Link href="/admin/propostas-corretores" className="text-sm text-[#168979] hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="h-64 flex items-center justify-center">
            <BarChart3 className="h-32 w-32 text-gray-300" />
            <p className="text-gray-500 ml-4">Gráfico de vendas será exibido aqui</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Novos Corretores</h3>
            <Link href="/admin/corretores" className="text-sm text-[#168979] hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Corretor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {corretores.slice(0, 3).map((corretor) => (
                  <tr key={corretor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{corretor.nome}</p>
                          <p className="text-xs text-gray-500">{corretor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">{corretor.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

