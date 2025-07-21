import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X, ArrowUp, ArrowDown, Brain, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  diagnosticQuestions, 
  addDiagnosticQuestion, 
  updateDiagnosticQuestion, 
  deleteDiagnosticQuestion, 
  DiagnosticQuestion as DBDiagnosticQuestion 
} from "@/data/database";

// Tipos de resposta disponíveis
const responseTypes = [
  { id: "multiple", name: "Múltipla Escolha" },
  { id: "single", name: "Resposta Única" },
  { id: "text", name: "Texto Livre" },
  { id: "number", name: "Número" }
];

// Interface para as opções de resposta
interface ResponseOption {
  id: string;
  text: string;
  value: string;
}

// Interface para as perguntas
interface DiagnosticQuestion {
  id: number;
  text: string;
  type: string;
  options: ResponseOption[];
  required: boolean;
  order: number;
  description?: string;
}

// Interface para os dados do formulário
interface QuestionFormData {
  text: string;
  type: string;
  options: ResponseOption[];
  required: boolean;
  description: string;
}

// Dados mockados baseados no quiz real
const mockQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    text: "Para começar, qual o seu ramo de atuação?",
    type: "single",
    options: [
      { id: "1", text: "🛒 Supermercado ou Mercadinho", value: "Supermercado ou Mercadinho" },
      { id: "2", text: "🍔 Restaurante ou Lanchonete", value: "Restaurante ou Lanchonete" },
      { id: "3", text: "📦 Distribuidora ou Atacado", value: "Distribuidora ou Atacado" },
      { id: "4", text: "👕 Loja de Roupas e Calçados", value: "Loja de Roupas e Calçados" },
      { id: "5", text: "🥩 Açougue", value: "Açougue" },
      { id: "6", text: "🥐 Padaria", value: "Padaria" },
      { id: "7", text: "🔩 Loja de Materiais de Construção", value: "Loja de Materiais de Construção" },
      { id: "8", text: "🛠️ Outro tipo de Loja ou Serviço", value: "Outro tipo de Loja ou Serviço" }
    ],
    required: true,
    order: 1,
    description: "Selecione o ramo principal da sua empresa"
  },
  {
    id: 2,
    text: "Entendido! E para seu estabelecimento, qual a prioridade?",
    type: "single",
    options: [
      { id: "1", text: "⚡ Agilidade no Caixa e Balcão", value: "Agilidade no Caixa e Balcão" },
      { id: "2", text: "🛵 Gestão de Mesas, Comandas e Delivery", value: "Gestão de Mesas, Comandas e Delivery" }
    ],
    required: false,
    order: 2,
    description: "Pergunta condicional - apenas para Restaurante e Padaria"
  },
  {
    id: 3,
    text: "Qual o porte da sua operação hoje?",
    type: "single",
    options: [
      { id: "1", text: "Pequeno: 1 a 2 caixas (PDVs)", value: "Pequeno" },
      { id: "2", text: "Médio: 3 a 5 caixas (PDVs)", value: "Médio" },
      { id: "3", text: "Grande: Mais de 5 caixas (PDVs)", value: "Grande" },
      { id: "4", text: "Interno: Não uso caixa, apenas gestão interna", value: "Interno" }
    ],
    required: true,
    order: 3,
    description: "Informe o porte da sua empresa"
  },
  {
    id: 4,
    text: "No dia a dia, o que é mais valioso para você e sua equipe?",
    type: "single",
    options: [
      { id: "1", text: "Performance Máxima", value: "Performance Máxima" },
      { id: "2", text: "Facilidade de Uso", value: "Facilidade de Uso" }
    ],
    required: true,
    order: 4,
    description: "Prioridade técnica do sistema"
  },
  {
    id: 5,
    text: "Como você imagina o acesso ao seu sistema de gestão?",
    type: "single",
    options: [
      { id: "1", text: "Acesso Local", value: "Acesso Local" },
      { id: "2", text: "Acesso de Qualquer Lugar (Nuvem)", value: "Acesso de Qualquer Lugar (Nuvem)" },
      { id: "3", text: "Preciso de Ajuda", value: "Preciso de Ajuda" }
    ],
    required: true,
    order: 5,
    description: "Tipo de infraestrutura desejada"
  },
  {
    id: 6,
    text: "Informações de contato",
    type: "text",
    options: [],
    required: true,
    order: 6,
    description: "Coleta de dados para envio do diagnóstico (Nome, Empresa, WhatsApp)"
  }
];

