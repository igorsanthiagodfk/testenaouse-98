import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import FilteredProductGrid from "@/components/FilteredProductGrid";
import UnifiedCartBar from "@/components/UnifiedCartBar";
import ProductDetailsModal from "@/components/ProductDetailsModal";
import ProactiveLiveChat from "@/components/ProactiveLiveChat";
import ExitIntentOffer from "@/components/ExitIntentOffer";
import { 
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  Package,
  ArrowLeft,
  Shield,
  Award,
  Truck,
  Wrench,
  Eye,
  Users,
  Home,
  ChevronRight,
  Mail,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSystemDataContext, SystemProduct } from "@/contexts/SystemDataContext";
import { useToast } from "@/hooks/use-toast";

// Interface removida - usando SystemProduct do contexto

const Produtos = () => {
  const { 
    products, 
    categories, 
    isLoading, 
    error,
    unifiedCart,
    addToUnifiedCart,
    removeFromUnifiedCart
  } = useSystemDataContext();
  const [categoriasAtivas, setCategoriasAtivas] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<SystemProduct | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { toast } = useToast();

  // Filtrar categorias ativas
  const categoriasAtivasData = categories.filter(cat => cat.ativo?.toLowerCase() === 'true');
  
  // Filtrar produtos ativos
  const produtosAtivos = products.filter(prod => prod.ativo?.toLowerCase() === 'true');

  // Produtos filtrados por categorias selecionadas
  const produtosFiltrados = categoriasAtivas.length === 0 
    ? produtosAtivos 
    : produtosAtivos.filter(prod => categoriasAtivas.includes(prod.categoria_id));

  // Ordenar produtos por ordem
  const produtosOrdenados = produtosFiltrados.sort((a, b) => 
    parseInt(a.ordem || '0') - parseInt(b.ordem || '0')
  );

  const adicionarAoCarrinho = (produto: SystemProduct) => {
    if (!unifiedCart.find(item => item.id === produto.id && item.tipo === 'product')) {
      addToUnifiedCart(produto, 'product');
      toast({
        title: "Produto adicionado ao orçamento",
        description: `${produto.nome} foi adicionado à sua lista`,
      });
    }
  };

  const abrirDetalhes = (produto: SystemProduct) => {
    setSelectedProduct(produto);
    setShowDetailsModal(true);
  };

  const formatPrice = (priceString: string) => {
    const price = parseFloat(priceString);
    return isNaN(price) ? priceString : price.toFixed(2).replace('.', ',');
  };

  const formatSpecifications = (specsString?: string) => {
    if (!specsString) return [];
    return specsString.split(',').map(spec => spec.trim()).filter(spec => spec.length > 0);
  };

  const formatTags = (tagsString?: string) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
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
        mensagem += `• ${item.nome}${item.preco ? ` - R$ ${formatPrice(item.preco)}` : ''}\n`;
      });
      mensagem += "\n";
    }
    
    mensagem += "Fico no aguardo do contato para verificar os valores e a disponibilidade.";
    
    const mensagemCodificada = encodeURIComponent(mensagem);
    const numeroWhatsApp = "556135516827";
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    window.open(linkWhatsApp, '_blank');
  };

  // Count products by category
  const productCountByCategory = categoriasAtivasData.reduce((acc, category) => {
    const count = produtosAtivos.filter(prod => prod.categoria_id === category.id).length;
    acc[category.id] = count;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Produtos e Equipamentos - I.S.T.I Tecnologia | Hardware para Comércio"
        description="Equipamentos de alta qualidade para automação comercial: PDV, servidores, impressoras fiscais e configuração completa. Soluções de hardware em Brasília-DF."
        keywords="equipamentos, PDV, servidores, impressoras fiscais, hardware, Brasília, automação comercial, máquinas"
        canonical="https://istitecnologia.com.br/produtos"
      />

      <Header />
      
      {/* Header */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Produtos & Equipamentos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore nossa seleção completa de equipamentos e monte seu orçamento personalizado de automação comercial.
          </p>
          
          {/* Cart Counter */}
          {unifiedCart.length > 0 && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-accent/10 rounded-lg px-4 py-2 border border-accent/20">
              <ShoppingCart className="w-5 h-5 text-accent" />
              <span className="text-foreground font-medium">
                {unifiedCart.length} item{unifiedCart.length !== 1 ? 's' : ''} no seu orçamento
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="p-2 bg-accent/10 rounded-full">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Equipamentos Homologados
                </span>
              </div>
              
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Qualidade Garantida
                </span>
              </div>
              
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="p-2 bg-orange/10 rounded-full">
                  <Truck className="h-5 w-5 text-orange" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Entrega Rápida
                </span>
              </div>
              
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Wrench className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  Suporte na Instalação
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros de Categoria */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <FilteredProductGrid
            categories={categoriasAtivasData}
            activeFilters={categoriasAtivas}
            onFilterChange={setCategoriasAtivas}
            productCount={productCountByCategory}
          />
        </div>
      </section>

      {/* Lista de Produtos */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              {categoriasAtivas.length === 0 
                ? "Todos os produtos disponíveis"
                : `Produtos das categorias selecionadas`
              }
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {categoriasAtivas.length === 0 
                ? "Explore nossa linha completa de equipamentos para automação comercial."
                : `Mostrando ${produtosOrdenados.length} produto${produtosOrdenados.length !== 1 ? 's' : ''} das categorias selecionadas.`
              }
            </p>
            
            {/* Status de carregamento */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Carregando produtos das planilhas...</span>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 mb-6">
                Erro ao carregar dados: {error}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosOrdenados.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {categoriasAtivas.length === 0 ? "Nenhum produto encontrado" : "Nenhum produto nas categorias selecionadas"}
                </h3>
                <p className="text-muted-foreground">
                  {categoriasAtivas.length === 0 
                    ? "Verifique se há produtos cadastrados na planilha."
                    : "Tente selecionar outras categorias ou remover os filtros."
                  }
                </p>
              </div>
            ) : (
              produtosOrdenados.map((produto) => {
                const jaNoCarrinho = unifiedCart.find(item => item.id === produto.id && item.tipo === 'product');
                const especificacoes = formatSpecifications(produto.especificacoes);
                const tags = formatTags(produto.tags);
                
                return (
                  <Card 
                    key={produto.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20 bg-background/60 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {produto.nome}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm line-clamp-2">{produto.descricao}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirDetalhes(produto)}
                          className="ml-2 p-2 h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {/* Preview da imagem */}
                    {produto.imagem && (
                      <div className="px-6 pb-3">
                        <div className="relative overflow-hidden rounded-lg bg-muted/20 border border-border/30">
                          <img 
                            src={produto.imagem} 
                            alt={produto.nome}
                            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="py-3">
                      <div className="space-y-3">
                        <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                          <span className="text-2xl font-bold text-accent">
                            R$ {formatPrice(produto.preco)}
                          </span>
                        </div>
                        
                        {produto.categoria_id && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            {produto.categoria_id}
                          </Badge>
                        )}

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 2).map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="text-xs bg-primary/10 text-primary border-primary/20"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}

                        {especificacoes.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-foreground text-sm">Especificações:</h4>
                            <div className="flex flex-wrap gap-1">
                              {especificacoes.slice(0, 2).map((spec, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                              {especificacoes.length > 2 && (
                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                  +{especificacoes.length - 2} mais
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardContent className="pt-0">
                      {jaNoCarrinho ? (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm text-accent font-medium flex items-center">
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            No orçamento
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromUnifiedCart(produto.id)}
                            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => adicionarAoCarrinho(produto)}
                          className="w-full transition-all duration-300 hover:shadow-glow"
                          variant="cta"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Adicionar ao Orçamento
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-primary-foreground mb-6">
            Ainda com dúvidas sobre qual equipamento escolher?
          </h2>
          <p className="text-lg lg:text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            Nossos consultores especializados fazem uma análise gratuita do seu negócio e recomendam a solução ideal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-[#FFB800] text-black hover:bg-[#FFB800]/90"
              onClick={() => {
                const mensagem = "Olá! Estava navegando pelos equipamentos. Pode me ajudar a encontrar a solução ideal para o meu negócio?";
                const mensagemCodificada = encodeURIComponent(mensagem);
                const numeroWhatsApp = "556135516827";
                const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
                window.open(linkWhatsApp, '_blank');
              }}
            >
              Conversar no WhatsApp
            </Button>
            <Link to="/contato">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-[#FFFFFF] text-[#FFFFFF] hover:bg-[#FFFFFF]/10"
              >
                <Mail className="w-4 h-4 mr-2" />
                Ver outras formas de contato
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal de detalhes do produto */}
      <ProductDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={selectedProduct}
        onAddToCart={adicionarAoCarrinho}
        isInCart={selectedProduct ? !!unifiedCart.find(p => p.id === selectedProduct.id && p.tipo === 'product') : false}
      />

      {/* Barra de orçamento unificada */}
      <UnifiedCartBar
        cartItems={unifiedCart}
        onRemoveItem={removeFromUnifiedCart}
        onWhatsAppClick={handleWhatsAppClick}
      />

      {/* Componentes auxiliares */}
      <ProactiveLiveChat />
      <ExitIntentOffer />
    </div>
  );
};

export default Produtos;