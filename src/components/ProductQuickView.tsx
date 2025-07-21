import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/data/database';
import { CheckCircle, Plus, X } from 'lucide-react';

interface ProductQuickViewProps {
  produto: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (produto: Product) => void;
  isInCart: boolean;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  produto,
  isOpen,
  onClose,
  onAddToCart,
  isInCart
}) => {
  if (!produto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold text-foreground">
            {produto.name}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Imagem do produto - placeholder por enquanto */}
          <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center border border-border/50">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">Imagem do produto</p>
            </div>
          </div>
          
          {/* Preço */}
          <div className="text-center">
            <Badge variant="secondary" className="text-lg px-4 py-2 font-bold text-accent">
              R$ {produto.price}
            </Badge>
          </div>
          
          {/* Descrição */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
            <p className="text-muted-foreground">{produto.short_description}</p>
          </div>
          
          {/* Especificações técnicas */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Especificações Técnicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {produto.specifications.map((spec, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-muted/20 rounded-lg border border-border/30">
                  <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{spec.label}: {spec.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Botão de ação */}
          <div className="flex gap-3 pt-4 border-t border-border/30">
            {isInCart ? (
              <Button variant="secondary" className="flex-1" disabled>
                <CheckCircle className="w-4 h-4 mr-2" />
                Já no orçamento
              </Button>
            ) : (
              <Button 
                variant="cta" 
                className="flex-1"
                onClick={() => onAddToCart(produto)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar ao Orçamento
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;