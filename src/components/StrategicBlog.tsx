import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Download,
  Share2,
  Eye,
  ThumbsUp,
  MessageCircle,
  Star,
  Filter,
  Calculator,
  DollarSign,
  BarChart3,
  Target,
  Zap,
  Shield,
  Award,
  Bell,
  Mail,
  FileText,
  ChevronRight,
  ArrowRight,
  Globe,
  Tag,
  Bookmark,
  Heart,
  Coffee,
  Lightbulb,
  TrendingDown,
  PieChart,
  Users,
  Building,
  ShoppingCart,
  Smartphone,
  Monitor,
  Headphones,
  Settings,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  image: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  downloadableContent?: {
    title: string;
    type: 'pdf' | 'excel' | 'guide';
    url: string;
  };
}

interface ROICalculatorData {
  monthlyRevenue: number;
  timeSpentOnTasks: number;
  errorRate: number;
  employeeWages: number;
  systemCost: number;
}

const StrategicBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [showNewsletterSignup, setShowNewsletterSignup] = useState(false);
  const [roiData, setROIData] = useState<ROICalculatorData>({
    monthlyRevenue: 50000,
    timeSpentOnTasks: 40,
    errorRate: 5,
    employeeWages: 2000,
    systemCost: 500
  });
  const [newsletter, setNewsletter] = useState({ email: '', name: '' });
  const { toast } = useToast();

  useEffect(() => {
    // Simular carregamento de posts
    const samplePosts: BlogPost[] = [
      {
        id: '1',
        title: 'Como Reduzir Custos com Automação Comercial: Guia Completo 2024',
        excerpt: 'Descubra estratégias práticas para diminuir custos operacionais e aumentar a eficiência do seu negócio com automação.',
        content: `A automação comercial é uma das principais estratégias para reduzir custos e aumentar a eficiência dos negócios. Neste guia completo, você aprenderá como implementar soluções que podem reduzir seus custos operacionais em até 40%.

## Principais Benefícios da Automação

1. **Redução de Erros Humanos**: Automatize processos repetitivos
2. **Otimização de Tempo**: Libere sua equipe para atividades estratégicas
3. **Controle Financeiro**: Tenha visibilidade completa do seu negócio
4. **Satisfação do Cliente**: Atendimento mais rápido e eficiente

## Calculadora ROI: Veja o Impacto no Seu Negócio

Use nossa calculadora interativa para descobrir quanto você pode economizar com automação.

## Casos de Sucesso

Empresas que implementaram automação viram:
- 60% de redução no tempo de atendimento
- 40% de diminuição em custos operacionais
- 95% de satisfação dos clientes

## Próximos Passos

1. Faça um diagnóstico do seu negócio
2. Identifique processos para automatizar
3. Escolha a solução ideal
4. Implemente com acompanhamento especializado`,
        author: 'João Silva',
        date: '2024-01-15',
        readTime: 8,
        image: '/api/placeholder/400/250',
        category: 'Automação',
        tags: ['ROI', 'Custos', 'Eficiência', 'Estratégia'],
        views: 1248,
        likes: 89,
        comments: 23,
        featured: true,
        difficulty: 'intermediate',
        downloadableContent: {
          title: 'Planilha de Cálculo ROI',
          type: 'excel',
          url: '/downloads/calculadora-roi.xlsx'
        }
      },
      {
        id: '2',
        title: 'Tendências de Automação para Pequenos Negócios em 2024',
        excerpt: 'Explore as principais tendências tecnológicas que estão transformando pequenos e médios negócios.',
        content: `O cenário da automação comercial está em constante evolução. Para pequenos negócios, estar atualizado com as tendências é crucial para manter a competitividade.

## Tendências Principais

### 1. Inteligência Artificial no Atendimento
- Chatbots mais inteligentes
- Análise preditiva de vendas
- Personalização automática

### 2. Integração Omnichannel
- Unificação de canais de venda
- Experiência consistente
- Dados centralizados

### 3. Automação de Marketing
- Campanhas automatizadas
- Segmentação inteligente
- ROI mensurável

### 4. Pagamentos Digitais
- PIX integrado
- Carteiras digitais
- Pagamentos por aproximação

## Como Implementar

1. **Avaliação Atual**: Diagnostique seus processos
2. **Priorização**: Identifique o que automatizar primeiro
3. **Implementação Gradual**: Faça mudanças progressivas
4. **Monitoramento**: Acompanhe resultados

## Investimento vs. Retorno

A automação pode parecer um investimento alto, mas o retorno é comprovado:
- Redução de 30-50% nos custos operacionais
- Aumento de 20-40% na produtividade
- Melhoria de 60% na satisfação do cliente`,
        author: 'Maria Santos',
        date: '2024-01-10',
        readTime: 6,
        image: '/api/placeholder/400/250',
        category: 'Tendências',
        tags: ['Tendências', 'Tecnologia', 'Pequenos Negócios', 'Futuro'],
        views: 892,
        likes: 67,
        comments: 18,
        featured: false,
        difficulty: 'beginner'
      },
      {
        id: '3',
        title: 'Guia Definitivo: Escolhendo o Sistema Ideal para seu Negócio',
        excerpt: 'Passo a passo completo para escolher o sistema de gestão perfeito para sua empresa.',
        content: `Escolher o sistema de gestão certo é uma decisão crítica para o sucesso do seu negócio. Este guia apresenta critérios essenciais para fazer a escolha perfeita.

## Critérios de Avaliação

### 1. Análise de Necessidades
- Tamanho da operação
- Complexidade dos processos
- Orçamento disponível
- Objetivos de crescimento

### 2. Funcionalidades Essenciais
- Gestão de vendas
- Controle de estoque
- Financeiro
- Relatórios gerenciais

### 3. Aspectos Técnicos
- Performance do sistema
- Facilidade de uso
- Suporte técnico
- Atualizações

## Etapas para Implementação

1. **Diagnóstico Inicial**: Análise completa dos processos atuais
2. **Planejamento**: Definição de cronograma e migração
3. **Configuração**: Personalização do sistema conforme necessidades
4. **Go-live**: Acompanhamento durante a transição

## Checklist de Decisão

✅ Sistema atende às necessidades atuais?
✅ É escalável para crescimento?
✅ Suporte técnico é adequado?
✅ Custo-benefício é atrativo?
✅ Treinamento é incluído?

## Implementação Bem-Sucedida

1. **Planejamento**: Defina cronograma e responsáveis
2. **Migração**: Transfira dados com segurança
3. **Treinamento**: Capacite toda a equipe
4. **Go-live**: Acompanhe a operação inicial
5. **Otimização**: Ajuste conforme necessário`,
        author: 'Pedro Oliveira',
        date: '2024-01-05',
        readTime: 10,
        image: '/api/placeholder/400/250',
        category: 'Guias',
        tags: ['Sistemas', 'Gestão', 'Escolha', 'Implementação'],
        views: 1456,
        likes: 112,
        comments: 34,
        featured: true,
        difficulty: 'advanced',
        downloadableContent: {
          title: 'Checklist de Escolha de Sistema',
          type: 'pdf',
          url: '/downloads/checklist-sistema.pdf'
        }
      }
    ];

    setPosts(samplePosts);
    setFilteredPosts(samplePosts);
  }, []);

  useEffect(() => {
    const filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredPosts(filtered);
  }, [searchTerm, categoryFilter, posts]);

  const calculateROI = () => {
    const { monthlyRevenue, timeSpentOnTasks, errorRate, employeeWages, systemCost } = roiData;
    
    // Cálculos baseados em dados reais de automação
    const timeSaved = timeSpentOnTasks * 0.6; // 60% de economia de tempo
    const errorReduction = errorRate * 0.8; // 80% de redução de erros
    const laborCostSavings = (timeSaved / 160) * employeeWages; // Economia em salários
    const errorCostSavings = (monthlyRevenue * errorReduction) / 100;
    const totalMonthlySavings = laborCostSavings + errorCostSavings;
    const annualSavings = totalMonthlySavings * 12;
    const roi = ((annualSavings - (systemCost * 12)) / (systemCost * 12)) * 100;
    
    return {
      monthlySavings: totalMonthlySavings,
      annualSavings,
      roi: Math.max(roi, 0),
      paybackMonths: Math.ceil((systemCost * 12) / totalMonthlySavings)
    };
  };

  const handleNewsletterSignup = () => {
    if (!newsletter.email || !newsletter.name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e email.",
        variant: "destructive",
      });
      return;
    }

    // Simular cadastro na newsletter
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    subscribers.push({ ...newsletter, date: new Date().toISOString() });
    localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));

    toast({
      title: "Cadastro realizado!",
      description: "Você receberá nossos conteúdos exclusivos por email.",
    });

    setNewsletter({ email: '', name: '' });
    setShowNewsletterSignup(false);
  };

  const downloadContent = (post: BlogPost) => {
    if (post.downloadableContent) {
      // Simular download
      const element = document.createElement('a');
      element.href = post.downloadableContent.url;
      element.download = post.downloadableContent.title;
      element.click();
      
      toast({
        title: "Download iniciado!",
        description: `${post.downloadableContent.title} está sendo baixado.`,
      });
    }
  };

  const sharePost = async (post: BlogPost) => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: `${window.location.origin}/blog/${post.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link copiado!",
          description: "Link do artigo copiado para área de transferência.",
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const ROICalculator = () => {
    const results = calculateROI();
    
    return (
      <Card className="border-accent">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Calculadora ROI - Automação Comercial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Faturamento Mensal (R$)
                  </label>
                  <Input
                    type="number"
                    value={roiData.monthlyRevenue}
                    onChange={(e) => setROIData(prev => ({
                      ...prev,
                      monthlyRevenue: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Horas gastas em tarefas manuais/mês
                  </label>
                  <Slider
                    value={[roiData.timeSpentOnTasks]}
                    onValueChange={(value) => setROIData(prev => ({
                      ...prev,
                      timeSpentOnTasks: value[0]
                    }))}
                    max={200}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    {roiData.timeSpentOnTasks} horas/mês
                  </span>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Taxa de erro atual (%)
                  </label>
                  <Slider
                    value={[roiData.errorRate]}
                    onValueChange={(value) => setROIData(prev => ({
                      ...prev,
                      errorRate: value[0]
                    }))}
                    max={20}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    {roiData.errorRate}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Salário médio funcionário (R$)
                  </label>
                  <Input
                    type="number"
                    value={roiData.employeeWages}
                    onChange={(e) => setROIData(prev => ({
                      ...prev,
                      employeeWages: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Custo mensal do sistema (R$)
                  </label>
                  <Input
                    type="number"
                    value={roiData.systemCost}
                    onChange={(e) => setROIData(prev => ({
                      ...prev,
                      systemCost: Number(e.target.value)
                    }))}
                  />
                </div>
                
                {/* Resultados */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">Resultados Projetados</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Economia mensal:</span>
                      <span className="font-semibold text-green-600">
                        R$ {results.monthlySavings.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Economia anual:</span>
                      <span className="font-semibold text-green-600">
                        R$ {results.annualSavings.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">ROI anual:</span>
                      <span className="font-semibold text-green-600">
                        {results.roi.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Payback:</span>
                      <span className="font-semibold text-green-600">
                        {results.paybackMonths} meses
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => downloadContent({ 
                  downloadableContent: { 
                    title: 'Relatório ROI Personalizado', 
                    type: 'pdf', 
                    url: '/downloads/roi-report.pdf' 
                  } 
                } as BlogPost)}
                variant="cta"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Relatório
              </Button>
              <Button 
                onClick={() => setShowNewsletterSignup(true)}
                variant="outline"
              >
                <Mail className="w-4 h-4 mr-2" />
                Receber por Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const NewsletterSignup = () => (
    <Card className="border-accent">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Receba Conteúdos Exclusivos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cadastre-se para receber guias, planilhas e conteúdos exclusivos sobre automação comercial.
          </p>
          
          <div className="space-y-3">
            <Input
              placeholder="Seu nome"
              value={newsletter.name}
              onChange={(e) => setNewsletter(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              type="email"
              placeholder="Seu email"
              value={newsletter.email}
              onChange={(e) => setNewsletter(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleNewsletterSignup} variant="cta" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Cadastrar
            </Button>
            <Button 
              onClick={() => setShowNewsletterSignup(false)}
              variant="outline"
            >
              Cancelar
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Você pode cancelar a assinatura a qualquer momento. Seus dados estão seguros.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Blog Estratégico - Automação Comercial
            </CardTitle>
            <Badge variant="secondary">{posts.length} artigos</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">Todas as categorias</option>
                <option value="Automação">Automação</option>
                <option value="Tendências">Tendências</option>
                <option value="Guias">Guias</option>
                <option value="Casos de Sucesso">Casos de Sucesso</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculadora ROI */}
      {showROICalculator && <ROICalculator />}

      {/* Newsletter Signup */}
      {showNewsletterSignup && <NewsletterSignup />}

      {/* Ações Rápidas */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setShowROICalculator(!showROICalculator)}
          variant={showROICalculator ? "default" : "outline"}
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculadora ROI
        </Button>
        <Button
          onClick={() => setShowNewsletterSignup(!showNewsletterSignup)}
          variant={showNewsletterSignup ? "default" : "outline"}
        >
          <Bell className="w-4 h-4 mr-2" />
          Newsletter
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          E-books Gratuitos
        </Button>
      </div>

      {/* Posts do Blog */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className={`${post.featured ? 'border-accent shadow-glow' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 md:h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="md:col-span-2 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{post.category}</Badge>
                    {post.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                        <Star className="w-3 h-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {post.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {post.likes}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-3 hover:text-accent cursor-pointer">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime} min
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="cta" size="sm">
                      Ler Artigo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {post.downloadableContent && (
                      <Button
                        onClick={() => downloadContent(post)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {post.downloadableContent.type.toUpperCase()}
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => sharePost(post)}
                      variant="ghost"
                      size="sm"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CTA Final */}
      <Card className="bg-gradient-accent text-accent-foreground">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Pronto para Automatizar seu Negócio?
          </h3>
          <p className="text-lg mb-6">
            Faça um diagnóstico gratuito e descubra como a automação pode transformar sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Target className="w-5 h-5 mr-2" />
              Diagnóstico Gratuito
            </Button>
            <Button variant="outline" size="lg">
              <Headphones className="w-5 h-5 mr-2" />
              Falar com Especialista
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategicBlog;