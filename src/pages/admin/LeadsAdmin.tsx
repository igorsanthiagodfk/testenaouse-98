import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, RefreshCw, Eye, Edit, Trash2, Phone, Mail, Building, MessageSquare, Filter, X, TrendingUp, Clock } from "lucide-react";
import { googleSheetsService } from "@/services/googleSheetsService";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  whatsapp?: string;
  empresa?: string;
  origem: string;
  status: string;
  observacoes?: string;
  interesse?: string;
  data_contato?: string;
  created_at?: string;
  updated_at?: string;
}

interface LeadStats {
  total: number;
  novos: number;
  contatados: number;
  qualificados: number;
  convertidos: number;
}

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Filtros
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOrigem, setFilterOrigem] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: 'novo', label: 'Novo', color: 'bg-blue-500' },
    { value: 'contatado', label: 'Contatado', color: 'bg-yellow-500' },
    { value: 'qualificado', label: 'Qualificado', color: 'bg-purple-500' },
    { value: 'negociando', label: 'Negociando', color: 'bg-orange-500' },
    { value: 'convertido', label: 'Convertido', color: 'bg-green-500' },
    { value: 'perdido', label: 'Perdido', color: 'bg-red-500' }
  ];

  const origemOptions = [
    'Site',
    'Diagnóstico',
    'WhatsApp',
    'Telefone',
    'Email',
    'Indicação',
    'Redes Sociais',
    'Outros'
  ];

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, filterStatus, filterOrigem, searchTerm]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await googleSheetsService.fetchTableData('leads');
      
      // Ordenar por data de criação mais recente
      const sortedLeads = data.sort((a, b) => 
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      );

      setLeads(sortedLeads);
      console.log('[LeadsAdmin] Leads carregados:', sortedLeads.length);

    } catch (err) {
      console.error('[LeadsAdmin] Erro ao carregar leads:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Filtro por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status?.toLowerCase() === filterStatus.toLowerCase());
    }

    // Filtro por origem
    if (filterOrigem !== 'all') {
      filtered = filtered.filter(lead => lead.origem?.toLowerCase() === filterOrigem.toLowerCase());
    }

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.nome?.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.empresa?.toLowerCase().includes(term) ||
        lead.telefone?.includes(term) ||
        lead.whatsapp?.includes(term)
      );
    }

    setFilteredLeads(filtered);
  };

  const getStats = (): LeadStats => {
    return {
      total: leads.length,
      novos: leads.filter(l => l.status?.toLowerCase() === 'novo').length,
      contatados: leads.filter(l => l.status?.toLowerCase() === 'contatado').length,
      qualificados: leads.filter(l => l.status?.toLowerCase() === 'qualificado').length,
      convertidos: leads.filter(l => l.status?.toLowerCase() === 'convertido').length
    };
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead({ ...lead });
    setIsEditDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingLead) return;

    setLeads(prev => 
      prev.map(lead => lead.id === editingLead.id ? editingLead : lead)
    );

    setIsEditDialogOpen(false);
    setEditingLead(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
      setLeads(prev => prev.filter(lead => lead.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status?.toLowerCase());
    if (!statusConfig) {
      return <Badge variant="secondary">{status}</Badge>;
    }

    return (
      <Badge 
        className="text-white" 
        style={{ backgroundColor: statusConfig.color.replace('bg-', '').replace('-500', '') }}
      >
        {statusConfig.label}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Olá ${name}! Aqui é da i.s.t.i. Vimos seu interesse em nossas soluções. Como podemos ajudá-lo?`;
    const url = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const stats = getStats();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Gestão de Leads
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie todos os leads capturados pelo sistema
            </p>
          </div>
          <Button onClick={loadLeads} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total de Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.novos}</p>
                <p className="text-xs text-muted-foreground">Novos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.contatados}</p>
                <p className="text-xs text-muted-foreground">Contatados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.qualificados}</p>
                <p className="text-xs text-muted-foreground">Qualificados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.convertidos}</p>
                <p className="text-xs text-muted-foreground">Convertidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4 mb-6">
          <p className="font-medium">Erro ao carregar dados:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Buscar:</Label>
              <Input
                placeholder="Nome, email, empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Status:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Origem:</Label>
              <Select value={filterOrigem} onValueChange={setFilterOrigem}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as origens</SelectItem>
                  {origemOptions.map(origem => (
                    <SelectItem key={origem} value={origem.toLowerCase()}>
                      {origem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterOrigem('all');
                  setSearchTerm('');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Badge variant="outline">
              {filteredLeads.length} de {leads.length} leads
            </Badge>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mr-3" />
          <span>Carregando leads...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Leads</CardTitle>
            <CardDescription>
              Todos os leads capturados pelo sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatDate(lead.created_at)}
                          </div>
                          {lead.data_contato && (
                            <div className="text-muted-foreground text-xs">
                              Último contato: {formatDate(lead.data_contato)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {lead.nome}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {lead.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3" />
                              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                                {lead.email}
                              </a>
                            </div>
                          )}
                          {lead.whatsapp && (
                            <div className="flex items-center gap-2 text-sm">
                              <MessageSquare className="h-3 w-3" />
                              <button
                                onClick={() => openWhatsApp(lead.whatsapp!, lead.nome)}
                                className="text-green-600 hover:underline"
                              >
                                {lead.whatsapp}
                              </button>
                            </div>
                          )}
                          {lead.telefone && lead.telefone !== lead.whatsapp && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3" />
                              <a href={`tel:${lead.telefone}`} className="hover:underline">
                                {lead.telefone}
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-3 w-3" />
                          {lead.empresa || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {lead.origem}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(lead.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(lead)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(lead)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lead.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog para visualizar lead */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Informações completas sobre este lead
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Nome:</Label>
                  <p>{selectedLead.nome}</p>
                </div>
                <div>
                  <Label className="font-medium">Empresa:</Label>
                  <p>{selectedLead.empresa || '-'}</p>
                </div>
                <div>
                  <Label className="font-medium">Email:</Label>
                  <p>{selectedLead.email || '-'}</p>
                </div>
                <div>
                  <Label className="font-medium">WhatsApp:</Label>
                  <p>{selectedLead.whatsapp || '-'}</p>
                </div>
                <div>
                  <Label className="font-medium">Telefone:</Label>
                  <p>{selectedLead.telefone || '-'}</p>
                </div>
                <div>
                  <Label className="font-medium">Origem:</Label>
                  <p>{selectedLead.origem}</p>
                </div>
                <div>
                  <Label className="font-medium">Status:</Label>
                  {getStatusBadge(selectedLead.status)}
                </div>
                <div>
                  <Label className="font-medium">Data de Criação:</Label>
                  <p>{formatDate(selectedLead.created_at)}</p>
                </div>
              </div>

              {selectedLead.interesse && (
                <div>
                  <Label className="font-medium">Interesse:</Label>
                  <p className="mt-1">{selectedLead.interesse}</p>
                </div>
              )}

              {selectedLead.observacoes && (
                <div>
                  <Label className="font-medium">Observações:</Label>
                  <p className="mt-1">{selectedLead.observacoes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Fechar
                </Button>
                {selectedLead.whatsapp && (
                  <Button 
                    onClick={() => openWhatsApp(selectedLead.whatsapp!, selectedLead.nome)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para editar lead */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Lead</DialogTitle>
            <DialogDescription>
              Atualize as informações do lead
            </DialogDescription>
          </DialogHeader>
          
          {editingLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome *</Label>
                  <Input
                    value={editingLead.nome}
                    onChange={(e) => setEditingLead({...editingLead, nome: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Empresa</Label>
                  <Input
                    value={editingLead.empresa || ''}
                    onChange={(e) => setEditingLead({...editingLead, empresa: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editingLead.email || ''}
                    onChange={(e) => setEditingLead({...editingLead, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    value={editingLead.whatsapp || ''}
                    onChange={(e) => setEditingLead({...editingLead, whatsapp: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editingLead.status}
                    onValueChange={(value) => setEditingLead({...editingLead, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Origem</Label>
                  <Select
                    value={editingLead.origem}
                    onValueChange={(value) => setEditingLead({...editingLead, origem: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {origemOptions.map(origem => (
                        <SelectItem key={origem} value={origem}>
                          {origem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Interesse</Label>
                <Textarea
                  value={editingLead.interesse || ''}
                  onChange={(e) => setEditingLead({...editingLead, interesse: e.target.value})}
                  placeholder="Descreva o interesse do lead..."
                />
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea
                  value={editingLead.observacoes || ''}
                  onChange={(e) => setEditingLead({...editingLead, observacoes: e.target.value})}
                  placeholder="Adicione observações sobre o lead..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}