export const CATEGORIES = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Lazer',
  'Saúde',
  'Educação',
  'Serviços',
  'Trabalho',
  'Extra',
  'Investimentos',
  'Outros',
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  Moradia: '#3b82f6',
  Alimentação: '#10b981',
  Transporte: '#8b5cf6',
  Lazer: '#ec4899',
  Saúde: '#ef4444',
  Educação: '#f59e0b',
  Serviços: '#06b6d4',
  Trabalho: '#6366f1',
  Extra: '#14b8a6',
  Investimentos: '#22c55e',
  Outros: '#a1a1aa',
}

export const CATEGORY_GOALS: Record<string, number> = {
  Moradia: 1500,
  Alimentação: 800,
  Transporte: 400,
  Lazer: 300,
  Saúde: 250,
  Educação: 350,
  Serviços: 500,
  Trabalho: 300,
  Extra: 200,
  Investimentos: 1000,
  Outros: 250,
}