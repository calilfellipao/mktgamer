// Sistema de condições específicas por categoria
export interface Condition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'account' | 'skin' | 'giftcard' | 'service';
}

export const CONDITIONS_BY_CATEGORY: Record<string, Condition[]> = {
  account: [
    {
      id: 'verified_account',
      name: '✅ Conta Verificada',
      description: 'Conta verificada por email oficial',
      icon: '✅',
      category: 'account'
    },
    {
      id: 'original_email',
      name: '🔑 Email Original Incluso',
      description: 'Acesso ao email original da conta',
      icon: '🔑',
      category: 'account'
    },
    {
      id: 'no_bans',
      name: '🚫 Sem Banimentos',
      description: 'Conta limpa, sem histórico de bans',
      icon: '🚫',
      category: 'account'
    },
    {
      id: 'purchase_history',
      name: '📜 Com Histórico de Compras',
      description: 'Conta com histórico de compras no jogo',
      icon: '📜',
      category: 'account'
    },
    {
      id: 'immediate_access',
      name: '🔓 Acesso Imediato',
      description: 'Login direto sem senha temporária',
      icon: '🔓',
      category: 'account'
    }
  ],
  skin: [
    {
      id: 'brand_new',
      name: '🌟 Nova',
      description: 'Skin nunca utilizada',
      icon: '🌟',
      category: 'skin'
    },
    {
      id: 'reused',
      name: '♻️ Reutilizada',
      description: 'Skin já foi utilizada anteriormente',
      icon: '♻️',
      category: 'skin'
    },
    {
      id: 'rare_skin',
      name: '🛡️ Rara',
      description: 'Skin de raridade especial',
      icon: '🛡️',
      category: 'skin'
    },
    {
      id: 'limited_edition',
      name: '💎 Edição Limitada',
      description: 'Skin de evento ou edição limitada',
      icon: '💎',
      category: 'skin'
    }
  ],
  giftcard: [
    {
      id: 'valid_code',
      name: '🎁 Código 100% Válido',
      description: 'Gift card com código válido e ativo',
      icon: '🎁',
      category: 'giftcard'
    },
    {
      id: 'near_expiry',
      name: '⌛ Próximo de Expirar',
      description: 'Gift card próximo da data de expiração',
      icon: '⌛',
      category: 'giftcard'
    },
    {
      id: 'no_expiry',
      name: '♾️ Sem Expiração',
      description: 'Gift card sem data de expiração',
      icon: '♾️',
      category: 'giftcard'
    },
    {
      id: 'high_value',
      name: '💰 Alto Valor',
      description: 'Gift card de valor elevado',
      icon: '💰',
      category: 'giftcard'
    }
  ],
  service: [
    {
      id: 'immediate_delivery',
      name: '⏳ Prazo Imediato',
      description: 'Serviço executado imediatamente',
      icon: '⏳',
      category: 'service'
    },
    {
      id: 'scheduled_delivery',
      name: '📅 Entrega Agendada',
      description: 'Serviço com data e hora agendada',
      icon: '📅',
      category: 'service'
    },
    {
      id: 'guaranteed_result',
      name: '🎯 Resultado Garantido',
      description: 'Serviço com garantia de resultado',
      icon: '🎯',
      category: 'service'
    },
    {
      id: 'professional_service',
      name: '👨‍💼 Serviço Profissional',
      description: 'Executado por profissional experiente',
      icon: '👨‍💼',
      category: 'service'
    }
  ]
};

export class ConditionService {
  static getConditionsForCategory(category: string): Condition[] {
    return CONDITIONS_BY_CATEGORY[category] || [];
  }

  static getConditionById(id: string): Condition | undefined {
    for (const categoryConditions of Object.values(CONDITIONS_BY_CATEGORY)) {
      const condition = categoryConditions.find(c => c.id === id);
      if (condition) return condition;
    }
    return undefined;
  }

  static getAllConditions(): Condition[] {
    return Object.values(CONDITIONS_BY_CATEGORY).flat();
  }
}