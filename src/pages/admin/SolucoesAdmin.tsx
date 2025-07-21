import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, RefreshCw, Database, ExternalLink, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService } from "@/services/googleSheetsService";

interface SolutionFromSheets {
  id: string;
  nome: string;
  slug: string;
  subtitulo?: string;
  descricao: string;
  beneficios?: string;
  capacidade_pdvs?: string;
  link_material?: string;
  texto_cta?: string;
  icon_name?: string;
  is_popular: string;
  is_recommended: string;
  segments?: string;
  ativo: string;
  ordem: string;
}

interface SolutionForm {
  id?: string;
  nome: string;
  slug: string;
  subtitulo: string;
  descricao: string;
  beneficios: string;
  capacidade_pdvs: string;
  link_material: string;
  texto_cta: string;
  icon_name: string;
  is_popular: string;
  is_recommended: string;
  segments: string;
  ativo: string;
  ordem: string;
}

export default function SolucoesAdmin() {
  const [solutions, setSolutions] = useState<SolutionFromSheets[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [editingSolution, setEditingSolution] = useState<SolutionForm | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<SolutionForm>({
    nome: '',
    slug: '',
    subtitulo: '',
    descricao: '',
    beneficios: '',
    capacidade_pdvs: '',
    link_material: '',
    texto_cta: '',
    icon_name: 'Building2',
    is_popular: 'false',
    is_recommended: 'false',
    segments: '',
    ativo: 'true',
    ordem: '1'
  });
  const { toast } = useToast();

  // Carrega dados das planilhas em tempo real
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[SolucoesAdmin] Carregando dados das planilhas...');
      
      const solutionsData = await googleSheetsService.fetchTableData('solucoes', true);

      console.log('[SolucoesAdmin] Soluções carregadas:', solutionsData);

      setSolutions(solutionsData);
      setLastSync(new Date());

    } catch (err) {
      console.error('[SolucoesAdmin] Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível conectar às planilhas do Google Sheets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Carrega dados na inicialização e configura atualização automática
  useEffect(() => {
    loadData();
    
    // Atualiza a cada 30 segundos para tempo real
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const activeSolutions = solutions.filter(s => s.ativo?.toLowerCase() === 'true');
  const popularSolutions = solutions.filter(s => s.is_popular?.toLowerCase() === 'true');
  const recommendedSolutions = solutions.filter(s => s.is_recommended?.toLowerCase() === 'true');

  const formatSegments = (segmentsString?: string) => {
    if (!segmentsString) return [];
    return segmentsString.split(',').map(segment => segment.trim()).filter(segment => segment.length > 0);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      slug: '',
      subtitulo: '',
      descricao: '',
      beneficios: '',
      capacidade_pdvs: '',
      link_material: '',
      texto_cta: '',
      icon_name: 'Building2',
      is_popular: 'false',
      is_recommended: 'false',
      segments: '',
      ativo: 'true',
      ordem: '1'
    });
    setEditingSolution(null);
  };

  const handleEdit = (solution: SolutionFromSheets) => {
    setEditingSolution(null);
    setFormData({
      id: solution.id,
      nome: solution.nome,
      slug: solution.slug,
      subtitulo: solution.subtitulo || '',
      descricao: solution.descricao,
      beneficios: solution.beneficios || '',
      capacidade_pdvs: solution.capacidade_pdvs || '',
      link_material: solution.link_material || '',
      texto_cta: solution.texto_cta || '',
      icon_name: solution.icon_name || 'Building2',
      is_popular: solution.is_popular,
      is_recommended: solution.is_recommended,
      segments: solution.segments || '',
      ativo: solution.ativo,
      ordem: solution.ordem
    });
    setIsEditDialogOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        toast({
          title: "Erro de validação",
          description: "Nome da solução é obrigatório",
          variant: "destructive",
        });
        return;
      }

      if (!formData.slug.trim()) {
        toast({
          title: "Erro de validação", 
          description: "Slug é obrigatório",
          variant: "destructive",
        });
        return;
      }

      if (!formData.descricao.trim()) {
        toast({
          title: "Erro de validação",
          description: "Descrição é obrigatória",
          variant: "destructive",
        });
        return;
      }

      // Simular salvamento (futuramente conectar com API de escrita no Google Sheets)
      console.log('[SolucoesAdmin] Salvando solução:', formData);
      
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A escrita nas planilhas será implementada em breve. Por enquanto, edite diretamente no Google Sheets.",
        variant: "default",
      });

      // Fechar modais
      setIsEditDialogOpen(false);
      setIsAddDialogOpen(false);
      resetForm();
      
      // Recarregar dados
      loadData();

    } catch (err) {
      console.error('[SolucoesAdmin] Erro ao salvar:', err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a solução. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (solutionId: string) => {
    try {
      // Simular exclusão (futuramente conectar com API)
      console.log('[SolucoesAdmin] Deletando solução:', solutionId);
      
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A exclusão será implementada em breve. Por enquanto, desative a solução na planilha (ativo = false).",
        variant: "default",
      });
      
    } catch (err) {
      console.error('[SolucoesAdmin] Erro ao deletar:', err);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar a solução. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Soluções</h1>
          <p className="text-muted-foreground">
            Soluções sincronizadas em tempo real com Google Sheets
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-500">
              Última atualização: {lastSync.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Solução
          </Button>
        </div>
      </div>

      {/* Status de Conexão */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Erro de conexão com Google Sheets</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Soluções</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{solutions.length}</div>
            <p className="text-xs text-muted-foreground">
              Sincronizado com solucoes.csv
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soluções Ativas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSolutions.length}</div>
            <p className="text-xs text-muted-foreground">
              Visíveis no site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Populares</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popularSolutions.length}</div>
            <p className="text-xs text-muted-foreground">
              Marcadas como populares
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recomendadas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendedSolutions.length}</div>
            <p className="text-xs text-muted-foreground">
              Destacadas no diagnóstico
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Soluções */}
      <Card>
        <CardHeader>
          <CardTitle>Soluções Cadastradas ({solutions.length})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Para editar soluções, acesse a planilha do Google Sheets
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Capacidade PDVs</TableHead>
                  <TableHead>Segmentos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destaque</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Carregando soluções...
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          Nenhuma solução encontrada na planilha
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  solutions
                    .sort((a, b) => parseInt(a.ordem || '0') - parseInt(b.ordem || '0'))
                    .map((solution) => (
                      <TableRow key={solution.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{solution.nome}</div>
                            {solution.subtitulo && (
                              <div className="text-sm text-muted-foreground">{solution.subtitulo}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {solution.slug}
                          </Badge>
                        </TableCell>
                        <TableCell>{solution.capacidade_pdvs || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {formatSegments(solution.segments).slice(0, 2).map((segment) => (
                              <Badge key={segment} variant="outline" className="text-xs">
                                {segment}
                              </Badge>
                            ))}
                            {formatSegments(solution.segments).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{formatSegments(solution.segments).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={solution.ativo?.toLowerCase() === 'true' ? 'default' : 'secondary'}
                            className={solution.ativo?.toLowerCase() === 'true' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {solution.ativo?.toLowerCase() === 'true' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {solution.is_popular?.toLowerCase() === 'true' && (
                              <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs">
                                Popular
                              </Badge>
                            )}
                            {solution.is_recommended?.toLowerCase() === 'true' && (
                              <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                                Recomendada
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {solution.ordem || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {solution.link_material ? (
                            <Button variant="outline" size="sm" asChild>
                              <a href={solution.link_material} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Ver
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">Sem material</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(solution)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(solution.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Solução
            </DialogTitle>
          </DialogHeader>
          <SolutionFormContent
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onCancel={() => setIsEditDialogOpen(false)}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Adição */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Nova Solução
            </DialogTitle>
          </DialogHeader>
          <SolutionFormContent
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onCancel={() => setIsAddDialogOpen(false)}
            isEditing={false}
          />
        </DialogContent>
      </Dialog>

      {/* Informações sobre Edição */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Como Editar Soluções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Este sistema está sincronizado em tempo real com as planilhas do Google Sheets.</strong>
            </p>
            <p>
              Para adicionar, editar ou remover soluções:
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Acesse a planilha solucoes.csv no Google Sheets</li>
              <li>Faça as alterações necessárias</li>
              <li>As mudanças aparecerão automaticamente aqui em até 30 segundos</li>
            </ol>
            <p className="mt-4 text-xs">
              <strong>Nota:</strong> Os botões de "Editar" e "Adicionar" são apenas protótipos. 
              A funcionalidade de escrita nas planilhas será implementada em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de formulário para soluções
interface SolutionFormContentProps {
  formData: SolutionForm;
  setFormData: (data: SolutionForm) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

function SolutionFormContent({ formData, setFormData, onSave, onCancel, isEditing }: SolutionFormContentProps) {
  const iconOptions = [
    { value: 'Building2', label: 'Building2 (Padrão)' },
    { value: 'Store', label: 'Store (Loja)' },
    { value: 'ShoppingCart', label: 'ShoppingCart (Carrinho)' },
    { value: 'Truck', label: 'Truck (Caminhão)' }
  ];

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da Solução *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            placeholder="Ex: SG Sistemas"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            placeholder="Ex: /solucoes/sg-sistemas"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitulo">Subtítulo</Label>
        <Input
          id="subtitulo"
          value={formData.subtitulo}
          onChange={(e) => setFormData({...formData, subtitulo: e.target.value})}
          placeholder="Subtítulo opcional"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData({...formData, descricao: e.target.value})}
          placeholder="Descrição detalhada da solução"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="beneficios">Benefícios</Label>
        <Textarea
          id="beneficios"
          value={formData.beneficios}
          onChange={(e) => setFormData({...formData, beneficios: e.target.value})}
          placeholder="Lista de benefícios separados por vírgula"
          rows={3}
        />
      </div>

      {/* Configurações Técnicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacidade_pdvs">Capacidade PDVs</Label>
          <Input
            id="capacidade_pdvs"
            value={formData.capacidade_pdvs}
            onChange={(e) => setFormData({...formData, capacidade_pdvs: e.target.value})}
            placeholder="Ex: Até 10 PDVs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon_name">Ícone</Label>
          <Select value={formData.icon_name} onValueChange={(value) => setFormData({...formData, icon_name: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="link_material">Link do Material</Label>
          <Input
            id="link_material"
            value={formData.link_material}
            onChange={(e) => setFormData({...formData, link_material: e.target.value})}
            placeholder="https://exemplo.com/material.pdf"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="texto_cta">Texto do CTA</Label>
          <Input
            id="texto_cta"
            value={formData.texto_cta}
            onChange={(e) => setFormData({...formData, texto_cta: e.target.value})}
            placeholder="Ex: Solicitar Demonstração"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="segments">Segmentos (separados por vírgula)</Label>
        <Input
          id="segments"
          value={formData.segments}
          onChange={(e) => setFormData({...formData, segments: e.target.value})}
          placeholder="Ex: Varejo, Serviços, Distribuidor"
        />
      </div>

      {/* Configurações de Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ativo">Status</Label>
          <Select value={formData.ativo} onValueChange={(value) => setFormData({...formData, ativo: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_popular">Popular</Label>
          <Select value={formData.is_popular} onValueChange={(value) => setFormData({...formData, is_popular: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="is_recommended">Recomendada</Label>
          <Select value={formData.is_recommended} onValueChange={(value) => setFormData({...formData, is_recommended: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ordem">Ordem</Label>
          <Input
            id="ordem"
            type="number"
            value={formData.ordem}
            onChange={(e) => setFormData({...formData, ordem: e.target.value})}
            placeholder="1"
            min="1"
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? 'Salvar Alterações' : 'Criar Solução'}
        </Button>
      </div>
    </div>
  );
}