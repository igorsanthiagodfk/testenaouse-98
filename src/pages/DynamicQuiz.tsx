import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import SEO from '@/components/SEO';
import { ArrowRight, Cog, BarChart3 } from 'lucide-react';
import { trackEvent, useUTMTracking, getStoredUTM } from '@/components/Analytics';
import { useNavigate } from 'react-router-dom';
import { seoData } from '@/data/constants';
import * as LucideIcons from 'lucide-react';

interface QuizData {
  [key: string]: string;
}

// Perguntas estáticas originais do quiz
const staticQuestions = [
  {
    id: '1',
    pergunta: 'Qual é o ramo do seu negócio?',
    tipo: 'single',
    opcoes: [
      'Varejo',
      'Supermercado ou Mercadinho', 
      'Distribuidora ou Atacado',
      'Restaurante ou Lanchonete',
      'Padaria',
      'Farmácia',
      'Oficina Mecânica',
      'Clínica ou Consultório',
      'Prestação de Serviços',
      'Outro'
    ]
  },
  {
    id: '2', 
    pergunta: 'Qual é o principal desafio na gestão da sua empresa?',
    tipo: 'single',
    opcoes: [
      'Gestão Financeira',
      'Controle de Estoque',
      'Relacionamento com Cliente',
      'Organização de Processos',
      'Controle de Vendas'
    ]
  },
  {
    id: '3',
    pergunta: 'Qual o porte da sua empresa?',
    tipo: 'single', 
    opcoes: [
      'Pequena (até 10 funcionários)',
      'Média (11 a 50 funcionários)',
      'Grande (mais de 50 funcionários)'
    ]
  },
  {
    id: '4',
    pergunta: 'Quais funcionalidades são essenciais para você?',
    tipo: 'multiple',
    opcoes: [
      'Emissão de Notas Fiscais',
      'Controle de Vendas', 
      'Fluxo de Caixa',
      'Gestão de Compras',
      'Relatórios Gerenciais',
      'Controle de Estoque Avançado'
    ]
  },
  {
    id: '5',
    pergunta: 'Quantos pontos de venda (PDVs) você possui?',
    tipo: 'single',
    opcoes: [
      '1 PDV',
      '2 a 3 PDVs',
      '4 a 8 PDVs', 
      'Mais de 8 PDVs'
    ]
  },
  {
    id: '6',
    pergunta: 'Qual tipo de acesso você prefere?',
    tipo: 'single',
    opcoes: [
      'Acesso em Nuvem (de qualquer lugar)',
      'Acesso Local (apenas na empresa)'
    ]
  }
];

const DynamicQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Capturar UTMs na primeira renderização
  useUTMTracking();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Função para determinar a próxima pergunta
  const getNextQuestionIndex = (currentIndex: number): number => {
    return currentIndex + 1;
  };

  const getTotalSteps = () => {
    return staticQuestions.length + 1; // +1 para tela inicial
  };

  const getProgressPercentage = () => {
    if (currentStep === 0) return 0;
    const totalSteps = getTotalSteps() - 1;
    const progress = Math.min(currentStep, totalSteps);
    return Math.min(100, (progress / totalSteps) * 100);
  };

  const getProgressText = () => {
    if (currentStep === 0) return "Vamos começar!";
    
    const texts = [
      "Vamos começar!",
      "Ótimo! Continue...",
      "Muito bem! Prossiga...",
      "Perfeito! Quase lá...",
      "Excelente! Mais um pouco...",
      "Incrível! Quase terminando...",
      "Fantástico! Último passo!"
    ];
    
    return texts[Math.min(currentStep, texts.length - 1)] || `Passo ${currentStep}`;
  };

  // Mapa dos IDs das perguntas para os nomes dos campos esperados pelos resultados
  const getFieldNameForQuestion = (questionId: string): string => {
    const fieldMap: { [key: string]: string } = {
      '1': 'ramo',
      '2': 'prioridade', 
      '3': 'porte',
      '4': 'funcionalidades',
      '5': 'pdvs',
      '6': 'acesso'
    };
    return fieldMap[questionId] || `answer_${questionId}`;
  };

  const handleOptionSelect = (value: string, isMultiple: boolean = false) => {
    console.log('[DynamicQuiz] Selecionando opção:', { value, currentStep, isMultiple });
    
    const currentQuestion = staticQuestions[currentQuestionIndex];
    const fieldName = getFieldNameForQuestion(currentQuestion.id);
    
    if (isMultiple) {
      // Para perguntas múltiplas, adicionar/remover da lista
      const currentValues = quizData[fieldName] ? quizData[fieldName].split(',') : [];
      let newValues: string[];
      
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value);
      } else {
        newValues = [...currentValues, value];
      }
      
      setQuizData(prev => ({ ...prev, [fieldName]: newValues.join(',') }));
      return; // Não avançar automaticamente em perguntas múltiplas
    } else {
      console.log('[DynamicQuiz] Mapeando pergunta', currentQuestion.id, 'para campo', fieldName);
      setQuizData(prev => ({ ...prev, [fieldName]: value }));
      
      setTimeout(() => {
        if (currentQuestionIndex < staticQuestions.length - 1) {
          const nextIndex = getNextQuestionIndex(currentQuestionIndex);
          setCurrentQuestionIndex(nextIndex);
          setCurrentStep(prev => prev + 1);
        } else {
          // Última pergunta, ir para formulário de contato
          setCurrentStep(prev => prev + 1);
        }
      }, 300);
    }
  };

  const handleContinueMultiple = () => {
    if (currentQuestionIndex < staticQuestions.length - 1) {
      const nextIndex = getNextQuestionIndex(currentQuestionIndex);
      setCurrentQuestionIndex(nextIndex);
      setCurrentStep(prev => prev + 1);
    } else {
      // Última pergunta, ir para formulário de contato
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[DynamicQuiz] 🚀 FORMULÁRIO SUBMETIDO - dados atuais:', quizData);
    
    // Verificar se temos os dados necessários
    if (!quizData.nome || !quizData.empresa || !quizData.whatsapp) {
      console.error('[DynamicQuiz] ❌ ERRO: Dados obrigatórios faltando');
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    
    console.log('[DynamicQuiz] ✅ Dados validados, iniciando processo de loading...');
    setIsLoading(true);
    
    const loadingTexts = [
      "Analisando suas respostas...",
      "Cruzando dados com as soluções ideais...",
      "Montando seu plano de ação personalizado..."
    ];
    
    let textIndex = 0;
    setLoadingText(loadingTexts[0]);
    
    const interval = setInterval(() => {
      textIndex++;
      if (textIndex < loadingTexts.length) {
        setLoadingText(loadingTexts[textIndex]);
      } else {
        clearInterval(interval);
        
        setTimeout(() => {
          try {
            trackEvent('diagnostico_iniciado', {
              ...quizData,
              utm_data: getStoredUTM()
            });
          } catch (error) {
            console.error('[DynamicQuiz] ❌ Erro no trackEvent:', error);
          }
          
          // Construir os parâmetros manualmente
          const params = new URLSearchParams();
          Object.entries(quizData).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
              params.set(key, value);
            }
          });
          
          const url = `/resultados?${params.toString()}`;
          console.log('[DynamicQuiz] 🎯 URL FINAL para navegação:', url);
          
          try {
            navigate(url, { replace: true });
          } catch (error) {
            console.error('[DynamicQuiz] ❌ Erro na navegação:', error);
            window.location.href = url;
          }
        }, 1000);
      }
    }, 1000);
  };

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SEO {...seoData.quiz} />
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{loadingText}</h2>
            <div className="flex items-center justify-center space-x-2">
              <Cog className="h-5 w-5 animate-spin text-primary" />
              <BarChart3 className="h-5 w-5 animate-pulse text-accent" />
              <Cog className="h-5 w-5 animate-spin text-primary" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de Início
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <SEO {...seoData.quiz} />
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Vamos encontrar a solução perfeita para o seu negócio
              </h1>
              <p className="text-lg text-muted-foreground">
                Responda a algumas perguntas rápidas e receba um diagnóstico completo e gratuito.
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-accent">
              <LucideIcons.ShoppingCart className="h-8 w-8" />
              <LucideIcons.BarChart3 className="h-8 w-8" />
              <LucideIcons.Settings className="h-8 w-8" />
            </div>
            
            <Button 
              onClick={() => {
                setCurrentStep(1);
                setCurrentQuestionIndex(0);
              }}
              className="w-full md:w-auto px-8 py-3 text-lg"
              variant="cta"
              size="lg"
            >
              Começar Diagnóstico
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se chegou ao final das perguntas (formulário de contato)
  if (currentQuestionIndex >= staticQuestions.length) {
    return (
      <div className="min-h-screen bg-background p-4">
        <SEO {...seoData.quiz} />
        <div className="max-w-4xl mx-auto mb-8">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {getProgressText()}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Seu Diagnóstico Personalizado está Pronto!
              </h2>
              <p className="text-lg text-muted-foreground">
                Falta apenas um detalhe. Para onde devemos enviar sua recomendação completa e gratuita?
              </p>
            </div>
            
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Seu nome</Label>
                    <Input
                      id="nome"
                      placeholder="Digite seu nome completo"
                      value={quizData.nome || ''}
                      onChange={(e) => setQuizData(prev => ({ ...prev, nome: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Nome da sua empresa</Label>
                    <Input
                      id="empresa"
                      placeholder="Digite o nome da sua empresa"
                      value={quizData.empresa || ''}
                      onChange={(e) => setQuizData(prev => ({ ...prev, empresa: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Seu melhor WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      placeholder="(61) 99999-9999"
                      value={quizData.whatsapp || ''}
                      onChange={(e) => setQuizData(prev => ({ 
                        ...prev, 
                        whatsapp: formatWhatsApp(e.target.value) 
                      }))}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full"
                  >
                    Ver Minha Recomendação Agora!
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar pergunta atual
  const currentQuestion = staticQuestions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-background p-4">
      <SEO {...seoData.quiz} />
      
      {/* Barra de Progresso */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              {getProgressText()}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">
            {currentQuestion.pergunta}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentQuestion.opcoes.map((option: string, index: number) => {
              const isSelected = currentQuestion.tipo === 'multiple' && 
                                quizData[getFieldNameForQuestion(currentQuestion.id)]?.split(',').includes(option);
              
              return (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-elegant ${
                    isSelected ? 'border-accent bg-accent/10' : 'hover:border-accent'
                  }`}
                  onClick={() => handleOptionSelect(option, currentQuestion.tipo === 'multiple')}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <p className="font-medium text-foreground">{option}</p>
                    {isSelected && <div className="w-4 h-4 rounded-full bg-accent mx-auto"></div>}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Botão para continuar em perguntas múltiplas */}
          {currentQuestion.tipo === 'multiple' && (
            <div className="text-center mt-6">
              <Button 
                onClick={handleContinueMultiple}
                variant="cta"
                size="lg"
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicQuiz;