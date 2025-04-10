"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { buscarPlanosPorFaixaEtaria } from "@/services/planos-service"
import type { Plano } from "@/types/planos"
import Script from "next/script" // Import Script component

export default function CotacaoPage() {
  const router = useRouter()
  const [idade, setIdade] = useState("")
  const [planosFiltrados, setPlanosFiltrados] = useState<Plano[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    // Recuperar o plano selecionado do localStorage
    const planoSalvo = localStorage.getItem("planoSelecionado")
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    setErro(null)

    try {
      // Salvar a idade no localStorage
      localStorage.setItem("idade", idade)

      const resultados = await buscarPlanosPorFaixaEtaria(idade)
      setPlanosFiltrados(resultados)
      setMostrarResultados(true)
    } catch (error) {
      console.error("Erro ao buscar planos:", error)
      setErro("Ocorreu um erro ao buscar os planos. Por favor, tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  const handleSelecionarPlano = (plano: Plano) => {
    // Armazenar o plano selecionado e redirecionar para a página de cadastro
    localStorage.setItem("planoSelecionado", JSON.stringify(plano))
    router.push("/cadastro")
  }

  return (
    <>
      <Header />

      {/* Meta Pixel Code - Loading asynchronously */}
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
         !function(f,b,e,v,n,t,s)
         {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
           n.callMethod.apply(n,arguments):n.queue.push(arguments)};
         if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
         n.queue=[];t=b.createElement(e);t.async=!0;
         t.src=v;s=b.getElementsByTagName(e)[0];
         s.parentNode.insertBefore(t,s)}(window, document,'script',
         'https://connect.facebook.net/en_US/fbevents.js');
         fbq('init', '987817753011551');
         fbq('track', 'PageView');
       `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=987817753011551&ev=PageView&noscript=1"
        />
      </noscript>
      {/* End Meta Pixel Code */}

      <main className="flex-grow py-8 md:py-10 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-[#168979]">
            Faça sua cotação de plano de saúde
          </h1>

          {!mostrarResultados ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Informações para cotação</CardTitle>
                <CardDescription>
                  Preencha sua faixa etária para encontrarmos os melhores planos para você.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="idade" className="text-sm md:text-base">
                      Faixa etária
                    </Label>
                    <Select value={idade} onValueChange={setIdade} required>
                      <SelectTrigger id="idade" className="text-sm md:text-base">
                        <SelectValue placeholder="Selecione sua faixa etária" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-18" className="text-sm md:text-base">
                          0 a 18 anos
                        </SelectItem>
                        <SelectItem value="19-23" className="text-sm md:text-base">
                          19 a 23 anos
                        </SelectItem>
                        <SelectItem value="24-28" className="text-sm md:text-base">
                          24 a 28 anos
                        </SelectItem>
                        <SelectItem value="29-33" className="text-sm md:text-base">
                          29 a 33 anos
                        </SelectItem>
                        <SelectItem value="34-38" className="text-sm md:text-base">
                          34 a 38 anos
                        </SelectItem>
                        <SelectItem value="39-43" className="text-sm md:text-base">
                          39 a 43 anos
                        </SelectItem>
                        <SelectItem value="44-48" className="text-sm md:text-base">
                          44 a 48 anos
                        </SelectItem>
                        <SelectItem value="49-53" className="text-sm md:text-base">
                          49 a 53 anos
                        </SelectItem>
                        <SelectItem value="54-58" className="text-sm md:text-base">
                          54 a 58 anos
                        </SelectItem>
                        <SelectItem value="59+" className="text-sm md:text-base">
                          59 anos ou mais
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#168979] hover:bg-[#13786a] text-sm md:text-base py-2 md:py-3"
                    disabled={carregando}
                  >
                    {carregando ? "Buscando planos..." : "Buscar planos"}
                  </Button>

                  {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-[#168979]">Planos encontrados</h2>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setMostrarResultados(false)}>
                  Voltar à pesquisa
                </Button>
              </div>

              {planosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {planosFiltrados.map((plano) => (
                    <Card key={plano.id} className="overflow-hidden">
                      <CardHeader className="bg-[#168979] text-white">
                        <CardTitle className="text-lg md:text-xl">{plano.nome}</CardTitle>
                        <CardDescription className="text-gray-100">{plano.operadora}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 md:pt-6">
                        <div className="mb-4">
                          <p className="text-2xl md:text-3xl font-bold text-[#168979]">
                            R$ {plano.preco.toFixed(2)}
                            <span className="text-sm font-normal text-gray-500">/mês</span>
                          </p>
                        </div>
                        <div className="space-y-2 mb-4 md:mb-6">
                          <p className="text-sm md:text-base">
                            <strong>Cobertura:</strong> {plano.cobertura}
                          </p>
                          <p className="text-sm md:text-base">
                            <strong>Tipo:</strong> {plano.tipo}
                          </p>
                          <p className="text-sm md:text-base text-gray-600">{plano.descricao}</p>
                        </div>
                        <Button
                          className="w-full bg-[#168979] hover:bg-[#13786a] text-sm md:text-base py-2 md:py-3"
                          onClick={() => handleSelecionarPlano(plano)}
                        >
                          Selecionar plano
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-10">
                  <p className="text-base md:text-lg text-gray-600 mb-4">
                    Não encontramos planos que correspondam aos seus critérios.
                  </p>
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => setMostrarResultados(false)}>
                    Tentar novamente
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
