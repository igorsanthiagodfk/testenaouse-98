import { Monitor, Server, Printer, Keyboard, Router, Building2, Store, ShoppingCart, Truck } from "lucide-react";

// ============ PRODUCTS DATABASE ============
export interface Product {
  id: number;
  category: string;
  name: string;
  price: number;
  image?: string;
  images?: string[]; // Array de imagens
  tags: string[];
  promotional_badges: string[]; // Badges promocionais como "Mais Vendido"
  short_description: string;
  long_description?: string; // Descrição completa
  specifications: Array<{
    label: string;
    value: string;
  }>;
}

// Estado global para produtos
let globalProducts: Product[] = [];

export interface ProductCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export const productCategories: ProductCategory[] = [
  {
    id: "impressoras",
    name: "Impressoras",
    icon: Printer,
    description: "Impressoras térmicas e matriciais para diversos usos comerciais"
  },
  {
    id: "computadores",
    name: "Computadores",
    icon: Monitor,
    description: "Equipamentos PDV e computadores para automação comercial"
  },
  {
    id: "servidores",
    name: "Servidores",
    icon: Server,
    description: "Servidores dedicados e soluções de infraestrutura"
  },
  {
    id: "acessorios",
    name: "Acessórios",
    icon: Keyboard,
    description: "Periféricos e acessórios para automação comercial"
  },
  {
    id: "rede",
    name: "Equipamentos de Rede",
    icon: Router,
    description: "Soluções completas de rede e conectividade"
  }
];

