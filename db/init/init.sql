-- ISTI Solution Flow - Inicialização do Banco de Dados
-- Script executado automaticamente na inicialização do container PostgreSQL

-- =============================================
-- TABELA DE CATEGORIAS DE PRODUTOS
-- =============================================
CREATE TABLE IF NOT EXISTS product_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA DE PRODUTOS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    images TEXT[], -- Array de URLs de imagens
    tags TEXT[] NOT NULL DEFAULT '{}',
    promotional_badges TEXT[] NOT NULL DEFAULT '{}',
    short_description TEXT NOT NULL,
    long_description TEXT,
    specifications JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category) REFERENCES product_categories(id) ON DELETE CASCADE
);

-- =============================================
-- TABELA DE SOLUÇÕES
-- =============================================
CREATE TABLE IF NOT EXISTS solutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    pdf_url VARCHAR(500) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    max_pdvs INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA DE PERGUNTAS DO DIAGNÓSTICO
-- =============================================
CREATE TABLE IF NOT EXISTS diagnostic_questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('single', 'multiple', 'contact_form')) NOT NULL,
    options JSONB NOT NULL DEFAULT '[]',
    required BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL,
    description TEXT,
    condition_field VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA DE RECOMENDAÇÕES
-- =============================================
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    rules JSONB NOT NULL DEFAULT '[]',
    recommended_solutions INTEGER[] NOT NULL DEFAULT '{}',
    recommended_products INTEGER[] NOT NULL DEFAULT '{}',
    custom_title VARCHAR(300),
    custom_text TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA DE LEADS (Para Analytics)
-- =============================================
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    empresa VARCHAR(200) NOT NULL,
    ramo VARCHAR(200) NOT NULL,
    sistema_recomendado VARCHAR(200),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    pdf_baixado BOOLEAN DEFAULT false,
    whatsapp VARCHAR(20),
    quiz_answers JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABELA DE USUÁRIOS ADMIN
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(500) NOT NULL,
    name VARCHAR(200) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- POPULAÇÃO INICIAL - CATEGORIAS DE PRODUTOS
-- =============================================
INSERT INTO product_categories (id, name, icon, description) VALUES
('impressoras', 'Impressoras', 'Printer', 'Impressoras térmicas e matriciais para diversos usos comerciais'),
('computadores', 'Computadores', 'Monitor', 'Equipamentos PDV e computadores para automação comercial'),
('servidores', 'Servidores', 'Server', 'Servidores dedicados e soluções de infraestrutura'),
('acessorios', 'Acessórios', 'Keyboard', 'Periféricos e acessórios para automação comercial'),
('rede', 'Equipamentos de Rede', 'Router', 'Soluções completas de rede e conectividade')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POPULAÇÃO INICIAL - PRODUTOS
-- =============================================
INSERT INTO products (id, category, name, price, tags, promotional_badges, short_description, long_description, specifications) VALUES
-- IMPRESSORAS
(1, 'impressoras', 'Impressora Térmica 80mm', 280.00, '{"Ideal para Lojas", "Frente de Caixa"}', '{"Ideal para Varejo"}', 'Impressora térmica de alta velocidade para cupons fiscais', 'Impressora térmica profissional de 80mm com alta velocidade de impressão e cortador automático. Ideal para estabelecimentos comerciais que precisam de agilidade e confiabilidade no ponto de venda.', '[{"label": "Velocidade", "value": "250mm/s"}, {"label": "Interface", "value": "USB e Serial"}, {"label": "Papel", "value": "80mm"}, {"label": "Cortador automático", "value": "Sim"}]'),

(2, 'impressoras', 'Impressora Matricial 24 agulhas', 650.00, '{"Escritório", "Formulários"}', '{}', 'Impressora matricial robusta para formulários contínuos', 'Impressora matricial de 24 agulhas com alta durabilidade para impressão de formulários contínuos e documentos fiscais. Ideal para empresas que precisam de equipamentos robustos.', '[{"label": "Agulhas", "value": "24 agulhas"}, {"label": "Papel", "value": "Formulário contínuo"}, {"label": "Interface", "value": "Paralela e USB"}, {"label": "Durabilidade", "value": "Alta"}]'),

(3, 'impressoras', 'Impressora de Etiquetas', 450.00, '{"Estoque", "Códigos de Barras"}', '{}', 'Impressora térmica especializada em etiquetas e códigos de barras', '', '[{"label": "Resolução", "value": "203 DPI"}, {"label": "Largura", "value": "Até 104mm"}, {"label": "Interface", "value": "USB"}, {"label": "Software", "value": "Incluído"}]'),

-- COMPUTADORES
(4, 'computadores', 'PDV Touch Screen 15"', 1890.00, '{"Frente de Caixa", "Touch"}', '{"Mais Vendido"}', 'Terminal PDV completo com tela touchscreen', 'Terminal de ponto de venda completo com tela touchscreen de 15 polegadas. Solução all-in-one ideal para estabelecimentos que buscam modernidade e praticidade no atendimento.', '[{"label": "Tela", "value": "15\" touch capacitiva"}, {"label": "Processador", "value": "Intel J1900"}, {"label": "Memória", "value": "4GB RAM, 64GB SSD"}, {"label": "Sistema", "value": "Operacional incluso"}]'),

(5, 'computadores', 'Computador PDV Compacto', 1250.00, '{"Frente de Caixa", "Compacto"}', '{}', 'Mini PC especializado para pontos de venda', '', '[{"label": "Processador", "value": "Intel Celeron N3350"}, {"label": "Memória", "value": "4GB DDR3"}, {"label": "Armazenamento", "value": "SSD 120GB"}, {"label": "Portas", "value": "4 portas USB"}]'),

(6, 'computadores', 'All-in-One PDV 21.5"', 2450.00, '{"Frente de Caixa", "All-in-One"}', '{}', 'Solução completa all-in-one para PDV', '', '[{"label": "Tela", "value": "21.5\" Full HD"}, {"label": "Touch", "value": "10 pontos"}, {"label": "Processador", "value": "Intel Core i3"}, {"label": "Memória", "value": "8GB RAM, 256GB SSD"}]'),

-- SERVIDORES
(7, 'servidores', 'Servidor Torre Entry', 3200.00, '{"Escritório", "Backup"}', '{}', 'Servidor torre para pequenas empresas', '', '[{"label": "Processador", "value": "Intel Xeon E-2124"}, {"label": "Memória", "value": "16GB ECC RAM"}, {"label": "Armazenamento", "value": "2x 1TB SATA"}, {"label": "RAID", "value": "RAID 1 integrado"}]'),

(8, 'servidores', 'Servidor Rack 1U', 4890.00, '{"Escritório", "Datacenter"}', '{}', 'Servidor rack otimizado para datacenters', '', '[{"label": "Processador", "value": "Intel Xeon Silver"}, {"label": "Memória", "value": "32GB DDR4 ECC"}, {"label": "Armazenamento", "value": "2x 480GB SSD"}, {"label": "Fonte", "value": "Redundante"}]'),

-- ACESSÓRIOS
(9, 'acessorios', 'Teclado para PDV', 89.00, '{"Frente de Caixa", "Periféricos"}', '{}', 'Teclado compacto resistente a líquidos', '', '[{"label": "Layout", "value": "ABNT2 compacto"}, {"label": "Resistência", "value": "A líquidos"}, {"label": "Interface", "value": "USB"}, {"label": "Teclas", "value": "Função programáveis"}]'),

(10, 'acessorios', 'Leitor de Código de Barras', 180.00, '{"Frente de Caixa", "Estoque"}', '{}', 'Leitor CCD para códigos de barras', '', '[{"label": "Tecnologia", "value": "CCD"}, {"label": "Interface", "value": "USB"}, {"label": "Cabo", "value": "2 metros"}, {"label": "Suporte", "value": "Incluído"}]'),

(11, 'acessorios', 'Gaveta de Dinheiro', 145.00, '{"Frente de Caixa"}', '{}', 'Gaveta metálica para dinheiro com trava', '', '[{"label": "Compartimentos moedas", "value": "5"}, {"label": "Compartimentos notas", "value": "4"}, {"label": "Trava", "value": "Automática"}, {"label": "Interface", "value": "RJ11"}]'),

