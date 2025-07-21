import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Award, 
  Share2, 
  Download, 
  ExternalLink, 
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Star,
  CheckCircle,
  Building,
  Quote,
  PlayCircle,
  QrCode,
  Calendar,
  BarChart3,
  Target,
  Zap,
  Shield,
  Heart,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Filter,
  Search,
  Globe,
  MapPin,
  Phone,
  Mail,
  Settings
} from 'lucide-react';

interface SuccessCase {
  id: string;
  title: string;
  company: string;
  sector: string;
  location: string;
  logo: string;
  image: string;
  testimonial: string;
  clientName: string;
  clientRole: string;
  metrics: {
    salesIncrease: number;
    timeReduction: number;
    costSavings: number;
    satisfaction: number;
  };
  challenges: string[];
  solutions: string[];
  results: string[];
  timeline: string;
  systemUsed: string;
  isPremium: boolean;
  videoUrl?: string;
  certificationUrl?: string;
  shareCount: number;
  rating: number;
  implementationDate: string;
  tags: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

const SuccessCasesShowcase: React.FC = () => {
  const [cases, setCases] = useState<SuccessCase[]>([
    {
      id: '1',
      title: 'Automação Completa Aumenta Vendas em 180%',
      company: 'Supermercado Bom de Preço',
      sector: 'Varejo Alimentício',
      location: 'Brasília - DF',
      logo: '/api/placeholder/80/80',
      image: '/api/placeholder/400/300',
      testimonial: 'O sistema da I.S.T.I transformou completamente nossa operação. Triplicamos nossas vendas e reduzimos drasticamente os erros no caixa.',
      clientName: 'João Silva',
      clientRole: 'Proprietário',
      metrics: {
        salesIncrease: 180,
        timeReduction: 65,
        costSavings: 40,
        satisfaction: 95
      },
      challenges: [
        'Filas longas no caixa',
        'Erros constantes na digitação',
        'Controle de estoque manual',
        'Falta de relatórios gerenciais'
      ],
      solutions: [
        'Implementação do SG Sistemas',
        'Treinamento da equipe',
        'Integração com código de barras',
        'Automatização de relatórios'
      ],
      results: [
        'Tempo de atendimento reduzido em 65%',
        'Zero erros de digitação',
        'Aumento de 180% nas vendas',
        'Satisfação do cliente em 95%'
      ],
      timeline: '30 dias',
      systemUsed: 'SG Sistemas',
      isPremium: true,
      videoUrl: '/cases/bom-de-preco.mp4',
      certificationUrl: '/certificates/bom-de-preco.pdf',
      shareCount: 245,
      rating: 5,
      implementationDate: '2024-01-15',
      tags: ['Automação Completa', 'Varejo', 'High Performance'],
      contact: {
        phone: '(61) 99999-1234',
        email: 'joao@bomdepreco.com.br',
        website: 'www.bomdepreco.com.br'
      }
    },
    {
      id: '2',
      title: 'Distribuidora Elimina Perdas e Otimiza Logística',
      company: 'Distribuidora Ideal',
      sector: 'Atacado e Distribuição',
      location: 'Brasília - DF',
      logo: '/api/placeholder/80/80',
      image: '/api/placeholder/400/300',
      testimonial: 'A solução da I.S.T.I nos permitiu ter controle total sobre nossa operação. Eliminamos perdas e otimizamos toda a logística.',
      clientName: 'Maria Santos',
      clientRole: 'Gerente Geral',
      metrics: {
        salesIncrease: 120,
        timeReduction: 50,
        costSavings: 60,
        satisfaction: 92
      },
      challenges: [
        'Perdas no estoque',
        'Logística desorganizada',
        'Falta de rastreabilidade',
        'Relatórios inadequados'
      ],
      solutions: [
        'Implementação do Hiper Sistemas',
        'Módulo de gestão de estoque',
        'Sistema de rastreabilidade',
        'Dashboard gerencial'
      ],
      results: [
        'Redução de 60% nos custos operacionais',
        'Eliminação de perdas por validade',
        'Otimização da logística',
        'Aumento de 120% na eficiência'
      ],
      timeline: '45 dias',
      systemUsed: 'Hiper Sistemas',
      isPremium: true,
      videoUrl: '/cases/ideal.mp4',
      certificationUrl: '/certificates/ideal.pdf',
      shareCount: 189,
      rating: 5,
      implementationDate: '2024-02-20',
      tags: ['Logística', 'Atacado', 'Controle Total'],
      contact: {
        phone: '(61) 99999-5678',
        email: 'maria@ideal.com.br'
      }
    },
    {
      id: '3',
      title: 'E-commerce Integrado Revoluciona Vendas Online',
      company: 'ShowDeComprar',
      sector: 'E-commerce',
      location: 'Brasília - DF',
      logo: '/api/placeholder/80/80',
      image: '/api/placeholder/400/300',
      testimonial: 'A integração perfeita entre loja física e online nos permitiu crescer exponencialmente. O suporte é excepcional!',
      clientName: 'Pedro Oliveira',
      clientRole: 'CEO',
      metrics: {
        salesIncrease: 300,
        timeReduction: 70,
        costSavings: 45,
        satisfaction: 98
      },
      challenges: [
        'Integração loja física x online',
        'Gestão de múltiplos canais',
        'Sincronização de estoque',
        'Atendimento unificado'
      ],
      solutions: [
        'RJK Sistemas com módulo e-commerce',
        'Integração com marketplaces',
        'Sincronização em tempo real',
        'Atendimento omnichannel'
      ],
      results: [
        'Crescimento de 300% nas vendas online',
        'Integração perfeita dos canais',
        'Redução de 70% no tempo de gestão',
        'Satisfação excepcional dos clientes'
      ],
      timeline: '60 dias',
      systemUsed: 'RJK Sistemas',
      isPremium: true,
      videoUrl: '/cases/showdecomprar.mp4',
      certificationUrl: '/certificates/showdecomprar.pdf',
      shareCount: 312,
      rating: 5,
      implementationDate: '2024-03-10',
      tags: ['E-commerce', 'Omnichannel', 'Inovação'],
      contact: {
        phone: '(61) 99999-9012',
        email: 'pedro@showdecomprar.com.br',
        website: 'www.showdecomprar.com.br'
      }
    }
  ]);

  const [currentCase, setCurrentCase] = useState(0);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredCases = cases.filter(case_ => {
    const matchesFilter = filter === 'all' || case_.sector.toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const shareCase = async (case_: SuccessCase) => {
    const shareData = {
      title: `Case de Sucesso: ${case_.title}`,
      text: `Veja como ${case_.company} ${case_.testimonial}`,
      url: `${window.location.origin}/cases/${case_.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - criar mensagem formatada
        const message = `🏆 *Case de Sucesso I.S.T.I*

*${case_.title}*
📊 Empresa: ${case_.company}
📍 Local: ${case_.location}
⭐ Avaliação: ${case_.rating}/5

*Resultados:*
📈 Aumento de vendas: ${case_.metrics.salesIncrease}%
⚡ Redução de tempo: ${case_.metrics.timeReduction}%
💰 Economia: ${case_.metrics.costSavings}%
😊 Satisfação: ${case_.metrics.satisfaction}%

*Depoimento:*
"${case_.testimonial}"
- ${case_.clientName}, ${case_.clientRole}

🔗 Leia o case completo: ${shareData.url}

#Automação #SucessoEmpresarial #ISTI`;

        navigator.clipboard.writeText(message);
        toast({
          title: "Conteúdo copiado!",
          description: "Case formatado copiado para área de transferência.",
        });
      }
      
      // Incrementar contador de compartilhamentos
      setCases(prev => prev.map(c => 
        c.id === case_.id ? { ...c, shareCount: c.shareCount + 1 } : c
      ));
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const downloadCertificate = (case_: SuccessCase) => {
    // Gerar certificado digital
    const certificate = generateDigitalCertificate(case_);
    const blob = new Blob([certificate], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificado_${case_.company.replace(/\s+/g, '_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Certificado baixado!",
      description: "Certificado digital do case de sucesso.",
    });
  };

  const generateDigitalCertificate = (case_: SuccessCase) => {
    // Simulação de geração de certificado
    return `Certificado Digital de Case de Sucesso

Empresa: ${case_.company}
Setor: ${case_.sector}
Sistema: ${case_.systemUsed}
Data de Implementação: ${case_.implementationDate}

Resultados Certificados:
- Aumento de vendas: ${case_.metrics.salesIncrease}%
- Redução de tempo: ${case_.metrics.timeReduction}%
- Economia: ${case_.metrics.costSavings}%
- Satisfação: ${case_.metrics.satisfaction}%

Certificado por: I.S.T.I Tecnologia
Data: ${new Date().toLocaleDateString()}

QR Code: [QR_CODE_PLACEHOLDER]
`;
  };

  const PremiumBadge = () => (
    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
      <Trophy className="w-3 h-3 mr-1" />
      Case Premiado
    </Badge>
  );

  const MetricsCard = ({ case_ }: { case_: SuccessCase }) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-green-600">+{case_.metrics.salesIncrease}%</div>
        <div className="text-sm text-green-700">Vendas</div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-blue-600">-{case_.metrics.timeReduction}%</div>
        <div className="text-sm text-blue-700">Tempo</div>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg text-center">
        <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-purple-600">-{case_.metrics.costSavings}%</div>
        <div className="text-sm text-purple-700">Custos</div>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg text-center">
        <Heart className="w-6 h-6 text-orange-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-orange-600">{case_.metrics.satisfaction}%</div>
        <div className="text-sm text-orange-700">Satisfação</div>
      </div>
    </div>
  );

  const ContactInfo = ({ case_ }: { case_: SuccessCase }) => (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Contato do Cliente</h4>
      <div className="space-y-1">
        {case_.contact.phone && (
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
            {case_.contact.phone}
          </div>
        )}
        {case_.contact.email && (
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            {case_.contact.email}
          </div>
        )}
        {case_.contact.website && (
          <div className="flex items-center text-sm">
            <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
            {case_.contact.website}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Award className="w-6 h-6 mr-2" />
              Cases de Sucesso Certificados
            </CardTitle>
            <Badge variant="secondary">{cases.length} cases</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">Todos os setores</option>
                <option value="varejo">Varejo</option>
                <option value="atacado">Atacado</option>
                <option value="e-commerce">E-commerce</option>
                <option value="farmácia">Farmácia</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Principal */}
      <Card className="border-accent shadow-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={filteredCases[currentCase]?.logo}
                alt={filteredCases[currentCase]?.company}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{filteredCases[currentCase]?.title}</h2>
                <p className="text-muted-foreground">{filteredCases[currentCase]?.company}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{filteredCases[currentCase]?.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {filteredCases[currentCase]?.isPremium && <PremiumBadge />}
              <Badge variant="outline">{filteredCases[currentCase]?.sector}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imagem/Vídeo */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={filteredCases[currentCase]?.image}
                  alt={filteredCases[currentCase]?.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {filteredCases[currentCase]?.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <Button variant="secondary" size="lg">
                      <PlayCircle className="w-6 h-6 mr-2" />
                      Assistir Vídeo
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Métricas */}
              <MetricsCard case_={filteredCases[currentCase]} />
            </div>

            {/* Conteúdo */}
            <div className="space-y-4">
              {/* Depoimento */}
              <Card>
                <CardContent className="p-4">
                  <Quote className="w-8 h-8 text-accent mb-3" />
                  <p className="text-foreground italic mb-3">
                    "{filteredCases[currentCase]?.testimonial}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-accent-foreground font-semibold">
                        {filteredCases[currentCase]?.clientName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{filteredCases[currentCase]?.clientName}</p>
                      <p className="text-sm text-muted-foreground">{filteredCases[currentCase]?.clientRole}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avaliação */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= filteredCases[currentCase]?.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {filteredCases[currentCase]?.rating}/5 - {filteredCases[currentCase]?.shareCount} compartilhamentos
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {filteredCases[currentCase]?.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Contato */}
              <ContactInfo case_={filteredCases[currentCase]} />
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
            <Button
              onClick={() => shareCase(filteredCases[currentCase])}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar Case
            </Button>
            <Button
              onClick={() => downloadCertificate(filteredCases[currentCase])}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <Download className="w-4 h-4 mr-2" />
              Certificado Digital
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button
              variant="cta"
              className="flex-1 sm:flex-none"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Visita
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navegação de Cases */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setCurrentCase(prev => Math.max(0, prev - 1))}
          disabled={currentCase === 0}
          variant="outline"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        
        <div className="flex items-center space-x-2">
          {filteredCases.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCase(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentCase ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button
          onClick={() => setCurrentCase(prev => Math.min(filteredCases.length - 1, prev + 1))}
          disabled={currentCase === filteredCases.length - 1}
          variant="outline"
        >
          Próximo
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Timeline de Implementação */}
      <Card>
        <CardHeader>
          <CardTitle>Cronograma de Implementação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Desafios Identificados</h3>
                <ul className="text-sm space-y-1">
                  {filteredCases[currentCase]?.challenges.map((challenge, index) => (
                    <li key={index} className="text-muted-foreground">• {challenge}</li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Soluções Implementadas</h3>
                <ul className="text-sm space-y-1">
                  {filteredCases[currentCase]?.solutions.map((solution, index) => (
                    <li key={index} className="text-muted-foreground">• {solution}</li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Resultados Alcançados</h3>
                <ul className="text-sm space-y-1">
                  {filteredCases[currentCase]?.results.map((result, index) => (
                    <li key={index} className="text-muted-foreground">• {result}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="text-center py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Implementação completa em <span className="font-semibold text-accent">{filteredCases[currentCase]?.timeline}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessCasesShowcase;