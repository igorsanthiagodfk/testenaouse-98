import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingCart, 
  X, 
  ChevronUp, 
  ChevronDown, 
  MessageCircle,
  Trash2,
  Package,
  Monitor,
  Printer,
  Server,
  Router,
  Keyboard,
  Settings
} from 'lucide-react';
import { Product } from '@/data/database';

interface RecommendationResult {
  sistema: {
    nome: string;
    logo: string;
    descricao: string;
    forte: string[];
  };
  infraestrutura: {
    tipo: string;
    descricao: string;
  };
  suporte: {
    nivel: string;
    descricao: string;
  };
  beneficios: string[];
}

interface CarrinhoOrcamentoProps {
  currentRecommendation: RecommendationResult;
  kitSelecionado: Product[];
  onRemoveFromKit: (produtoId: string) => void;
  onWhatsAppClick: () => void;
}

const getIconByCategory = (categoria: string) => {
  switch (categoria) {
    case 'sistema':
      return Settings;
    case 'computadores':
      return Monitor;
    case 'impressoras':
      return Printer;
    case 'servidores':
      return Server;
    case 'rede':
      return Router;
    case 'acessorios':
      return Keyboard;
    default:
      return Package;
  }
};

const CarrinhoOrcamento: React.FC<CarrinhoOrcamentoProps> = ({
  currentRecommendation,
  kitSelecionado,
  onRemoveFromKit,
  onWhatsAppClick
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Kit personalizado que sempre inclui o sistema recomendado + produtos selecionados
  const getKitPersonalizado = () => {
    const sistemaItem = {
      id: `sistema-${currentRecommendation?.sistema.nome.toLowerCase().replace(/\s+/g, '-')}`,
      nome: currentRecommendation?.sistema.nome || 'Sistema Recomendado',
      descricao: currentRecommendation?.sistema.descricao || '',
      categoria: 'sistema',
      especificacoes: currentRecommendation?.sistema.forte || [],
      preco: 'Consultar'
    };
    
    return [sistemaItem, ...kitSelecionado];
  };

  const kitCompleto = getKitPersonalizado();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRemove = (produtoId: string) => {
    // Não permitir remoção do sistema principal
    if (produtoId.startsWith('sistema-')) return;
    onRemoveFromKit(produtoId);
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
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
                    key={kitCompleto.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  >
                    {kitCompleto.length}
                  </motion.div>
                </motion.div>
                <h3 className="text-lg font-semibold text-foreground">
                  Sua Solução ({kitCompleto.length} {kitCompleto.length === 1 ? 'item' : 'itens'}):
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
                  {kitCompleto.map((item, index) => {
                    const category = 'category' in item ? item.category : item.categoria;
                    const IconComponent = getIconByCategory(category);
                    const isSystemItem = String(item.id).startsWith('sistema-');
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground text-sm">
                              {'name' in item ? item.name : item.nome}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {'category' in item ? item.category : item.categoria}
                            </p>
                          </div>
                          {(('price' in item && item.price) || ('preco' in item && item.preco)) && (
                            <Badge variant="secondary" className="text-xs">
                              {'price' in item ? `R$ ${item.price.toFixed(2)}` : item.preco}
                            </Badge>
                          )}
                        </div>
                        
                        {!isSystemItem && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(String(item.id))}
                            className="ml-2 p-2 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </motion.div>
                    );
                  })}
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
              Falar com um consultor
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
                    key={kitCompleto.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  >
                    {kitCompleto.length}
                  </motion.div>
                </motion.div>
                <div className="text-sm">
                  <p className="font-semibold text-foreground">
                    {kitCompleto.length} {kitCompleto.length === 1 ? 'item' : 'itens'} na sua solução | Clique para ver os detalhes
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
                  Falar com um consultor
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CarrinhoOrcamento;