import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, X, Users } from 'lucide-react';

interface ProactiveLiveChatProps {
  delay?: number; // delay in milliseconds before showing
}

const ProactiveLiveChat: React.FC<ProactiveLiveChatProps> = ({ delay = 10000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleChatClick = () => {
    const mensagem = "Olá! Vi que vocês estão navegando pelos equipamentos. Posso ajudar a encontrar a solução ideal para o meu negócio?";
    const mensagemCodificada = encodeURIComponent(mensagem);
    const numeroWhatsApp = "556135516827";
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    window.open(linkWhatsApp, '_blank');
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="fixed bottom-24 right-6 z-40 max-w-sm"
        >
          <Card className="shadow-2xl border-accent/20 bg-background/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-foreground">
                      Equipe I.S.T.I
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleDismiss}
                      className="h-6 w-6 p-0 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    Olá! Precisa de ajuda para escolher os equipamentos ideais para seu negócio?
                  </p>
                  
                  <Button 
                    onClick={handleChatClick}
                    variant="cta" 
                    size="sm" 
                    className="w-full text-xs"
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Conversar agora
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Online agora</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProactiveLiveChat;