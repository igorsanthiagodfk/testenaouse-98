import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Calendar, 
  Tag, 
  Clock, 
  CheckCircle, 
  ShoppingCart,
  ExternalLink
} from 'lucide-react';
import { SystemProduct } from '@/contexts/SystemDataContext';

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: SystemProduct | null;
  onAddToCart: (product: SystemProduct) => void;
  isInCart: boolean;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart,
  isInCart
}) => {
  if (!product) return null;

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const specifications = formatSpecifications(product.especificacoes);
  const tags = formatTags(product.tags);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-background/95 backdrop-blur-lg border border-border/50">
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <Package className="w-7 h-7 text-accent" />
            {product.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-8 space-y-0">
          {/* Coluna da esquerda - Imagem e informações básicas */}
          <div className="space-y-6">
            {/* Imagem do produto */}
            {product.imagem && (
              <div className="relative">
                <div className="overflow-hidden rounded-xl bg-muted/20 border border-border/30 shadow-lg">
                  <img 
                    src={product.imagem} 
                    alt={product.nome}
                    className="w-full h-80 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
                </div>
              </div>
            )}

            {/* Informações básicas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border/30">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">ID do Produto</span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{product.id}</p>
              </div>

              <div className="space-y-2 p-4 bg-muted/30 rounded-lg border border-border/30">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">Categoria</span>
                </div>
                <p className="text-sm text-muted-foreground">{product.categoria_id}</p>
              </div>
            </div>
          </div>

          {/* Coluna da direita - Conteúdo principal */}
          <div className="space-y-6">
            {/* Preço destacado */}
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/30 shadow-lg">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Preço</p>
                <p className="text-4xl font-bold text-accent mb-2">R$ {formatPrice(product.preco)}</p>
                <div className="w-16 h-1 bg-accent/50 rounded-full mx-auto"></div>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed text-base">{product.descricao}</p>
            </div>

            {/* Especificações técnicas */}
            {specifications.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Especificações Técnicas</h3>
                <div className="grid gap-3">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border/30 hover:bg-muted/60 transition-colors">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm text-foreground font-medium">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground border-b border-border/30 pb-2">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-sm font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Botão de ação */}
            <div className="pt-6 border-t border-border/30">
              {isInCart ? (
                <Button variant="secondary" size="lg" className="w-full h-14 text-lg font-semibold" disabled>
                  <CheckCircle className="w-5 h-5 mr-3" />
                  ✓ Produto no Orçamento
                </Button>
              ) : (
                <Button 
                  variant="cta" 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-3" />
                  Adicionar ao Orçamento
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;