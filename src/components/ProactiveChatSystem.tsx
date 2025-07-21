import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Send, 
  X, 
  User, 
  Bot, 
  Clock, 
  Zap, 
  Heart, 
  HelpCircle,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  sentiment?: 'interessado' | 'duvida-tecnica' | 'preco' | 'urgente' | 'satisfeito';
  attachment?: string;
}

interface ChatState {
  isOpen: boolean;
  isMinimized: boolean;
  currentContext: string;
  userInfo: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    interest?: string;
  };
  sentiment: 'interessado' | 'duvida-tecnica' | 'preco' | 'urgente' | 'satisfeito' | null;
}

const ProactiveChatSystem: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    isMinimized: false,
    currentContext: '',
    userInfo: {},
    sentiment: null
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTimePrompt, setShowTimePrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Gatilho por horário (9h-18h BRT)
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const hour = parseInt(now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false }));
      const isBusinessHours = hour >= 9 && hour <= 18;
      
      if (isBusinessHours && !chatState.isOpen && messages.length === 0) {
        setShowTimePrompt(true);
        setTimeout(() => {
          if (!chatState.isOpen) {
            initializeChat();
          }
        }, 3000);
      }
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000);
    return () => clearInterval(interval);
  }, [chatState.isOpen, messages.length]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = () => {
    const context = getContextFromCurrentPage();
    setChatState(prev => ({ ...prev, isOpen: true, currentContext: context }));
    
    // Envio automático do contexto
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: `Olá! 👋 Notei que você está ${context}. Sou especialista em automação comercial e posso ajudar você a encontrar a solução ideal para seu negócio. Em que posso ajudá-lo?`,
      timestamp: new Date(),
      sentiment: 'interessado'
    };

    setMessages([welcomeMessage]);
    setShowTimePrompt(false);
  };

  const getContextFromCurrentPage = () => {
    const path = window.location.pathname;
    const contexts = {
      '/': 'navegando nossa página inicial',
      '/quiz': 'fazendo o diagnóstico do seu negócio',
      '/resultados': 'vendo os resultados do seu diagnóstico',
      '/produtos': 'conhecendo nossos produtos',
      '/equipamentos': 'explorando nossos equipamentos',
      '/quem-somos': 'conhecendo nossa empresa',
      '/contato': 'procurando nosso contato',
      '/blog': 'lendo nosso blog',
      '/cases': 'vendo nossos cases de sucesso'
    };
    return contexts[path as keyof typeof contexts] || 'navegando nosso site';
  };

  const analyzeSentiment = (message: string): 'interessado' | 'duvida-tecnica' | 'preco' | 'urgente' | 'satisfeito' => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo')) {
      return 'preco';
    }
    if (lowerMessage.includes('urgente') || lowerMessage.includes('rapido') || lowerMessage.includes('imediato')) {
      return 'urgente';
    }
    if (lowerMessage.includes('como funciona') || lowerMessage.includes('tecnic') || lowerMessage.includes('sistema')) {
      return 'duvida-tecnica';
    }
    if (lowerMessage.includes('obrigado') || lowerMessage.includes('perfeito') || lowerMessage.includes('excelente')) {
      return 'satisfeito';
    }
    return 'interessado';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      sentiment: analyzeSentiment(inputMessage)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Atualizar sentiment do chat
    setChatState(prev => ({ ...prev, sentiment: userMessage.sentiment }));

    // Simular resposta do bot baseada no sentiment
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage: Message): Message => {
    const responses = {
      'preco': 'Entendo sua preocupação com o investimento! 💰 Nossos sistemas têm excelente custo-benefício e oferecemos várias opções de pagamento. Posso agendar uma apresentação personalizada para mostrar o ROI do seu negócio?',
      'urgente': 'Perfeito! Entendo a urgência. ⚡ Podemos agendar uma demonstração ainda hoje. Qual seu WhatsApp? Vou priorizar seu atendimento.',
      'duvida-tecnica': 'Ótima pergunta técnica! 🔧 Nosso sistema é robusto e confiável. Quer que eu agende uma demo técnica com nosso especialista? Ele pode mostrar todas as funcionalidades.',
      'satisfeito': 'Que bom saber! 😊 Fico feliz em ajudar. Se quiser dar o próximo passo, posso agendar uma apresentação personalizada para seu negócio.',
      'interessado': 'Interessante! 🎯 Vou te enviar um material exclusivo sobre automação comercial. Qual seu e-mail?'
    };

    const sentiment = userMessage.sentiment || 'interessado';
    
    return {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: responses[sentiment],
      timestamp: new Date(),
      sentiment
    };
  };

  const getSentimentIcon = (sentiment: string) => {
    const icons = {
      'interessado': <Heart className="w-4 h-4 text-green-500" />,
      'duvida-tecnica': <HelpCircle className="w-4 h-4 text-blue-500" />,
      'preco': <Zap className="w-4 h-4 text-yellow-500" />,
      'urgente': <AlertCircle className="w-4 h-4 text-red-500" />,
      'satisfeito': <CheckCircle className="w-4 h-4 text-green-600" />
    };
    return icons[sentiment as keyof typeof icons] || null;
  };

  const toggleChat = () => {
    setChatState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    if (!chatState.isOpen && messages.length === 0) {
      initializeChat();
    }
  };

  const toggleMinimize = () => {
    setChatState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  return (
    <>
      {/* Prompt de Horário de Funcionamento */}
      <AnimatePresence>
        {showTimePrompt && !chatState.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="w-80 border-accent shadow-glow animate-glassmorphism">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-accent" />
                    <span className="text-sm font-semibold">Horário de Atendimento</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTimePrompt(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Estamos online! Que tal conversar com um especialista agora?
                </p>
                <Button 
                  onClick={initializeChat}
                  className="w-full" 
                  size="sm"
                  variant="cta"
                >
                  Iniciar Conversa
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante de Chat */}
      <AnimatePresence>
        {!chatState.isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={toggleChat}
              className="w-16 h-16 rounded-full shadow-glow animate-pulse-glow"
              variant="cta"
            >
              <MessageCircle className="w-8 h-8" />
            </Button>
            {chatState.sentiment && (
              <Badge className="absolute -top-2 -left-2 animate-notification-appear">
                {getSentimentIcon(chatState.sentiment)}
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Janela de Chat */}
      <AnimatePresence>
        {chatState.isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]"
          >
            <Card className="shadow-glow border-accent animate-glassmorphism">
              {/* Header */}
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">Chat Especialista</CardTitle>
                    {chatState.sentiment && (
                      <Badge variant="secondary" className="text-xs">
                        {getSentimentIcon(chatState.sentiment)}
                        {chatState.sentiment}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMinimize}
                      className="h-8 w-8 p-0"
                    >
                      {chatState.isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleChat}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Content */}
              <AnimatePresence>
                {!chatState.isMinimized && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-4 pt-2">
                      {/* Messages */}
                      <div className="h-80 overflow-y-auto mb-4 space-y-3">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                              message.type === 'user' 
                                ? 'bg-accent text-accent-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              <div className="flex items-start space-x-2">
                                {message.type === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                                {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                                <div className="flex-1">
                                  <p className="text-sm">{message.content}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs opacity-60">
                                      {message.timestamp.toLocaleTimeString()}
                                    </span>
                                    {message.sentiment && getSentimentIcon(message.sentiment)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                          >
                            <div className="bg-muted p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Bot className="w-4 h-4" />
                                <div className="typing-indicator">
                                  <span></span>
                                  <span></span>
                                  <span></span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="flex space-x-2">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Digite sua mensagem..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!inputMessage.trim() || isTyping}
                          size="sm"
                          variant="cta"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInputMessage('Gostaria de ver uma demonstração')}
                        >
                          📱 Demo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInputMessage('Qual o preço do sistema?')}
                        >
                          💰 Preços
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setInputMessage('Preciso de ajuda técnica')}
                        >
                          🔧 Suporte
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles for typing indicator */}
      <style>{`
        .typing-indicator {
          display: flex;
          gap: 2px;
        }
        .typing-indicator span {
          width: 4px;
          height: 4px;
          background: currentColor;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 60%, 100% {
            opacity: 0.3;
          }
          30% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ProactiveChatSystem;