export default function DiagnosticoAdmin() {
  const [currentQuestions, setCurrentQuestions] = useState<DiagnosticQuestion[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<DiagnosticQuestion | null>(null);
  const [formData, setFormData] = useState<QuestionFormData>({
    text: "",
    type: "single",
    options: [],
    required: true,
    description: ""
  });
  const [newOption, setNewOption] = useState({ text: "", value: "" });
  const { toast } = useToast();

// Carregar perguntas
  useEffect(() => {
    console.log('[DiagnosticoAdmin] Carregando perguntas do banco de dados');
    const questions = diagnosticQuestions();
    // Converter para o formato esperado pelo componente
    const convertedQuestions = questions.map(q => ({
      ...q,
      options: q.options.map((opt, index) => ({
        id: (index + 1).toString(),
        text: opt.text,
        value: opt.value
      }))
    }));
    setCurrentQuestions(convertedQuestions);
  }, []);

  // Resetar formulário
  const resetForm = useCallback(() => {
    setFormData({
      text: "",
      type: "single",
      options: [],
      required: true,
      description: ""
    });
    setNewOption({ text: "", value: "" });
  }, []);

  // Adicionar opção de resposta
  const addOption = useCallback(() => {
    if (!newOption.text.trim()) {
      toast({
        title: "Erro",
        description: "Digite o texto da opção.",
        variant: "destructive"
      });
      return;
    }

    const value = newOption.value.trim() || newOption.text.toLowerCase().replace(/\s+/g, '_');
    const optionId = (formData.options.length + 1).toString();
    
    const newOptionObj: ResponseOption = {
      id: optionId,
      text: newOption.text.trim(),
      value: value
    };

    setFormData(prev => ({
      ...prev,
      options: [...prev.options, newOptionObj]
    }));

    setNewOption({ text: "", value: "" });
  }, [newOption, formData.options, toast]);

  // Remover opção de resposta
  const removeOption = useCallback((optionId: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(option => option.id !== optionId)
    }));
  }, []);

  // Submeter formulário
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      toast({
        title: "Erro",
        description: "O texto da pergunta é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if ((formData.type === "single" || formData.type === "multiple") && formData.options.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma opção de resposta.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingQuestion) {
        // Atualizar pergunta existente
        const updatedQuestion: DiagnosticQuestion = {
          ...editingQuestion,
          text: formData.text.trim(),
          type: formData.type,
          options: formData.options,
          required: formData.required,
          description: formData.description.trim()
        };

        setCurrentQuestions(prev => 
          prev.map(q => q.id === editingQuestion.id ? updatedQuestion : q)
        );

        toast({
          title: "Pergunta atualizada",
          description: "As alterações foram salvas com sucesso."
        });
      } else {
        // Adicionar nova pergunta
        const newQuestion: DiagnosticQuestion = {
          id: Math.max(...currentQuestions.map(q => q.id), 0) + 1,
          text: formData.text.trim(),
          type: formData.type,
          options: formData.options,
          required: formData.required,
          order: currentQuestions.length + 1,
          description: formData.description.trim()
        };

        setCurrentQuestions(prev => [...prev, newQuestion]);

        toast({
          title: "Pergunta criada",
          description: "Nova pergunta adicionada com sucesso."
        });
      }

      // Fechar dialog e resetar
      setIsAddDialogOpen(false);
      setEditingQuestion(null);
      resetForm();

    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a pergunta.",
        variant: "destructive"
      });
    }
  }, [formData, editingQuestion, currentQuestions, toast, resetForm]);

  // Editar pergunta
  const handleEdit = useCallback((question: DiagnosticQuestion) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      type: question.type,
      options: [...question.options],
      required: question.required,
      description: question.description || ""
    });
    setIsAddDialogOpen(true);
  }, []);

  // Excluir pergunta
  const handleDelete = useCallback((questionId: number) => {
    setCurrentQuestions(prev => prev.filter(q => q.id !== questionId));
    toast({
      title: "Pergunta excluída",
      description: "A pergunta foi removida com sucesso."
    });
  }, [toast]);

  // Reordenar perguntas
  const moveQuestion = useCallback((questionId: number, direction: 'up' | 'down') => {
    setCurrentQuestions(prev => {
      const questions = [...prev];
      const index = questions.findIndex(q => q.id === questionId);
      
      if (index === -1) return prev;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= questions.length) return prev;
      
      // Trocar posições
      [questions[index], questions[newIndex]] = [questions[newIndex], questions[index]];
      
      // Atualizar ordem
      questions.forEach((q, i) => {
        q.order = i + 1;
      });
      
      return questions;
    });
  }, []);

  // Cancelar edição
  const handleCancel = useCallback(() => {
    setIsAddDialogOpen(false);
    setEditingQuestion(null);
    resetForm();
  }, [resetForm]);

  // Perguntas ordenadas
  const sortedQuestions = useMemo(() => {
    return [...currentQuestions].sort((a, b) => a.order - b.order);
  }, [currentQuestions]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Diagnóstico</h1>
          <p className="text-muted-foreground">
            Configure as perguntas do questionário de diagnóstico
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingQuestion(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Pergunta
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Perguntas do Diagnóstico ({sortedQuestions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedQuestions.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma pergunta cadastrada</h3>
              <p className="text-muted-foreground mb-4">
                Adicione perguntas para criar o questionário de diagnóstico
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Pergunta
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ordem</TableHead>
                  <TableHead>Pergunta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Opções</TableHead>
                  <TableHead>Obrigatória</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedQuestions.map((question, index) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        <span>{question.order}</span>
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => moveQuestion(question.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => moveQuestion(question.id, 'down')}
                            disabled={index === sortedQuestions.length - 1}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{question.text}</p>
                        {question.description && (
                          <p className="text-sm text-muted-foreground">{question.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {responseTypes.find(t => t.id === question.type)?.name || question.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {question.options.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {question.options.slice(0, 3).map(option => (
                            <Badge key={option.id} variant="secondary" className="text-xs">
                              {option.text}
                            </Badge>
                          ))}
                          {question.options.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{question.options.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={question.required ? "default" : "secondary"}>
                        {question.required ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(question)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(question.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog para adicionar/editar pergunta */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}
            </DialogTitle>
            <DialogDescription>
              {editingQuestion ? "Modifique os dados da pergunta abaixo." : "Preencha os dados da nova pergunta."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Texto da pergunta */}
            <div className="space-y-2">
              <Label htmlFor="text">
                Texto da Pergunta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Ex: Qual o setor do seu negócio?"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição adicional para ajudar o usuário a entender a pergunta"
                rows={2}
              />
            </div>

            {/* Tipo de resposta */}
            <div className="space-y-2">
              <Label>Tipo de Resposta</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  type: value,
                  options: (value === "text" || value === "number") ? [] : prev.options
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {responseTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opções de resposta (apenas para múltipla escolha e resposta única) */}
            {(formData.type === "single" || formData.type === "multiple") && (
              <div className="space-y-4">
                <Label>Opções de Resposta</Label>
                
                {/* Lista de opções existentes */}
                {formData.options.length > 0 && (
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="flex-1">{option.text}</span>
                        <Badge variant="outline" className="text-xs">
                          {option.value}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(option.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Adicionar nova opção */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        value={newOption.text}
                        onChange={(e) => setNewOption(prev => ({ ...prev, text: e.target.value }))}
                        placeholder="Texto da opção"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addOption();
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={newOption.value}
                        onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="Valor (opcional)"
                      />
                    </div>
                    <Button type="button" onClick={addOption}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Se não informar o valor, será gerado automaticamente a partir do texto.
                  </p>
                </div>

                {formData.options.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Adicione pelo menos uma opção de resposta.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pergunta obrigatória */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={formData.required}
                onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="required">Pergunta obrigatória</Label>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingQuestion ? "Atualizar" : "Criar"} Pergunta
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}