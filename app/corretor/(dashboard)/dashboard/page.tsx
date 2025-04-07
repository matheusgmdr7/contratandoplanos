"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react"
// Verificar se a importação está correta
import { buscarPropostasPorCorretor } from "@/services/propostas-corretores-service"
import { getCorretorLogado } from "@/services/auth-corretores-service"
import { buscarComissoesPorCorretor } from "@/services/comissoes-service"
import { formatarMoeda } from "@/utils/formatters"

interface DashboardStats {
  propostasEnviadas: number
  propostasAprovadas: number
  comissoesPendentes: number
  comissoesTotais: number
  comissoesPagas: number
  clientesAtivos: number
}

export default function CorretorDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    propostasEnviadas: 0,
    propostasAprovadas: 0,
    comissoesPendentes: 0,
    comissoesTotais: 0,
    comissoesPagas: 0,
    clientesAtivos: 0,
  })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [ultimasPropostas, setUltimasPropostas] = useState<any[]>([])
  const [ultimasComissoes, setUltimasComissoes] = useState<any[]>([])

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true)
        setErro(null)

        // Obter o corretor logado
        const corretor = getCorretorLogado()

        if (!corretor || !corretor.id) {
          setErro("Corretor não autenticado ou ID não disponível")
          setCarregando(false)
          return
        }

        console.log("ID do corretor autenticado:", corretor.id)

        // Buscar propostas do corretor
        const propostas = await buscarPropostasPorCorretor(corretor.id)

        // Buscar comissões do corretor - NOVO
        const comissoes = await buscarComissoesPorCorretor(corretor.id)

        // Calcular resumo das comissões da mesma forma que na página de comissões
        const comissoesTotais = comissoes.reduce((acc, comissao) => acc + Number(comissao.valor), 0)
        const comissoesPagas = comissoes
          .filter((comissao) => comissao.status === "pago")
          .reduce((acc, comissao) => acc + Number(comissao.valor), 0)
        const comissoesPendentes = comissoes
          .filter((comissao) => comissao.status === "pendente")
          .reduce((acc, comissao) => acc + Number(comissao.valor), 0)

        // Calcular estatísticas com base nas propostas reais
        const propostasEnviadas = propostas.length
        const propostasAprovadas = propostas.filter((p) => p.status === "aprovada").length

        // Calcular clientes únicos (baseado no email)
        const clientesUnicos = new Set(propostas.map((p) => p.email_cliente))
        const clientesAtivos = clientesUnicos.size

        // Atualizar estatísticas
        setStats({
          propostasEnviadas,
          propostasAprovadas,
          comissoesPendentes, // Agora usando o valor calculado das comissões pendentes
          comissoesTotais, // Novo campo
          comissoesPagas, // Novo campo
          clientesAtivos,
        })

        // Definir últimas propostas (limitado a 3)
        const propostasRecentes = [...propostas]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)

        setUltimasPropostas(propostasRecentes)

        // Definir últimas comissões (limitado a 3) - NOVO
        const comissoesRecentes = [...comissoes]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)

        // Atualizar o estado com as comissões recentes
        setUltimasComissoes(comissoesRecentes)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        setErro("Erro ao carregar dados do dashboard")
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [])

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erro ao carregar o dashboard</h2>
        <p className="text-gray-600 mb-4">{erro}</p>
        <p className="text-sm text-gray-500">Tente novamente mais tarde ou contate o suporte.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Propostas Enviadas</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.propostasEnviadas}</div>
              <p className="text-xs text-gray-500">Propostas enviadas no total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Propostas Aprovadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.propostasAprovadas}</div>
              <p className="text-xs text-gray-500">Propostas aprovadas no total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Comissões Pendentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{formatarMoeda(stats.comissoesPendentes)}</div>
              <p className="text-xs text-gray-500">Comissões a receber</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clientesAtivos}</div>
              <p className="text-xs text-gray-500">Total de clientes ativos</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimas Propostas</CardTitle>
            <CardDescription>Propostas enviadas recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between py-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : ultimasPropostas.length > 0 ? (
              <div className="space-y-2">
                {ultimasPropostas.map((proposta, index) => (
                  <div
                    key={proposta.id}
                    className={`flex justify-between py-2 ${index < ultimasPropostas.length - 1 ? "border-b" : ""}`}
                  >
                    <span>{proposta.nome_cliente || proposta.email_cliente}</span>
                    <span className="text-[#168979]">{proposta.produto_nome || proposta.plano_nome || "Plano"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma proposta enviada ainda</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comissões Recentes</CardTitle>
            <CardDescription>Últimas comissões recebidas</CardDescription>
          </CardHeader>
          <CardContent>
            {carregando ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between py-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : ultimasComissoes.length > 0 ? (
              <div className="space-y-2">
                {ultimasComissoes.map((comissao, index) => (
                  <div
                    key={comissao.id}
                    className={`flex justify-between py-2 ${index < ultimasComissoes.length - 1 ? "border-b" : ""}`}
                  >
                    <span>
                      {comissao.descricao ||
                        (comissao.propostas_corretores?.cliente
                          ? `${comissao.propostas_corretores.cliente}`
                          : "Comissão")}
                    </span>
                    <span className="text-green-600">{formatarMoeda(comissao.valor)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma comissão recebida ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

