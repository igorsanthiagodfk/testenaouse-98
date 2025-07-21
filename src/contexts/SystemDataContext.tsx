import React, { createContext, useContext, useEffect, useState } from 'react';
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
  created_at?: string;
  updated_at?: string;
}

export interface SystemConfiguration {
  id: string;
  chave: string;
  valor: string;
  descricao?: string;
}

// Unified cart item type
export interface UnifiedCartItem {
  id: string;
  nome: string;
  tipo: 'solution' | 'product';
  preco?: string;
  descricao?: string;
  data: SystemSolution | SystemProduct;
}

interface SystemDataContextType {
  solutions: SystemSolution[];
  categories: SystemCategory[];
  products: SystemProduct[];
  configurations: SystemConfiguration[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  // Unified cart for both products and solutions
  unifiedCart: UnifiedCartItem[];
  addToUnifiedCart: (item: SystemSolution | SystemProduct, type: 'solution' | 'product') => void;
  removeFromUnifiedCart: (itemId: string) => void;
  clearUnifiedCart: () => void;
  // Legacy product cart for backward compatibility
  productCart: SystemProduct[];
  addToProductCart: (product: SystemProduct) => void;
  removeFromProductCart: (productId: string) => void;
  clearProductCart: () => void;
}

const SystemDataContext = createContext<SystemDataContextType | undefined>(undefined);

export const useSystemDataContext = () => {
  const context = useContext(SystemDataContext);
  if (!context) {
    throw new Error('useSystemDataContext must be used within a SystemDataProvider');
  }
  return context;
};

export const SystemDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [solutions, setSolutions] = useState<SystemSolution[]>([]);
  const [categories, setCategories] = useState<SystemCategory[]>([]);
  const [products, setProducts] = useState<SystemProduct[]>([]);
  const [configurations, setConfigurations] = useState<SystemConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Global product cart state (legacy)
  const [productCart, setProductCart] = useState<SystemProduct[]>([]);
  // Unified cart state
  const [unifiedCart, setUnifiedCart] = useState<UnifiedCartItem[]>([]);

  const loadSystemData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('[SystemDataContext] Carregando todos os dados das planilhas...');

      // Carrega todas as planilhas em paralelo
      const allData = await googleSheetsService.fetchAllData();

      setSolutions(allData.solucoes?.filter(s => s.ativo?.toLowerCase() === 'true') || []);
      setCategories(allData.categorias?.filter(c => c.ativo?.toLowerCase() === 'true') || []);
      setProducts(allData.produtos?.filter(p => p.ativo?.toLowerCase() === 'true') || []);
      setConfigurations(allData.configuracoes || []);

      console.log('[SystemDataContext] Todos os dados carregados com sucesso');
      console.log('- Soluções:', allData.solucoes?.length || 0);
      console.log('- Categorias:', allData.categorias?.length || 0);  
      console.log('- Produtos:', allData.produtos?.length || 0);
      console.log('- Configurações:', allData.configuracoes?.length || 0);

    } catch (err) {
      console.error('[SystemDataContext] Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  // Unified cart functions
  const addToUnifiedCart = (item: SystemSolution | SystemProduct, type: 'solution' | 'product') => {
    const cartItem: UnifiedCartItem = {
      id: item.id,
      nome: item.nome,
      tipo: type,
      preco: 'preco' in item ? item.preco : undefined,
      descricao: item.descricao,
      data: item
    };

    setUnifiedCart(prev => {
      if (prev.find(p => p.id === item.id && p.tipo === type)) {
        return prev; // Already in cart
      }
      return [...prev, cartItem];
    });
  };

  const removeFromUnifiedCart = (itemId: string) => {
    setUnifiedCart(prev => prev.filter(p => p.id !== itemId));
  };

  const clearUnifiedCart = () => {
    setUnifiedCart([]);
  };

  // Legacy product cart functions for backward compatibility
  const addToProductCart = (product: SystemProduct) => {
    setProductCart(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev; // Already in cart
      }
      return [...prev, product];
    });
    // Also add to unified cart
    addToUnifiedCart(product, 'product');
  };

  const removeFromProductCart = (productId: string) => {
    setProductCart(prev => prev.filter(p => p.id !== productId));
    removeFromUnifiedCart(productId);
  };

  const clearProductCart = () => {
    setProductCart([]);
  };

  // Load data on mount
  useEffect(() => {
    loadSystemData();
  }, []);

  const value: SystemDataContextType = {
    solutions,
    categories,
    products,
    configurations,
    isLoading,
    error,
    refreshData: loadSystemData,
    unifiedCart,
    addToUnifiedCart,
    removeFromUnifiedCart,
    clearUnifiedCart,
    productCart,
    addToProductCart,
    removeFromProductCart,
    clearProductCart
  };

  return (
    <SystemDataContext.Provider value={value}>
      {children}
    </SystemDataContext.Provider>
  );
};