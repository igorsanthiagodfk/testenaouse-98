import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import { Check, Download, MessageCircle } from "lucide-react";
import { Solution } from "@/data/database";

interface DynamicSolutionPageProps {
  solution: Solution;
}

const DynamicSolutionPage = ({ solution }: DynamicSolutionPageProps) => {
  console.log('[DynamicSolutionPage] Renderizando solução:', solution.name);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${solution.name} - ${solution.short_description} | i.s.t.i`}
        description={solution.short_description}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <solution.icon className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">{solution.name}</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              {solution.short_description}
            </p>
          </div>

          {/* Descrição Detalhada */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Sobre o {solution.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {solution.long_description.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  )
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefícios e Funcionalidades */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Benefícios e Funcionalidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {solution.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {solution.max_pdvs && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-semibold text-muted-foreground">
                        <strong>Capacidade de PDVs:</strong> {
                          solution.max_pdvs === 50 ? "Até 50 terminais simultâneos" :
                          solution.max_pdvs === 20 ? "Até 20 PDVs integrados" :
                          solution.max_pdvs === 10 ? "Até 10 terminais simultâneos" :
                          `Até ${solution.max_pdvs} terminais simultâneos`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Folder PDF */}
            <Card>
              <CardHeader>
                <CardTitle>Material Informativo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Baixe nosso material completo com especificações técnicas, 
                  casos de uso e informações detalhadas sobre o {solution.name}.
                </p>
                <a 
                  href={solution.pdf_url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                  onClick={() => {
                    // Rastrear download do PDF
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                      (window as any).gtag('event', 'pdf_download', {
                        sistema: solution.name,
                        pagina: solution.slug.replace('/solucoes/', '')
                      });
                    }
                  }}
                >
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Folder PDF
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-accent text-accent-foreground">
            <CardContent className="text-center py-8">
              <h3 className="text-2xl font-bold mb-4">
                Este sistema parece ideal para você?
              </h3>
              <p className="mb-6 opacity-90">
                Fale com nossos especialistas e descubra como o {solution.name} pode 
                transformar a gestão da sua empresa.
              </p>
              <Link to={`/contato?sistema=${solution.slug.replace('/solucoes/', '')}`}>
                <Button variant="cta" size="lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Falar com um especialista sobre o {solution.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DynamicSolutionPage;