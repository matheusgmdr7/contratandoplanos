import { CustomButton } from "@/components/ui/custom-button"
import { ArrowRight, Users, Building, UserPlus } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#168979] to-[#13786a] -skew-y-6 origin-top-left transform-gpu -translate-y-32 z-0"></div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Encontre o plano de saúde ideal para você e sua família
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
                  Compare preços e coberturas dos melhores planos de saúde do Brasil com a Contratandoplanos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <CustomButton
                    href="/cotacao"
                    size="lg"
                    className="bg-amber-500 text-white hover:bg-amber-600 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all"
                  >
                    Faça sua cotação agora
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </CustomButton>
                </div>
              </div>
              <div className="hidden md:block relative">
                <div className="absolute -inset-0.5 bg-white/20 rounded-2xl blur-xl"></div>
                <img
                  src="https://i.ibb.co/vvLp7GFD/Inserir-um-ti-tulo-3.png"
                  alt="Família feliz com plano de saúde"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Corretoras Parceiras Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Corretoras parceiras</h2>
              <p className="text-gray-600 text-lg mb-10">
                Trabalhamos com as melhores corretoras para garantir um atendimento personalizado e de qualidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center max-w-3xl mx-auto">
              {/* Card da ALFA CORRETORA com imagem */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-24 overflow-hidden">
                <div className="w-full h-full">
                  <img
                    src="https://i.ibb.co/Zzm354my/Design-sem-nome-2.png"
                    alt="ALFA CORRETORA"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center" }}
                  />
                </div>
              </div>

              {/* Card da PR PLANOS DE SAÚDE com imagem */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-24 overflow-hidden">
                <div className="w-full h-full">
                  <img
                    src="https://i.ibb.co/dwdJ0Kpm/Design-sem-nome-10.png"
                    alt="PR PLANOS DE SAÚDE"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center" }}
                  />
                </div>
              </div>

              {/* Card da CONTRATAR com imagem */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-24 overflow-hidden">
                <div className="w-full h-full">
                  <img
                    src="https://i.ibb.co/20r7hSmP/Design-sem-nome-11.png"
                    alt="CONTRATAR"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Os melhores planos de saúde Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Os melhores planos de saúde</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Trabalhamos com as melhores operadoras de planos de saúde do mercado para oferecer as melhores opções para
              você.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center max-w-5xl mx-auto">
              <div className="bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-24 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src="https://i.ibb.co/fzhQW0FM/Unimed2.png"
                    alt="Operadora 1"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center" }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-24 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src="https://i.ibb.co/Jjm3N0rk/Design-sem-nome-4.png"
                    alt="SulAmérica"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-24 overflow-hidden">
                <div className="w-full h-full">
                  <img
                    src="https://i.ibb.co/Hf35SSwv/Seguros-Unimed.png"
                    alt="Seguros Unimed"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-24 overflow-hidden p-0">
                <img
                  src="https://i.ibb.co/LD2f2T3r/Porto-Saude.png"
                  alt="Porto Saúde"
                  className="w-full h-full object-contain"
                  style={{ objectPosition: "center" }}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow w-full h-24 overflow-hidden p-0">
                <img
                  src="https://i.ibb.co/ycmHb8Yx/Bradesco.png"
                  alt="Bradesco Saúde"
                  className="w-full h-full object-contain"
                  style={{ objectPosition: "center" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Planos Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Planos para todas as necessidades</h2>
              <p className="text-gray-600 text-lg">
                Encontre o plano ideal para você, sua família ou sua empresa com condições especiais.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#168979] p-6 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Planos Individuais e Familiares
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Planos de saúde personalizados para você e sua família, com cobertura completa para consultas,
                    exames, internações e procedimentos médicos, garantindo tranquilidade e bem-estar para todos.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#168979] p-6 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Planos Empresariais
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Soluções completas para empresas de todos os portes, com planos a partir de 2 vidas. Ofereça um
                    benefício de qualidade aos seus colaboradores, aumentando a satisfação e produtividade da sua
                    equipe.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#168979] p-6 text-white">
                  <h3 className="text-xl font-bold flex items-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Planos Coletivo por Adesão
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Planos de saúde destinados a entidades de classe, sindicatos e associações profissionais.
                    Beneficie-se de condições especiais e preços reduzidos por fazer parte de um grupo específico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#168979] to-[#13786a] text-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Garanta sua saúde e bem estar</h2>
              <p className="text-xl mb-8 text-white/90">
                Faça uma cotação gratuita e descubra as melhores opções de planos de saúde para você.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CustomButton
                  href="/cotacao"
                  size="lg"
                  className="bg-amber-500 text-white hover:bg-amber-600 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  Fazer cotação gratuita
                </CustomButton>
                <CustomButton
                  href="/contato"
                  size="lg"
                  className="bg-white text-[#168979] hover:bg-white/90 rounded-full font-medium"
                >
                  Falar com um consultor
                </CustomButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