// Dados iniciais dos produtos
const initialProducts: Product[] = [
  // IMPRESSORAS
  {
    id: 1,
    category: "impressoras",
    name: "Impressora Térmica 80mm",
    price: 280,
    tags: ["Ideal para Lojas", "Frente de Caixa"],
    promotional_badges: ["Ideal para Varejo"],
    short_description: "Impressora térmica de alta velocidade para cupons fiscais",
    long_description: "Impressora térmica profissional de 80mm com alta velocidade de impressão e cortador automático. Ideal para estabelecimentos comerciais que precisam de agilidade e confiabilidade no ponto de venda.",
    specifications: [
      { label: "Velocidade", value: "250mm/s" },
      { label: "Interface", value: "USB e Serial" },
      { label: "Papel", value: "80mm" },
      { label: "Cortador automático", value: "Sim" }
    ]
  },
  {
    id: 2,
    category: "impressoras",
    name: "Impressora Matricial 24 agulhas",
    price: 650,
    tags: ["Escritório", "Formulários"],
    promotional_badges: [],
    short_description: "Impressora matricial robusta para formulários contínuos",
    long_description: "Impressora matricial de 24 agulhas com alta durabilidade para impressão de formulários contínuos e documentos fiscais. Ideal para empresas que precisam de equipamentos robustos.",
    specifications: [
      { label: "Agulhas", value: "24 agulhas" },
      { label: "Papel", value: "Formulário contínuo" },
      { label: "Interface", value: "Paralela e USB" },
      { label: "Durabilidade", value: "Alta" }
    ]
  },
  {
    id: 3,
    category: "impressoras",
    name: "Impressora de Etiquetas",
    price: 450,
    tags: ["Estoque", "Códigos de Barras"],
    promotional_badges: [],
    short_description: "Impressora térmica especializada em etiquetas e códigos de barras",
    specifications: [
      { label: "Resolução", value: "203 DPI" },
      { label: "Largura", value: "Até 104mm" },
      { label: "Interface", value: "USB" },
      { label: "Software", value: "Incluído" }
    ]
  },

  // COMPUTADORES
  {
    id: 4,
    category: "computadores",
    name: "PDV Touch Screen 15\"",
    price: 1890,
    tags: ["Frente de Caixa", "Touch"],
    promotional_badges: ["Mais Vendido"],
    short_description: "Terminal PDV completo com tela touchscreen",
    long_description: "Terminal de ponto de venda completo com tela touchscreen de 15 polegadas. Solução all-in-one ideal para estabelecimentos que buscam modernidade e praticidade no atendimento.",
    specifications: [
      { label: "Tela", value: "15\" touch capacitiva" },
      { label: "Processador", value: "Intel J1900" },
      { label: "Memória", value: "4GB RAM, 64GB SSD" },
      { label: "Sistema", value: "Operacional incluso" }
    ]
  },
  {
    id: 5,
    category: "computadores",
    name: "Computador PDV Compacto",
    price: 1250,
    tags: ["Frente de Caixa", "Compacto"],
    promotional_badges: [],
    short_description: "Mini PC especializado para pontos de venda",
    specifications: [
      { label: "Processador", value: "Intel Celeron N3350" },
      { label: "Memória", value: "4GB DDR3" },
      { label: "Armazenamento", value: "SSD 120GB" },
      { label: "Portas", value: "4 portas USB" }
    ]
  },
  {
    id: 6,
    category: "computadores",
    name: "All-in-One PDV 21.5\"",
    price: 2450,
    tags: ["Frente de Caixa", "All-in-One"],
    promotional_badges: [],
    short_description: "Solução completa all-in-one para PDV",
    specifications: [
      { label: "Tela", value: "21.5\" Full HD" },
      { label: "Touch", value: "10 pontos" },
      { label: "Processador", value: "Intel Core i3" },
      { label: "Memória", value: "8GB RAM, 256GB SSD" }
    ]
  },

  // SERVIDORES
  {
    id: 7,
    category: "servidores",
    name: "Servidor Torre Entry",
    price: 3200,
    tags: ["Escritório", "Backup"],
    promotional_badges: [],
    short_description: "Servidor torre para pequenas empresas",
    specifications: [
      { label: "Processador", value: "Intel Xeon E-2124" },
      { label: "Memória", value: "16GB ECC RAM" },
      { label: "Armazenamento", value: "2x 1TB SATA" },
      { label: "RAID", value: "RAID 1 integrado" }
    ]
  },
  {
    id: 8,
    category: "servidores",
    name: "Servidor Rack 1U",
    price: 4890,
    tags: ["Escritório", "Datacenter"],
    promotional_badges: [],
    short_description: "Servidor rack otimizado para datacenters",
    specifications: [
      { label: "Processador", value: "Intel Xeon Silver" },
      { label: "Memória", value: "32GB DDR4 ECC" },
      { label: "Armazenamento", value: "2x 480GB SSD" },
      { label: "Fonte", value: "Redundante" }
    ]
  },

  // ACESSÓRIOS
  {
    id: 9,
    category: "acessorios",
    name: "Teclado para PDV",
    price: 89,
    tags: ["Frente de Caixa", "Periféricos"],
    promotional_badges: [],
    short_description: "Teclado compacto resistente a líquidos",
    specifications: [
      { label: "Layout", value: "ABNT2 compacto" },
      { label: "Resistência", value: "A líquidos" },
      { label: "Interface", value: "USB" },
      { label: "Teclas", value: "Função programáveis" }
    ]
  },
  {
    id: 10,
    category: "acessorios",
    name: "Leitor de Código de Barras",
    price: 180,
    tags: ["Frente de Caixa", "Estoque"],
    promotional_badges: [],
    short_description: "Leitor CCD para códigos de barras",
    specifications: [
      { label: "Tecnologia", value: "CCD" },
      { label: "Interface", value: "USB" },
      { label: "Cabo", value: "2 metros" },
      { label: "Suporte", value: "Incluído" }
    ]
  },
  {
    id: 11,
    category: "acessorios",
    name: "Gaveta de Dinheiro",
    price: 145,
    tags: ["Frente de Caixa"],
    promotional_badges: [],
    short_description: "Gaveta metálica para dinheiro com trava",
    specifications: [
      { label: "Compartimentos moedas", value: "5" },
      { label: "Compartimentos notas", value: "4" },
      { label: "Trava", value: "Automática" },
      { label: "Interface", value: "RJ11" }
    ]
  },
  {
    id: 12,
    category: "acessorios",
    name: "No-break 1200VA",
    price: 320,
    tags: ["Escritório", "Proteção"],
    promotional_badges: [],
    short_description: "No-break interativo com proteção contra surtos",
    specifications: [
      { label: "Potência", value: "1200VA/660W" },
      { label: "Tomadas", value: "6" },
      { label: "Autonomia", value: "15min" },
      { label: "Display", value: "LCD" }
    ]
  },

  // REDE
  {
    id: 13,
    category: "rede",
    name: "Switch 8 Portas Gigabit",
    price: 185,
    tags: ["Escritório", "Conectividade"],
    promotional_badges: [],
    short_description: "Switch não gerenciável com 8 portas gigabit",
    specifications: [
      { label: "Portas", value: "8 portas 10/100/1000" },
      { label: "Configuração", value: "Plug and play" },
      { label: "Gabinete", value: "Metal" },
      { label: "Consumo", value: "Baixo" }
    ]
  },
  {
    id: 14,
    category: "rede",
    name: "Roteador Wi-Fi AC1200",
    price: 165,
    tags: ["Escritório", "Wi-Fi"],
    promotional_badges: [],
    short_description: "Roteador dual band para redes corporativas",
    specifications: [
      { label: "Wi-Fi", value: "AC1200" },
      { label: "Frequência", value: "Dual band 2.4/5GHz" },
      { label: "Antenas", value: "4 externas" },
      { label: "Controle", value: "Largura de banda" }
    ]
  }
];

// Função para obter produtos (dinâmica)
export const products = (): Product[] => {
  if (globalProducts.length === 0) {
    globalProducts = [...initialProducts];
  }
  return globalProducts;
};

// ============ SOLUTIONS DATABASE ============
export interface Solution {
  id: number;
  name: string;
  icon: any;
  tags: string[];
  short_description: string;
  long_description: string;
  features: string[];
  pdf_url: string;
  slug: string;
  max_pdvs?: number;
}

// Estado global para soluções
let globalSolutions: Solution[] = [];

// Dados iniciais das soluções
const initialSolutions: Solution[] = [
  {
    id: 1,
    name: "SG Sistemas",
    icon: Building2,
    tags: ["Mais Popular", "Varejo", "Serviços"],
    short_description: "Sistema completo para gestão empresarial com módulos financeiro, fiscal e comercial integrados para pequenas e médias empresas.",
    long_description: "O SG Sistemas é uma solução completa desenvolvida especificamente para pequenas e médias empresas que buscam automatizar e otimizar seus processos administrativos e comerciais. Com módulos integrados de gestão financeira, controle fiscal e comercial, o sistema oferece uma visão 360° do seu negócio, permitindo tomadas de decisão mais assertivas e ágeis. Desenvolvido com tecnologia moderna e interface intuitiva, o SG Sistemas se adapta às necessidades específicas de cada empresa, proporcionando eficiência e crescimento sustentável. Nossa plataforma conta com backup automático em nuvem, atualizações constantes e suporte técnico especializado, garantindo que sua empresa esteja sempre protegida e atualizada.",
    features: [
      "Gestão Financeira Completa",
      "Controle Fiscal Automatizado",
      "Módulo Comercial Integrado",
      "Relatórios Gerenciais",
      "Backup Automático em Nuvem",
      "Suporte Técnico Especializado",
      "Interface Intuitiva",
      "Integração com Bancos"
    ],
    pdf_url: "/pdfs/sg-sistemas.pdf",
    slug: "/solucoes/sg-sistemas",
    max_pdvs: 3
  },
  {
    id: 2,
    name: "Arpa Sistemas",
    icon: Truck,
    tags: ["Distribuidor", "Atacado"],
    short_description: "Solução especializada em distribuidoras e atacados com controle de estoque avançado e gestão de múltiplos pontos de venda.",
    long_description: "O Arpa Sistemas é uma plataforma robusta desenvolvida especialmente para empresas do setor de distribuição e atacado. Com funcionalidades avançadas de controle de estoque, gestão de múltiplos pontos de venda e integração com transportadoras, o sistema oferece total visibilidade da cadeia de suprimentos. A solução permite gerenciar complexas operações de distribuição, desde o recebimento de mercadorias até a entrega ao cliente final, com controle total sobre custos, margens e prazos.",
    features: [
      "Controle de Estoque Avançado",
      "Gestão de Múltiplos PDVs",
      "Integração com Transportadoras",
      "Controle de Rotas de Entrega",
      "Gestão de Comissões",
      "Relatórios de Performance",
      "Sistema de Precificação Dinâmica",
      "Portal do Cliente"
    ],
    pdf_url: "/pdfs/arpa-sistemas.pdf",
    slug: "/solucoes/arpa-sistemas",
    max_pdvs: 10
  },
  {
    id: 3,
    name: "Hiper Sistemas",
    icon: Store,
    tags: ["Recomendado", "Supermercados", "Varejo"],
    short_description: "Sistema robusto para supermercados e hipermercados com PDV integrado, controle fiscal e relatórios gerenciais completos.",
    long_description: "O Hiper Sistemas é uma solução completa e robusta desenvolvida especificamente para supermercados, hipermercados e grandes varejos. Com módulos integrados de PDV, gestão de estoque, controle fiscal e relatórios gerenciais avançados, o sistema suporta operações de grande volume com alta performance. A plataforma oferece recursos especializados como gestão de perecíveis, controle de validade, promoções automáticas e integração com balanças eletrônicas, proporcionando uma operação fluida e eficiente.",
    features: [
      "PDV de Alta Performance",
      "Gestão de Perecíveis",
      "Controle de Validade",
      "Promoções Automáticas",
      "Integração com Balanças",
      "Relatórios Gerenciais Avançados",
      "Controle Fiscal Completo",
      "Sistema de Fidelidade"
    ],
    pdf_url: "/pdfs/hiper-sistemas.pdf",
    slug: "/solucoes/hiper-sistemas",
    max_pdvs: 50
  },
  {
    id: 4,
    name: "RJK Sistemas",
    icon: ShoppingCart,
    tags: ["Varejo", "Serviços", "E-commerce"],
    short_description: "Plataforma moderna para comércio eletrônico e varejo com integração omnichannel e automação de processos.",
    long_description: "O RJK Sistemas é uma plataforma moderna e inovadora que integra perfeitamente o varejo físico e digital. Com funcionalidades omnichannel, automação de processos e integração com principais marketplaces, o sistema permite uma gestão unificada de todos os canais de venda. A solução oferece recursos avançados de e-commerce, gestão de campanhas de marketing, análise de dados e inteligência artificial para otimização de vendas e experiência do cliente.",
    features: [
      "Integração Omnichannel",
      "E-commerce Integrado",
      "Automação de Marketing",
      "Análise de Dados Avançada",
      "Integração com Marketplaces",
      "Sistema de CRM",
      "Gestão de Campanhas",
      "Inteligência Artificial"
    ],
    pdf_url: "/pdfs/rjk-sistemas.pdf",
    slug: "/solucoes/rjk-sistemas",
    max_pdvs: 20
  }
];

