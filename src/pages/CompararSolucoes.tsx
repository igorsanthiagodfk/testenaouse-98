import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import SEO from "@/components/SEO";
import ExitIntentOffer from "@/components/ExitIntentOffer";
import { Building2, Store, ShoppingCart, Truck, Check, RefreshCw } from "lucide-react";
import { useSystemDataContext } from "@/contexts/SystemDataContext";


const CompararSolucoes = () => {
  console.log('[CompararSolucoes] Carregando página de comparação');
  const { solutions, isLoading, error } = useSystemDataContext();

  // Definir ícones baseado no icon_name
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Store': return Store;
      case 'ShoppingCart': return ShoppingCart;
      case 'Truck': return Truck;
      default: return Building2;
    }
  };

  // Converter soluções do Google Sheets para formato necessário
  const sistemas = solutions
    .filter(s => s.ativo?.toLowerCase() === 'true')
    .sort((a, b) => parseInt(a.ordem || '0') - parseInt(b.ordem || '0'))
    .map(solution => ({
      nome: solution.nome,
      indicacao: solution.subtitulo || solution.segments || 'Sistema de gestão',
      pdvs: solution.capacidade_pdvs || 'Conforme necessidade',
      icon: getIconComponent(solution.icon_name),
      funcionalidades: solution.beneficios ? solution.beneficios.split(',').filter(b => b.trim()) : [],
      descricao: solution.descricao,
      slug: solution.slug
    }));

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Compare Nossas Soluções | i.s.t.i"
        description="Compare todos os sistemas i.s.t.i lado a lado e encontre a solução ideal para seu negócio."
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Compare Nossas Soluções
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja as características de cada sistema lado a lado para tomar a melhor decisão
          </p>
          
          {/* Status de carregamento */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground mt-6">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Carregando dados das planilhas...</span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 mt-6">
              Erro ao carregar dados: {error}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        {!isLoading && sistemas.length > 0 && (
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse border border-border rounded-lg">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-4 text-left font-semibold">Sistema</th>
                <th className="border border-border p-4 text-left font-semibold">Indicação</th>
                <th className="border border-border p-4 text-left font-semibold">Capacidade PDVs</th>
                <th className="border border-border p-4 text-left font-semibold">Funcionalidades</th>
                <th className="border border-border p-4 text-left font-semibold">Diferencial</th>
                <th className="border border-border p-4 text-left font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody>
              {sistemas.map((sistema, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-4">
                    <div className="flex items-center gap-3">
                      <sistema.icon className="h-6 w-6 text-primary" />
                      <span className="font-semibold">{sistema.nome}</span>
                    </div>
                  </td>
                  <td className="border border-border p-4 text-muted-foreground">
                    {sistema.indicacao}
                  </td>
                  <td className="border border-border p-4 font-medium">
                    {sistema.pdvs}
                  </td>
                  <td className="border border-border p-4">
                    <ul className="space-y-1">
                      {sistema.funcionalidades.slice(0, 3).map((func, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{func}</span>
                        </li>
                      ))}
                      {sistema.funcionalidades.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{sistema.funcionalidades.length - 3} mais funcionalidades...
                        </li>
                      )}
                    </ul>
                  </td>
                  <td className="border border-border p-4">
                    <div className="text-sm text-muted-foreground">
                      {sistema.descricao ? sistema.descricao.substring(0, 100) + '...' : 'Solução completa de gestão'}
                    </div>
                  </td>
                  <td className="border border-border p-4">
                    <div className="flex gap-2">
                      <Link to={sistema.slug}>
                        <Button variant="outline" size="sm">
                          Ver detalhes
                        </Button>
                      </Link>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          const cartData = JSON.parse(localStorage.getItem('unified_cart') || '[]');
                          if (!cartData.find((item: any) => item.id === sistema.nome.toLowerCase().replace(/\s+/g, '-'))) {
                            cartData.push({
                              id: sistema.nome.toLowerCase().replace(/\s+/g, '-'),
                              nome: sistema.nome,
                              tipo: 'solution',
                              preco: null
                            });
                            localStorage.setItem('unified_cart', JSON.stringify(cartData));
                            alert(`${sistema.nome} adicionado ao orçamento!`);
                          } else {
                            alert(`${sistema.nome} já está no orçamento!`);
                          }
                        }}
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Orçar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {!isLoading && sistemas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma solução encontrada na planilha.
            </p>
          </div>
        )}

        {/* Mobile Cards */}
        {!isLoading && sistemas.length > 0 && (
          <div className="lg:hidden space-y-6">
            {sistemas.map((sistema, index) => (
            <Card key={index} className="hover:shadow-elegant transition-all duration-[1.5s]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <sistema.icon className="h-6 w-6 text-primary" />
                  {sistema.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Indicação:</p>
                  <p className="text-sm">{sistema.indicacao}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Capacidade PDVs:</p>
                  <p className="text-sm font-medium">{sistema.pdvs}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Funcionalidades:</p>
                  <ul className="space-y-1">
                    {sistema.funcionalidades.map((func, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <Check className="h-3 w-3 text-primary flex-shrink-0" />
                        {func}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link to={sistema.slug}>
                  <Button variant="outline" className="w-full">
                    Ver detalhes completos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Ainda tem dúvidas sobre qual sistema escolher?
          </p>
          <Link to="/quiz">
            <Button variant="cta">
              Fazer Diagnóstico Gratuito
            </Button>
          </Link>
        </div>
      </main>
      
      {/* Exit-Intent Popup */}
      <ExitIntentOffer isEnabled={true} />
    </div>
  );
};

export default CompararSolucoes;