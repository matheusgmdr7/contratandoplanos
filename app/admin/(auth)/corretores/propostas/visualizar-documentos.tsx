"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PropostaCorretor } from "@/types/corretores"
import { FileIcon, FileTextIcon } from "lucide-react"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function VisualizarDocumentos({ proposta }: { proposta: PropostaCorretor }) {
  const [open, setOpen] = useState(false)
  const [documentos, setDocumentos] = useState<{
    rgFrente?: string
    rgVerso?: string
    comprovante?: string
  }>({})
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const carregarDocumentos = async () => {
    if (loading) return

    setLoading(true)
    setErro(null)

    try {
      const supabase = createClientComponentClient()

      // Verificar se os caminhos dos documentos existem
      const caminhos = [
        proposta.documento_rg_frente,
        proposta.documento_rg_verso,
        proposta.documento_comprovante_residencia,
      ].filter(Boolean) as string[]

      if (caminhos.length === 0) {
        setErro("Nenhum documento encontrado para esta proposta.")
        setLoading(false)
        return
      }

      // Obter URLs públicas para cada documento
      const urls: Record<string, string> = {}

      for (const caminho of caminhos) {
        try {
          // Extrair o bucket e o caminho do arquivo
          const [bucket, ...pathParts] = caminho.split("/").filter(Boolean)
          const path = pathParts.join("/")

          const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 3600) // URL válida por 1 hora

          if (error) {
            console.error(`Erro ao obter URL para ${caminho}:`, error)
            continue
          }

          if (caminho === proposta.documento_rg_frente) {
            urls.rgFrente = data.signedUrl
          } else if (caminho === proposta.documento_rg_verso) {
            urls.rgVerso = data.signedUrl
          } else if (caminho === proposta.documento_comprovante_residencia) {
            urls.comprovante = data.signedUrl
          }
        } catch (error) {
          console.error(`Erro ao processar ${caminho}:`, error)
        }
      }

      setDocumentos(urls)

      if (Object.keys(urls).length === 0) {
        setErro("Não foi possível carregar os documentos. Verifique os caminhos dos arquivos.")
      }
    } catch (error) {
      console.error("Erro ao carregar documentos:", error)
      setErro("Ocorreu um erro ao carregar os documentos.")
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      carregarDocumentos()
    }
  }

  const temDocumentos =
    proposta.documento_rg_frente || proposta.documento_rg_verso || proposta.documento_comprovante_residencia

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!temDocumentos}>
          <FileIcon className="h-4 w-4 mr-2" />
          {temDocumentos ? "Ver Documentos" : "Sem Documentos"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Documentos da Proposta</DialogTitle>
          <DialogDescription>
            Documentos enviados pelo corretor para a proposta de {proposta.nome_cliente}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : erro ? (
          <div className="text-center text-red-500 p-4">{erro}</div>
        ) : (
          <Tabs defaultValue="rgFrente">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rgFrente" disabled={!documentos.rgFrente}>
                RG/CNH (Frente)
              </TabsTrigger>
              <TabsTrigger value="rgVerso" disabled={!documentos.rgVerso}>
                RG/CNH (Verso)
              </TabsTrigger>
              <TabsTrigger value="comprovante" disabled={!documentos.comprovante}>
                Comprovante de Residência
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rgFrente" className="mt-4">
              {documentos.rgFrente ? (
                <DocumentoPreview url={documentos.rgFrente} titulo="RG/CNH (Frente)" />
              ) : (
                <div className="text-center p-8 border rounded-md">Documento não disponível</div>
              )}
            </TabsContent>

            <TabsContent value="rgVerso" className="mt-4">
              {documentos.rgVerso ? (
                <DocumentoPreview url={documentos.rgVerso} titulo="RG/CNH (Verso)" />
              ) : (
                <div className="text-center p-8 border rounded-md">Documento não disponível</div>
              )}
            </TabsContent>

            <TabsContent value="comprovante" className="mt-4">
              {documentos.comprovante ? (
                <DocumentoPreview url={documentos.comprovante} titulo="Comprovante de Residência" />
              ) : (
                <div className="text-center p-8 border rounded-md">Documento não disponível</div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DocumentoPreview({ url, titulo }: { url: string; titulo: string }) {
  const extensao = url.split(".").pop()?.toLowerCase() || ""
  const isPDF = extensao === "pdf"
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extensao)

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-medium mb-2">{titulo}</h3>

      {isPDF ? (
        <div className="w-full h-[500px] border rounded-md overflow-hidden">
          <iframe src={`${url}#toolbar=0`} className="w-full h-full" title={titulo} />
        </div>
      ) : isImage ? (
        <div className="relative w-full h-[500px] border rounded-md overflow-hidden">
          <Image src={url || "/placeholder.svg"} alt={titulo} fill className="object-contain" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md w-full">
          <FileTextIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p>Tipo de arquivo não suportado para visualização</p>
          <Button variant="outline" className="mt-4" onClick={() => window.open(url, "_blank")}>
            Baixar Arquivo
          </Button>
        </div>
      )}

      <Button variant="outline" className="mt-4" onClick={() => window.open(url, "_blank")}>
        Abrir em Nova Aba
      </Button>
    </div>
  )
}

