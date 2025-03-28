"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase-auth"
import { Spinner } from "@/components/ui/spinner"

export default function GerenciarUsuarios() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [email, setEmail] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const [promoteLoading, setPromoteLoading] = useState(false)

  // Carregar usuários administradores
  useEffect(() => {
    async function loadAdminUsers() {
      try {
        // Não é possível listar todos os usuários com o cliente anônimo
        // Vamos apenas verificar o usuário atual
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          setUsers([user])
        }
      } catch (error) {
        console.error("Erro ao carregar usuários:", error)
        toast.error("Erro ao carregar usuários")
      } finally {
        setLoading(false)
      }
    }

    loadAdminUsers()
  }, [])

  // Buscar usuário por email
  const searchUser = async () => {
    if (!email) {
      toast.error("Digite um email para buscar")
      return
    }

    setSearchLoading(true)
    try {
      // Esta função não está disponível no cliente anônimo
      // Em um ambiente real, você precisaria de uma API serverless
      toast.error("Função não disponível no cliente. Use o painel do Supabase.")
    } catch (error: any) {
      console.error("Erro ao buscar usuário:", error)
      toast.error(error.message || "Erro ao buscar usuário")
    } finally {
      setSearchLoading(false)
    }
  }

  // Promover usuário a administrador
  const promoteToAdmin = async (userId: string) => {
    setPromoteLoading(true)
    try {
      // Esta função não está disponível no cliente anônimo
      // Em um ambiente real, você precisaria de uma API serverless
      toast.error("Função não disponível no cliente. Use o painel do Supabase.")
    } catch (error: any) {
      console.error("Erro ao promover usuário:", error)
      toast.error(error.message || "Erro ao promover usuário")
    } finally {
      setPromoteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Usuário</CardTitle>
          <CardDescription>Busque um usuário por email para atribuir permissões de administrador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <Input
                id="email"
                placeholder="Email do usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button onClick={searchUser} disabled={searchLoading}>
              {searchLoading ? <Spinner size="sm" /> : "Buscar"}
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
              Nota: Para atribuir permissões de administrador, use o painel do Supabase diretamente. Acesse
              Authentication &gt; Users, encontre o usuário e adicione {`{"role": "admin"}`} nos metadados.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Administradores</CardTitle>
          <CardDescription>Lista de usuários com permissões de administrador</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-gray-500">Nenhum usuário administrador encontrado</p>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                    <p className="text-sm text-green-600">Função: {user.user_metadata?.role || "Não definida"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
