import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, GitCompare, Building2, Store, ShoppingCart, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Sistema {
  id: string;
  nome: string;
  descricao: string;
  icon: React.ComponentType<any>;
  slug: string;
}

interface CompararSistemasProps {
  sistemas: Sistema[];
}

const dadosComparacao = {
  'sg-sistemas': {
    'Controle de Estoque': true,
    'Emissão de NFC-e': true,
    'PDV (Ponto de Venda)': true,
    'Gestão Financeira': true,
    'Relatórios Gerenciais': true,
    'Backup Automático': true,
    'Suporte Técnico': true,
    'Multi-usuário': true,
    'Controle de Produção': false,
    'E-commerce Integrado': false,
    'App Mobile': false,
    'Gestão de Delivery': false,
    'PDVs Ilimitados': false,
    'Servidor em Nuvem': false
  },
  'arpa-sistemas': {
    'Controle de Estoque': true,
    'Emissão de NFC-e': true,
    'PDV (Ponto de Venda)': true,
    'Gestão Financeira': true,
    'Relatórios Gerenciais': true,
    'Backup Automático': true,
    'Suporte Técnico': true,
    'Multi-usuário': true,
    'Controle de Produção': true,
    'E-commerce Integrado': false,
    'App Mobile': true,
    'Gestão de Delivery': false,
    'PDVs Ilimitados': true,
    'Servidor em Nuvem': true
  },
  'hiper-sistemas': {
    'Controle de Estoque': true,
    'Emissão de NFC-e': true,
    'PDV (Ponto de Venda)': true,
    'Gestão Financeira': true,
    'Relatórios Gerenciais': true,
    'Backup Automático': true,
    'Suporte Técnico': true,
    'Multi-usuário': true,
    'Controle de Produção': false,
    'E-commerce Integrado': true,
    'App Mobile': true,
    'Gestão de Delivery': true,
    'PDVs Ilimitados': false,
    'Servidor em Nuvem': true
  },
  'rjk-sistemas': {
    'Controle de Estoque': true,
    'Emissão de NFC-e': true,
    'PDV (Ponto de Venda)': true,
    'Gestão Financeira': true,
    'Relatórios Gerenciais': true,
    'Backup Automático': true,
    'Suporte Técnico': true,
    'Multi-usuário': true,
    'Controle de Produção': false,
    'E-commerce Integrado': true,
    'App Mobile': true,
    'Gestão de Delivery': true,
    'PDVs Ilimitados': false,
    'Servidor em Nuvem': true
  }
};

const CompararSistemas: React.FC<CompararSistemasProps> = ({ sistemas }) => {
  const [sistemasSelecionados, setSistemasSelecionados] = useState<string[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  const toggleSistema = (sistemaId: string) => {
    setSistemasSelecionados(prev => {
      if (prev.includes(sistemaId)) {
        return prev.filter(id => id !== sistemaId);
      }
      
      // Limite de 3 sistemas para comparação
      if (prev.length >= 3) {
        return [...prev.slice(1), sistemaId];
      }
      
      return [...prev, sistemaId];
    });
  };

  const abrirComparacao = () => {
    if (sistemasSelecionados.length >= 2) {
      setModalAberto(true);
    }
  };

  const obterDadosSistemasSelecionados = () => {
    return sistemasSelecionados.map(id => {
      const sistema = sistemas.find(s => s.id === id);
      return {
        ...sistema,
        dados: dadosComparacao[id as keyof typeof dadosComparacao] || {}
      };
    });
  };

  const funcionalidades = [
    'Controle de Estoque',
    'Emissão de NFC-e',
    'PDV (Ponto de Venda)',
    'Gestão Financeira',
    'Relatórios Gerenciais',
    'Backup Automático',
    'Suporte Técnico',
    'Multi-usuário',
    'Controle de Produção',
    'E-commerce Integrado',
    'App Mobile',
    'Gestão de Delivery',
    'PDVs Ilimitados',
    'Servidor em Nuvem'
  ];

  // Anexar funções ao objeto global para acesso dos cards
  React.useEffect(() => {
    (window as any).compararSistemas = {
      toggleSistema,
      sistemasSelecionados,
      isSelecionado: (id: string) => sistemasSelecionados.includes(id)
    };
  }, [sistemasSelecionados]);

  return (
    <>
      {/* Bandeja de Comparação Flutuante */}
      <AnimatePresence>
        {sistemasSelecionados.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-background border-accent shadow-glow min-w-80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitCompare className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {sistemasSelecionados.length} sistema{sistemasSelecionados.length > 1 ? 's' : ''} selecionado{sistemasSelecionados.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSistemasSelecionados([])}
                    >
                      Limpar
                    </Button>
                    <Button
                      variant="cta"
                      size="sm"
                      onClick={abrirComparacao}
                      disabled={sistemasSelecionados.length < 2}
                    >
                      Comparar Agora
                    </Button>
                  </div>
                </div>
                
                {sistemasSelecionados.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {sistemasSelecionados.map(sistemaId => {
                      const sistema = sistemas.find(s => s.id === sistemaId);
                      return (
                        <Badge
                          key={sistemaId}
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>{sistema?.nome}</span>
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => toggleSistema(sistemaId)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Comparação */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GitCompare className="h-6 w-6 text-primary" />
              <span>Comparação de Sistemas</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Funcionalidade</TableHead>
                  {obterDadosSistemasSelecionados().map(sistema => (
                    <TableHead key={sistema?.id} className="text-center min-w-40">
                      <div className="flex flex-col items-center space-y-2">
                        {sistema?.icon && <sistema.icon className="h-6 w-6 text-primary" />}
                        <span className="font-semibold">{sistema?.nome}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {funcionalidades.map(funcionalidade => (
                  <TableRow key={funcionalidade}>
                    <TableCell className="font-medium">{funcionalidade}</TableCell>
                    {obterDadosSistemasSelecionados().map(sistema => {
                      const possuiFuncionalidade = sistema?.dados[funcionalidade];
                      return (
                        <TableCell key={sistema?.id} className="text-center">
                          {possuiFuncionalidade ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setModalAberto(false)}
            >
              Fechar Comparação
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hook para renderizar botões de comparação nos cards */}
      <style>{`
        .comparison-button-container {
          display: contents;
        }
      `}</style>
    </>
  );
};

export default CompararSistemas;