// Função para obter soluções (dinâmica)
export const solutions = (): Solution[] => {
  if (globalSolutions.length === 0) {
    globalSolutions = [...initialSolutions];
  }
  return globalSolutions;
};

// ============ HELPER FUNCTIONS ============
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products().filter(product => product.category === categoryId);
};

export const getProductById = (id: number): Product | undefined => {
  return products().find(product => product.id === id);
};

export const getSolutionById = (id: number): Solution | undefined => {
  return solutions().find(solution => solution.id === id);
};

export const getSolutionBySlug = (slug: string): Solution | undefined => {
  return solutions().find(solution => solution.slug === slug);
};

export const getProductsByTags = (tags: string[]): Product[] => {
  return products().filter(product => 
    product.tags.some(tag => tags.includes(tag))
  );
};

export const getSolutionsByTags = (tags: string[]): Solution[] => {
  return solutions().filter(solution => 
    solution.tags.some(tag => tags.includes(tag))
  );
};

// ============ ADMIN FUNCTIONS ============
export const addProduct = (product: Omit<Product, 'id'>): Product => {
  const currentProducts = products();
  const newId = Math.max(...currentProducts.map(p => p.id), 0) + 1;
  const newProduct = { ...product, id: newId };
  globalProducts.push(newProduct);
  console.log('[Database] Produto adicionado:', newProduct);
  return newProduct;
};

