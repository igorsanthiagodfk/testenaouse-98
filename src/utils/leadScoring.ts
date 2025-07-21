// Lead Scoring System para automação inteligente
export interface LeadScore {
  total: number;
  actions: LeadAction[];
  level: 'iniciante' | 'interessado' | 'especialista' | 'alta-intenção';
  lastUpdated: number;
}

export interface LeadAction {
  type: 'page_view' | 'quiz_completed' | 'pdf_download' | 'cta_click' | 'system_view' | 'demo_request';
  points: number;
  timestamp: number;
  details?: string;
}

export const LEAD_SCORING_RULES = {
  page_view: 1,
  system_view: 1,
  pdf_download: 2,
  cta_click: 3,
  quiz_completed: 5,
  demo_request: 8
} as const;

export const LEAD_LEVELS = {
  iniciante: { min: 0, max: 3, description: 'Visitante explorando' },
  interessado: { min: 4, max: 7, description: 'Usuário engajado' },
  especialista: { min: 8, max: 12, description: 'Lead qualificado' },
  'alta-intenção': { min: 13, max: 999, description: 'Pronto para conversão' }
} as const;

// Gerenciador de Lead Scoring
export class LeadScoringManager {
  private static readonly STORAGE_KEY = 'isti_lead_score';
  
  static getScore(): LeadScore {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Erro ao recuperar lead score:', e);
      }
    }
    
    return {
      total: 0,
      actions: [],
      level: 'iniciante',
      lastUpdated: Date.now()
    };
  }
  
  static addAction(type: LeadAction['type'], details?: string): LeadScore {
    const currentScore = this.getScore();
    const points = LEAD_SCORING_RULES[type];
    
    const newAction: LeadAction = {
      type,
      points,
      timestamp: Date.now(),
      details
    };
    
    currentScore.actions.push(newAction);
    currentScore.total += points;
    currentScore.level = this.calculateLevel(currentScore.total);
    currentScore.lastUpdated = Date.now();
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentScore));
    
    // Disparar eventos personalizados para notificações
    this.triggerScoreEvent(currentScore);
    
    return currentScore;
  }
  
  static calculateLevel(score: number): LeadScore['level'] {
    for (const [level, range] of Object.entries(LEAD_LEVELS)) {
      if (score >= range.min && score <= range.max) {
        return level as LeadScore['level'];
      }
    }
    return 'iniciante';
  }
  
  static triggerScoreEvent(score: LeadScore) {
    // Disparar evento customizado para componentes React
    window.dispatchEvent(new CustomEvent('leadScoreUpdate', {
      detail: score
    }));
    
    // Verificar se deve mostrar notificação
    if (score.total >= 6 && score.level === 'especialista') {
      this.triggerSpecialistNotification();
    }
  }
  
  static triggerSpecialistNotification() {
    window.dispatchEvent(new CustomEvent('showSpecialistNotification'));
  }
  
  static getSystemInterests(): string[] {
    const score = this.getScore();
    const systemViews = score.actions.filter(a => a.type === 'system_view');
    const systemCounts: Record<string, number> = {};
    
    systemViews.forEach(action => {
      if (action.details) {
        systemCounts[action.details] = (systemCounts[action.details] || 0) + 1;
      }
    });
    
    // Retornar sistemas com 2+ interações
    return Object.entries(systemCounts)
      .filter(([_, count]) => count >= 2)
      .map(([system, _]) => system);
  }
  
  static shouldShowPredictiveRecommendation(systemName: string): boolean {
    const interests = this.getSystemInterests();
    return interests.includes(systemName);
  }
  
  static trackPageView(pageName: string) {
    this.addAction('page_view', pageName);
  }
  
  static trackSystemView(systemName: string) {
    this.addAction('system_view', systemName);
  }
  
  static trackCTAClick(ctaName: string) {
    this.addAction('cta_click', ctaName);
  }
  
  static trackQuizCompleted(resultado: string) {
    this.addAction('quiz_completed', resultado);
  }
  
  static trackPDFDownload(pdfName: string) {
    this.addAction('pdf_download', pdfName);
  }
  
  static reset() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}