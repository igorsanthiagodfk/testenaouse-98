import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  Package, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Database,
  Upload
} from 'lucide-react';
import { googleSheetsService } from '@/services/googleSheetsService';
import { useToast } from '@/hooks/use-toast';

interface ProductForm {
  id?: string;
  nome: string;
  categoria_id: string;
  preco: string;
  descricao: string;
  imagem?: string;
  especificacoes: string;
  ativo: string;
  ordem: string;
  tags: string;
}

export default function ProdutosAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    nome: '',
    categoria_id: '',
    preco: '',
    descricao: '',
    imagem: '',
    especificacoes: '',
    ativo: 'true',
    ordem: '1',
    tags: ''
  });
  const { toast } = useToast();

  // Carrega dados das planilhas em tempo real
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[ProdutosAdmin] Carregando dados das planilhas...');
      
      const [productsData, categoriesData] = await Promise.all([
        googleSheetsService.fetchTableData('produtos', true),
        googleSheetsService.fetchTableData('categorias', true)
      ]);

      console.log('[ProdutosAdmin] Produtos carregados:', productsData);
      console.log('[ProdutosAdmin] Categorias carregadas:', categoriesData);

      setProducts(productsData.filter(p => p.ativo?.toLowerCase() === 'true'));
      setCategories(categoriesData.filter(c => c.ativo?.toLowerCase() === 'true'));
      setLastSync(new Date());

    } catch (err) {
      console.error('[ProdutosAdmin] Erro ao carregar dados:', err);
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

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.nome || categoryId;
  };

  const formatPrice = (priceString: string) => {
    const price = parseFloat(priceString);
    return isNaN(price) ? priceString : `R$ ${price.toFixed(2)}`;
  };

  const formatTags = (tagsString?: string) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      categoria_id: '',
      preco: '',
      descricao: '',
      imagem: '',
      especificacoes: '',
      ativo: 'true',
      ordem: '1',
      tags: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      nome: product.nome,
      categoria_id: product.categoria_id,
      preco: product.preco,
      descricao: product.descricao,
      imagem: product.imagem || '',
      especificacoes: product.especificacoes || '',
      ativo: product.ativo,
      ordem: product.ordem,
      tags: product.tags || ''
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
          description: "Nome do produto é obrigatório",
          variant: "destructive",
        });
        return;
      }

      if (!formData.categoria_id) {
        toast({
          title: "Erro de validação", 
          description: "Categoria é obrigatória",
          variant: "destructive",
        });
        return;
      }

      if (!formData.preco) {
        toast({
          title: "Erro de validação",
          description: "Preço é obrigatório",
          variant: "destructive",
        });
        return;
      }

      // Simular salvamento (futuramente conectar com API de escrita no Google Sheets)
      console.log('[ProdutosAdmin] Salvando produto:', formData);
      
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
      console.error('[ProdutosAdmin] Erro ao salvar:', err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o produto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      // Simular exclusão (futuramente conectar com API)
      console.log('[ProdutosAdmin] Deletando produto:', productId);
      
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A exclusão será implementada em breve. Por enquanto, desative o produto na planilha (ativo = false).",
        variant: "default",
      });
      
    } catch (err) {
      console.error('[ProdutosAdmin] Erro ao deletar:', err);
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível deletar o produto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
          <p className="text-muted-foreground">
            Produtos sincronizados em tempo real com Google Sheets
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
        </div>
      </div>

      {/* Status de Conexão */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Erro de conexão com Google Sheets: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Sincronizado com produtos.csv
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias Ativas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Sincronizado com categorias.csv
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {products.reduce((acc, p) => acc + (parseFloat(p.preco) || 0), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os produtos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categorias Disponíveis */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Categorias Cadastradas ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Badge variant="secondary">{category.nome}</Badge>
                <span className="text-sm text-muted-foreground">
                  {products.filter(p => p.categoria_id === category.id).length} produtos
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Produtos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produtos Cadastrados ({products.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerencie os produtos sincronizados com Google Sheets
              </p>
            </div>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Carregando produtos...
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          Nenhum produto encontrado na planilha
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  products
                    .sort((a, b) => parseInt(a.ordem || '0') - parseInt(b.ordem || '0'))
                    .map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getCategoryName(product.categoria_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(product.preco)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {formatTags(product.tags).slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {formatTags(product.tags).length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{formatTags(product.tags).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {product.ordem || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.ativo?.toLowerCase() === 'true' ? 'default' : 'secondary'}>
                            {product.ativo?.toLowerCase() === 'true' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Editar Produto
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSave={handleSave}
            onCancel={() => setIsEditDialogOpen(false)}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Adição */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Novo Produto
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
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
            Sincronização com Google Sheets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Upload className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-amber-800 font-medium">Funcionalidade de Escrita em Desenvolvimento</p>
                <p className="text-amber-700">
                  Atualmente, os formulários estão prontos mas a escrita nas planilhas ainda não está implementada. 
                  Para editar dados, acesse diretamente o Google Sheets.
                </p>
              </div>
            </div>
            
            <p>
              Este sistema está sincronizado em tempo real com as planilhas do Google Sheets para <strong>leitura</strong>.
            </p>
            <p>
              Para adicionar, editar ou remover produtos temporariamente:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Acesse a planilha produtos.csv no Google Sheets</li>
              <li>Faça as alterações necessárias</li>
              <li>As mudanças aparecerão automaticamente aqui em até 30 segundos</li>
            </ul>
            <p className="text-orange-600">
              Campos importantes: nome, categoria_id (deve existir na planilha categorias), preco, ativo (true/false), ordem
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente do formulário de produto
interface ProductFormProps {
  formData: ProductForm;
  setFormData: (data: ProductForm) => void;
  categories: any[];
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  setFormData,
  categories,
  onSave,
  onCancel,
  isEditing
}) => {
  const updateFormData = (field: keyof ProductForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Produto *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => updateFormData('nome', e.target.value)}
            placeholder="Ex: Sistema PDV Completo"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria *</Label>
          <Select value={formData.categoria_id} onValueChange={(value) => updateFormData('categoria_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter(cat => cat.ativo?.toLowerCase() === 'true')
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.nome}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preco">Preço *</Label>
          <Input
            id="preco"
            type="number"
            step="0.01"
            value={formData.preco}
            onChange={(e) => updateFormData('preco', e.target.value)}
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ordem">Ordem de Exibição</Label>
          <Input
            id="ordem"
            type="number"
            value={formData.ordem}
            onChange={(e) => updateFormData('ordem', e.target.value)}
            placeholder="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ativo">Status</Label>
          <Select value={formData.ativo} onValueChange={(value) => updateFormData('ativo', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => updateFormData('descricao', e.target.value)}
          placeholder="Descrição detalhada do produto..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="especificacoes">Especificações</Label>
        <Textarea
          id="especificacoes"
          value={formData.especificacoes}
          onChange={(e) => updateFormData('especificacoes', e.target.value)}
          placeholder="Especificação 1, Especificação 2, Especificação 3..."
          rows={2}
        />
        <p className="text-xs text-muted-foreground">
          Separe múltiplas especificações por vírgula
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => updateFormData('tags', e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
          <p className="text-xs text-muted-foreground">
            Separe múltiplas tags por vírgula
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imagem">URL da Imagem</Label>
          <Input
            id="imagem"
            value={formData.imagem}
            onChange={(e) => updateFormData('imagem', e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}
        </Button>
      </div>
    </div>
  );
};