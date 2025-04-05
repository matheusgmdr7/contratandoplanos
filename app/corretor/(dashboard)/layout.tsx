"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Package, LogOut, Menu, X, DollarSign, Table } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { verificarAutenticacao, logout } from "@/services/auth-corretores-simples"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { obterUrlAvatar } from "@/services/storage-service"

export default function CorretorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [corretor, setCorretor] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    async function verificarAcesso() {
      try {
        console.log("Verificando autenticação do corretor...")

        // Verificar autenticação usando o módulo simplificado
        const { autenticado, corretor } = verificarAutenticacao()

        console.log("Resultado da verificação:", { autenticado, corretor })

        if (!autenticado || !corretor) {
          console.log("Corretor não autenticado, redirecionando para login")
          router.push("/corretor/login")
          return
        }

        // Verificar status atual do corretor no banco de dados
        const { data, error } = await supabase.from("corretores").select("*").eq("id", corretor.id).single()

        console.log("Dados atualizados do corretor:", { data, error })

        if (error || !data) {
          console.log("Erro ao buscar dados atualizados do corretor, redirecionando para login")
          logout()
          router.push("/corretor/login")
          return
        }

        // Verificar status do corretor
        if (data.status !== "aprovado") {
          console.log("Corretor não aprovado, redirecionando para aguardando aprovação")
          router.push("/corretor/aguardando-aprovacao")
          return
        }

        // Atualizar dados do corretor no localStorage
        localStorage.setItem(
          "corretorLogado",
          JSON.stringify({
            ...data,
            session: corretor.session,
          }),
        )

        setCorretor(data)
      } catch (error) {
        console.error("Erro ao verificar acesso:", error)
        logout()
        router.push("/corretor/login")
      } finally {
        setLoading(false)
      }
    }

    verificarAcesso()
  }, [router])

  useEffect(() => {
    async function carregarAvatar() {
      if (corretor?.id) {
        const url = await obterUrlAvatar(corretor.id)
        setAvatarUrl(url)
      }
    }

    if (corretor) {
      carregarAvatar()
    }
  }, [corretor])

  const handleLogout = () => {
    logout()
    router.push("/corretor/login")
  }

  const menuItems = [
    {
      href: "/corretor/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/corretor/propostas",
      label: "Propostas",
      icon: FileText,
    },
    {
      href: "/corretor/comissoes",
      label: "Comissões",
      icon: DollarSign,
    },
    {
      href: "/corretor/produtos",
      label: "Produtos",
      icon: Package,
    },
    {
      href: "/corretor/tabelas",
      label: "Tabelas",
      icon: Table,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
        <span className="ml-2 text-gray-600">Verificando credenciais...</span>
      </div>
    )
  }

  if (!corretor) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-[#168979] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-[#13786a] mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <img
              src="https://i.ibb.co/sdXM3bth/Post-Feed-e-Logo-6.png"
              alt="Logo Contratandoplanos"
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold">Corretor Digital</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-sm">{corretor.nome}</span>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#13786a]" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-[#168979] h-full w-64 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold text-white">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:bg-[#13786a]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="px-4 py-3 flex items-center gap-3 text-sm text-blue-100 border-t border-[#13786a]">
                <Avatar className="h-10 w-10 border-2 border-[#13786a]">
                  <AvatarImage src={avatarUrl || ""} alt={corretor.nome || corretor.email} />
                  <AvatarFallback className="bg-[#13786a] text-white">
                    {corretor.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-white font-medium">{corretor.nome || "Corretor"}</span>
                  <span className="text-xs text-blue-100">{corretor.email}</span>
                </div>
              </div>

              <nav className="mt-5 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden",
                        isActive
                          ? "bg-[#13786a] text-white shadow-md"
                          : "text-blue-100 hover:bg-[#13786a]/70 hover:text-white hover:translate-x-1",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-full" />}
                      <div
                        className={cn(
                          "flex items-center justify-center mr-3 p-1.5 rounded-md transition-all duration-200",
                          isActive ? "bg-white/20" : "bg-[#13786a]/20 group-hover:bg-white/10",
                        )}
                      >
                        <Icon
                          className={cn(
                            "flex-shrink-0 h-5 w-5",
                            isActive ? "text-white" : "text-blue-100 group-hover:text-white",
                          )}
                          aria-hidden="true"
                        />
                      </div>
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto pt-4 border-t border-[#13786a]">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-[#13786a] justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col bg-[#168979]">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
            <div className="px-4 py-3 flex items-center gap-3 text-sm text-blue-100 border-t border-[#13786a]">
              <Avatar className="h-10 w-10 border-2 border-[#13786a]">
                <AvatarImage src={avatarUrl || ""} alt={corretor.nome || corretor.email} />
                <AvatarFallback className="bg-[#13786a] text-white">
                  {corretor.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white font-medium">{corretor.nome || "Corretor"}</span>
                <span className="text-xs text-blue-100">{corretor.email}</span>
              </div>
            </div>
            <nav className="flex-1 px-2 pb-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden",
                      isActive
                        ? "bg-[#13786a] text-white shadow-md"
                        : "text-blue-100 hover:bg-[#13786a]/70 hover:text-white hover:translate-x-1",
                    )}
                  >
                    {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-full" />}
                    <div
                      className={cn(
                        "flex items-center justify-center mr-3 p-1.5 rounded-md transition-all duration-200",
                        isActive ? "bg-white/20" : "bg-[#13786a]/20 group-hover:bg-white/10",
                      )}
                    >
                      <Icon
                        className={cn(
                          "flex-shrink-0 h-5 w-5",
                          isActive ? "text-white" : "text-blue-100 group-hover:text-white",
                        )}
                        aria-hidden="true"
                      />
                    </div>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="p-4 border-t border-[#13786a]">
              <Button
                variant="ghost"
                className="w-full text-white hover:bg-[#13786a] justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-auto">{children}</main>
      </div>
    </div>
  )
}

