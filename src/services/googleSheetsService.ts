// Serviço para buscar dados diretamente do Google Sheets
export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private cache: Map<string, { data: any[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 1000; // 30 segundos para tempo real

  // URLs das planilhas Google Sheets
  private readonly SHEET_URLS = {
    admin_users: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1ez26BCRXWCNJK2oVLwFmPvkyud9BOuZz7o7EFAQzMz56WWqpQjkHMPzsxuhA5sdHL7x4ZzRRYw7u/pub?gid=822459661&single=true&output=csv',
    solucoes: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSFt9xAYTJLKR6rcSuZxj5teLxfOON_TtZy4zWxC8IOmSCg_y6BAt2SALQjpsV1YlFBmDQ7dVqZuuEl/pub?gid=1648471777&single=true&output=csv',
    categorias: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRi8IMrUCe6vH6_B3KNYXAGAHZ6QMWpcyrelf88Er2IGkiwZMF7jjOiPmDWnWk75k-ZJaWMaPrKiuDe/pub?gid=1973243438&single=true&output=csv',
    configuracoes: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtCGCRxdZ3c0tYpHp9A1zuM8ff4S1zA8wzVyprfD1peezLbsReK6d9sc6mLktI_Ecp4NbhqmVcmQm2/pub?gid=726228657&single=true&output=csv',
    produtos: 'https://docs.google.com/spreadsheets/d/1OZoCFqkqD-FLG7lOvCrEYWyWPL9Hk9M0DrK08zEAp_4/export?format=csv',
    leads: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXdEda1NWWWXGc41Q-JbxcT2tiSezMGuDKyjsZY6NH6pAhTPEnbxJ5jc91JJyZNb5N21UsGmYFT6ve/pub?gid=257823870&single=true&output=csv',
    recommendations: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRA7h6HF9ZRp8AHzjaJz28fVc8rf7M5MhyiwqROi7V8aYgu-x2keVBBzS_vIp7eyQgTou-x8GlY_vqc/pub?gid=776298054&single=true&output=csv',
    diagnostic_questions: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRc7yN86KNW7KLb0B4v4v0hH_hHeEWJNDk-em0sMW-ic1wyh3lggM5aseEwxC1f9P-U3HQkYqXzKH7Q/pub?gid=68235269&single=true&output=csv'
  };

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  private parseCSVToJSON(csvText: string): any[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }

    return data;
  }

  private parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current);
    return result;
  }

  private isCacheValid(tableName: string): boolean {
    const cached = this.cache.get(tableName);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < this.CACHE_DURATION;
  }

  async fetchTableData(tableName: keyof typeof this.SHEET_URLS, forceRefresh = false): Promise<any[]> {
    try {
      // Verifica cache primeiro
      if (!forceRefresh && this.isCacheValid(tableName)) {
        console.log(`[GoogleSheets] Usando cache para ${tableName}`);
        return this.cache.get(tableName)!.data;
      }

      const url = this.SHEET_URLS[tableName];
      if (!url) {
        throw new Error(`URL não encontrada para tabela: ${tableName}`);
      }

      console.log(`[GoogleSheets] Buscando dados de ${tableName}:`, url);

      let csvUrl = url;

      const response = await fetch(csvUrl, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const csvText = await response.text();
      const data = this.parseCSVToJSON(csvText);

      // Armazena no cache
      this.cache.set(tableName, {
        data,
        timestamp: Date.now()
      });

      // Armazena no localStorage como fallback
      localStorage.setItem(`sheets_${tableName}`, JSON.stringify(data));

      console.log(`[GoogleSheets] Dados de ${tableName} carregados:`, data.length, 'registros');
      return data;

    } catch (error) {
      console.error(`[GoogleSheets] Erro ao buscar ${tableName}:`, error);
      
      // Tenta recuperar do localStorage como fallback
      const fallbackData = localStorage.getItem(`sheets_${tableName}`);
      if (fallbackData) {
        console.log(`[GoogleSheets] Usando fallback do localStorage para ${tableName}`);
        try {
          return JSON.parse(fallbackData);
        } catch (parseError) {
          console.error(`[GoogleSheets] Erro ao parsear fallback:`, parseError);
        }
      }

      return [];
    }
  }

  async fetchAllData(forceRefresh = false): Promise<Record<string, any[]>> {
    const tables = Object.keys(this.SHEET_URLS) as (keyof typeof this.SHEET_URLS)[];
    const results: Record<string, any[]> = {};

    await Promise.all(
      tables.map(async (tableName) => {
        try {
          results[tableName] = await this.fetchTableData(tableName, forceRefresh);
        } catch (error) {
          console.error(`Erro ao buscar ${tableName}:`, error);
          results[tableName] = [];
        }
      })
    );

    return results;
  }

  // Método específico para autenticação de admin
  async authenticateAdmin(email: string, password: string): Promise<boolean> {
    try {
      const adminUsers = await this.fetchTableData('admin_users', true);
      console.log('[GoogleSheets] Admin users encontrados:', adminUsers);
      
      // Busca o usuário pelo email
      const user = adminUsers.find(u => 
        u.email?.toLowerCase() === email.toLowerCase() && 
        u.ativo?.toLowerCase() === 'true'
      );

      if (!user) {
        console.log('[GoogleSheets] Usuário não encontrado ou inativo');
        return false;
      }

      // Para desenvolvimento, aceita qualquer senha se o hash contém "dev"
      // Em produção, aqui você faria a verificação real do hash
      const isValid = user.password_hash?.includes('dev') || 
                     user.password_hash === password ||
                     password === 'admin123'; // Senha padrão para desenvolvimento

      console.log('[GoogleSheets] Autenticação:', isValid ? 'sucesso' : 'falhou');
      return isValid;

    } catch (error) {
      console.error('[GoogleSheets] Erro na autenticação:', error);
      return false;
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('[GoogleSheets] Cache limpo');
  }

  getCacheStatus(): Record<string, { cached: boolean; timestamp?: number }> {
    const status: Record<string, { cached: boolean; timestamp?: number }> = {};
    
    Object.keys(this.SHEET_URLS).forEach(tableName => {
      const cached = this.cache.get(tableName);
      status[tableName] = {
        cached: !!cached && this.isCacheValid(tableName),
        timestamp: cached?.timestamp
      };
    });

    return status;
  }
}

export const googleSheetsService = GoogleSheetsService.getInstance();