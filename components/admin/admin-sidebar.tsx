"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CreditCard, ClipboardList, LogOut, User } from "lucide-react"
import { signOutAdmin, supabase } from "@/lib/supabase-auth"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    async function getUserEmail() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/admin/login")
        return
      }
      setUserEmail(session.user.email || null)
    }
    getUserEmail()
  }, [router])

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/planos",
      label: "Planos",
      icon: CreditCard,
    },
    {
      href: "/admin/corretores",
      label: "Corretores",
      icon: Users,
    },
    {
      href: "/admin/leads",
      label: "Leads",
      icon: Users,
    },
    {
      href: "/admin/propostas",
      label: "Propostas",
      icon: ClipboardList,
    },
  ]

  const handleLogout = async () => {
    try {
      await signOutAdmin()
      toast.success("Logout realizado com sucesso!")
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      toast.error("Erro ao fazer logout")
    }
  }

  if (!userEmail) {
    return null
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-[#168979] overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-4">
          <span className="text-xl font-bold text-white">Admin</span>
        </div>
        <div className="px-4 py-2 flex items-center text-sm text-blue-100 border-t border-[#13786a]">
          <User className="h-4 w-4 mr-2" />
          {userEmail}
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-[#13786a] text-white"
                      : "text-blue-100 hover:bg-[#13786a] hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-6 w-6",
                      pathname === item.href ? "text-white" : "text-blue-100 group-hover:text-white",
                    )}
                    aria-hidden="true"
                  />
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
    </div>
  )
}

