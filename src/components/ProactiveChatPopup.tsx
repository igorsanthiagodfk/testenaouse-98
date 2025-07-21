import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, MessageCircle, Minimize2 } from "lucide-react";

const ProactiveChatPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Verificar se está no horário comercial (09h às 18h BRT)
    const checkBusinessHours = () => {
      const now = new Date();
      const hour = parseInt(now.toLocaleString('pt-BR', { 
        timeZone: 'America/Sao_Paulo', 
        hour: '2-digit', 
        hour12: false 
      }));
      
      console.log('[ChatPopup] Hora atual BRT:', hour);
      
      if (hour >= 9 && hour < 18) {
        // Mostrar popup após 10 segundos
        const timer = setTimeout(() => {
          setIsVisible(true);
          console.log('[ChatPopup] Popup ativado');
        }, 10000);

        return () => clearTimeout(timer);
      }
    };

    checkBusinessHours();
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    console.log('[ChatPopup]', message);
    
    const encodedMessage = encodeURIComponent(`Olá! ${message}`);
    const whatsappUrl = `https://wa.me/556135516827?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    setIsVisible(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <Button 
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <div className="bg-background border border-border rounded-lg shadow-xl w-80 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Ajuda via WhatsApp</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              Olá! Precisa de ajuda para escolher o sistema ideal?
            </p>
            
            <div className="space-y-3">
              <Input
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm"
              />
              
              <Button 
                onClick={handleSendMessage}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!message.trim()}
              >
                Enviar via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProactiveChatPopup;