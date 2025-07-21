import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import { 
  Target,
  Heart,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react";

const QuemSomos = () => {
  const valores = [
    {
      icon: Target,
      title: "Foco no Cliente",
      description: "Cada solução é pensada especificamente para as necessidades do seu negócio"
    },
    {
      icon: Heart,
      title: "Suporte Humanizado",
      description: "Acreditamos no atendimento pessoal, sem robôs ou chatbots automáticos"
    },
    {
      icon: Award,
      title: "Qualidade Comprovada",
      description: "Mais de 120 negócios em Brasília confiam em nossas soluções"
    },
    {
      icon: Users,
      title: "Parceria de Longo Prazo",
      description: "Não vendemos apenas sistemas, construímos relacionamentos duradouros"
    }
  ];

  const timeline = [
    {
      year: "2018",
      title: "Fundação",
      description: "Início das atividades com foco em pequenos comércios de Brasília"
    },
    {
      year: "2020",
      title: "Expansão de Serviços",
      description: "Ampliação para consultoria completa em TI e infraestrutura"
    },
    {
      year: "2022",
      title: "100+ Clientes",
      description: "Marca histórica de mais de 100 negócios atendidos"
    },
    {
      year: "2024",
      title: "Liderança Regional",
      description: "Consolidação como referência em automação comercial em Brasília"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Quem Somos - I.S.T.I Tecnologia | Nossa História e Valores"
        description="Conheça a I.S.T.I Tecnologia: mais de 6 anos no mercado, 120+ negócios atendidos em Brasília. Nossa missão é simplificar a gestão comercial através de tecnologia acessível."
        keywords="I.S.T.I Tecnologia, quem somos, história, valores, Brasília, automação comercial, missão, visão"
        canonical="https://istitecnologia.com.br/quem-somos"
      />

      <Header />
      
      {/* Header */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 mb-6">
            <Clock className="w-4 h-4 mr-2" />
            Mais de 6 anos no mercado
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Quem Somos
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            A <strong>I.S.T.I Tecnologia</strong> nasceu da necessidade de oferecer soluções completas em TI 
            para pequenos e médios comércios, com suporte humanizado e consultoria real.
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nossa Trajetória
            </h2>
            <p className="text-xl text-muted-foreground">
              Construindo soluções que realmente funcionam desde 2018
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all duration-[1.5s]">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-accent mb-2">{item.year}</div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Nossa Missão
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Simplificar a gestão de pequenos e médios comércios através de tecnologia acessível, 
                suporte humanizado e consultoria especializada. Acreditamos que todo negócio, 
                independente do tamanho, merece ter acesso a soluções de TI profissionais.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground">Tecnologia acessível para todos os negócios</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground">Suporte técnico humano, não automatizado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-foreground">Consultoria personalizada para cada cliente</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-accent/10 rounded-2xl p-8 border border-accent/20">
              <div className="text-center space-y-6">
                <div className="text-4xl font-bold text-accent">120+</div>
                <div className="text-lg font-semibold text-foreground">Negócios Atendidos</div>
                <div className="text-muted-foreground">
                  Mercados, padarias, distribuidoras, açougues, lojas de confecção e muito mais
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compromisso com a Migração */}
      <section className="py-20 bg-gradient-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Pavor de trocar de sistema? <br />
              <span className="text-accent">Deixe a parte difícil com a gente.</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Sabemos que migrar de sistema é uma das maiores preocupações dos empresários. 
              Por isso, desenvolvemos um processo 100% seguro e transparente.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Zero Perda de Dados</h3>
                  <p className="text-muted-foreground">
                    Garantimos a migração completa de todos os seus dados: clientes, produtos, 
                    fornecedores, histórico de vendas e informações fiscais.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Processo Transparente</h3>
                  <p className="text-muted-foreground">
                    Você acompanha cada etapa da migração e valida todos os dados antes 
                    do sistema entrar em funcionamento.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Suporte Durante Todo o Processo</h3>
                  <p className="text-muted-foreground">
                    Nossa equipe fica disponível 24/7 durante a migração para esclarecer 
                    dúvidas e garantir que tudo saia perfeito.
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-background/80 backdrop-blur-sm border-accent/20">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Mais de 120 migrações realizadas
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Dados migrados com sucesso</span>
                    <span className="text-accent font-bold">100%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Clientes satisfeitos</span>
                    <span className="text-accent font-bold">120+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Tempo médio de migração</span>
                    <span className="text-accent font-bold">3-5 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-muted-foreground">
              Os princípios que guiam nosso trabalho todos os dias
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((valor, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-elegant transition-all duration-[1.5s] hover:border-accent/50"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                    <valor.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground">{valor.title}</h3>
                  <p className="text-sm text-muted-foreground">{valor.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Vamos Conversar?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Conheça nosso trabalho de perto e descubra como podemos transformar a gestão do seu negócio.
          </p>
          <Button variant="cta" size="lg">
            Falar Conosco
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default QuemSomos;