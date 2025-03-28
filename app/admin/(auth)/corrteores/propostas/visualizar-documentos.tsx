"use client"

import { useState } from "react"
import type { PropostaCorretor } from "@/types/corretores"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileIcon, Download, Eye, FileX } from "lucide-react"
import { obterUrlPublica } from "@/services/storage-service"
import { Skeleton } from "@/components/ui/skeleton"

interface VisualizarDocumentosProps {
  proposta: PropostaCorretor
}

export function VisualizarDocumentos({ proposta }: VisualizarDocumentosProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [urls, setUrls] = useState<{
    rgFrente?: string
    rgVerso?: string
    comprovante?: string
  }>({})

  const temDocumentos =
    proposta.documento_rg_frente || proposta.documento_rg_verso || proposta.documento_comprovante_residencia

  const carregarUrls = async () => {
    if (loading || (urls.rgFrente && urls.rgVerso && urls.comprovante)) return

    setLoading(true)
    try {
      const [rgFrenteUrl, rgVersoUrl, comprovanteUrl] = await Promise.all([
        proposta.documento_rg_frente ? obterUrlPublica(proposta.documento_rg_frente) : Promise.resolve(undefined),
        proposta.documento_rg_verso ? obterUrlPublica(proposta.documento_rg_verso) : Promise.resolve(undefined),
        proposta.documento_comprovante_residencia
          ? obterUrlPublica(proposta.documento_comprovante_residencia)
          : Promise.resolve(undefined),
      ])

      setUrls({
        rgFrente: rgFrenteUrl,
        rgVerso: rgVersoUrl,
        comprovante: comprovanteUrl,
      })
    } catch (error) {
      console.error("Erro ao carregar URLs dos documentos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      carregarUrls()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant={temDocumentos ? "default" : "outline"} size="sm" disabled={!temDocumentos}>
          {temDocumentos ? (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Ver Documentos
            </>
          ) : (
            <>
              <FileX className="mr-2 h-4 w-4" />
              Sem Documentos
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Documentos de {proposta.nome_cliente || "Cliente"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="rg-frente" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="rg-frente">RG/CNH (Frente)</TabsTrigger>
            <TabsTrigger value="rg-verso">RG/CNH (Verso)</TabsTrigger>
            <TabsTrigger value="comprovante">Comprovante de Residência</TabsTrigger>
          </TabsList>

          <TabsContent value="rg-frente" className="mt-4">
            <DocumentoViewer
              url={urls.rgFrente}
              loading={loading}
              documentoPath={proposta.documento_rg_frente}
              titulo="RG/CNH (Frente)"
            />
          </TabsContent>

          <TabsContent value="rg-verso" className="mt-4">
            <DocumentoViewer
              url={urls.rgVerso}
              loading={loading}
              documentoPath={proposta.documento_rg_verso}
              titulo="RG/CNH (Verso)"
            />
          </TabsContent>

          <TabsContent value="comprovante" className="mt-4">
            <DocumentoViewer
              url={urls.comprovante}
              loading={loading}
              documentoPath={proposta.documento_comprovante_residencia}
              titulo="Comprovante de Residência"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

interface DocumentoViewerProps {
  url?: string
  loading: boolean
  documentoPath?: string
  titulo: string
}

function DocumentoViewer({ url, loading, documentoPath, titulo }: DocumentoViewerProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!documentoPath) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileX className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{titulo} não foi enviado pelo corretor.</p>
      </div>
    )
  }

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Não foi possível carregar o documento.</p>
      </div>
    )
  }

  // Determinar o tipo de arquivo
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(documentoPath)
  const isPdf = /\.pdf$/i.test(documentoPath)

  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-2">
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer" download>
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden bg-muted/20 flex items-center justify-center">
        {isImage ? (
          <img src={url || "/placeholder.svg"} alt={titulo} className="max-w-full max-h-[500px] object-contain" />
        ) : isPdf ? (
          <iframe src={url} title={titulo} className="w-full h-[500px]" sandbox="allow-scripts allow-same-origin" />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Visualização não disponível. Faça o download para visualizar.</p>
          </div>
        )}
      </div>
    </div>
  )
}

