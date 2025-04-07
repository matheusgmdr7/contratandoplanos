import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Contratando Planos",
  description: "Encontre o plano de saúde ideal para você e sua família",
  generator: "BItech",
  icons: {
    icon: "https://i.ibb.co/ymrfXfdC/Post-Feed-e-Logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

