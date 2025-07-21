import { useState, useEffect } from 'react';
import { googleSheetsService } from '@/services/googleSheetsService';

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  ativo: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  empresa?: string;
  telefone?: string;
  ramo?: string;
  sistema_recomendado?: string;
  origem?: string;
  pdf_baixado: string;
  dados_quiz?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  nome: string;
  categoria_id: string;
  preco: string;
  descricao: string;
  imagem?: string;
  especificacoes?: string;
  ativo: string;
  ordem: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

export interface Solution {
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
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  name: string;
  priority: string;
  rules: string;
  recommended_solutions: string;
  recommended_products: string;
  custom_title?: string;
  custom_text: string;
  is_active: string;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  type: string;
  options: string;
  required: string;
  order_position: string;
  description?: string;
  condition?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  nome: string;
  icon_name: string;
  descricao: string;
  ordem: string;
  ativo: string;
  created_at: string;
  updated_at: string;
}

export interface Configuration {
  id: string;
  chave: string;
  valor: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminData {
  leads: Lead[];
  products: Product[];
  solutions: Solution[];
  recommendations: Recommendation[];
  diagnosticQuestions: DiagnosticQuestion[];
  categories: Category[];
  configurations: Configuration[];
  adminUsers: AdminUser[];
}

export const useAdminData = () => {
  const [data, setData] = useState<AdminData>({
    leads: [],
    products: [],
    solutions: [],
    recommendations: [],
    diagnosticQuestions: [],
    categories: [],
    configurations: [],
    adminUsers: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const loadData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useAdminData] Carregando dados do Google Sheets...');
      const sheetsData = await googleSheetsService.fetchAllData(forceRefresh);

      setData({
        leads: sheetsData.leads || [],
        products: sheetsData.produtos || [],
        solutions: sheetsData.solucoes || [],
        recommendations: sheetsData.recommendations || [],
        diagnosticQuestions: sheetsData.diagnostic_questions || [],
        categories: sheetsData.categorias || [],
        configurations: sheetsData.configuracoes || [],
        adminUsers: sheetsData.admin_users || []
      });

      setLastSync(new Date());
      console.log('[useAdminData] Dados carregados com sucesso');

    } catch (err) {
      console.error('[useAdminData] Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadData(true);
  };

  const clearCache = () => {
    googleSheetsService.clearCache();
    loadData(true);
  };

  const getCacheStatus = () => {
    return googleSheetsService.getCacheStatus();
  };

  // Carrega dados na inicialização
  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    error,
    lastSync,
    refreshData,
    clearCache,
    getCacheStatus
  };
};