"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-auth"
import Link from "next/link"
import { Bell, Search, Settings, User } from "lucide-react"

export default function AdminHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function getUserInfo() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/admin/login")
        return
      }
      setUserEmail(session.user.email || null)

      // Extrair nome do email (parte antes do @)
      if (session.user.email) {
        const namePart = session.user.email.split("@")[0]
        // Capitalizar primeira letra de cada palavra
        const formattedName = namePart
          .split(".")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        setUserName(formattedName)
      }
    }
    getUserInfo()
  }, [router])

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <Link href="/admin" className="text-xl font-bold text-[#168979] hidden md:block">
          Contratandoplanos <span className="text-gray-500 font-normal">Admin</span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#168979] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="h-5 w-5 text-gray-500" />
        </button>

        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-[#168979] text-white flex items-center justify-center mr-2">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            {userName && <p className="text-sm font-medium">{userName}</p>}
            {userEmail && <p className="text-xs text-gray-500">{userEmail}</p>}
          </div>
        </div>
      </div>
    </header>
  )
}