(12, 'acessorios', 'No-break 1200VA', 320.00, '{"Escritório", "Proteção"}', '{}', 'No-break interativo com proteção contra surtos', '', '[{"label": "Potência", "value": "1200VA/660W"}, {"label": "Tomadas", "value": "6"}, {"label": "Autonomia", "value": "15min"}, {"label": "Display", "value": "LCD"}]'),

-- REDE
(13, 'rede', 'Switch 8 Portas Gigabit', 185.00, '{"Escritório", "Conectividade"}', '{}', 'Switch não gerenciável com 8 portas gigabit', '', '[{"label": "Portas", "value": "8 portas 10/100/1000"}, {"label": "Configuração", "value": "Plug and play"}, {"label": "Gabinete", "value": "Metal"}, {"label": "Consumo", "value": "Baixo"}]'),

(14, 'rede', 'Roteador Wi-Fi AC1200', 165.00, '{"Escritório", "Wi-Fi"}', '{}', 'Roteador dual band para redes corporativas', '', '[{"label": "Wi-Fi", "value": "AC1200"}, {"label": "Frequência", "value": "Dual band 2.4/5GHz"}, {"label": "Antenas", "value": "4 externas"}, {"label": "Controle", "value": "Largura de banda"}]')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POPULAÇÃO INICIAL - SOLUÇÕES
-- =============================================
INSERT INTO solutions (id, name, icon, tags, short_description, long_description, features, pdf_url, slug, max_pdvs) VALUES
(1, 'SG Sistemas', 'Building2', '{"Mais Popular", "Varejo", "Serviços"}', 'Sistema completo para gestão empresarial com módulos financeiro, fiscal e comercial integrados para pequenas e médias empresas.', 'O SG Sistemas é uma solução completa desenvolvida especificamente para pequenas e médias empresas que buscam automatizar e otimizar seus processos administrativos e comerciais. Com módulos integrados de gestão financeira, controle fiscal e comercial, o sistema oferece uma visão 360° do seu negócio, permitindo tomadas de decisão mais assertivas e ágeis. Desenvolvido com tecnologia moderna e interface intuitiva, o SG Sistemas se adapta às necessidades específicas de cada empresa, proporcionando eficiência e crescimento sustentável. Nossa plataforma conta com backup automático em nuvem, atualizações constantes e suporte técnico especializado, garantindo que sua empresa esteja sempre protegida e atualizada.', '{"Gestão Financeira Completa", "Controle Fiscal Automatizado", "Módulo Comercial Integrado", "Relatórios Gerenciais", "Backup Automático em Nuvem", "Suporte Técnico Especializado", "Interface Intuitiva", "Integração com Bancos"}', '/pdfs/sg-sistemas.pdf', '/solucoes/sg-sistemas', 3),

(2, 'Arpa Sistemas', 'Truck', '{"Distribuidor", "Atacado"}', 'Solução especializada em distribuidoras e atacados com controle de estoque avançado e gestão de múltiplos pontos de venda.', 'O Arpa Sistemas é uma plataforma robusta desenvolvida especialmente para empresas do setor de distribuição e atacado. Com funcionalidades avançadas de controle de estoque, gestão de múltiplos pontos de venda e integração com transportadoras, o sistema oferece total visibilidade da cadeia de suprimentos. A solução permite gerenciar complexas operações de distribuição, desde o recebimento de mercadorias até a entrega ao cliente final, com controle total sobre custos, margens e prazos.', '{"Controle de Estoque Avançado", "Gestão de Múltiplos PDVs", "Integração com Transportadoras", "Controle de Rotas de Entrega", "Gestão de Comissões", "Relatórios de Performance", "Sistema de Precificação Dinâmica", "Portal do Cliente"}', '/pdfs/arpa-sistemas.pdf', '/solucoes/arpa-sistemas', 10),

