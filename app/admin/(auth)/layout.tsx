import type React from "react"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AuthGuard from "@/components/admin/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8 overflow-x-auto">
            <div>{children}</div>
          </main>
          <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t border-gray-200">
            <p>© {new Date().getFullYear()} Contratandoplanos - Painel Administrativo</p>
          </footer>
        </div>
      </div>
    </AuthGuard>
  )
}

