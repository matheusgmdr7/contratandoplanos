"use client"

import { useEffect, useState } from "react"
import PageHeader from "@/components/admin/page-header"
import StatCard from "@/components/admin/stat-card"
import { Users, FileText, Package, DollarSign, BarChart3, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulando carregamento de dados
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
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
          title="Total de Clientes"
          value="1,248"
          icon={Users}
          trend="up"
          trendValue="12% este mês"
          color="primary"
        />
        <StatCard
          title="Propostas Ativas"
          value="64"
          icon={FileText}
          trend="neutral"
          trendValue="Estável"
          color="info"
        />
        <StatCard
          title="Planos Vendidos"
          value="842"
          icon={Package}
          trend="up"
          trendValue="8% este mês"
          color="success"
        />
        <StatCard
          title="Receita Mensal"
          value="R$ 124.500"
          icon={DollarSign}
          trend="up"
          trendValue="15% este mês"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Vendas Recentes</h3>
            <Link href="/admin/propostas" className="text-sm text-[#168979] hover:underline">
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
            <h3 className="text-lg font-medium">Atividade Recente</h3>
            <button className="text-sm text-[#168979] hover:underline">Atualizar</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-1">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Nova proposta enviada</p>
                  <p className="text-xs text-gray-500">Há 2 horas atrás</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-center text-[#168979] hover:bg-gray-50 rounded-md">
            Ver mais atividades
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Corretores em Destaque</h3>
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
                  Vendas
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comissão
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">João Silva</p>
                        <p className="text-xs text-gray-500">joao.silva@exemplo.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">24 vendas</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">R$ 4.200,00</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Ativo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
