import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  ChevronUp, 
  ChevronDown, 
  MessageCircle,
  Trash2,
  Package,
  Eye
} from 'lucide-react';
import { SystemProduct } from '@/contexts/SystemDataContext';

interface ProductCartBarProps {
  produtos: SystemProduct[];
  onRemoveFromCart: (productId: string) => void;
  onViewDetails: (product: SystemProduct) => void;
  onWhatsAppClick: () => void;
}

const ProductCartBar: React.FC<ProductCartBarProps> = ({
  produtos,
  onRemoveFromCart,
  onViewDetails,
  onWhatsAppClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (produtos.length === 0) {
    return null;
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const formatPrice = (priceString: string) => {
    const price = parseFloat(priceString);
    return isNaN(price) ? priceString : price.toFixed(2).replace('.', ',');
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t shadow-lg z-50"
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto p-4"
          >
            {/* Cabeçalho do carrinho expandido */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <ShoppingCart className="w-6 h-6 text-accent" />
                  <motion.div 
                    key={produtos.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  >
                    {produtos.length}
                  </motion.div>
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground">
                  Orçamento de Produtos ({produtos.length} {produtos.length === 1 ? 'item' : 'itens'}):
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="flex items-center gap-2"
              >
                <ChevronDown className="w-4 h-4" />
                Fechar
              </Button>
            </div>

            {/* Lista de itens detalhada */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {produtos.map((produto, index) => (
                    <motion.div
                      key={produto.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">{produto.nome}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{produto.descricao}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          R$ {formatPrice(produto.preco)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(produto)}
                          className="p-2 hover:bg-accent/10 hover:text-accent"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFromCart(produto.id)}
                          className="p-2 hover:bg-destructive/10 hover:text-destructive"
                          title="Remover do orçamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botão de ação */}
            <Button 
              onClick={onWhatsAppClick}
              variant="cta"
              size="lg"
              className="w-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Receber Orçamento no WhatsApp
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="minimized"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto p-4"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={handleToggle}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <ShoppingCart className="w-6 h-6 text-accent" />
                  <motion.div 
                    key={produtos.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  >
                    {produtos.length}
                  </motion.div>
                </motion.div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">
                    {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'} para orçamento | Clique para ver os detalhes
                  </p>
                  <p className="text-muted-foreground">Sem compromisso • Orçamento gratuito</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWhatsAppClick();
                  }}
                  variant="cta"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Solicitar Orçamento
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCartBar;