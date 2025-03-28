"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart, Users, Package, Menu, X, LogOut, User, ChevronDown, ChevronRight } from "lucide-react"
import { signOutAdmin } from "@/lib/supabase-auth"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [corretoresExpanded, setCorretoresExpanded] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Detectar se é mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar inicialmente
    checkIfMobile()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkIfMobile)

    // Limpar listener
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Fechar sidebar automaticamente após navegação em mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [pathname, isMobile])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const toggleCorretoresSection = (e: React.MouseEvent) => {
    e.preventDefault()
    setCorretoresExpanded(!corretoresExpanded)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const isCorretoresSection = () => {
    return (
      pathname.includes("/admin/corretores") ||
      pathname.includes("/admin/propostas-corretores") ||
      pathname.includes("/admin/produtos-corretores") ||
      pathname.includes("/admin/comissoes")
    )
  }

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOutAdmin()
      router.push("/admin/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button onClick={toggleSidebar} className="p-2 rounded-md bg-white shadow-md" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay para mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
        } md:translate-x-0 md:w-64 lg:w-72`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold">Painel Admin</h1>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 ${
                    isActive("/admin") ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <BarChart className="w-5 h-5 text-gray-500" />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/planos"
                  className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 ${
                    isActive("/admin/planos") ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="ml-3">Planos</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/leads"
                  className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 ${
                    isActive("/admin/leads") ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="ml-3">Leads</span>
                </Link>
              </li>

              {/* Seção de Corretores com expansão/colapso */}
              <li className="pt-3 mt-3">
                <button
                  onClick={toggleCorretoresSection}
                  className={`flex items-center justify-between w-full p-2 text-base font-normal rounded-lg hover:bg-gray-100 ${
                    isCorretoresSection() ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="ml-3">Corretores</span>
                  </div>
                  {corretoresExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Submenu de Corretores */}
                {corretoresExpanded && (
                  <ul className="pl-6 mt-1 space-y-1">
                    <li>
                      <Link
                        href="/admin/corretores"
                        className={`flex items-center p-2 text-sm font-normal rounded-lg hover:bg-gray-100 ${
                          isActive("/admin/corretores") ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={closeSidebar}
                      >
                        <span>Corretores</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/propostas-corretores"
                        className={`flex items-center p-2 text-sm font-normal rounded-lg hover:bg-gray-100 ${
                          isActive("/admin/propostas-corretores") ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={closeSidebar}
                      >
                        <span>Propostas</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/produtos-corretores"
                        className={`flex items-center p-2 text-sm font-normal rounded-lg hover:bg-gray-100 ${
                          isActive("/admin/produtos-corretores") ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={closeSidebar}
                      >
                        <span>Produtos</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/admin/comissoes"
                        className={`flex items-center p-2 text-sm font-normal rounded-lg hover:bg-gray-100 ${
                          isActive("/admin/comissoes") ? "bg-gray-100 font-medium" : ""
                        }`}
                        onClick={closeSidebar}
                      >
                        <span>Comissões</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center p-2 text-base font-normal text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">{isLoggingOut ? "Saindo..." : "Sair"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal - ajustado para dar espaço à sidebar */}
      <div className="md:ml-64 lg:ml-72">
        {/* Este div é apenas para empurrar o conteúdo para a direita em telas maiores */}
      </div>
    </>
  )
}
