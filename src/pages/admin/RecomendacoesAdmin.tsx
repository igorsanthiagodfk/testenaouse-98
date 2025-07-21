import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, X, Settings, Target, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  diagnosticQuestions,
  solutions,
  products
} from "@/data/database";

interface DiagnosticRule {
  questionId: number;
  expectedValue: string;
}

interface Recommendation {
  id: number;
  name: string;
  priority: number; // MISSÃO 2: Campo de prioridade
  rules: DiagnosticRule[];
  recommendedSolutions: number[];
  recommendedProducts: number[];
  customTitle?: string; // MISSÃO 2: Título personalizado
  customText: string;
  isActive: boolean;
}

// Estado global das recomendações sincronizado com database.ts
let globalRecommendations: Recommendation[] = [
  {
    id: 1,
    name: "Solução para Distribuidoras/Atacado",
    priority: 20,
    rules: [
      { questionId: 1, expectedValue: "Distribuidora ou Atacado" }
    ],
    recommendedSolutions: [2], // Arpa Sistemas
    recommendedProducts: [1, 2, 3],
    customTitle: "A Combinação Perfeita para Distribuidoras",
    customText: "Baseado no seu perfil de distribuidora/atacado, recomendamos o Arpa Sistemas, especializado em gestão de estoque e logística para grandes volumes.",
    isActive: true
  },
  {
    id: 2,
    name: "Solução para Performance Máxima",
    priority: 15,
    rules: [
      { questionId: 4, expectedValue: "Performance Máxima" }
    ],
    recommendedSolutions: [1], // SG Sistemas
    recommendedProducts: [1, 5, 6],
    customTitle: "Máxima Performance Para Seu Negócio",
    customText: "Para quem prioriza performance máxima, o SG Sistemas oferece estabilidade extrema e velocidade incomparável.",
    isActive: true
  },
  {
    id: 3,
    name: "Solução para Facilidade de Uso - Grande Porte",
    priority: 25,
    rules: [
      { questionId: 4, expectedValue: "Facilidade de Uso" },
      { questionId: 3, expectedValue: "Grande" }
    ],
    recommendedSolutions: [3], // Hiper Sistemas
    recommendedProducts: [1, 2, 4, 7],
    customTitle: "Interface Moderna Para Grandes Operações",
    customText: "Para operações de grande porte que priorizam facilidade, o Hiper Sistemas combina interface moderna com recursos avançados.",
    isActive: true
  }
];

const RecomendacoesAdmin = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecommendation, setEditingRecommendation] = useState<Recommendation | null>(null);
  const [newRecommendation, setNewRecommendation] = useState<Omit<Recommendation, 'id'>>({
    name: "",
    priority: 10, // MISSÃO 2: Valor padrão de prioridade
    rules: [],
    recommendedSolutions: [],
    recommendedProducts: [],
    customTitle: "",
    customText: "",
    isActive: true
  });
  const { toast } = useToast();

  // Carregar dados
  useEffect(() => {
    setRecommendations([...globalRecommendations]);
  }, []);

  const handleCreateRecommendation = () => {
    if (!newRecommendation.name.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome da recomendação é obrigatório"
      });
      return;
    }

    const newId = Math.max(...globalRecommendations.map(r => r.id), 0) + 1;
    const recommendation: Recommendation = {
      ...newRecommendation,
      id: newId
    };

    globalRecommendations.push(recommendation);
    setRecommendations([...globalRecommendations]);
    setIsCreateDialogOpen(false);
    setNewRecommendation({
      name: "",
      priority: 10,
      rules: [],
      recommendedSolutions: [],
      recommendedProducts: [],
      customTitle: "",
      customText: "",
      isActive: true
    });

    toast({
      title: "Sucesso",
      description: "Recomendação criada com sucesso!"
    });
  };

  const handleEditRecommendation = () => {
    if (!editingRecommendation) return;

    const index = globalRecommendations.findIndex(r => r.id === editingRecommendation.id);
    if (index !== -1) {
      globalRecommendations[index] = editingRecommendation;
      setRecommendations([...globalRecommendations]);
      setIsEditDialogOpen(false);
      setEditingRecommendation(null);

      toast({
        title: "Sucesso",
        description: "Recomendação atualizada com sucesso!"
      });
    }
  };

  const handleDeleteRecommendation = (id: number) => {
    const index = globalRecommendations.findIndex(r => r.id === id);
    if (index !== -1) {
      globalRecommendations.splice(index, 1);
      setRecommendations([...globalRecommendations]);

      toast({
        title: "Sucesso",
        description: "Recomendação removida com sucesso!"
      });
    }
  };

  const addRule = (recommendation: Omit<Recommendation, 'id'> | Recommendation, setter: (rec: any) => void) => {
    const newRule: DiagnosticRule = { questionId: 0, expectedValue: "" };
    setter({
      ...recommendation,
      rules: [...recommendation.rules, newRule]
    });
  };

  const updateRule = (recommendation: Omit<Recommendation, 'id'> | Recommendation, setter: (rec: any) => void, index: number, field: keyof DiagnosticRule, value: string | number) => {
    const updatedRules = [...recommendation.rules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setter({
      ...recommendation,
      rules: updatedRules
    });
  };

  const removeRule = (recommendation: Omit<Recommendation, 'id'> | Recommendation, setter: (rec: any) => void, index: number) => {
    setter({
      ...recommendation,
      rules: recommendation.rules.filter((_, i) => i !== index)
    });
  };

  const toggleSolution = (recommendation: Omit<Recommendation, 'id'> | Recommendation, setter: (rec: any) => void, solutionId: number) => {
    const isSelected = recommendation.recommendedSolutions.includes(solutionId);
    const updatedSolutions = isSelected
      ? recommendation.recommendedSolutions.filter(id => id !== solutionId)
      : [...recommendation.recommendedSolutions, solutionId];
    
    setter({
      ...recommendation,
      recommendedSolutions: updatedSolutions
    });
  };

  const toggleProduct = (recommendation: Omit<Recommendation, 'id'> | Recommendation, setter: (rec: any) => void, productId: number) => {
    const isSelected = recommendation.recommendedProducts.includes(productId);
    const updatedProducts = isSelected
      ? recommendation.recommendedProducts.filter(id => id !== productId)
      : [...recommendation.recommendedProducts, productId];
    
    setter({
      ...recommendation,
      recommendedProducts: updatedProducts
    });
  };

  const questions = diagnosticQuestions();
  const allSolutions = solutions();
  const allProducts = products();

  const RuleEditor = ({ recommendation, setter }: { recommendation: Omit<Recommendation, 'id'> | Recommendation, setter: (rec: any) => void }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Condições para Ativar</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addRule(recommendation, setter)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Regra
        </Button>
      </div>

      {recommendation.rules.map((rule, index) => {
        const selectedQuestion = questions.find(q => q.id === rule.questionId);
        return (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-xs">Pergunta</Label>
              <Select
                value={rule.questionId.toString()}
                onValueChange={(value) => updateRule(recommendation, setter, index, 'questionId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a pergunta" />
                </SelectTrigger>
                <SelectContent>
                  {questions.map(q => (
                    <SelectItem key={q.id} value={q.id.toString()}>
                      {q.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="text-xs">É igual a</Label>
              <Select
                value={rule.expectedValue}
                onValueChange={(value) => updateRule(recommendation, setter, index, 'expectedValue', value)}
                disabled={!selectedQuestion}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a resposta" />
                </SelectTrigger>
                <SelectContent>
                  {selectedQuestion?.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeRule(recommendation, setter, index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );

  const RecommendationDialog = ({ 
    isOpen, 
    setIsOpen, 
    recommendation, 
    setter, 
    onSave, 
    title 
  }: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    recommendation: Omit<Recommendation, 'id'> | Recommendation;
    setter: (rec: any) => void;
    onSave: () => void;
    title: string;
  }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Configure as regras e recomendações para esta situação específica
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">Nome Interno da Regra</Label>
              <Input
                id="name"
                placeholder="Ex: Regra para Restaurantes Pequenos"
                value={recommendation.name}
                onChange={(e) => setter({ ...recommendation, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Input
                id="priority"
                type="number"
                placeholder="Ex: 10"
                value={recommendation.priority}
                onChange={(e) => setter({ ...recommendation, priority: parseInt(e.target.value) || 10 })}
              />
              <p className="text-xs text-muted-foreground mt-1">Números maiores = prioridade mais alta</p>
            </div>
          </div>

          <RuleEditor recommendation={recommendation} setter={setter} />

          <div>
            <Label className="text-sm font-medium">Soluções Recomendadas</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {allSolutions.map(solution => (
                <div key={solution.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={recommendation.recommendedSolutions.includes(solution.id)}
                    onCheckedChange={() => toggleSolution(recommendation, setter, solution.id)}
                  />
                  <Label className="text-sm">{solution.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Equipamentos Recomendados</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
              {allProducts.map(product => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={recommendation.recommendedProducts.includes(product.id)}
                    onCheckedChange={() => toggleProduct(recommendation, setter, product.id)}
                  />
                  <Label className="text-sm">{product.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="customTitle">Título Personalizado do Resultado</Label>
            <Input
              id="customTitle"
              placeholder="Ex: A Combinação Perfeita para o seu Restaurante"
              value={recommendation.customTitle || ""}
              onChange={(e) => setter({ ...recommendation, customTitle: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="customText">Texto da Análise</Label>
            <Textarea
              id="customText"
              placeholder="Ex: Com base nas suas respostas, identificamos que a agilidade no caixa é sua maior necessidade..."
              value={recommendation.customText}
              onChange={(e) => setter({ ...recommendation, customText: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={recommendation.isActive}
              onCheckedChange={(checked) => setter({ ...recommendation, isActive: !!checked })}
            />
            <Label>Recomendação ativa</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            Salvar Recomendação
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recomendações</h1>
          <p className="text-muted-foreground mt-2">
            Configure regras inteligentes para recomendar soluções baseadas nas respostas do diagnóstico
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Recomendação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Recomendações Configuradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Regras</TableHead>
                <TableHead>Soluções</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations.map((recommendation) => (
                <TableRow key={recommendation.id}>
                  <TableCell className="font-medium">
                    {recommendation.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {recommendation.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {recommendation.rules.map((rule, index) => {
                        const question = questions.find(q => q.id === rule.questionId);
                        return (
                          <Badge key={index} variant="outline" className="text-xs">
                            {question?.text.substring(0, 20)}... = {rule.expectedValue}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {recommendation.recommendedSolutions.map(solutionId => {
                        const solution = allSolutions.find(s => s.id === solutionId);
                        return (
                          <Badge key={solutionId} variant="secondary" className="text-xs">
                            {solution?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={recommendation.isActive ? "default" : "secondary"}>
                      {recommendation.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingRecommendation(recommendation);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRecommendation(recommendation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RecommendationDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={setIsCreateDialogOpen}
        recommendation={newRecommendation}
        setter={setNewRecommendation}
        onSave={handleCreateRecommendation}
        title="Nova Recomendação"
      />

      {editingRecommendation && (
        <RecommendationDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          recommendation={editingRecommendation}
          setter={setEditingRecommendation}
          onSave={handleEditRecommendation}
          title="Editar Recomendação"
        />
      )}
    </div>
  );
};

export default RecomendacoesAdmin;