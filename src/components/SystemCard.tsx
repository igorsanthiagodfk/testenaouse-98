import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GitCompare, ShoppingCart, Check, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface Sistema {
  id: string;
  nome: string;
  descricao: string;
  subtitulo?: string;
  icon: React.ComponentType<any>;
  slug: string;
  isPopular?: boolean;
  isRecommended?: boolean;
}

interface SystemCardProps {
  sistema: Sistema;
  index: number;
  onAddToCart: (sistemaId: string) => void;
  onCompare: (sistemaId: string) => void;
  isInCart: boolean;
  isSelectedForComparison: boolean;
}

const SystemCard: React.FC<SystemCardProps> = ({
  sistema,
  index,
  onAddToCart,
  onCompare,
  isInCart,
  isSelectedForComparison
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [localIsInCart, setLocalIsInCart] = useState(isInCart);
  const [localIsSelectedForComparison, setLocalIsSelectedForComparison] = useState(isSelectedForComparison);

  // Sincronizar estado local com props
  React.useEffect(() => {
    setLocalIsInCart(isInCart);
  }, [isInCart]);

  React.useEffect(() => {
    setLocalIsSelectedForComparison(isSelectedForComparison);
  }, [isSelectedForComparison]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`
        group relative overflow-hidden card-hover-lift
        ${isSelectedForComparison ? 'comparison-glow' : 'hover:shadow-elegant'}
        ${isHovered ? 'border-primary/20' : ''}
        ${sistema.isPopular ? 'system-card-popular' : ''}
        ${sistema.isRecommended ? 'system-card-recommended' : ''}
      `}>
        {/* Badge de destaque */}
        {(sistema.isPopular || sistema.isRecommended) && (
          <div className="absolute top-3 right-3 z-10">
            {sistema.isPopular && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                <Award className="h-3 w-3 mr-1" />
                Mais Popular
              </Badge>
            )}
            {sistema.isRecommended && (
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                <Star className="h-3 w-3 mr-1" />
                Recomendado
              </Badge>
            )}
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <sistema.icon className="h-8 w-8 text-primary" />
            </motion.div>
            <CardTitle className="text-xl">{sistema.nome}</CardTitle>
          </div>
          <CardDescription className="text-base leading-relaxed">
            {sistema.subtitulo}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <div className="flex gap-2">
            {/* Botão Ver detalhes */}
            <Link to={sistema.slug} className="flex-1">
              <Button 
                variant="secondary" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-[1.5s]"
              >
                Ver detalhes
              </Button>
            </Link>

            {/* Botão Adicionar ao Orçamento */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={localIsInCart ? "default" : "outline"}
                    size="default"
                    onClick={() => {
                      console.log(`[SystemCard] Clicando no carrinho para sistema ${sistema.id}`);
                      if (!localIsInCart) {
                        onAddToCart(sistema.id);
                        setLocalIsInCart(true);
                      }
                    }}
                    disabled={localIsInCart}
                    className={`
                      px-3 transition-all duration-[1.5s]
                      ${localIsInCart 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'hover:bg-primary/10 hover:border-primary/50'
                      }
                    `}
                  >
                    {localIsInCart ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {localIsInCart 
                      ? 'Adicionado ao orçamento' 
                      : 'Adicionar ao orçamento para consulta'
                    }
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Botão Comparar */}
            <Button
              variant={localIsSelectedForComparison ? "default" : "outline"}
              size="default"
              onClick={() => {
                console.log(`[SystemCard] Clicando em comparar para sistema ${sistema.id}`);
                onCompare(sistema.id);
                setLocalIsSelectedForComparison(!localIsSelectedForComparison);
              }}
              className={`
                flex items-center space-x-2 px-3 transition-all duration-[1.5s]
                ${localIsSelectedForComparison 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent/10 hover:border-accent/50'
                }
              `}
            >
              {localIsSelectedForComparison ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Selecionado</span>
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4" />
                  <span className="hidden sm:inline">Comparar</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>

        {/* Efeito de hover sutil */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </Card>
    </motion.div>
  );
};

export default SystemCard;