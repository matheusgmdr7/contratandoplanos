"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-auth"
import Link from "next/link"

export default function AdminHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const router = useRouter()

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

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 fixed md:relative w-full z-30">
      <div className="md:hidden">{/* Espaço para o botão de menu que está no AdminSidebar */}</div>
      <div className="hidden md:block">
        <Link href="/admin" className="text-lg font-semibold text-[#168979]">
          Contratandoplanos Admin
        </Link>
      </div>
      <div className="ml-auto text-sm text-gray-600">
        {userEmail && <span className="hidden md:inline">{userEmail}</span>}
      </div>
    </header>
  )
}

