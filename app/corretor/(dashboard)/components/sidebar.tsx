"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import { BarChart3, FileText, Home, LogOut, Users } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Buscar a URL do avatar
        try {
          const { data } = await supabase.storage.from("avatars").getPublicUrl(user.id)

          setAvatarUrl(data.publicUrl)
        } catch (error) {
          console.error("Erro ao buscar avatar:", error)
        }
      }
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // Obter as iniciais do email para o fallback do avatar
  const getInitials = (email: string | undefined) => {
    if (!email) return "U"
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="h-screen border-r bg-green-800 text-white">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-auto py-2">
          <div className="flex h-14 items-center border-b border-white/10 px-4">
            <Link href="/corretor/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="text-lg">Corretor Digital</span>
            </Link>
          </div>
          <nav className="grid items-start px-2 py-4 text-sm font-medium">
            <Link
              href="/corretor/dashboard"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                pathname === "/corretor/dashboard" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10",
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/corretor/propostas"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                pathname === "/corretor/propostas" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10",
              )}
            >
              <FileText className="h-4 w-4" />
              Propostas
            </Link>
            <Link
              href="/corretor/clientes"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                pathname === "/corretor/clientes" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10",
              )}
            >
              <Users className="h-4 w-4" />
              Clientes
            </Link>
            <Link
              href="/corretor/relatorios"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-white",
                pathname === "/corretor/relatorios" ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="flex flex-col items-center gap-2 rounded-lg px-3 py-2 border-t border-white/10 pt-4">
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src={avatarUrl || ""} alt={user?.email || "Avatar do usuário"} />
              <AvatarFallback className="bg-white/20 text-white">{getInitials(user?.email)}</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium text-center">{user?.email}</div>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start text-white/80 hover:bg-white/10 hover:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}

