export type Transaction = {
  id: string
  userId: string
  type: 'income' | 'expense'
  description: string
  category: string
  amount: number
  date: string
}

export type FormState = {
  type: 'income' | 'expense'
  description: string
  category: string
  amount: string
  date: string
}

export type ChartItem = {
  name: string
  value: number
}