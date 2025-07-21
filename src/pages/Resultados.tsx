import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import { 
  Star, ArrowRight, MessageCircle, Award,
  ShoppingCart, Building2, Store, Truck, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '@/components/Analytics';
import { useSystemDataContext } from '@/contexts/SystemDataContext';

interface QuizData {
  ramo: string;
  prioridade?: string;
  porte: string;
  funcionalidades?: string;
  pdvs?: string;
  acesso: string;
  nome?: string;
  empresa?: string;
  whatsapp?: string;
}

const Resultados = () => {
  const [searchParams] = useSearchParams();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { solutions, isLoading: dataLoading } = useSystemDataContext();

  useEffect(() => {
    // Capturar dados da URL
    const data: QuizData = {
      ramo: searchParams.get('ramo') || '',
      prioridade: searchParams.get('prioridade') || undefined,
      porte: searchParams.get('porte') || '',
      funcionalidades: searchParams.get('funcionalidades') || '',
      pdvs: searchParams.get('pdvs') || '',
      acesso: searchParams.get('acesso') || '',
      nome: searchParams.get('nome') || undefined,
      empresa: searchParams.get('empresa') || undefined,
      whatsapp: searchParams.get('whatsapp') || undefined,
    };

    setQuizData(data);
    setIsLoading(false);
    
    // Track quiz completion
    localStorage.setItem('quiz_results', JSON.stringify(data));
  }, [searchParams]);

  // Sistema de recomendação baseado em tags/compatibilidade
  const findBestSolution = (data: QuizData) => {
    console.log('[Resultados] Analisando dados do quiz:', data);
    
    if (!solutions || solutions.length === 0) {
      console.log('[Resultados] Nenhuma solução disponível');
      return null;
    }

    // Pontuação para cada solução baseada na compatibilidade
    const solutionScores = solutions.map(solution => {
      let score = 0;
      const tags = solution.segments ? solution.segments.split(',').map(s => s.trim().toLowerCase()) : [];
      
      console.log(`[Resultados] Analisando ${solution.nome} com tags:`, tags);

      // Pontuação por ramo/segmento (peso alto)
      if (data.ramo) {
        const ramo = data.ramo.toLowerCase();
        if (ramo.includes('distribuidora') || ramo.includes('atacado')) {
          if (tags.includes('distribuidoras')) score += 50;
        }
        if (ramo.includes('supermercado') || ramo.includes('mercadinho')) {
          if (tags.includes('supermercados')) score += 50;
        }
        if (ramo.includes('varejo') || ramo.includes('farmácia') || ramo.includes('padaria')) {
          if (tags.includes('varejo')) score += 50;
        }
        if (ramo.includes('serviços') || ramo.includes('clínica') || ramo.includes('consultório')) {
          if (tags.includes('serviços')) score += 50;
        }
      }

      // Pontuação por quantidade de PDVs (peso médio)
      if (data.pdvs && solution.capacidade_pdvs) {
        const pdvCount = data.pdvs.toLowerCase();
        const maxPdvs = solution.capacidade_pdvs.toLowerCase();
        
        if (pdvCount.includes('1 pdv') && maxPdvs.includes('3')) score += 20;
        if (pdvCount.includes('2 a 3') && maxPdvs.includes('3')) score += 25;
        if (pdvCount.includes('4 a 8') && (maxPdvs.includes('8') || maxPdvs.includes('15'))) score += 25;
        if (pdvCount.includes('mais de 8') && maxPdvs.includes('15')) score += 30;
      }

      // Pontuação por funcionalidades (peso baixo)
      if (data.funcionalidades) {
        const funcionalidades = data.funcionalidades.toLowerCase();
        if (funcionalidades.includes('estoque') && solution.beneficios?.toLowerCase().includes('estoque')) score += 10;
        if (funcionalidades.includes('fiscal') && solution.beneficios?.toLowerCase().includes('fiscal')) score += 10;
        if (funcionalidades.includes('vendas') && solution.beneficios?.toLowerCase().includes('venda')) score += 10;
      }

      // Boost para sistemas populares/recomendados
      if (solution.is_popular?.toLowerCase() === 'true') score += 5;
      if (solution.is_recommended?.toLowerCase() === 'true') score += 5;

      console.log(`[Resultados] ${solution.nome} - Score: ${score}`);
      return { solution, score };
    });

    // Ordenar por pontuação e retornar o melhor
    const sortedSolutions = solutionScores.sort((a, b) => b.score - a.score);
    const bestSolution = sortedSolutions[0];
    
    console.log('[Resultados] Melhor solução:', bestSolution?.solution.nome, 'Score:', bestSolution?.score);
    
    return bestSolution?.solution || solutions[0]; // Fallback para primeira solução
  };

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Store': return Store;
      case 'ShoppingCart': return ShoppingCart;
      case 'Truck': return Truck;
      default: return Building2;
    }
  };

  const handleWhatsAppClick = () => {
    if (!quizData || !recommendedSolution) return;
    
    trackEvent('cta_whatsapp_clicado', {
      sistema: recommendedSolution.nome,
      ramo: quizData.ramo,
      pagina: 'resultados'
    });
    
    let message = `Olá! Meu nome é ${quizData.nome || '[Nome]'} e represento a empresa ${quizData.empresa || '[Empresa]'}.%0A%0AAcabei de fazer o diagnóstico no site e gostaria de agendar uma demonstração do ${recommendedSolution.nome}.%0A%0A`;
    
    message += `Dados da minha empresa:%0A`;
    message += `• Ramo: ${quizData.ramo}%0A`;
    message += `• Porte: ${quizData.porte}%0A`;
    if (quizData.pdvs) message += `• PDVs: ${quizData.pdvs}%0A`;
    
    message += '%0AFico no aguardo do contato.';
    
    window.open(`https://wa.me/556135516827?text=${message}`, '_blank');
  };

  if (isLoading || dataLoading || !quizData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando sua recomendação...</p>
        </div>
      </div>
    );
  }

  const recommendedSolution = findBestSolution(quizData);
  if (!recommendedSolution) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Erro ao carregar recomendação. Tente novamente.</p>
          <Link to="/quiz">
            <Button className="mt-4">Refazer Diagnóstico</Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = getIconComponent(recommendedSolution.icon_name);
  const beneficios = recommendedSolution.beneficios ? recommendedSolution.beneficios.split(',').map(b => b.trim()) : [];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SEO
        title={`Resultado do Diagnóstico - ${recommendedSolution.nome} | I.S.T.I Tecnologia`}
        description={`Sua solução personalizada: ${recommendedSolution.nome}. Veja os detalhes da recomendação baseada no seu perfil de negócio.`}
        keywords={`${recommendedSolution.nome}, automação comercial, sistema de gestão, Brasília`}
      />

      <Header />
      
      {/* Seção 1: Sistema Recomendado - HERÓI */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Olá, {quizData.nome}! ✨
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Analisamos as necessidades da <span className="font-semibold text-foreground">{quizData.empresa}</span>
            </p>
            <div className="inline-flex items-center bg-gradient-to-r from-accent/10 to-primary/10 px-6 py-3 rounded-full border border-accent/20">
              <CheckCircle className="w-5 h-5 mr-2 text-accent" />
              <span className="text-lg font-medium">Sua solução de alta performance está pronta!</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-accent shadow-glow relative overflow-hidden">
              {/* Badge de destaque */}
              <motion.div 
                className="absolute top-4 right-4 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge variant="secondary" className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  ⭐ Sistema Recomendado para você
                </Badge>
              </motion.div>

              <CardHeader className="pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-foreground mb-2">
                      {recommendedSolution.nome}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">
                      {recommendedSolution.subtitulo}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {recommendedSolution.descricao}
                </p>

                {beneficios.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Principais benefícios:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {beneficios.slice(0, 6).map((beneficio, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{beneficio}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recommendedSolution.capacidade_pdvs && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                      <span className="font-medium">Capacidade:</span>
                      <span className="text-muted-foreground">{recommendedSolution.capacidade_pdvs}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    onClick={handleWhatsAppClick}
                    variant="cta" 
                    size="lg" 
                    className="flex-1"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Falar com Especialista
                  </Button>
                  
                  <Link to={recommendedSolution.slug} className="flex-1">
                    <Button variant="secondary" size="lg" className="w-full">
                      Ver Detalhes Completos
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Seção 2: Outras Soluções e Comparação */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Outras soluções que podem interessar
            </h2>
            <p className="text-muted-foreground">
              Compare com outras opções ou explore equipamentos complementares
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {solutions
              .filter(s => s.id !== recommendedSolution.id && s.ativo?.toLowerCase() === 'true')
              .slice(0, 3)
              .map((solution, index) => {
                const SolutionIcon = getIconComponent(solution.icon_name);
                return (
                  <Card key={solution.id} className="hover:shadow-elegant transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-2">
                        <SolutionIcon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-lg">{solution.nome}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {solution.subtitulo}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link to={solution.slug} className="block">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver detalhes
                        </Button>
                      </Link>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          // Adicionar ao carrinho para comparação
                          const cartData = JSON.parse(localStorage.getItem('unified_cart') || '[]');
                          if (!cartData.find((item: any) => item.id === solution.id)) {
                            cartData.push({
                              id: solution.id,
                              nome: solution.nome,
                              tipo: 'solution',
                              preco: null
                            });
                            localStorage.setItem('unified_cart', JSON.stringify(cartData));
                          }
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar para Comparar
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/solucoes">
                <Button variant="outline">
                  Ver todas as soluções
                </Button>
              </Link>
              <Link to="/comparar-solucoes">
                <Button variant="secondary">
                  Comparar sistemas em detalhes
                </Button>
              </Link>
              <Link to="/produtos">
                <Button variant="outline">
                  Ver equipamentos complementares
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-accent/20">
            <CardContent className="p-8">
              <Award className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Pronto para transformar seu negócio?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Nossa equipe está pronta para apresentar o {recommendedSolution.nome} 
                e mostrar como ele pode revolucionar a gestão da {quizData.empresa}.
              </p>
              <Button 
                onClick={handleWhatsAppClick}
                variant="cta" 
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Agendar Demonstração Gratuita
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Resultados;