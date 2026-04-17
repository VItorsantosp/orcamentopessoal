import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import type { Transaction, FormState, ChartItem } from '../types/transaction'
import {
  createTransaction,
  editTransaction,
  deleteTransaction as deleteTransactionService,
} from '../services/transactionService'

type UseTransactionsProps = {
  user: User
}

export function useTransactions({ user }: UseTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  const [form, setForm] = useState<FormState>({
    type: 'expense',
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  })

  useEffect(() => {
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const loadedTransactions: Transaction[] = snapshot.docs.map((docItem) => {
          const item = docItem.data() as Omit<Transaction, 'id'>

          return {
            id: docItem.id,
            ...item,
          }
        })

        setTransactions(loadedTransactions.reverse())
        setLoading(false)
      },
      (error) => {
        console.error('Erro ao carregar transações:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user.uid])

  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>()

    transactions.forEach((t) => {
      monthsSet.add(t.date.slice(0, 7))
    })

    return Array.from(monthsSet).sort().reverse()
  }, [transactions])

  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(selectedMonth)
    )
  }, [transactions, selectedMonth])

  const previousMonth = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const date = new Date(year, month - 2, 1)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }, [selectedMonth])

  const previousMonthTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(previousMonth)
    )
  }, [transactions, previousMonth])

  const summary = useMemo(() => {
    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0)

    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [monthTransactions])

  const previousSummary = useMemo(() => {
    const income = previousMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0)

    const expense = previousMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)

    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [previousMonthTransactions])

  const chartData = useMemo<ChartItem[]>(() => {
    const totals: Record<string, number> = {}

    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + t.amount
      })

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [monthTransactions])

  const monthlyData = useMemo(() => {
    const months: Record<string, { name: string; receitas: number; despesas: number }> = {}

    transactions.forEach((transaction) => {
      const date = new Date(`${transaction.date}T00:00:00`)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })

      if (!months[key]) {
        months[key] = {
          name: monthName.charAt(0).toUpperCase() + monthName.slice(1).replace('.', ''),
          receitas: 0,
          despesas: 0,
        }
      }

      if (transaction.type === 'income') {
        months[key].receitas += transaction.amount
      } else {
        months[key].despesas += transaction.amount
      }
    })

    return Object.values(months).slice(-6)
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return monthTransactions
    return monthTransactions.filter((t) => t.type === filter)
  }, [monthTransactions, filter])

  const insights = useMemo(() => {
    const topExpense = chartData[0]

    const expenseDiff = summary.expense - previousSummary.expense
    const incomeDiff = summary.income - previousSummary.income

    const items: Array<{
      title: string
      description: string
      tone: 'blue' | 'emerald' | 'rose'
    }> = []

    if (topExpense) {
      items.push({
        title: 'Maior categoria',
        description: `${topExpense.name} lidera seus gastos no mês com ${new Intl.NumberFormat(
          'pt-BR',
          { style: 'currency', currency: 'BRL' }
        ).format(topExpense.value)}.`,
        tone: 'blue',
      })
    } else {
      items.push({
        title: 'Sem despesas no mês',
        description: 'Você ainda não registrou despesas no período selecionado.',
        tone: 'blue',
      })
    }

    if (expenseDiff > 0) {
      items.push({
        title: 'Despesas subiram',
        description: `Você gastou ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(expenseDiff)} a mais que no mês anterior.`,
        tone: 'rose',
      })
    } else if (expenseDiff < 0) {
      items.push({
        title: 'Despesas caíram',
        description: `Você reduziu ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Math.abs(expenseDiff))} em relação ao mês anterior.`,
        tone: 'emerald',
      })
    } else {
      items.push({
        title: 'Despesas estáveis',
        description: 'Seu nível de gastos ficou praticamente igual ao mês anterior.',
        tone: 'blue',
      })
    }

    if (incomeDiff > 0) {
      items.push({
        title: 'Receita em alta',
        description: `Suas entradas cresceram ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(incomeDiff)} neste mês.`,
        tone: 'emerald',
      })
    } else if (incomeDiff < 0) {
      items.push({
        title: 'Receita menor',
        description: `Suas entradas ficaram ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(Math.abs(incomeDiff))} abaixo do mês anterior.`,
        tone: 'rose',
      })
    } else {
      items.push({
        title: 'Receita estável',
        description: 'Suas entradas ficaram no mesmo nível do mês anterior.',
        tone: 'blue',
      })
    }

    return items
  }, [chartData, summary.expense, summary.income, previousSummary.expense, previousSummary.income])

  const startEdit = (transaction: Transaction) => {
    setForm({
      type: transaction.type,
      description: transaction.description,
      category: transaction.category,
      amount: String(transaction.amount),
      date: transaction.date,
    })
    setEditingId(transaction.id)
  }

  const resetForm = () => {
    setForm({
      type: 'expense',
      description: '',
      category: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
    })
    setEditingId(null)
  }

  const addTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const amount = Number(form.amount)
    if (!form.description || !form.category || !amount || amount <= 0) return

    try {
      if (editingId) {
        await editTransaction(editingId, form)
        toast.success('Lançamento atualizado')
      } else {
        await createTransaction(user.uid, form)
        toast.success('Lançamento criado')
      }

      resetForm()
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar lançamento')
    }
  }

  const removeTransaction = async (id: string) => {
    try {
      await deleteTransactionService(id)
      toast.success('Lançamento removido')
    } catch (error) {
      console.error('Erro ao deletar:', error)
      toast.error('Erro ao deletar')
    }
  }

  return {
    transactions,
    monthTransactions,
    filteredTransactions,
    filter,
    setFilter,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    loading,
    form,
    setForm,
    editingId,
    summary,
    previousSummary,
    chartData,
    monthlyData,
    insights,
    startEdit,
    resetForm,
    addTransaction,
    removeTransaction,
  }
}