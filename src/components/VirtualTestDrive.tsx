import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Monitor, 
  Smartphone, 
  Tablet,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  CheckCircle,
  PlayCircle,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Share2,
  Star,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface DemoModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  gif: string;
  video?: string;
  tasks: string[];
  benefits: string[];
  category: 'vendas' | 'estoque' | 'financeiro' | 'relatorios';
}

interface TestDriveProps {
  systemType: 'sg' | 'hiper' | 'rjk' | 'arpa';
  onCompleted?: (results: any) => void;
}

const VirtualTestDrive: React.FC<TestDriveProps> = ({ systemType, onCompleted }) => {
  const [currentModule, setCurrentModule] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [testResults, setTestResults] = useState({
    timeSpent: 0,
    tasksCompleted: 0,
    userRating: 0,
    preferredFeatures: [] as string[]
  });
  const { toast } = useToast();

  // Módulos demo baseados no sistema
  const demoModules: DemoModule[] = [
    {
      id: 'vendas',
      title: 'Frente de Caixa Inteligente',
      description: 'Venda rápida e segura com leitor de código de barras',
      duration: 45,
      gif: '/api/placeholder/400/300',
      video: '/demo/vendas.mp4',
      tasks: [
        'Escaneie um produto',
        'Adicione desconto',
        'Finalize a venda',
        'Emita o cupom fiscal'
      ],
      benefits: [
        'Redução de 60% no tempo de atendimento',
        'Zero erros de digitação',
        'Compliance fiscal automático'
      ],
      category: 'vendas'
    },
    {
      id: 'estoque',
      title: 'Controle de Estoque Inteligente',
      description: 'Gestão automatizada com alertas e relatórios',
      duration: 60,
      gif: '/api/placeholder/400/300',
      video: '/demo/estoque.mp4',
      tasks: [
        'Consulte estoque atual',
        'Configure alerta de estoque mínimo',
        'Faça entrada de produtos',
        'Gere relatório de movimentação'
      ],
      benefits: [
        'Redução de 40% em perdas',
        'Alertas automáticos',
        'Controle total de movimentação'
      ],
      category: 'estoque'
    },
    {
      id: 'financeiro',
      title: 'Gestão Financeira Completa',
      description: 'Controle total de receitas e despesas',
      duration: 50,
      gif: '/api/placeholder/400/300',
      video: '/demo/financeiro.mp4',
      tasks: [
        'Registre uma venda',
        'Lance uma despesa',
        'Consulte fluxo de caixa',
        'Gere relatório financeiro'
      ],
      benefits: [
        'Visão completa do caixa',
        'Controle de contas a pagar/receber',
        'Relatórios gerenciais'
      ],
      category: 'financeiro'
    },
    {
      id: 'relatorios',
      title: 'Relatórios Inteligentes',
      description: 'Insights automáticos para tomada de decisão',
      duration: 40,
      gif: '/api/placeholder/400/300',
      video: '/demo/relatorios.mp4',
      tasks: [
        'Acesse dashboard principal',
        'Gere relatório de vendas',
        'Analise produtos mais vendidos',
        'Exporte relatório em PDF'
      ],
      benefits: [
        'Decisões baseadas em dados',
        'Relatórios automáticos',
        'Análise de performance'
      ],
      category: 'relatorios'
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            handleModuleComplete();
            return 100;
          }
          return prev + (100 / demoModules[currentModule].duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentModule]);

  useEffect(() => {
    // Atualizar tempo gasto
    const startTime = Date.now();
    return () => {
      const timeSpent = Date.now() - startTime;
      setTestResults(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + timeSpent
      }));
    };
  }, [currentModule]);

  const handleModuleComplete = () => {
    const moduleId = demoModules[currentModule].id;
    if (!completedTasks.includes(moduleId)) {
      setCompletedTasks(prev => [...prev, moduleId]);
      setTestResults(prev => ({
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1
      }));
      
      toast({
        title: "Módulo Concluído! 🎉",
        description: `Você completou: ${demoModules[currentModule].title}`,
      });
    }
  };

  const nextModule = () => {
    if (currentModule < demoModules.length - 1) {
      setCurrentModule(prev => prev + 1);
      setProgress(0);
      setIsPlaying(false);
    } else {
      // Test drive concluído
      handleTestDriveComplete();
    }
  };

  const handleTestDriveComplete = () => {
    const finalResults = {
      ...testResults,
      completionRate: (completedTasks.length / demoModules.length) * 100,
      systemTested: systemType,
      timestamp: new Date()
    };

    if (onCompleted) {
      onCompleted(finalResults);
    }

    toast({
      title: "Test Drive Concluído! 🚀",
      description: "Agora você pode agendar uma demonstração personalizada.",
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetModule = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const getDeviceViewClass = () => {
    switch (deviceView) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'max-w-full';
    }
  };

  const RatingModule = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleRating = (value: number) => {
      setRating(value);
      setTestResults(prev => ({ ...prev, userRating: value }));
    };

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Avalie sua Experiência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  <Star className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {rating === 5 ? 'Excelente!' : rating === 4 ? 'Muito bom!' : rating === 3 ? 'Bom!' : 'Pode melhorar'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const UsabilityMetrics = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Métricas de Usabilidade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((testResults.timeSpent / 1000) / 60)}min
            </div>
            <div className="text-sm text-muted-foreground">Tempo Gasto</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {testResults.tasksCompleted}/{demoModules.length}
            </div>
            <div className="text-sm text-muted-foreground">Módulos Concluídos</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Controles do Test Drive */}
      <Card className="border-accent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <PlayCircle className="w-6 h-6 mr-2" />
              Test Drive Virtual - {demoModules[currentModule].title}
            </CardTitle>
            <Badge variant="secondary">
              {currentModule + 1} de {demoModules.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso do módulo</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Controles de Reprodução */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={togglePlay}
                  variant={isPlaying ? "destructive" : "cta"}
                  size="sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={resetModule}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  onClick={nextModule}
                  variant="outline"
                  size="sm"
                  disabled={progress < 100}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleVideo}
                  variant="outline"
                  size="sm"
                >
                  {showVideo ? 'GIF' : 'Vídeo'}
                </Button>
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="outline"
                  size="sm"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Seletor de Dispositivo */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Visualizar em:</span>
              <Button
                onClick={() => setDeviceView('desktop')}
                variant={deviceView === 'desktop' ? 'default' : 'outline'}
                size="sm"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setDeviceView('tablet')}
                variant={deviceView === 'tablet' ? 'default' : 'outline'}
                size="sm"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setDeviceView('mobile')}
                variant={deviceView === 'mobile' ? 'default' : 'outline'}
                size="sm"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Área de Demonstração */}
      <Card className={`${getDeviceViewClass()}`}>
        <CardContent className="p-0">
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            {/* Media Player */}
            <div className="aspect-video">
              {showVideo ? (
                <video
                  className="w-full h-full object-cover"
                  autoPlay={isPlaying}
                  muted={isMuted}
                  loop
                  src={demoModules[currentModule].video}
                />
              ) : (
                <img
                  className="w-full h-full object-cover"
                  src={demoModules[currentModule].gif}
                  alt={demoModules[currentModule].title}
                />
              )}
            </div>

            {/* Overlay de Controles */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={togglePlay}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <Button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Maximize className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Indicador de Tempo */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              {Math.round(progress * demoModules[currentModule].duration / 100)}s / {demoModules[currentModule].duration}s
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Módulo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarefas do Módulo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Tarefas-Chave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {demoModules[currentModule].tasks.map((task, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span className="text-sm">{task}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefícios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Benefícios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {demoModules[currentModule].benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Navegação por Módulos */}
      <Card>
        <CardHeader>
          <CardTitle>Módulos do Test Drive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {demoModules.map((module, index) => (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all ${
                  index === currentModule 
                    ? 'border-accent shadow-glow' 
                    : 'hover:border-accent/50'
                } ${
                  completedTasks.includes(module.id) ? 'bg-green-50' : ''
                }`}
                onClick={() => setCurrentModule(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{module.title}</h3>
                    {completedTasks.includes(module.id) && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {module.duration}s
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {module.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Usabilidade */}
      <UsabilityMetrics />

      {/* Avaliação */}
      <RatingModule />

      {/* Ações Finais */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold mb-1">Gostou do que viu?</h3>
              <p className="text-sm text-muted-foreground">
                Agende uma demonstração personalizada para seu negócio
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Baixar Relatório
              </Button>
              <Button variant="cta" size="sm">
                Agendar Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualTestDrive;