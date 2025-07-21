import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import { productCategories, Product, products } from "@/data/database";
import { Link } from "react-router-dom";

interface KitSelectorProps {
  onKitComplete: (produtos: Product[]) => void;
  onSkip: () => void;
}

const KitSelector = ({ onKitComplete, onSkip }: KitSelectorProps) => {
  const [kit, setKit] = useState<Product[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const allProducts = products();
  const categoriaSelecionada = productCategories.find(cat => cat.id === categoriaAtiva);
  const produtosDaCategoria = allProducts.filter(p => p.category === categoriaAtiva);

  const adicionarAoKit = (produto: Product) => {
    const produtoExiste = kit.find(p => p.id === produto.id);
    if (!produtoExiste) {
      setKit([...kit, produto]);
    }
  };

  const removerDoKit = (produtoId: number) => {
    setKit(kit.filter(p => p.id !== produtoId));
  };

  const valorTotal = kit.reduce((total, produto) => total + produto.price, 0);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
              Monte seu Kit de Equipamentos
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Além do sistema, você precisa de equipamentos? Selecione produtos das categorias abaixo para compor seu orçamento completo.
            </p>
            
            {kit.length > 0 && (
              <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-lg px-4 py-2 border border-accent/20 mb-4">
                <ShoppingCart className="w-5 h-5 text-accent" />
                <span className="text-foreground font-medium">
                  {kit.length} produto{kit.length !== 1 ? 's' : ''} selecionado{kit.length !== 1 ? 's' : ''}
                </span>
                <Badge variant="secondary">R$ {valorTotal.toFixed(2)}</Badge>
              </div>
            )}
          </div>

          {!categoriaAtiva ? (
            /* Seleção de Categorias */
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {productCategories.map((categoria) => (
                  <Card 
                    key={categoria.id}
                    className="group hover:shadow-elegant transition-all duration-[1.5s] border-border/50 hover:border-accent/50 cursor-pointer"
                    onClick={() => setCategoriaAtiva(categoria.id)}
                  >
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                        <categoria.icon className="w-8 h-8 text-accent" />
                      </div>
                      <CardTitle className="text-lg">{categoria.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{categoria.description}</p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-right">
                        <Badge variant="outline">
                          {allProducts.filter(p => p.category === categoria.id).length} produtos
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:border-accent group-hover:text-accent text-sm mt-4"
                      >
                        Ver Produtos
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Ações */}
              <div className="text-center space-y-4">
                {kit.length > 0 && (
                  <Button 
                    variant="default" 
                    size="lg" 
                    onClick={() => onKitComplete(kit)}
                    className="text-lg px-8 py-6"
                  >
                    Finalizar Kit ({kit.length} item{kit.length !== 1 ? 's' : ''})
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
                
                <div>
                  <Button 
                    variant="ghost" 
                    onClick={onSkip}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Pular esta etapa - Apenas sistema
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Lista de Produtos */
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setCategoriaAtiva(null)}
                    className="flex items-center space-x-2"
                  >
                    ← Voltar
                  </Button>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                      {categoriaSelecionada?.name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {categoriaSelecionada?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de produtos da categoria */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {produtosDaCategoria.map((produto) => {
                  const jaAdicionado = kit.some(p => p.id === produto.id);
                  return (
                    <Card key={produto.id} className={`cursor-pointer transition-colors ${jaAdicionado ? 'ring-2 ring-primary' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{produto.name}</h4>
                          {jaAdicionado && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{produto.short_description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-primary">R$ {produto.price.toFixed(2)}</span>
                          <Button
                            size="sm"
                            variant={jaAdicionado ? "secondary" : "default"}
                            onClick={() => jaAdicionado ? removerDoKit(produto.id) : adicionarAoKit(produto)}
                          >
                            {jaAdicionado ? "Remover" : "Adicionar"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCategoriaAtiva(null)}
                  className="mr-4"
                >
                  Continuar Selecionando
                </Button>
                
                {kit.length > 0 && (
                  <Button 
                    variant="default" 
                    onClick={() => onKitComplete(kit)}
                  >
                    Finalizar Kit ({kit.length})
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Kit Summary - Fixo no bottom em mobile */}
          {kit.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 lg:hidden z-50">
              <div className="flex items-center justify-between max-w-sm mx-auto">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium text-sm">
                    {kit.length} no kit
                  </span>
                </div>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onKitComplete(kit)}
                >
                  Finalizar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitSelector;