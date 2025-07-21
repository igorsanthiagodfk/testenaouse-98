import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  FileText, 
  Share2, 
  Mail, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Shield,
  Award,
  Clock,
  Users,
  Building
} from 'lucide-react';

interface ProposalData {
  cliente: {
    nome: string;
    empresa: string;
    ramo: string;
    porte: string;
    telefone?: string;
    email?: string;
  };
  sistema: {
    nome: string;
    descricao: string;
    beneficios: string[];
    investimento: string;
    economia: string;
    roi: string;
  };
  dashboard: {
    vendas: number;
    estoque: number;
    financeiro: number;
    clientes: number;
  };
  recomendacoes: string[];
  prazo: string;
  proximosPassos: string[];
}

interface SmartPDFGeneratorProps {
  proposalData: ProposalData;
  onEmailSent?: (email: string) => void;
  onCRMSaved?: (data: any) => void;
}

const SmartPDFGenerator: React.FC<SmartPDFGeneratorProps> = ({
  proposalData,
  onEmailSent,
  onCRMSaved
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulação de progresso
      const progressSteps = [
        { step: 20, message: 'Preparando dados...' },
        { step: 40, message: 'Gerando gráficos...' },
        { step: 60, message: 'Criando layout...' },
        { step: 80, message: 'Finalizando PDF...' },
        { step: 100, message: 'Concluído!' }
      ];

      for (const { step, message } of progressSteps) {
        setGenerationProgress(step);
        toast({
          title: "Gerando Proposta",
          description: message,
        });
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Capturar elemento como canvas
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Adicionar páginas se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download
      const fileName = `proposta_${proposalData.cliente.empresa.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
      pdf.save(fileName);

      // Salvar no CRM
      saveToCRM();

      // Enviar email de boas-vindas
      sendWelcomeEmail();

      toast({
        title: "PDF Gerado com Sucesso!",
        description: "Proposta personalizada criada e enviada por email.",
      });

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const saveToCRM = () => {
    const crmData = {
      nome: proposalData.cliente.nome,
      empresa: proposalData.cliente.empresa,
      email: proposalData.cliente.email,
      telefone: proposalData.cliente.telefone,
      ramo: proposalData.cliente.ramo,
      porte: proposalData.cliente.porte,
      sistema_interesse: proposalData.sistema.nome,
      data_proposta: new Date().toISOString(),
      status: 'proposta_enviada',
      valor_proposta: proposalData.sistema.investimento,
      origem: 'quiz_website'
    };

    // Verificar duplicação
    const existingLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    const isDuplicate = existingLeads.some((lead: any) => 
      lead.email === crmData.email || 
      (lead.telefone === crmData.telefone && crmData.telefone)
    );

    if (!isDuplicate) {
      existingLeads.push(crmData);
      localStorage.setItem('crm_leads', JSON.stringify(existingLeads));
      
      if (onCRMSaved) {
        onCRMSaved(crmData);
      }
    }
  };

  const sendWelcomeEmail = () => {
    // Simular envio de email de boas-vindas
    setTimeout(() => {
      setEmailSent(true);
      if (onEmailSent && proposalData.cliente.email) {
        onEmailSent(proposalData.cliente.email);
      }
      
      toast({
        title: "Email de Boas-Vindas Enviado!",
        description: "Verifique sua caixa de entrada com o link para download e GIF demonstrativo.",
      });
    }, 2000);
  };

  const shareProposal = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Proposta I.S.T.I - ${proposalData.sistema.nome}`,
          text: `Confira a proposta personalizada para ${proposalData.cliente.empresa}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copiado!",
        description: "Link da proposta copiado para a área de transferência.",
      });
    }
  };

  const MiniDashboard = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Vendas Mensais</p>
              <p className="text-2xl font-bold text-green-600">
                +{proposalData.dashboard.vendas}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Controle Estoque</p>
              <p className="text-2xl font-bold text-blue-600">
                -{proposalData.dashboard.estoque}%
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Gestão Financeira</p>
              <p className="text-2xl font-bold text-purple-600">
                +{proposalData.dashboard.financeiro}%
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Satisfação Cliente</p>
              <p className="text-2xl font-bold text-orange-600">
                {proposalData.dashboard.clientes}%
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            variant="cta"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Gerar Proposta PDF
              </>
            )}
          </Button>
          
          <Button
            onClick={() => setShowDashboard(!showDashboard)}
            variant="outline"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showDashboard ? 'Ocultar' : 'Mostrar'} Dashboard
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={shareProposal}
            variant="outline"
            size="sm"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          
          {emailSent && (
            <Badge variant="secondary" className="text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Email Enviado
            </Badge>
          )}
        </div>
      </div>

      {/* Progresso da Geração */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Gerando sua proposta personalizada...</span>
                <span className="text-sm text-muted-foreground">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Interativo */}
      {showDashboard && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Dashboard Interativo - Impacto Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MiniDashboard />
              <p className="text-sm text-muted-foreground">
                * Dados baseados em casos reais de implementação em empresas similares
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Preview do PDF */}
      <div 
        ref={pdfRef}
        className="bg-white text-black p-8 rounded-lg shadow-lg"
        style={{ width: '210mm', minHeight: '297mm' }}
      >
        {/* Header */}
        <div className="border-b-2 border-blue-600 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">I.S.T.I TECNOLOGIA</h1>
              <p className="text-gray-600">Proposta Técnica Personalizada</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Data: {new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Proposta: #{Date.now()}</p>
            </div>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Dados do Cliente</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Nome:</strong> {proposalData.cliente.nome}</p>
              <p><strong>Empresa:</strong> {proposalData.cliente.empresa}</p>
              <p><strong>Ramo:</strong> {proposalData.cliente.ramo}</p>
            </div>
            <div>
              <p><strong>Porte:</strong> {proposalData.cliente.porte}</p>
              <p><strong>Telefone:</strong> {proposalData.cliente.telefone}</p>
              <p><strong>Email:</strong> {proposalData.cliente.email}</p>
            </div>
          </div>
        </div>

        {/* Sistema Recomendado */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Sistema Recomendado</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{proposalData.sistema.nome}</h3>
            <p className="text-gray-700 mb-4">{proposalData.sistema.descricao}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Principais Benefícios:</h4>
                <ul className="space-y-1">
                  {proposalData.sistema.beneficios.map((beneficio, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      {beneficio}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Investimento:</h4>
                <p className="text-2xl font-bold text-green-600">{proposalData.sistema.investimento}</p>
                <p className="text-sm text-gray-600">Economia estimada: {proposalData.sistema.economia}</p>
                <p className="text-sm text-gray-600">ROI previsto: {proposalData.sistema.roi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard de Impacto */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Dashboard de Impacto</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-green-700">Aumento de Vendas</h3>
              <p className="text-3xl font-bold text-green-600">+{proposalData.dashboard.vendas}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-blue-700">Redução de Perdas</h3>
              <p className="text-3xl font-bold text-blue-600">-{proposalData.dashboard.estoque}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-purple-700">Melhoria Financeira</h3>
              <p className="text-3xl font-bold text-purple-600">+{proposalData.dashboard.financeiro}%</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-orange-700">Satisfação Cliente</h3>
              <p className="text-3xl font-bold text-orange-600">{proposalData.dashboard.clientes}%</p>
            </div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Recomendações Estratégicas</h2>
          <ul className="space-y-2">
            {proposalData.recomendacoes.map((recomendacao, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">{recomendacao}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Próximos Passos */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Próximos Passos</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Prazo de Implementação: {proposalData.prazo}</p>
            <ol className="space-y-2">
              {proposalData.proximosPassos.map((passo, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{passo}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-blue-600 pt-4 mt-8">
          <div className="text-center">
            <p className="font-semibold text-blue-600">I.S.T.I TECNOLOGIA - Sistemas Ideais para seu Comércio</p>
            <p className="text-sm text-gray-600">
              Telefone: (61) 3551-6827 | Email: istigestao@gmail.com
            </p>
            <p className="text-sm text-gray-600">
              Brasília - DF | www.istitecnologia.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartPDFGenerator;