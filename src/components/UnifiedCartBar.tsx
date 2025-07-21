import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, ShoppingCart, MessageCircle, Package, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UnifiedCartItem } from "@/contexts/SystemDataContext";

interface UnifiedCartBarProps {
  cartItems: UnifiedCartItem[];
  onRemoveItem: (itemId: string) => void;
  onWhatsAppClick: () => void;
}

const UnifiedCartBar: React.FC<UnifiedCartBarProps> = ({
  cartItems,
  onRemoveItem,
  onWhatsAppClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (cartItems.length === 0) return null;

  const formatPrice = (priceString?: string) => {
    if (!priceString) return "Consultar";
    const price = parseFloat(priceString);
    return isNaN(price) ? priceString : `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl">
      {/* Barra principal */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-accent" />
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-accent text-accent-foreground min-w-5 h-5 text-xs flex items-center justify-center p-0"
                >
                  {cartItems.length}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Seu Orçamento
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} selecionado{cartItems.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:flex"
            >
              {isExpanded ? 'Recolher' : 'Ver Itens'}
            </Button>
            
            <Button 
              variant="cta" 
              size="sm"
              onClick={onWhatsAppClick}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Solicitar Orçamento</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Lista expandida */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <Card key={`${item.tipo}-${item.id}`} className="border-border/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="p-2 rounded-lg bg-accent/10">
                            {item.tipo === 'solution' ? (
                              <Rocket className="w-4 h-4 text-accent" />
                            ) : (
                              <Package className="w-4 h-4 text-accent" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground text-sm truncate">
                                {item.nome}
                              </h4>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${
                                  item.tipo === 'solution' 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'bg-accent/10 text-accent'
                                }`}
                              >
                                {item.tipo === 'solution' ? 'Sistema' : 'Produto'}
                              </Badge>
                            </div>
                            
                            {item.preco && (
                              <p className="text-sm font-medium text-accent">
                                {formatPrice(item.preco)}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-muted-foreground hover:text-destructive p-1"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <Button 
                  variant="cta" 
                  size="lg"
                  onClick={onWhatsAppClick}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Orçamento via WhatsApp</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedCartBar;