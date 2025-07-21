import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import FilterTags from "@/components/FilterTags";
import ProofBanner from "@/components/ProofBanner";
import SystemCard from "@/components/SystemCard";
import UnifiedCartBar from "@/components/UnifiedCartBar";
import { useSystemDataContext, SystemSolution } from "@/contexts/SystemDataContext";
import CompararSistemas from "@/components/CompararSistemas";
import ExitIntentOffer from "@/components/ExitIntentOffer";
import { RefreshCw, Building2, Store, ShoppingCart, Truck } from "lucide-react";

// Interface para compatibilidade com componentes existentes
interface Sistema {
  id: string;
  nome: string;
  descricao: string;
  subtitulo?: string;
  icon: React.ComponentType<any>;
  slug: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  tags: string[];
}

// Função para converter SystemSolution em Sistema
const systemSolutionToSistema = (solution: SystemSolution): Sistema => {
  // Definir ícones baseado no icon_name
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Store': return Store;
      case 'ShoppingCart': return ShoppingCart;
      case 'Truck': return Truck;
      default: return Building2;
    }
  };

  // Processar tags/segments
  const tags = solution.segments ? solution.segments.split(',').map(s => s.trim()) : [];
  
  return {
    id: solution.id,
    nome: solution.nome,
    descricao: solution.descricao,
    subtitulo: solution.subtitulo,
    icon: getIconComponent(solution.icon_name),
    slug: solution.slug,
    isPopular: solution.is_popular?.toLowerCase() === 'true',
    isRecommended: solution.is_recommended?.toLowerCase() === 'true',
    tags: tags
  };
};

const Solucoes = () => {
  console.log('[Solucoes] Carregando página de soluções');
  
  const { 
    solutions, 
    isLoading, 
    error, 
    unifiedCart, 
    addToUnifiedCart, 
    removeFromUnifiedCart 
  } = useSystemDataContext();
  
  const [segmentFilters, setSegmentFilters] = useState<string[]>([]);
  const [sistemasSelecionadosComparacao, setSistemasSelecionadosComparacao] = useState<string[]>([]);
  const [, forceUpdate] = useState({});

  // Forçar re-render das soluções quando a página é visitada
  useEffect(() => {
    forceUpdate({});
  }, []);

  // Sincronizar com o estado global de comparação
  useEffect(() => {
    const checkComparison = () => {
      const comparador = (window as any).compararSistemas;
      if (comparador && comparador.sistemasSelecionados) {
        setSistemasSelecionadosComparacao([...comparador.sistemasSelecionados]);
      }
    };

    const interval = setInterval(checkComparison, 100);
    return () => clearInterval(interval);
  }, []);

  // Extrair soluções ativas
  const activeSolutions = solutions.filter(s => s.ativo?.toLowerCase() === 'true');
  
  // Extrair segments únicos das soluções ativas
  const uniqueSegments = Array.from(
    new Set(
      activeSolutions
        .flatMap(solution => 
          solution.segments 
            ? solution.segments.split(',').map(s => s.trim()) 
            : []
        )
        .filter(segment => segment.length > 0)
    )
  ).sort();

  // Criar filtros dinâmicos baseados nos segments
  const getIconForSegment = (segment: string) => {
    switch (segment.toLowerCase()) {
      case 'varejo': return Store;
      case 'supermercados': return ShoppingCart;
      case 'distribuidoras': return Truck;
      case 'serviços': return Building2;
      default: return Building2;
    }
  };

  const dynamicFilterOptions = uniqueSegments.map(segment => ({
    id: segment,
    label: segment,
    icon: getIconForSegment(segment),
    description: `Soluções para ${segment.toLowerCase()}`
  }));

  // Aplicar filtros por segmento - usando segments diretamente
  const filteredSolutions = segmentFilters.length === 0 
    ? activeSolutions 
    : activeSolutions.filter(solution => {
        const solutionSegments = solution.segments ? solution.segments.split(',').map(s => s.trim()) : [];
        return solutionSegments.some(segment => segmentFilters.includes(segment));
      });
  
  // Ordenar por ordem
  const sortedSolutions = filteredSolutions.sort((a, b) => 
    parseInt(a.ordem || '0') - parseInt(b.ordem || '0')
  );
  
  const filteredSistemas = sortedSolutions.map(systemSolutionToSistema);

  const handleAddToCart = (sistemaId: string) => {
    console.log('[Solucoes] Adicionando ao carrinho:', sistemaId);
    const solution = solutions.find(s => s.id === sistemaId);
    if (solution && !unifiedCart.find(item => item.id === sistemaId && item.tipo === 'solution')) {
      addToUnifiedCart(solution, 'solution');
      console.log('[Solucoes] Item adicionado ao carrinho');
    } else {
      console.log('[Solucoes] Item já está no carrinho ou não encontrado');
    }
  };

  const handleRemoveFromCart = (sistemaId: string) => {
    removeFromUnifiedCart(sistemaId);
  };

  const handleCompare = (sistemaId: string) => {
    console.log('[Solucoes] Comparando sistema:', sistemaId);
    const comparador = (window as any).compararSistemas;
    if (comparador) {
      comparador.toggleSistema(sistemaId);
      console.log('[Solucoes] Sistema adicionado/removido da comparação');
    } else {
      console.log('[Solucoes] Comparador não encontrado');
    }
  };

  const handleWhatsAppClick = () => {
    let mensagem = "Olá! Gostaria de solicitar um orçamento para os seguintes itens que selecionei no site:\n\n";
    
    const productItems = unifiedCart.filter(item => item.tipo === 'product');
    const solutionItems = unifiedCart.filter(item => item.tipo === 'solution');
    
    if (solutionItems.length > 0) {
      mensagem += "Sistemas:\n";
      solutionItems.forEach(item => {
        mensagem += `• ${item.nome}\n`;
      });
      mensagem += "\n";
    }
    
    if (productItems.length > 0) {
      mensagem += "Equipamentos:\n";
      productItems.forEach(item => {
        mensagem += `• ${item.nome}${item.preco ? ` - R$ ${item.preco}` : ''}\n`;
      });
      mensagem += "\n";
    }
    
    mensagem += "Fico no aguardo do contato para verificar os valores e a disponibilidade.";
    
    const mensagemCodificada = encodeURIComponent(mensagem);
    const numeroWhatsApp = "556135516827";
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    window.open(linkWhatsApp, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Soluções em Automação de Sistemas | i.s.t.i"
        description="Conheça nossas soluções especializadas: SG Sistemas, Arpa Sistemas, Hiper Sistemas e RJK Sistemas. Automação completa para seu negócio."
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Soluções em Automação de Sistemas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra a solução ideal para transformar a gestão do seu negócio
          </p>
          
          {/* Status de carregamento */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground mt-6">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Carregando soluções das planilhas...</span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 mt-6">
              Erro ao carregar dados: {error}
            </div>
          )}
        </div>

        <ProofBanner />

        <FilterTags 
          activeFilters={segmentFilters}
          onFilterChange={setSegmentFilters}
          filterOptions={dynamicFilterOptions}
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredSistemas.length === 0 && !isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                {segmentFilters.length === 0 
                  ? "Nenhuma solução encontrada na planilha."
                  : "Nenhuma solução encontrada para os filtros selecionados."
                }
              </div>
            </div>
          ) : (
            filteredSistemas.map((sistema, index) => (
              <SystemCard
                key={`${sistema.id}-${index}`}
                sistema={sistema}
                index={index}
                onAddToCart={handleAddToCart}
                onCompare={handleCompare}
                isInCart={!!unifiedCart.find(item => item.id === sistema.id && item.tipo === 'solution')}
                isSelectedForComparison={sistemasSelecionadosComparacao.includes(sistema.id)}
              />
            ))
          )}
        </div>

        {/* Componente de comparação integrado (apenas para bandeja e modal) */}
        <CompararSistemas sistemas={filteredSistemas} />

        <div className="text-center mt-12 space-y-6 mb-32">
          <div className="bg-gradient-to-br from-muted/30 to-background rounded-xl p-8 border border-border/50">
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Ainda em dúvida sobre qual o melhor caminho?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Responda nosso diagnóstico de 1 minuto e receba uma recomendação personalizada, 
              ou veja nossa tabela de comparação completa para tomar a melhor decisão.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/quiz">
                <Button variant="cta" size="lg" className="min-w-48">
                  Fazer Diagnóstico Gratuito
                </Button>
              </Link>
              
              <span className="text-muted-foreground">ou</span>
              
              <Link to="/comparar-solucoes">
                <Button variant="secondary" size="lg" className="min-w-48">
                  Ver comparação detalhada
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Barra de orçamento flutuante */}
        <UnifiedCartBar
          cartItems={unifiedCart}
          onRemoveItem={handleRemoveFromCart}
          onWhatsAppClick={handleWhatsAppClick}
        />
      </main>
      
      {/* Exit-Intent Popup */}
      <ExitIntentOffer isEnabled={true} />
    </div>
  );
};

export default Solucoes;