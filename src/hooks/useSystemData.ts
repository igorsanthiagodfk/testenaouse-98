import { useState, useEffect } from 'react';
import { googleSheetsService } from '@/services/googleSheetsService';

export interface SystemSolution {
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

export interface SystemCategory {
  id: string;
  nome: string;
  icon_name: string;
  descricao: string;
  ordem: string;
  ativo: string;
}

export interface SystemConfiguration {
  id: string;
  chave: string;
  valor: string;
  descricao?: string;
}

export interface SystemProduct {
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
}

export const useSystemData = () => {
  const [solutions, setSolutions] = useState<SystemSolution[]>([]);
  const [categories, setCategories] = useState<SystemCategory[]>([]);
  const [configurations, setConfigurations] = useState<SystemConfiguration[]>([]);
  const [products, setProducts] = useState<SystemProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSystemData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[useSystemData] Carregando dados do sistema...');

      const [solutionsData, categoriesData, configurationsData, productsData] = await Promise.all([
        googleSheetsService.fetchTableData('solucoes'),
        googleSheetsService.fetchTableData('categorias'),
        googleSheetsService.fetchTableData('configuracoes'),
        googleSheetsService.fetchTableData('produtos')
      ]);

      setSolutions(solutionsData.filter(s => s.ativo?.toLowerCase() === 'true'));
      setCategories(categoriesData.filter(c => c.ativo?.toLowerCase() === 'true'));
      setConfigurations(configurationsData);
      setProducts(productsData.filter(p => p.ativo?.toLowerCase() === 'true'));

      console.log('[useSystemData] Dados do sistema carregados com sucesso');

    } catch (err) {
      console.error('[useSystemData] Erro ao carregar dados do sistema:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSystemData();
  }, []);

  return {
    solutions,
    categories,
    configurations,
    products,
    isLoading,
    error,
    refreshData: loadSystemData
  };
};