import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Eye, ShoppingCart, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Sistema {
  id: string;
  nome: string;
  descricao: string;
  icon: React.ComponentType<any>;
  slug: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  tags: string[];
}

interface SolutionsCarouselProps {
  sistemas: Sistema[];
  sistemasSelecionados: string[];
  onAddToCart: (sistemaId: string) => void;
}

const SolutionsCarousel: React.FC<SolutionsCarouselProps> = ({
  sistemas,
  sistemasSelecionados,
  onAddToCart
}) => {
  const [currentIndex, setCurrentIndex] = useState(1); // Começar no meio
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % sistemas.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [sistemas.length, isDragging]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sistemas.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + sistemas.length) % sistemas.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const diff = e.clientX - dragStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getCardStyle = (index: number) => {
    const distance = index - currentIndex;
    const absDistance = Math.abs(distance);
    
    if (absDistance === 0) {
      // Card Central (Ativo/Em Foco) - Especificações exatas do prompt
      return {
        scale: 1.05, // Levemente maior para criar proximidade
        opacity: 1, // Opacidade total
        blur: 0, // Totalmente nítido
        zIndex: 20, // Camada superior para ficar na frente
        x: 0,
        y: 0,
        rotateY: 0,
        shadow: 'shadow-2xl shadow-accent/30' // Sombra pronunciada para "flutuar"
      };
    } else if (absDistance === 1) {
      // Cards Laterais (Anterior e Próximo) - "Espiando" por trás
      return {
        scale: 0.85, // Visivelmente menores
        opacity: 0.6, // Opacidade reduzida para elementos secundários
        blur: 4, // Desfoque para indicar que não estão em foco
        zIndex: 10, // Camada inferior ao card central
        x: distance > 0 ? 180 : -180, // Posicionados parcialmente atrás
        y: 20, // Ligeiramente abaixo para efeito de profundidade
        rotateY: distance > 0 ? 8 : -8, // Rotação sutil para dar volume
        shadow: 'shadow-lg shadow-black/20'
      };
    } else {
      // Cards Ocultos - Completamente invisíveis
      return {
        scale: 0.7,
        opacity: 0, // Completamente invisíveis
        blur: 8,
        zIndex: 0, // Camada mais baixa
        x: distance > 0 ? 300 : -300,
        y: 40,
        rotateY: distance > 0 ? 15 : -15,
        shadow: 'shadow-none'
      };
    }
  };

  return (
    <div className="relative py-20 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Efeito Spotlight */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-radial from-accent/20 via-transparent to-transparent"
          style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(var(--accent) / 0.2) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
          >
            Nossas Principais{" "}
            <span className="text-accent">Soluções de Gestão</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Descubra a solução ideal para transformar a gestão do seu negócio
          </motion.p>
        </div>

        {/* Carrossel com Efeito Card Deck */}
        <div className="relative max-w-7xl mx-auto">
          <div 
            className="relative h-[520px] flex items-center justify-center"
            style={{ perspective: '1200px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {sistemas.map((sistema, index) => {
              const style = getCardStyle(index);
              const isCenter = index === currentIndex;
              const isVisible = style.opacity > 0; // Só renderizar cards visíveis
              
              if (!isVisible) return null;
              
              return (
                <motion.div
                  key={sistema.id}
                  className="absolute w-80 h-96"
                  initial={false}
                  animate={{
                    scale: style.scale,
                    opacity: style.opacity,
                    rotateY: style.rotateY,
                    x: style.x,
                    y: style.y,
                    zIndex: style.zIndex,
                    filter: `blur(${style.blur}px)`
                  }}
                  transition={{
                    // Sincronização perfeita - todas as propriedades com a mesma transição
                    duration: 0.6,
                    ease: [0.25, 0.8, 0.25, 1] // cubic-bezier conforme especificação
                  }}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    cursor: isCenter ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
                  }}
                  onClick={() => !isCenter && goToSlide(index)}
                >
                  <Card className={`
                    h-full relative overflow-hidden border-border/50 backdrop-blur-sm
                    transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]
                    ${style.shadow}
                    ${isCenter 
                      ? 'border-accent/50 bg-card hover:border-accent/70' 
                      : 'border-border/30 bg-card/90 hover:border-accent/30'
                    }
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
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Recomendado
                          </Badge>
                        )}
                      </div>
                    )}

                    <CardContent className="p-6 h-full flex flex-col justify-between">
                      <div className="text-center space-y-4">
                        <div 
                          className={`
                            w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto
                            ${isCenter ? 'animate-pulse-accent' : ''}
                          `}
                        >
                          <sistema.icon className="w-8 h-8 text-accent-foreground" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className={`text-xl font-bold transition-colors ${isCenter ? 'text-accent' : 'text-foreground'}`}>
                            {sistema.nome}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {sistema.descricao}
                          </p>
                        </div>

                        {/* Tags dos pontos fortes */}
                        <div className="flex flex-wrap gap-1 justify-center">
                          {sistema.tags?.slice(0, 2).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="bg-accent/20 text-accent border-accent/30 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Botões de ação - apenas visíveis no card central */}
                      <AnimatePresence>
                        {isCenter && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-2 mt-4"
                          >
                            <Link to={sistema.slug}>
                              <Button 
                                variant="secondary" 
                                className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                              </Button>
                            </Link>
                            
                            <Button
                              variant={sistemasSelecionados.includes(sistema.id) ? "default" : "outline"}
                              onClick={() => onAddToCart(sistema.id)}
                              disabled={sistemasSelecionados.includes(sistema.id)}
                              className={`
                                w-full transition-all duration-300
                                ${sistemasSelecionados.includes(sistema.id)
                                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                                  : 'hover:bg-accent hover:text-accent-foreground'
                                }
                              `}
                            >
                              {sistemasSelecionados.includes(sistema.id) ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Adicionado
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Adicionar ao Orçamento
                                </>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Botões de navegação - Design aprimorado para o deck */}
          <button
            onClick={goToPrevious}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-background/90 backdrop-blur-md border border-border/50 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all duration-300 shadow-2xl z-30 hover:shadow-accent/30"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-background/90 backdrop-blur-md border border-border/50 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:scale-110 transition-all duration-300 shadow-2xl z-30 hover:shadow-accent/30"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Indicadores melhorados para o deck */}
          <div className="flex justify-center space-x-3 mt-10">
            {sistemas.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]
                  ${index === currentIndex 
                    ? 'w-8 h-3 bg-accent shadow-lg shadow-accent/50 rounded-full' 
                    : 'w-3 h-3 bg-border hover:bg-accent/50 rounded-full hover:scale-125'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsCarousel;