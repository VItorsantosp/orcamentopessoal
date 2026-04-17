import { useEffect, useMemo, useState } from 'react'
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

  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(selectedMonth)
    )
  }, [transactions, selectedMonth])

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

  const availableMonths = useMemo(() => {
  const monthsSet = new Set<string>()

  transactions.forEach((t) => {
    monthsSet.add(t.date.slice(0, 7))
  })

  return Array.from(monthsSet).sort().reverse()
}, [transactions])

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
      } else {
        await createTransaction(user.uid, form)
      }

      resetForm()
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const removeTransaction = async (id: string) => {
    try {
      await deleteTransactionService(id)
    } catch (error) {
      console.error('Erro ao deletar:', error)
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
  chartData,
  monthlyData,
  startEdit,
  resetForm,
  addTransaction,
  removeTransaction,
}
}