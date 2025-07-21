import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, HelpCircle, Clock, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface ExitIntentOfferProps {
  isEnabled?: boolean;
}

// Configuração de conteúdo por tipo de página
const PAGE_CONFIGS = {
  solutions: {
    icon: HelpCircle,
    title: "Um momento, por favor...",
    subtitle: "Sabemos que escolher um sistema é uma grande decisão",
    description: "Que tal uma ajuda rápida e sem compromisso?",
    whatsappMessage: "Olá! Estava navegando pelas soluções no site e gostaria de falar com um especialista para me ajudar a escolher o sistema ideal para meu negócio."
  },
  products: {
    icon: Clock,
    title: "Só um instante...",
    subtitle: "Encontrar o equipamento certo pode ser complicado",
    description: "Nossos especialistas estão aqui para ajudar.",
    whatsappMessage: "Olá! Estava navegando pelos equipamentos no site e gostaria de falar com um especialista para me ajudar a escolher a solução ideal para meu negócio."
  }
};

const ExitIntentOffer: React.FC<ExitIntentOfferProps> = ({ isEnabled = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pageLoadTime, setPageLoadTime] = useState(Date.now());
  const lastMousePosition = useRef({ x: 0, y: 0, time: 0 });
  const location = useLocation();
  
  // Reset page load time when route changes
  useEffect(() => {
    setPageLoadTime(Date.now());
  }, [location.pathname]);
  
  // Verificar se deve mostrar baseado na página atual
  const shouldShow = () => {
    const path = location.pathname;
    
    // Páginas onde NÃO deve mostrar
    const excludedPaths = [
      '/',
      '/resultados',
      '/quiz',
      '/contato', 
      '/quem-somos'
    ];
    
    return !excludedPaths.includes(path);
  };
  
  // Determinar tipo de conteúdo baseado na página
  const getPageType = () => {
    const path = location.pathname;
    
    if (path.includes('solucoes') || path.includes('comparar')) {
      return 'solutions';
    }
    
    return 'products'; // Default para páginas de produtos/equipamentos
  };

  useEffect(() => {
    if (!isEnabled || !shouldShow()) return;
    
    // Verificar se já foi mostrado nesta sessão
    const hasBeenShown = sessionStorage.getItem('exitIntentShown');
    if (hasBeenShown) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      const timeSincePageLoad = currentTime - pageLoadTime;
      
      // Regra 2: Período de tolerância - não mostrar nos primeiros 15 segundos
      if (timeSincePageLoad < 15000) return;
      
      // Calcular velocidade e direção
      const timeDelta = currentTime - lastMousePosition.current.time;
      if (timeDelta > 0) {
        const deltaY = e.clientY - lastMousePosition.current.y;
        const velocityY = Math.abs(deltaY) / timeDelta;
        
        // Regra 1: Velocidade e direção - movimento rápido para cima
        const isMovingUp = deltaY < 0;
        const isFastMovement = velocityY > 0.5; // pixels per millisecond
        const isNearTop = e.clientY <= 100; // within 100px of top
        
        if (isMovingUp && isFastMovement && isNearTop) {
          setIsVisible(true);
          // Marcar como mostrado nesta sessão
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      }
      
      // Atualizar posição anterior
      lastMousePosition.current = {
        x: e.clientX,
        y: e.clientY,
        time: currentTime
      };
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const currentTime = Date.now();
      const timeSincePageLoad = currentTime - pageLoadTime;
      
      // Regra 2: Período de tolerância
      if (timeSincePageLoad < 15000) return;
      
      // Detectar se o mouse está saindo pela parte superior
      if (e.clientY <= 0 && e.relatedTarget === null) {
        setIsVisible(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEnabled, location.pathname, pageLoadTime]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleWhatsAppClick = () => {
    const config = PAGE_CONFIGS[getPageType()];
    const mensagemCodificada = encodeURIComponent(config.whatsappMessage);
    const numeroWhatsApp = "556135516827";
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    window.open(linkWhatsApp, '_blank');
    handleClose();
  };

  const handlePhoneClick = () => {
    window.open('tel:+5561992825803', '_self');
    handleClose();
  };

  // Não renderizar se não deve mostrar
  if (!shouldShow()) return null;
  
  const config = PAGE_CONFIGS[getPageType()];
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <Dialog open={isVisible} onOpenChange={handleClose}>
          <DialogOverlay 
            className="bg-background/50 backdrop-blur-[8px]"
            style={{
              backgroundColor: 'rgba(13, 27, 42, 0.5)',
              backdropFilter: 'blur(8px)'
            }}
          />
          <DialogContent className="max-w-md p-0 gap-0 border-0 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.34, 1.56, 0.64, 1] // cubic-bezier que cria efeito de mola
              }}
              className="relative rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-accent p-6 text-center relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="absolute top-2 right-2 h-8 w-8 p-0 text-accent-foreground/80 hover:text-accent-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200
                  }}
                  className="w-16 h-16 bg-accent-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <IconComponent className="w-8 h-8 text-accent-foreground" />
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-accent-foreground mb-2"
                >
                  {config.title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-accent-foreground/80 text-sm"
                >
                  {config.subtitle}
                </motion.p>
              </div>

              {/* Content */}
              <div className="p-6 bg-background space-y-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mb-6"
                >
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <Button 
                    onClick={handleWhatsAppClick}
                    variant="cta" 
                    className="w-full transition-all duration-300 hover:scale-[1.02]"
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Conversar no WhatsApp
                  </Button>

                  <Button 
                    onClick={handlePhoneClick}
                    variant="outline" 
                    className="w-full transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar agora: (61) 3551-6827
                  </Button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center pt-4 border-t border-border/30"
                >
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Atendimento online • Segunda a sexta, 8h às 18h
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentOffer;