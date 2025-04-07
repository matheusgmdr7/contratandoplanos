"use client"

import { Button } from "@/components/ui/button"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Users, Package, Menu, X, LogOut, User, ChevronDown, ChevronRight, Table, FileDown, Home } from "lucide-react"
import { signOutAdmin } from "@/lib/supabase-auth"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [corretoresExpanded, setCorretoresExpanded] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const avatarUrl = "" // Replace with actual avatar URL if available
  const corretor = { email: "admin@example.com" } // Replace with actual corretor data
  const getInitials = (name: string | undefined) => {
    if (!name) return ""
    const nameParts = name.split(" ")
    let initials = ""
    for (let i = 0; i < nameParts.length; i++) {
      initials += nameParts[i].charAt(0).toUpperCase()
    }
    return initials
  }

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
        className={`fixed top-0 left-0 z-40 h-screen bg-[#168979] text-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
        } md:translate-x-0 md:w-64 lg:w-72`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-white/10 px-4">
            <Link
              href="/corretor/dashboard"
              className="flex items-center gap-2 font-semibold transition-colors hover:bg-transparent"
            >
              <span className="text-lg">Portal do Administrador</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                    isActive("/admin") ? "bg-[#13786a] text-white" : "text-white/80 hover:bg-white/10",
                  )}
                  onClick={closeSidebar}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/planos"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                    isActive("/admin/planos") ? "bg-[#13786a] text-white" : "text-white/80 hover:bg-white/10",
                  )}
                  onClick={closeSidebar}
                >
                  <Package className="h-4 w-4" />
                  Planos
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/leads"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                    isActive("/admin/leads") ? "bg-[#13786a] text-white" : "text-white/80 hover:bg-white/10",
                  )}
                  onClick={closeSidebar}
                  // This link navigates to the admin leads page
                >
                  <Users className="h-4 w-4" />
                  Leads
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/tabelas"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                    isActive("/admin/tabelas") ? "bg-[#13786a] text-white" : "text-white/80 hover:bg-white/10",
                  )}
                  onClick={closeSidebar}
                >
                  <Table className="h-4 w-4" />
                  Tabelas de Preços
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/modelos-propostas"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                    isActive("/admin/modelos-propostas") ? "bg-[#13786a] text-white" : "text-white/80 hover:bg-white/10",
                  )}
                  onClick={closeSidebar}
                >
                  <FileDown className="h-4 w-4" />
                  Modelos de Propostas
                </Link>
              </li>

             {/* Seção de Corretores com expansão/colapso */}
         <li className="pt-3 mt-3">
           <button
             onClick={toggleCorretoresSection}
             className={`flex items-center justify-between w-full p-2 text-base font-normal rounded-lg hover:bg-gray-10 ${
               isCorretoresSection() ? "bg-white-10 font-medium" : ""
             }`}
           >
             <div className="flex items-center">
               <User className="w-5 h-5 text-white-500" />
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
                   className={cn(
                     "flex items-center p-2 text-sm font-normal rounded-lg transition-all hover:bg-transparent", // Adicionado hover:bg-transparent e transition-all
                     isActive("/admin/corretores") ? "bg-[#13786a] font-medium" : "text-white/80 hover:bg-white/10",
                   )}
                   onClick={closeSidebar}
                 >
                   <span>Corretores</span>
                 </Link>
               </li>
               <li>
                 <Link
                   href="/admin/propostas-corretores"
                   className={cn(
                     "flex items-center p-2 text-sm font-normal rounded-lg transition-all hover:bg-transparent", // Adicionado hover:bg-transparent e transition-all
                     isActive("/admin/propostas-corretores") ? "bg-[#13786a] font-medium" : "text-white/80 hover:bg-white/10",
                   )}
                   onClick={closeSidebar}
                 >
                   <span>Propostas</span>
                 </Link>
               </li>
               <li>
                 <Link
                   href="/admin/produtos-corretores"
                   className={cn(
                     "flex items-center p-2 text-sm font-normal rounded-lg transition-all hover:bg-transparent", // Adicionado hover:bg-transparent e transition-all
                     isActive("/admin/produtos-corretores") ? "bg-[#13786a] font-medium" : "text-white/80 hover:bg-white/10",
                   )}
                   onClick={closeSidebar}
                 >
                   <span>Produtos</span>
                 </Link>
               </li>
               <li>
                 <Link
                   href="/admin/comissoes"
                   className={cn(
                     "flex items-center p-2 text-sm font-normal rounded-lg transition-all hover:bg-transparent", // Adicionado hover:bg-transparent e transition-all
                     isActive("/admin/comissoes") ? "bg-[#13786a] font-medium" : "text-white/80 hover:bg-white/10",
                   )}
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
   </div>
   <div className="mt-auto p-4">
     <div className="flex flex-col items-center gap-2 rounded-lg px-3 py-2 border-t border-white/10 pt-4">
       <Avatar className="h-16 w-16 mb-2">
         <AvatarImage src={avatarUrl || ""} alt={corretor?.email || "Avatar do usuário"} />
         <AvatarFallback className="bg-white/20 text-white">{getInitials(corretor?.email)}</AvatarFallback>
       </Avatar>
       <div className="text-sm font-medium text-center">{corretor?.email}</div>
     </div>
     <Button
       variant="ghost"
       className="mt-2 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
       onClick={handleLogout}
     >
       <div className="p-4 border-t">
         <button
           onClick={handleLogout}
           type="button"
           disabled={isLoggingOut}
           className="flex w-full items-center p-2 text-base font-normal text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-50"
         >
           <LogOut className="w-5 h-5" />
           <span className="ml-3">{isLoggingOut ? "Saindo..." : "Sair"}</span>
         </button>
       </div>
     </Button>
   </aside>

   {/* Content - adjusted to give space to the sidebar */}
   <div className="md:ml-64 lg:ml-72">
     {/* Este div é apenas para empurrar o conteúdo para a direita em telas maiores */}
   </div>
 </>
 );
}

