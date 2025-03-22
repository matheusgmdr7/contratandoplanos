"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
      <div className="bg-[#168979] text-white">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img
                src="https://i.ibb.co/pjVQg3Xh/A-PR-ESTA-DE-CARA-NOVA-1.png"
                alt="Contratandoplanos"
                className="h-10 w-auto"
                style={{ maxWidth: "180px" }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-white hover:text-white/80 font-medium text-sm tracking-wide transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Início
              </Link>
              <Link
                href="/sobre"
                className="text-white hover:text-white/80 font-medium text-sm tracking-wide transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Sobre nós
              </Link>
              <Link
                href="/contato"
                className="text-white hover:text-white/80 font-medium text-sm tracking-wide transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Contato
              </Link>
              <Link
                href="/corretores"
                className="text-white hover:text-white/80 font-medium text-sm tracking-wide transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all hover:after:w-full"
              >
                Corretores
              </Link>
              <Button
                asChild
                size="sm"
                className="bg-white text-[#168979] hover:bg-white/90 font-medium rounded-full px-6"
              >
                <Link href="/cotacao">Fazer cotação</Link>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pt-4 pb-4 border-t border-white/20 mt-3">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-white font-medium py-2 hover:translate-x-1 transition-transform"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </Link>
                <Link
                  href="/sobre"
                  className="text-white font-medium py-2 hover:translate-x-1 transition-transform"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre nós
                </Link>
                <Link
                  href="/contato"
                  className="text-white font-medium py-2 hover:translate-x-1 transition-transform"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
                <Link
                  href="/corretores"
                  className="text-white font-medium py-2 hover:translate-x-1 transition-transform"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Corretores
                </Link>
                <Button
                  asChild
                  className="bg-white text-[#168979] hover:bg-white/90 w-full mt-2 rounded-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/cotacao">Fazer cotação</Link>
                </Button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