(3, 'Hiper Sistemas', 'Store', '{"Recomendado", "Supermercados", "Varejo"}', 'Sistema robusto para supermercados e hipermercados com PDV integrado, controle fiscal e relatórios gerenciais completos.', 'O Hiper Sistemas é uma solução completa e robusta desenvolvida especificamente para supermercados, hipermercados e grandes varejos. Com módulos integrados de PDV, gestão de estoque, controle fiscal e relatórios gerenciais avançados, o sistema suporta operações de grande volume com alta performance. A plataforma oferece recursos especializados como gestão de perecíveis, controle de validade, promoções automáticas e integração com balanças eletrônicas, proporcionando uma operação fluida e eficiente.', '{"PDV de Alta Performance", "Gestão de Perecíveis", "Controle de Validade", "Promoções Automáticas", "Integração com Balanças", "Relatórios Gerenciais Avançados", "Controle Fiscal Completo", "Sistema de Fidelidade"}', '/pdfs/hiper-sistemas.pdf', '/solucoes/hiper-sistemas', 50),

(4, 'RJK Sistemas', 'ShoppingCart', '{"Varejo", "Serviços", "E-commerce"}', 'Plataforma moderna para comércio eletrônico e varejo com integração omnichannel e automação de processos.', 'O RJK Sistemas é uma plataforma moderna e inovadora que integra perfeitamente o varejo físico e digital. Com funcionalidades omnichannel, automação de processos e integração com principais marketplaces, o sistema permite uma gestão unificada de todos os canais de venda. A solução oferece recursos avançados de e-commerce, gestão de campanhas de marketing, análise de dados e inteligência artificial para otimização de vendas e experiência do cliente.', '{"Integração Omnichannel", "E-commerce Integrado", "Automação de Marketing", "Análise de Dados Avançada", "Integração com Marketplaces", "Sistema de CRM", "Gestão de Campanhas", "Inteligência Artificial"}', '/pdfs/rjk-sistemas.pdf', '/solucoes/rjk-sistemas', 20)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POPULAÇÃO INICIAL - PERGUNTAS DO DIAGNÓSTICO
-- =============================================
INSERT INTO diagnostic_questions (id, text, type, options, required, order_index, description, condition_field) VALUES
(1, 'Para começar, qual o seu ramo de atuação?', 'single', '[
    {"text": "🛒 Supermercado ou Mercadinho", "value": "Supermercado ou Mercadinho", "icon": "ShoppingCart"},
    {"text": "🍔 Restaurante ou Lanchonete", "value": "Restaurante ou Lanchonete", "icon": "Utensils", "skip_to": 2},
    {"text": "📦 Distribuidora ou Atacado", "value": "Distribuidora ou Atacado", "icon": "Package"},
    {"text": "👕 Loja de Roupas e Calçados", "value": "Loja de Roupas e Calçados", "icon": "Shirt"},
    {"text": "🥩 Açougue", "value": "Açougue", "icon": "Beef"},
    {"text": "🥐 Padaria", "value": "Padaria", "icon": "Croissant", "skip_to": 2},
    {"text": "🔩 Loja de Materiais de Construção", "value": "Loja de Materiais de Construção", "icon": "Hammer"},
    {"text": "🛠️ Outro tipo de Loja ou Serviço", "value": "Outro tipo de Loja ou Serviço", "icon": "Wrench"}
]', true, 1, 'Identifica o segmento do negócio para direcionamento adequado', null),

(2, 'Entendido! E para seu estabelecimento, qual a prioridade?', 'single', '[
    {"text": "⚡ Agilidade no Caixa e Balcão", "value": "Agilidade no Caixa e Balcão", "icon": "Zap"},
    {"text": "🛵 Gestão de Mesas, Comandas e Delivery", "value": "Gestão de Mesas, Comandas e Delivery", "icon": "Truck"}
]', true, 2, 'Pergunta condicional para Restaurantes e Padarias', 'ramo=Restaurante ou Lanchonete,Padaria'),

(3, 'Qual o porte da sua operação hoje?', 'single', '[
    {"text": "Pequeno: 1 a 2 caixas (PDVs)", "value": "Pequeno", "icon": "Mouse"},
    {"text": "Médio: 3 a 5 caixas (PDVs)", "value": "Médio", "icon": "Gauge"},
    {"text": "Grande: Mais de 5 caixas (PDVs)", "value": "Grande", "icon": "BarChart3"},
    {"text": "Interno: Não uso caixa, apenas gestão interna", "value": "Interno", "icon": "Cog"}
]', true, 3, 'Define o porte do negócio e necessidades de infraestrutura', null),

