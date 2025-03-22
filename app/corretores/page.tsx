"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { criarCorretor } from "@/services/corretores-service"

const ESTADOS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export default function CorretoresPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    estado: "",
  })
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro(null)
    setSucesso(false)

    try {
      await criarCorretor(formData)
      setSucesso(true)
      setFormData({
        nome: "",
        email: "",
        whatsapp: "",
        estado: "",
      })
    } catch (error) {
      console.error("Erro ao cadastrar corretor:", error)
      setErro("Ocorreu um erro ao cadastrar. Por favor, tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <>
      <Header />

      <main className="flex-grow py-8 md:py-10 bg-gray-50">
        <div className="container px-4 md:px-6">
          <p className="text-lg md:text-xl text-center text-gray-600 mb-4">
            Tenha acesso aos produtos das nossas corretoras parceiras
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-[#168979]">
            Seja um Corretor Parceiro
          </h1>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Cadastro de Corretor</CardTitle>
              <CardDescription>Preencha o formulário abaixo para se tornar um corretor parceiro.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {erro && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm md:text-base">{erro}</div>}

                {sucesso && (
                  <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm md:text-base">
                    Cadastro realizado com sucesso! Entraremos em contato em breve.
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm md:text-base">
                    Nome completo *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Digite seu nome completo"
                    required
                    className="text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">
                    E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Digite seu e-mail"
                    required
                    className="text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-sm md:text-base">
                    WhatsApp *
                  </Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="(00) 00000-0000"
                    required
                    className="text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-sm md:text-base">
                    Estado *
                  </Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) => setFormData({ ...formData, estado: value })}
                  >
                    <SelectTrigger id="estado" className="text-sm md:text-base">
                      <SelectValue placeholder="Selecione seu estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((estado) => (
                        <SelectItem key={estado} value={estado} className="text-sm md:text-base">
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#168979] hover:bg-[#13786a] text-sm md:text-base py-2 md:py-3"
                  disabled={carregando}
                >
                  {carregando ? "Enviando..." : "Enviar cadastro"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  )
}

