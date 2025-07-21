import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Monitor, Brain, Globe, Users, TrendingUp, Database, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSystemData } from "@/hooks/useSystemData";
import { googleSheetsService } from "@/services/googleSheetsService";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const { solutions, categories, products, isLoading, error } = useSystemData();
  const [leads, setLeads] = useState<any[]>([]);
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<any[]>([]);
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Carrega dados adicionais das planilhas
  useEffect(() => {
    const loadAdditionalData = async () => {
      try {
        const [leadsData, questionsData] = await Promise.all([
          googleSheetsService.fetchTableData('leads'),
          googleSheetsService.fetchTableData('diagnostic_questions')
        ]);
        setLeads(leadsData);
        setDiagnosticQuestions(questionsData);
        setLastSync(new Date());
      } catch (err) {
        console.error('Erro ao carregar dados adicionais:', err);
      }
    };

    loadAdditionalData();
    // Atualiza a cada 30 segundos para tempo real
    const interval = setInterval(loadAdditionalData, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { name: "Produtos Cadastrados", value: products.length.toString(), icon: Package, change: "Sincronizado do Sheets" },
    { name: "Soluções Ativas", value: solutions.filter(s => s.ativo?.toLowerCase() === 'true').length.toString(), icon: Monitor, change: "Todas funcionais" },
    { name: "Perguntas Diagnóstico", value: diagnosticQuestions.length.toString(), icon: Brain, change: "Sistema ativo" },
    { name: "Leads Capturados", value: leads.length.toString(), icon: Users, change: "Dados atualizados" },
  ];

  const quickActions = [
    { name: "Gerenciar Produtos", href: "/admin/produtos", icon: Package, description: "Visualizar produtos do Sheets" },
    { name: "Editar Soluções", href: "/admin/solucoes", icon: Monitor, description: "Gerenciar sistemas disponíveis" },
    { name: "Configurar Diagnóstico", href: "/admin/diagnostico", icon: Brain, description: "Ajustar perguntas e regras" },
    { name: "Configurações Gerais", href: "/admin/configuracoes", icon: Globe, description: "Dados da empresa e contato" },
  ];

  const cacheStatus = googleSheetsService.getCacheStatus();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
            <p className="text-muted-foreground mt-2">
              Sistema conectado ao Google Sheets - Dados sincronizados automaticamente em tempo real
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-500">Atualização automática ativa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status de Sincronização */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Status do Google Sheets
          </CardTitle>
          <CardDescription>
            Monitoramento da conexão e cache dos dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {error ? (
                <AlertCircle className="w-5 h-5 text-destructive" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span className="font-medium">
                {error ? 'Erro de conexão' : 'Conectado'}
              </span>
            </div>
            <Badge variant="secondary">
              Última sync: {lastSync.toLocaleTimeString()}
            </Badge>
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(cacheStatus).map(([table, status]) => (
              <div key={table} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status.cached ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm capitalize">{table.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as seções de gerenciamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.name} to={action.href}>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-muted/50 w-full"
                >
                  <action.icon className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{action.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}