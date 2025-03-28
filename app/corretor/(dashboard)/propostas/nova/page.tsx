"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/hooks/auth"
import { criarProposta } from "@/services/propostas-corretores-service"
import { buscarProdutosAtivos } from "@/services/produtos-corretores-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  cliente_nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cliente_email: z.string().email("Email inválido"),
  cliente_telefone: z.string().min(10, "Telefone inválido"),
  produto_id: z.string().min(1, "Selecione um produto"),
  valor: z.string().min(1, "Valor é obrigatório"),
  observacoes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NovaPropostaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [produtos, setProdutos] = useState<any[]>([])
  const [carregandoProdutos, setCarregandoProdutos] = useState(true)
  const [enviando, setEnviando] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente_nome: "",
      cliente_email: "",
      cliente_telefone: "",
      produto_id: "",
      valor: "",
      observacoes: "",
    },
  })

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    setCarregandoProdutos(true)
    try {
      const dados = await buscarProdutosAtivos()
      setProdutos(dados)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      })
    } finally {
      setCarregandoProdutos(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    if (!user?.id) {
      toast({
        title: "Erro ao criar proposta",
        description: "Você precisa estar logado para criar uma proposta.",
        variant: "destructive",
      })
      return
    }

    setEnviando(true)
    try {
      // Converte o valor para número
      const valorNumerico = Number.parseFloat(data.valor.replace(/[^\d,.-]/g, "").replace(",", "."))

      await criarProposta({
        corretor_id: user.id,
        cliente_nome: data.cliente_nome,
        cliente_email: data.cliente_email,
        cliente_telefone: data.cliente_telefone,
        produto_id: Number.parseInt(data.produto_id),
        valor: valorNumerico,
        status: "pendente",
        observacoes: data.observacoes,
      })

      router.push("/corretor/propostas")
    } catch (error) {
      console.error("Erro ao criar proposta:", error)
      toast({
        title: "Erro ao criar proposta",
        description: "Ocorreu um erro ao criar a proposta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setEnviando(false)
    }
  }

  // Formata o valor como moeda brasileira
  const formatarValorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "")

    if (valor === "") {
      form.setValue("valor", "")
      return
    }

    // Converte para centavos e depois formata
    valor = (Number.parseInt(valor) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

    form.setValue("valor", valor)
  }

  // Formata o telefone
  const formatarTelefoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let telefone = e.target.value.replace(/\D/g, "")

    if (telefone.length > 11) {
      telefone = telefone.substring(0, 11)
    }

    if (telefone.length > 10) {
      telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    } else if (telefone.length > 6) {
      telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3")
    } else if (telefone.length > 2) {
      telefone = telefone.replace(/^(\d{2})(\d{0,5})$/, "($1) $2")
    }

    form.setValue("cliente_telefone", telefone)
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/corretor/propostas")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para propostas
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nova Proposta</CardTitle>
          <CardDescription>Preencha os dados para criar uma nova proposta de seguro</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cliente_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cliente_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="cliente_telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e)
                            formatarTelefoneInput(e)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados da Proposta</h3>
                <FormField
                  control={form.control}
                  name="produto_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produto</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={carregandoProdutos}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um produto" />
                          </SelectTrigger>
                          <SelectContent>
                            {carregandoProdutos ? (
                              <div className="flex items-center justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                <span>Carregando produtos...</span>
                              </div>
                            ) : produtos.length > 0 ? (
                              produtos.map((produto) => (
                                <SelectItem key={produto.id} value={produto.id.toString()}>
                                  {produto.nome}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-muted-foreground">Nenhum produto disponível</div>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e)
                            formatarValorInput(e)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais sobre a proposta"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Opcional. Adicione detalhes relevantes para a análise da proposta.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/corretor/propostas")}
                  disabled={enviando}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={enviando}>
                  {enviando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {enviando ? "Enviando..." : "Criar Proposta"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

