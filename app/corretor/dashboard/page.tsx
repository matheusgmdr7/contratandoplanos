"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/corretor")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#168979]"></div>
    </div>
  )
}

