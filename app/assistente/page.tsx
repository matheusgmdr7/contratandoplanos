"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Send, User, Bot, ArrowRight } from "lucide-react"
import Link from "next/link"

interface Mensagem {
  texto: string
  remetente: "usuario" | "assistente"
  timestamp: Date
}

interface DadosCliente {
  nome: string
  email: string
  whatsapp: string
  planoSelecionado: {
    nome: string
    operadora: string
  }
}

export default function AssistentePage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [mensagemAtual, setMensagemAtual] = useState("")
  const [dadosCliente, setDadosCliente] = useState<DadosCliente | null>(null)
  const [carregando, setCarregando] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Recuperar dados do cliente do localStorage
    const dadosSalvos = localStorage.getItem("dadosCliente")
    if (dadosSalvos) {
      setDadosCliente(JSON.parse(dadosSalvos))
    }

    // Mensagem inicial do assistente
    const mensagemInicial: Mensagem = {
      texto:
        "Olá! Sou o assistente virtual da ContratandoPlanos. Como posso ajudar você hoje?\n\nEscolha uma das opções abaixo ou faça sua própria pergunta:",
      remetente: "assistente",
      timestamp: new Date(),
    }
    setMensagens([mensagemInicial])
  }, [])

  useEffect(() => {
    // Rolar para a última mensagem quando novas mensagens são adicionadas
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [mensagens])

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mensagemAtual.trim()) return

    // Adicionar mensagem do usuário
    const novaMensagemUsuario: Mensagem = {
      texto: mensagemAtual,
      remetente: "usuario",
      timestamp: new Date(),
    }

    setMensagens((prev) => [...prev, novaMensagemUsuario])
    setMensagemAtual("")
    setCarregando(true)

    try {
      // Simular resposta do assistente virtual (em uma aplicação real, seria uma chamada à API)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Gerar resposta com base na pergunta
      const resposta = gerarRespostaAssistente(mensagemAtual)

      const novaMensagemAssistente: Mensagem = {
        texto: resposta,
        remetente: "assistente",
        timestamp: new Date(),
      }

      setMensagens((prev) => [...prev, novaMensagemAssistente])
    } catch (error) {
      console.error("Erro ao processar mensagem:", error)
    } finally {
      setCarregando(false)
    }
  }

  const handleAtalhoClick = (pergunta: string) => {
    setMensagemAtual(pergunta)
  }

  // Função simples para gerar respostas baseadas em palavras-chave
  const gerarRespostaAssistente = (pergunta: string): string => {
    const perguntaLowerCase = pergunta.toLowerCase()

    if (
      perguntaLowerCase.includes("carência") ||
      perguntaLowerCase.includes("carencia") ||
      perguntaLowerCase.includes("1")
    ) {
      return "Este plano possui carências reduzidas, ou seja, carência zero para todos os procedimentos, exceto para parto e pré existência. Obs.: Antes da adesão é feito uma entrevista de saúde."
    }

    if (
      perguntaLowerCase.includes("cobertura") ||
      perguntaLowerCase.includes("cobre") ||
      perguntaLowerCase.includes("2")
    ) {
      return "A cobertura deste plano é nacional para consultas eletivas, urgências e emergência."
    }

    if (perguntaLowerCase.includes("portabilidade") || perguntaLowerCase.includes("3")) {
      return "A portabilidade é possível, mediante a aprovação na entrevista de saúde."
    }

    if (
      perguntaLowerCase.includes("adesão") ||
      perguntaLowerCase.includes("processo") ||
      perguntaLowerCase.includes("4")
    ) {
      return "O processo de adesão é composto por uma entrevista de saúde e cadastro na devida Administradora, para ser feito a ativação dentro do período de vigência."
    }

    if (
      perguntaLowerCase.includes("dependente") ||
      perguntaLowerCase.includes("familiar") ||
      perguntaLowerCase.includes("5")
    ) {
      return "Filhos e cônjuges, podem ser dependentes. E menores de idade, apenas com titular maior."
    }

    if (
      perguntaLowerCase.includes("rede") ||
      perguntaLowerCase.includes("hospital") ||
      perguntaLowerCase.includes("clínica") ||
      perguntaLowerCase.includes("clinica") ||
      perguntaLowerCase.includes("médico") ||
      perguntaLowerCase.includes("medico") ||
      perguntaLowerCase.includes("6")
    ) {
      return "Caso queria saber mais detalhes sobre a rede credenciada, solicite ao corretor."
    }

    if (
      perguntaLowerCase.includes("preço") ||
      perguntaLowerCase.includes("preco") ||
      perguntaLowerCase.includes("valor") ||
      perguntaLowerCase.includes("custo")
    ) {
      return "O valor do plano de saúde varia conforme diversos fatores como idade, tipo de plano (individual, familiar ou empresarial), abrangência da cobertura e operadora escolhida. Na sua cotação, você já pode ver os valores específicos para o seu perfil. Se precisar de mais esclarecimentos ou quiser negociar condições especiais, nossos corretores estão à disposição."
    }

    if (
      perguntaLowerCase.includes("trocar") ||
      perguntaLowerCase.includes("mudar") ||
      perguntaLowerCase.includes("outro plano")
    ) {
      return "Você pode trocar de plano a qualquer momento! Para isso, basta voltar à página de cotação e selecionar um novo plano que atenda melhor às suas necessidades. Se preferir, pode também conversar diretamente com um de nossos corretores, que poderá ajudá-lo a encontrar a melhor opção para o seu perfil."
    }

    if (perguntaLowerCase.includes("documentos") || perguntaLowerCase.includes("documentação")) {
      return "Para contratar um plano de saúde, você precisará apresentar: documento de identidade (RG e CPF), comprovante de residência atualizado, e em alguns casos, comprovante de renda. Para planos familiares, serão necessários também documentos que comprovem o vínculo familiar. Para planos empresariais, será preciso apresentar documentação da empresa. Nosso corretor irá orientá-lo sobre todos os documentos necessários para o plano específico que você escolheu."
    }

    if (
      perguntaLowerCase.includes("corretor") ||
      perguntaLowerCase.includes("contato") ||
      perguntaLowerCase.includes("falar com")
    ) {
      return "Você pode falar diretamente com um de nossos corretores especializados clicando no botão 'Falar com corretor' abaixo. Ele estará pronto para esclarecer todas as suas dúvidas e ajudá-lo no processo de contratação do seu plano de saúde."
    }

    // Resposta padrão para perguntas não reconhecidas
    return "Para informações mais detalhadas sobre esse assunto, recomendo que você converse diretamente com um de nossos corretores especializados. Eles poderão fornecer informações precisas e personalizadas para o seu caso. Você pode iniciar o contato clicando no botão 'Falar com corretor' abaixo."
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-8 md:py-10 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-[#168979]">Assistente Virtual</h1>
            <p className="text-base md:text-xl text-center text-gray-600 mb-6 md:mb-8">
              Tire todas as suas dúvidas com nosso assistente virtual antes de falar com um dos nossos corretores.
            </p>

            {dadosCliente && (
              <Card className="mb-4 md:mb-6 bg-[#168979] text-white">
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
                    <div>
                      <p className="font-medium text-sm md:text-base">Olá, {dadosCliente.nome.split(" ")[0]}!</p>
                      <p className="text-xs md:text-sm text-gray-200">
                        Plano selecionado: {dadosCliente.planoSelecionado.nome} -{" "}
                        {dadosCliente.planoSelecionado.operadora}
                      </p>
                    </div>
                    <Button
                      asChild
                      className="w-full md:w-auto bg-white text-[#168979] hover:bg-gray-100 text-sm md:text-base"
                    >
                      <Link
                        href={`https://wa.me/5521969564416?text=Olá! Meu nome é ${dadosCliente.nome} e tenho interesse no plano ${dadosCliente.planoSelecionado.nome} da ${dadosCliente.planoSelecionado.operadora}.`}
                        target="_blank"
                      >
                        Falar com corretor
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-3 md:p-4">
                <div
                  ref={chatContainerRef}
                  className="h-[300px] md:h-[400px] overflow-y-auto mb-4 p-3 md:p-4 bg-gray-50 rounded-lg"
                >
                  {mensagens.map((mensagem, index) => (
                    <div
                      key={index}
                      className={`flex mb-3 md:mb-4 ${mensagem.remetente === "usuario" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[85%] md:max-w-[80%] ${
                          mensagem.remetente === "usuario"
                            ? "bg-[#168979] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                            : "bg-gray-200 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                        } p-2 md:p-3`}
                      >
                        <div className="mr-2 mt-1">
                          {mensagem.remetente === "usuario" ? (
                            <User className="h-3 w-3 md:h-4 md:w-4" />
                          ) : (
                            <Bot className="h-3 w-3 md:h-4 md:w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm md:text-base">{mensagem.texto}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {mensagem.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="w-full text-sm md:text-base border-[#168979] text-[#168979] hover:bg-[#168979] hover:text-white"
                      onClick={() => handleAtalhoClick("Carência dos planos")}
                    >
                      Carência dos planos
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-sm md:text-base border-[#168979] text-[#168979] hover:bg-[#168979] hover:text-white"
                      onClick={() => handleAtalhoClick("Cobertura")}
                    >
                      Cobertura
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-sm md:text-base border-[#168979] text-[#168979] hover:bg-[#168979] hover:text-white"
                      onClick={() => handleAtalhoClick("Portabilidade")}
                    >
                      Portabilidade
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-sm md:text-base border-[#168979] text-[#168979] hover:bg-[#168979] hover:text-white"
                      onClick={() => handleAtalhoClick("Processo de Adesão")}
                    >
                      Processo de Adesão
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-sm md:text-base border-[#168979] text-[#168979] hover:bg-[#168979] hover:text-white"
                      onClick={() => handleAtalhoClick("Dependentes")}
                    >
                      Dependentes
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-sm md:text-base border-[#168979] text-[#168979] hover:bg-[#168979] hover:text-white"
                      onClick={() => handleAtalhoClick("Rede credenciada")}
                    >
                      Rede credenciada
                    </Button>
                  </div>

                  {carregando && (
                    <div className="flex justify-start mb-3 md:mb-4">
                      <div className="bg-gray-200 text-gray-800 rounded-lg p-2 md:p-3">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleEnviarMensagem} className="flex space-x-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={mensagemAtual}
                    onChange={(e) => setMensagemAtual(e.target.value)}
                    disabled={carregando}
                    className="text-sm md:text-base"
                  />
                  <Button type="submit" disabled={carregando} className="bg-[#168979] hover:bg-[#13786a]">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Precisa de ajuda mais específica?</p>
              <Button
                asChild
                variant="outline"
                className="border-[#168979] text-[#168979] hover:bg-[#168979] hover:text-white"
              >
                <Link
                  href={
                    dadosCliente?.nome && dadosCliente?.planoSelecionado
                      ? `https://wa.me/5521969564416?text=Olá! Meu nome é ${dadosCliente.nome} e tenho interesse no plano ${dadosCliente.planoSelecionado.nome} da ${dadosCliente.planoSelecionado.operadora}.`
                      : "https://wa.me/5521969564416"
                  }
                  target="_blank"
                >
                  Falar com um corretor pelo WhatsApp
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

