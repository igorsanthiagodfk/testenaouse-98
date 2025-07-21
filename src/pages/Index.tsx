import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import SEO from "@/components/SEO";
import InfiniteCarousel from "@/components/InfiniteCarousel";
import AnimatedTitle from "@/components/AnimatedTitle";
import InteractiveValueCard from "@/components/InteractiveValueCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Users, 
  Server, 
  Headphones, 
  CheckCircle,
  Zap,
  Building2,
  MessageSquare,
  Phone,
  MessageCircle,
  Timer,
  TrendingUp,
  Award,
  Store,
  Truck,
  ShoppingCart,
  Eye
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ProactiveChatPopup from "@/components/ProactiveChatPopup";
import SolutionCartBar from "@/components/SolutionCartBar";
import SolutionsCarousel from "@/components/SolutionsCarousel";
import CompactDiagnosticCTA from "@/components/CompactDiagnosticCTA";
import { comercios, clientes, seoData } from "@/data/constants";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sistemasSelecionadosCarrinho, setSistemasSelecionadosCarrinho] = useState<string[]>([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const titleWords = ["SISTEMAS", "IDEAIS", "PARA", "SEU", "COMÉRCIO"];

  const interactiveCards = [
    {
      icon: Building2,
      title: "Sistema",
      description: "Software Personalizado",
      expandedDescription: "Solução completa adaptada às suas necessidades específicas"
    },
    {
      icon: Server,
      title: "Infraestrutura",
      description: "Servidores 24/7",
      expandedDescription: "Servidores em nuvem ou local com 99.9% de uptime garantido"
    },
    {
      icon: Headphones,
      title: "Suporte",
      description: "Equipe Especializada",
      expandedDescription: "Suporte humanizado via WhatsApp com plantão para emergências"
    }
  ];

  const differentials = [
    {
      icon: Headphones,
      title: "Suporte Humanizado via WhatsApp",
      description: "Fale diretamente com especialistas e conte com nosso plantão para emergências."
    },
    {
      icon: Server,
      title: "Infraestrutura 24/7",
      description: "Seu sistema no ar, sempre. Opções de servidores em nuvem de alta disponibilidade ou implementação local robusta."
    },
    {
      icon: Users,
      title: "Consultoria Real",
      description: "Analisamos seu negócio a fundo antes de recomendar qualquer solução."
    }
  ];

  const sistemas = [
    {
      id: "sg-sistemas",
      nome: "SG Sistemas",
      descricao: "Sistema completo para gestão empresarial com módulos financeiro, fiscal e comercial integrados.",
      icon: Building2,
      slug: "/solucoes/sg-sistemas",
      isPopular: true,
      tags: ["Gestão completa", "Multi-empresas", "Fiscal integrado"]
    },
    {
      id: "hiper-sistemas",
      nome: "Hiper Sistemas", 
      descricao: "Sistema robusto para supermercados e hipermercados com PDV integrado e controle fiscal completo.",
      icon: Store,
      slug: "/solucoes/hiper-sistemas",
      isRecommended: true,
      tags: ["PDV Integrado", "Supermercados", "Controle fiscal"]
    },
    {
      id: "arpa-sistemas", 
      nome: "Arpa Sistemas",
      descricao: "Solução especializada em distribuidoras e atacados com controle de estoque avançado.",
      icon: Truck,
      slug: "/solucoes/arpa-sistemas",
      tags: ["Distribuidoras", "Atacado", "Estoque avançado"]
    }
  ];

  const sistemasSelecionadosCarrinhoData = sistemasSelecionadosCarrinho
    .map(id => sistemas.find(s => s.id === id))
    .filter(Boolean) as typeof sistemas;

  const handleAddToCart = (sistemaId: string) => {
    if (!sistemasSelecionadosCarrinho.includes(sistemaId)) {
      setSistemasSelecionadosCarrinho([...sistemasSelecionadosCarrinho, sistemaId]);
    }
  };

  const handleRemoveFromCart = (sistemaId: string) => {
    setSistemasSelecionadosCarrinho(sistemasSelecionadosCarrinho.filter(id => id !== sistemaId));
  };

  const handleWhatsAppClick = () => {
    console.log('WhatsApp clicked with systems:', sistemasSelecionadosCarrinhoData);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEO {...seoData.home} />
      
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Background Pattern Dinâmico */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-background-shift" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F59E0B' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="space-y-6">
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                  <Zap className="w-4 h-4 mr-2" />
                  Sistema de gestão 100% online
                </Badge>
                
                <AnimatedTitle 
                  words={titleWords}
                  className="text-3xl sm:text-4xl lg:text-6xl font-bold text-accent leading-tight"
                />
                
                <p className="text-lg sm:text-xl text-primary-foreground/80 leading-relaxed animate-slide-in-left">
                  Sistema de gestão 100% online para micro, pequenas e médias empresas. 
                  Software de automação para seu comércio.
                </p>

                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6 border border-accent/20 animate-slide-in-up">
                  <p className="text-lg font-semibold text-accent mb-4">
                    Tenha o controle de sua loja na palma da mão
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {comercios.map((comercio, index) => (
                      <div key={index} className="flex items-center space-x-2 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                        <comercio.icon className="w-4 h-4 text-accent" />
                        <span className="text-primary-foreground/80 text-sm">{comercio.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/quiz">
                  <Button variant="cta" size="lg" className="w-full sm:w-auto group relative overflow-hidden">
                    <span className="relative z-10">Iniciar Diagnóstico Gratuito</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-accent/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/contato">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto group"
                    aria-label="Falar com consultor especializado"
                  >
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Falar com Consultor
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Interactive Cards */}
            <div className={`relative ${isVisible ? 'animate-float' : 'opacity-0'}`}>
              <div className="relative bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20">
                <div className="space-y-6">
                  {interactiveCards.map((card, index) => (
                    <div key={index}>
                      <InteractiveValueCard
                        icon={card.icon}
                        title={card.title}
                        description={card.description}
                        expandedDescription={card.expandedDescription}
                        index={index}
                      />
                      {index < interactiveCards.length - 1 && (
                        <div className="w-full h-px bg-accent/30 my-4" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse-accent">
                  <span className="text-accent-foreground font-bold text-sm">✓</span>
                </div>
                
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="bg-accent text-accent-foreground animate-pulse">
                    Solução Completa
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carrossel de Soluções Interativo */}
      <SolutionsCarousel 
        sistemas={sistemas}
        sistemasSelecionados={sistemasSelecionadosCarrinho}
        onAddToCart={handleAddToCart}
      />

      {/* Nossos Clientes Section - Carrossel Infinito */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        {/* Divisor orgânico superior */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-muted/30 transform -translate-y-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Empresas como a sua que já estão{" "}
              <span className="text-accent">crescendo com a i.s.t.i</span>
            </h2>
            <p className="text-muted-foreground">
              Passe o mouse sobre os cards para pausar a rolagem e ver mais detalhes
            </p>
          </div>

          <InfiniteCarousel clients={clientes} />

          {/* Indicadores de Sucesso Animados */}
          <div className="text-center mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-4xl font-bold text-accent">
                  <AnimatedCounter end={120} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Negócios Atendidos</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-4xl font-bold text-accent">
                  <AnimatedCounter end={98} suffix="%" />
                </div>
                <div className="text-sm text-muted-foreground">Índice de Satisfação</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-4xl font-bold text-accent">
                  <AnimatedCounter end={15} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground">Anos de Mercado</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                <Shield className="w-4 h-4 mr-2" />
                Consultoria 100% Gratuita
              </Badge>
              <Badge variant="secondary" className="bg-orange/20 text-orange border-orange/30">
                <TrendingUp className="w-4 h-4 mr-2" />
                Crescimento Comprovado
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Mais de 120 negócios em Brasília com operações otimizadas e resultados mensuráveis
            </p>
          </div>
        </div>

        {/* Divisor orgânico inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-transparent to-muted/30 transform translate-y-10" />
      </section>

      {/* CTA de Diagnóstico Compacto */}
      <CompactDiagnosticCTA />

      {/* Differentials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Com a i.s.t.i, seu sistema vem com{" "}
              <span className="text-accent">gente de verdade</span> por trás
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Não somos apenas revendedores. Somos sua equipe de TI completa, 
              oferecendo suporte técnico imediato e infraestrutura que garante que seu negócio nunca pare.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {differentials.map((item, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-glow transition-all duration-500 border-border/50 hover:border-accent/50 bg-card/50 backdrop-blur-sm animate-slide-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div 
                    className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-12 transition-all duration-[1.5s] relative"
                    aria-label={`Ícone de ${item.title}`}
                  >
                    {item.title === "Suporte Humanizado via WhatsApp" && (
                      <MessageCircle className="w-6 h-6 text-accent-foreground absolute -top-1 -right-1 bg-green-500 rounded-full p-1 animate-pulse" />
                    )}
                    <item.icon className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-secondary-foreground">
              I.S.T.I | TECNOLOGIA
            </h3>
            <p className="text-secondary-foreground/80">
              Sistema para seu comércio • Brasília-DF
            </p>
            <div className="flex justify-center items-center space-x-2 text-secondary-foreground/80">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">(61) 3551-6827</span>
            </div>
            <div className="flex justify-center space-x-6 text-secondary-foreground/60">
              <span>Sistemas</span>
              <span>•</span>
              <span>Servidores</span>
              <span>•</span>
              <span>Suporte</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Chat Popup */}
      <ProactiveChatPopup />
      
      {/* Barra de orçamento flutuante */}
      <SolutionCartBar
        sistemasSelecionados={sistemasSelecionadosCarrinhoData}
        onRemoveFromCart={handleRemoveFromCart}
        onWhatsAppClick={handleWhatsAppClick}
      />
    </div>
  );
};

export default Index;