export const updateProduct = (id: number, updates: Partial<Product>): boolean => {
  const index = globalProducts.findIndex(p => p.id === id);
  if (index === -1) {
    console.error('[Database] Produto não encontrado para atualização:', id);
    return false;
  }
  globalProducts[index] = { ...globalProducts[index], ...updates };
  console.log('[Database] Produto atualizado:', globalProducts[index]);
  return true;
};

export const deleteProduct = (id: number): boolean => {
  const index = globalProducts.findIndex(p => p.id === id);
  if (index === -1) {
    console.error('[Database] Produto não encontrado para exclusão:', id);
    return false;
  }
  const deletedProduct = globalProducts.splice(index, 1)[0];
  console.log('[Database] Produto removido:', deletedProduct);
  return true;
};

export const addSolution = (solution: Omit<Solution, 'id'>): Solution => {
  const currentSolutions = solutions();
  const newId = Math.max(...currentSolutions.map(s => s.id), 0) + 1;
  const newSolution = { ...solution, id: newId };
  globalSolutions.push(newSolution);
  console.log('[Database] Solução adicionada:', newSolution);
  return newSolution;
};

export const updateSolution = (id: number, updates: Partial<Solution>): boolean => {
  const index = globalSolutions.findIndex(s => s.id === id);
  if (index === -1) {
    console.error('[Database] Solução não encontrada para atualização:', id);
    return false;
  }
  globalSolutions[index] = { ...globalSolutions[index], ...updates };
  console.log('[Database] Solução atualizada:', globalSolutions[index]);
  return true;
};

export const deleteSolution = (id: number): boolean => {
  const index = globalSolutions.findIndex(s => s.id === id);
  if (index === -1) {
    console.error('[Database] Solução não encontrada para exclusão:', id);
    return false;
  }
  const deletedSolution = globalSolutions.splice(index, 1)[0];
  console.log('[Database] Solução removida:', deletedSolution);
  return true;
};

// ============ DIAGNOSTIC QUESTIONS DATABASE ============
export interface DiagnosticQuestion {
  id: number;
  text: string;
  type: 'single' | 'multiple' | 'contact_form';
  options: Array<{
    text: string;
    value: string;
    icon?: string; // Nome do ícone Lucide
    skip_to?: number; // ID da próxima pergunta (para lógica condicional)
  }>;
  required: boolean;
  order: number;
  description?: string;
  condition?: string; // Condição para mostrar esta pergunta (ex: "ramo=Restaurante")
}

// Estado global para perguntas de diagnóstico
let globalQuestions: DiagnosticQuestion[] = [];