(4, 'No dia a dia, o que é mais valioso para você e sua equipe?', 'single', '[
    {"text": "Performance Máxima: Um sistema extremamente rápido e estável, que nunca trava, mesmo que a interface seja mais simples e direta.", "value": "Performance Máxima", "icon": "Zap"},
    {"text": "Facilidade de Uso: Uma interface visualmente moderna e intuitiva, que seja muito fácil para qualquer funcionário aprender a usar rapidamente.", "value": "Facilidade de Uso", "icon": "Mouse"}
]', true, 4, 'Identifica preferência entre performance e usabilidade', null),

(5, 'Como você imagina o acesso ao seu sistema de gestão?', 'single', '[
    {"text": "Acesso Local: Quero que tudo funcione apenas nos computadores da minha loja.", "value": "Acesso Local", "icon": "HardDrive"},
    {"text": "Acesso de Qualquer Lugar (Nuvem): Preciso de flexibilidade para acessar meus dados de casa, do celular ou de qualquer lugar com internet.", "value": "Acesso de Qualquer Lugar (Nuvem)", "icon": "Cloud"},
    {"text": "Preciso de Ajuda: Não tenho certeza, gostaria de uma recomendação.", "value": "Preciso de Ajuda", "icon": "HelpCircle"}
]', true, 5, 'Define preferências de infraestrutura e acesso', null),

(6, 'Seu Diagnóstico Personalizado está Pronto!', 'contact_form', '[]', true, 6, 'Coleta de dados para envio do diagnóstico (Nome, Empresa, WhatsApp)', null)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POPULAÇÃO INICIAL - RECOMENDAÇÕES
-- =============================================
INSERT INTO recommendations (id, name, priority, rules, recommended_solutions, recommended_products, custom_title, custom_text, is_active) VALUES
(1, 'Solução para Distribuidoras/Atacado', 20, '[{"questionId": 1, "expectedValue": "Distribuidora ou Atacado"}]', '{2}', '{1,2,3}', 'A Combinação Perfeita para Distribuidoras', 'Baseado no seu perfil de distribuidora/atacado, recomendamos o Arpa Sistemas, especializado em gestão de estoque e logística para grandes volumes.', true),

(2, 'Solução para Performance Máxima', 15, '[{"questionId": 4, "expectedValue": "Performance Máxima"}]', '{1}', '{1,5,6}', 'Máxima Performance Para Seu Negócio', 'Para quem prioriza performance máxima, o SG Sistemas oferece estabilidade extrema e velocidade incomparável.', true),

(3, 'Solução para Facilidade de Uso - Grande Porte', 25, '[{"questionId": 4, "expectedValue": "Facilidade de Uso"}, {"questionId": 3, "expectedValue": "Grande"}]', '{3}', '{1,2,4,7}', 'Interface Moderna Para Grandes Operações', 'Para operações de grande porte que priorizam facilidade, o Hiper Sistemas combina interface moderna com recursos avançados.', true),

(4, 'Solução para Facilidade de Uso - Pequeno Porte', 10, '[{"questionId": 4, "expectedValue": "Facilidade de Uso"}, {"questionId": 3, "expectedValue": "Pequeno"}]', '{4}', '{1,4,9}', 'Solução Ideal Para Pequenos Negócios', 'Para pequenos negócios que priorizam facilidade de uso, o RJK Sistemas oferece a combinação perfeita entre simplicidade e eficiência.', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- POPULAÇÃO INICIAL - USUÁRIO ADMIN
-- =============================================
-- Senha: password (hash bcrypt)
INSERT INTO admin_users (email, password_hash, name) VALUES
('admin@isti.com.br', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeliPgBQVIDjDl8KW', 'Administrador ISTI')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_solutions_slug ON solutions(slug);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_is_active ON recommendations(is_active);

-- =============================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA DE UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para todas as tabelas
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solutions_updated_at BEFORE UPDATE ON solutions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diagnostic_questions_updated_at BEFORE UPDATE ON diagnostic_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Script finalizado com sucesso
SELECT 'Database initialization completed successfully!' as status;