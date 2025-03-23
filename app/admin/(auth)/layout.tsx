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
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6 overflow-x-auto">
            <div className="admin-content">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