// Dados iniciais das perguntas de diagnóstico
const initialQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    text: "Para começar, qual o seu ramo de atuação?",
    type: "single",
    options: [
      { text: "🛒 Supermercado ou Mercadinho", value: "Supermercado ou Mercadinho", icon: "ShoppingCart" },
      { text: "🍔 Restaurante ou Lanchonete", value: "Restaurante ou Lanchonete", icon: "Utensils", skip_to: 2 },
      { text: "📦 Distribuidora ou Atacado", value: "Distribuidora ou Atacado", icon: "Package" },
      { text: "👕 Loja de Roupas e Calçados", value: "Loja de Roupas e Calçados", icon: "Shirt" },
      { text: "🥩 Açougue", value: "Açougue", icon: "Beef" },
      { text: "🥐 Padaria", value: "Padaria", icon: "Croissant", skip_to: 2 },
      { text: "🔩 Loja de Materiais de Construção", value: "Loja de Materiais de Construção", icon: "Hammer" },
      { text: "🛠️ Outro tipo de Loja ou Serviço", value: "Outro tipo de Loja ou Serviço", icon: "Wrench" }
    ],
    required: true,
    order: 1,
    description: "Identifica o segmento do negócio para direcionamento adequado"
  },
  {
    id: 2,
    text: "Entendido! E para seu estabelecimento, qual a prioridade?",
    type: "single",
    options: [
      { text: "⚡ Agilidade no Caixa e Balcão", value: "Agilidade no Caixa e Balcão", icon: "Zap" },
      { text: "🛵 Gestão de Mesas, Comandas e Delivery", value: "Gestão de Mesas, Comandas e Delivery", icon: "Truck" }
    ],
    required: true,
    order: 2,
    description: "Pergunta condicional para Restaurantes e Padarias",
    condition: "ramo=Restaurante ou Lanchonete,Padaria"
  },
  {
    id: 3,
    text: "Qual o porte da sua operação hoje?",
    type: "single",
    options: [
      { text: "Pequeno: 1 a 2 caixas (PDVs)", value: "Pequeno", icon: "Mouse" },
      { text: "Médio: 3 a 5 caixas (PDVs)", value: "Médio", icon: "Gauge" },
      { text: "Grande: Mais de 5 caixas (PDVs)", value: "Grande", icon: "BarChart3" },
      { text: "Interno: Não uso caixa, apenas gestão interna", value: "Interno", icon: "Cog" }
    ],
    required: true,
    order: 3,
    description: "Define o porte do negócio e necessidades de infraestrutura"
  },
  {
    id: 4,
    text: "No dia a dia, o que é mais valioso para você e sua equipe?",
    type: "single",
    options: [
      { 
        text: "Performance Máxima: Um sistema extremamente rápido e estável, que nunca trava, mesmo que a interface seja mais simples e direta.", 
        value: "Performance Máxima", 
        icon: "Zap" 
      },
      { 
        text: "Facilidade de Uso: Uma interface visualmente moderna e intuitiva, que seja muito fácil para qualquer funcionário aprender a usar rapidamente.", 
        value: "Facilidade de Uso", 
        icon: "Mouse" 
      }
    ],
    required: true,
    order: 4,
    description: "Identifica preferência entre performance e usabilidade"
  },
  {
    id: 5,
    text: "Como você imagina o acesso ao seu sistema de gestão?",
    type: "single",
    options: [
      { 
        text: "Acesso Local: Quero que tudo funcione apenas nos computadores da minha loja.", 
        value: "Acesso Local", 
        icon: "HardDrive" 
      },
      { 
        text: "Acesso de Qualquer Lugar (Nuvem): Preciso de flexibilidade para acessar meus dados de casa, do celular ou de qualquer lugar com internet.", 
        value: "Acesso de Qualquer Lugar (Nuvem)", 
        icon: "Cloud" 
      },
      { 
        text: "Preciso de Ajuda: Não tenho certeza, gostaria de uma recomendação.", 
        value: "Preciso de Ajuda", 
        icon: "HelpCircle" 
      }
    ],
    required: true,
    order: 5,
    description: "Define preferências de infraestrutura e acesso"
  },
  {
    id: 6,
    text: "Seu Diagnóstico Personalizado está Pronto!",
    type: "contact_form",
    options: [],
    required: true,
    order: 6,
    description: "Coleta de dados para envio do diagnóstico (Nome, Empresa, WhatsApp)"
  }
];

