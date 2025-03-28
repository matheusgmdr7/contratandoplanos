"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { toast } from "sonner"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [enviado, setEnviado] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)

    try {
      // Simulando o envio de email de recuperação
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setEnviado(true)
      toast.success("Email de recuperação enviado com sucesso!")
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error)
      toast.error("Erro ao enviar email. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <Header />

      <main className="flex-grow py-8 md:py-10 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-[#168979]">Recuperar Senha</h1>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Esqueceu sua senha?</CardTitle>
                <CardDescription>
                  {enviado
                    ? "Enviamos um email com instruções para recuperar sua senha."
                    : "Digite seu email para receber instruções de recuperação de senha."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enviado ? (
                  <div className="space-y-4">
                    <p className="text-center text-sm text-gray-600">
                      Verifique sua caixa de entrada e siga as instruções enviadas para o email:{" "}
                      <strong>{email}</strong>
                    </p>
                    <div className="flex flex-col space-y-2">
                      <Button onClick={() => setEnviado(false)} variant="outline">
                        Tentar com outro email
                      </Button>
                      <Link href="/corretor/login">
                        <Button className="w-full bg-[#168979] hover:bg-[#13786a]">Voltar para o login</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm md:text-base">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        className="text-sm md:text-base"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#168979] hover:bg-[#13786a] text-sm md:text-base py-2 md:py-3"
                      disabled={carregando}
                    >
                      {carregando ? "Enviando..." : "Recuperar Senha"}
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                      Lembrou sua senha?{" "}
                      <Link href="/corretor/login" className="text-[#168979] hover:underline">
                        Voltar para o login
                      </Link>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

