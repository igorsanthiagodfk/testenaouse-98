// Dados de conteúdo da aplicação
// Arquivo criado para melhor organização e manutenibilidade

import { ShoppingCart, Coffee, Store, Utensils, Shirt, Building2 } from "lucide-react";

export const comercios = [
  { name: "Mercados", icon: ShoppingCart },
  { name: "Padarias", icon: Coffee },
  { name: "Distribuidoras", icon: Store },
  { name: "Açougues", icon: Utensils },
  { name: "Lojas de confecções", icon: Shirt },
];

export const clientes = [
  { 
    name: "Bom de Preço", 
    description: "Supermercado", 
    testimonial: "\"O sistema da I.S.T.I. triplicou nossa eficiência no caixa e reduziu drasticamente as filas. Nossos clientes notaram a diferença!\"",
    logo: "/placeholder.svg"
  },
  { 
    name: "Ideal", 
    description: "Atacado e Varejo", 
    testimonial: "\"Sistema nunca falha, suporte excepcional. Em 3 anos nunca tivemos problemas graves. A equipe responde em minutos!\"",
    logo: "/placeholder.svg"
  },
  { 
    name: "Showdecomprar", 
    description: "E-commerce", 
    testimonial: "\"Migração sem dor de cabeça, dados 100% seguros. Integramos estoque físico e online perfeitamente.\"",
    logo: "/placeholder.svg"
  },
  { 
    name: "Supermercado Veredas", 
    description: "Supermercado", 
    testimonial: "\"Controle de estoque e vendas em um só lugar! Conseguimos reduzir perdas em 40% no primeiro mês.\"",
    logo: "/placeholder.svg"
  },
  { 
    name: "Hortifruti Rapidin", 
    description: "Hortifruti", 
    testimonial: "\"Agilidade no caixa que impressiona os clientes. Vendas aumentaram 25% desde a implementação.\"",
    logo: "/placeholder.svg"
  }
];

export const differentials = [
  {
    icon: "Headphones",
    title: "Suporte Humanizado via WhatsApp",
    description: "Fale diretamente com especialistas e conte com nosso plantão para emergências."
  },
  {
    icon: "Server",
    title: "Infraestrutura 24/7",
    description: "Seu sistema no ar, sempre. Opções de servidores em nuvem de alta disponibilidade ou implementação local robusta."
  },
  {
    icon: "Users",
    title: "Consultoria Real",
    description: "Analisamos seu negócio a fundo antes de recomendar qualquer solução."
  }
];

// SEO Meta Tags para as páginas
export const seoData = {
  home: {
    title: "I.S.T.I Tecnologia - Sistema de Gestão para Comércio em Brasília",
    description: "Sistema de gestão 100% online para micro, pequenas e médias empresas. Software de automação comercial em Brasília-DF. Suporte especializado 24/7.",
    keywords: "sistema para comércio, automação comercial, software de gestão, sistema PDV, Brasília, sistema de vendas, controle de estoque",
    ogTitle: "Sistemas Ideais para seu Comércio - I.S.T.I Tecnologia",
    ogDescription: "Transforme seu negócio com sistemas de gestão profissionais. Consultoria gratuita e suporte humanizado em Brasília-DF.",
    canonical: "https://istitecnologia.com.br"
  },
  quiz: {
    title: "Diagnóstico Gratuito - Encontre o Sistema Ideal para seu Negócio",
    description: "Responda 5 perguntas simples e receba um diagnóstico personalizado com a solução completa para seu comércio. 100% gratuito.",
    keywords: "diagnóstico gratuito, sistema para comércio, consultoria, automação comercial, Brasília",
    ogTitle: "Diagnóstico Gratuito - Sistema Personalizado para seu Comércio",
    ogDescription: "Descubra qual sistema de gestão é perfeito para seu negócio. Diagnóstico rápido e gratuito.",
    canonical: "https://istitecnologia.com.br/quiz"
  },
  contato: {
    title: "Fale com Consultor - I.S.T.I Tecnologia Brasília",
    description: "Entre em contato com nossos especialistas em sistemas comerciais. Atendimento humanizado via WhatsApp. Consultoria gratuita.",
    keywords: "contato, consultor, suporte, sistema comercial, Brasília, WhatsApp",
    ogTitle: "Fale com Nossos Especialistas - I.S.T.I Tecnologia",
    ogDescription: "Tire suas dúvidas com nossos consultores especializados. Atendimento personalizado e gratuito.",
    canonical: "https://istitecnologia.com.br/contato"
  }
};