// Função para obter perguntas (dinâmica)
export const diagnosticQuestions = (): DiagnosticQuestion[] => {
  if (globalQuestions.length === 0) {
    globalQuestions = [...initialQuestions];
  }
  return globalQuestions;
};

// ============ DIAGNOSTIC ADMIN FUNCTIONS ============
export const addDiagnosticQuestion = (question: Omit<DiagnosticQuestion, 'id'>): DiagnosticQuestion => {
  const currentQuestions = diagnosticQuestions();
  const newId = Math.max(...currentQuestions.map(q => q.id), 0) + 1;
  const newQuestion = { ...question, id: newId };
  globalQuestions.push(newQuestion);
  console.log('[Database] Pergunta adicionada:', newQuestion);
  return newQuestion;
};

export const updateDiagnosticQuestion = (id: number, updates: Partial<DiagnosticQuestion>): boolean => {
  const index = globalQuestions.findIndex(q => q.id === id);
  if (index === -1) {
    console.error('[Database] Pergunta não encontrada para atualização:', id);
    return false;
  }
  globalQuestions[index] = { ...globalQuestions[index], ...updates };
  console.log('[Database] Pergunta atualizada:', globalQuestions[index]);
  return true;
};

export const deleteDiagnosticQuestion = (id: number): boolean => {
  const index = globalQuestions.findIndex(q => q.id === id);
  if (index === -1) {
    console.error('[Database] Pergunta não encontrada para exclusão:', id);
    return false;
  }
  const deletedQuestion = globalQuestions.splice(index, 1)[0];
  console.log('[Database] Pergunta removida:', deletedQuestion);
  return true;
};

// ============ RECOMMENDATIONS SYSTEM ============
export interface DiagnosticRule {
  questionId: number;
  expectedValue: string;
}

