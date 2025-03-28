"use client"

import { DialogFooter } from "@/components/ui/dialog"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { atualizarStatusPropostaCorretor } from "@/services/propostas-corretores-service"
import type { PropostaCorretor } from "@/types/corretores"

export function AprovarReprovarProposta({ proposta }: { proposta: PropostaCorretor }) {
  const [open, setOpen] = useState(false)
  const [motivoRejeicao, setMotivoRejeicao] = useState("")
  const [loading, setLoading] = useState(false)

  const aprovarProposta = async () => {
    setLoading(true)
    try {
      await atualizarStatusPropostaCorretor(proposta.id, "aprovada")
      toast.success("Proposta aprovada com sucesso")
      setOpen(false)
      window.location.reload() // Refresh the page to update the list
    } catch (error) {
      console.error("Erro ao aprovar proposta:", error)
      toast.error("Erro ao aprovar proposta")
    } finally {
      setLoading(false)
    }
  }

  const reprovarProposta = async () => {
    if (!motivoRejeicao.trim()) {
      toast.error("Por favor, informe o motivo da rejeição")
      return
    }

    setLoading(true)
    try {
      await atualizarStatusPropostaCorretor(proposta.id, "rejeitada", motivoRejeicao)
      toast.success("Proposta reprovada com sucesso")
      setOpen(false)
      window.location.reload() // Refresh the page to update the list
    } catch (error) {
      console.error("Erro ao reprovar proposta:", error)
      toast.error("Erro ao reprovar proposta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Analisar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Analisar Proposta</DialogTitle>
          <DialogDescription>Aprovar ou reprovar a proposta do corretor.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo da Rejeição (Opcional)</Label>
            <Input
              id="motivo"
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
              placeholder="Informe o motivo da rejeição"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={aprovarProposta}
            className="ml-2 bg-green-500 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? "Aprovando..." : "Aprovar"}
          </Button>
          <Button
            type="button"
            onClick={reprovarProposta}
            className="ml-2 bg-red-500 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? "Reprovando..." : "Reprovar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