export interface Recommendation {
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

// Estado global das recomendações com PRIORIDADES
let globalRecommendations: Recommendation[] = [
  {
    id: 1,
    name: "Solução para Distribuidoras/Atacado",
    priority: 20, // MISSÃO 2: Prioridade mais alta para distribuidoras
    rules: [
      { questionId: 1, expectedValue: "Distribuidora ou Atacado" }
    ],
    recommendedSolutions: [2], // Arpa Sistemas (ID corrigido)
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
    recommendedSolutions: [1], // SG Sistemas (ID corrigido)
    recommendedProducts: [1, 5, 6],
    customTitle: "Máxima Performance Para Seu Negócio",
    customText: "Para quem prioriza performance máxima, o SG Sistemas oferece estabilidade extrema e velocidade incomparável.",
    isActive: true
  },
  {
    id: 3,
    name: "Solução para Facilidade de Uso - Grande Porte",
    priority: 25, // MISSÃO 2: Prioridade mais alta para teste
    rules: [
      { questionId: 4, expectedValue: "Facilidade de Uso" },
      { questionId: 3, expectedValue: "Grande" }
    ],
    recommendedSolutions: [3], // Hiper Sistemas (ID corrigido)
    recommendedProducts: [1, 2, 4, 7],
    customTitle: "Interface Moderna Para Grandes Operações",
    customText: "Para operações de grande porte que priorizam facilidade, o Hiper Sistemas combina interface moderna com recursos avançados.",
    isActive: true
  },
  {
    id: 4,
    name: "Solução para Facilidade de Uso - Pequeno Porte",
    priority: 10, // MISSÃO 2: Prioridade menor
    rules: [
      { questionId: 4, expectedValue: "Facilidade de Uso" },
      { questionId: 3, expectedValue: "Pequeno" }
    ],
    recommendedSolutions: [4], // RJK Sistemas
    recommendedProducts: [1, 4, 9],
    customTitle: "Solução Ideal Para Pequenos Negócios",
    customText: "Para pequenos negócios que priorizam facilidade de uso, o RJK Sistemas oferece a combinação perfeita entre simplicidade e eficiência.",
    isActive: true
  }
];

// Funções para gerenciar recomendações
export const getRecommendations = (): Recommendation[] => {
  return [...globalRecommendations];
};

export const addRecommendation = (recommendation: Omit<Recommendation, 'id'>): Recommendation => {
  const newId = Math.max(...globalRecommendations.map(r => r.id), 0) + 1;
  const newRecommendation = { ...recommendation, id: newId };
  globalRecommendations.push(newRecommendation);
  console.log('[Database] Recomendação adicionada:', newRecommendation);
  return newRecommendation;
};

export const updateRecommendation = (id: number, updates: Partial<Recommendation>): boolean => {
  const index = globalRecommendations.findIndex(r => r.id === id);
  if (index === -1) {
    console.error('[Database] Recomendação não encontrada para atualização:', id);
    return false;
  }
  globalRecommendations[index] = { ...globalRecommendations[index], ...updates };
  console.log('[Database] Recomendação atualizada:', globalRecommendations[index]);
  return true;
};

export const deleteRecommendation = (id: number): boolean => {
  const index = globalRecommendations.findIndex(r => r.id === id);
  if (index === -1) {
    console.error('[Database] Recomendação não encontrada para exclusão:', id);
    return false;
  }
  const deletedRecommendation = globalRecommendations.splice(index, 1)[0];
  console.log('[Database] Recomendação removida:', deletedRecommendation);
  return true;
};

// MISSÃO 2: ENGINE DE RECOMENDAÇÃO INTELIGENTE COM PRIORIDADES
export const findMatchingRecommendation = (quizAnswers: { [key: string]: string }): Recommendation | null => {
  console.log('[RecommendationEngine] 🚀 NOVA ENGINE: Procurando recomendação para:', quizAnswers);
  
  const activeRecommendations = globalRecommendations.filter(r => r.isActive);
  const matchingRecommendations: Recommendation[] = [];
  
  // ETAPA 1: Encontrar todas as recomendações que batem
  for (const recommendation of activeRecommendations) {
    let allRulesMatch = true;
    
    console.log(`[RecommendationEngine] Testando regra: ${recommendation.name} (Prioridade: ${recommendation.priority})`);
    
    for (const rule of recommendation.rules) {
      const questionId = rule.questionId;
      const expectedValue = rule.expectedValue;
      
      // Mapear ID da pergunta para nome do campo
      const fieldMap: { [key: number]: string } = {
        1: 'ramo',
        2: 'prioridade', 
        3: 'porte',
        4: 'prioridadeTecnica',
        5: 'acesso'
      };
      
      const fieldName = fieldMap[questionId];
      const actualValue = quizAnswers[fieldName];
      
      console.log('[RecommendationEngine] Verificando regra:', {
        questionId,
        fieldName,
        expectedValue,
        actualValue,
        matches: actualValue === expectedValue
      });
      
      if (actualValue !== expectedValue) {
        allRulesMatch = false;
        break;
      }
    }
    
    if (allRulesMatch) {
      console.log(`[RecommendationEngine] ✅ Regra compatível: ${recommendation.name}`);
      matchingRecommendations.push(recommendation);
    }
  }
  
  // ETAPA 2: Se não encontrou nenhuma, retorna null
  if (matchingRecommendations.length === 0) {
    console.log('[RecommendationEngine] ❌ Nenhuma recomendação específica encontrada');
    return null;
  }
  
  // ETAPA 3: Ordenar por prioridade (MAIOR prioridade primeiro) e retornar a primeira
  matchingRecommendations.sort((a, b) => b.priority - a.priority);
  
  const winnerRecommendation = matchingRecommendations[0];
  console.log(`[RecommendationEngine] 🏆 VENCEDORA: ${winnerRecommendation.name} (Prioridade: ${winnerRecommendation.priority})`);
  
  if (matchingRecommendations.length > 1) {
    console.log('[RecommendationEngine] 📊 Outras recomendações encontradas:', 
      matchingRecommendations.slice(1).map(r => `${r.name} (${r.priority})`));
  }
  
  return winnerRecommendation;
};