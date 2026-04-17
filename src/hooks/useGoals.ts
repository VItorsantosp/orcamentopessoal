import toast from 'react-hot-toast'
import { useEffect, useMemo, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import { CATEGORIES } from '../constants/categories'
import { saveGoal } from '../services/goalService'

type UseGoalsProps = {
  user: User
}

export function useGoals({ user }: UseGoalsProps) {
  const [goals, setGoals] = useState<Record<string, number>>({})
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [draftValue, setDraftValue] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users', user.uid, 'goals'),
      (snapshot) => {
        const loadedGoals: Record<string, number> = {}

        snapshot.forEach((docItem) => {
          const data = docItem.data() as { category: string; value: number }
          loadedGoals[data.category] = data.value
        })

        setGoals(loadedGoals)
      }
    )

    return () => unsubscribe()
  }, [user.uid])

  const mergedGoals = useMemo(() => {
    const result: Record<string, number> = {}

    CATEGORIES.forEach((category) => {
      result[category] = goals[category] ?? 0
    })

    return result
  }, [goals])

  const startEditingGoal = (category: string) => {
    setEditingCategory(category)
    setDraftValue(String(mergedGoals[category] ?? 0))
  }

  const cancelEditingGoal = () => {
    setEditingCategory(null)
    setDraftValue('')
  }

  const saveEditingGoal = async () => {
  if (!editingCategory) return

  const numericValue = Number(draftValue)

  if (Number.isNaN(numericValue) || numericValue < 0) {
    toast.error('Valor inválido')
    return
  }

  try {
    await saveGoal(user.uid, editingCategory, numericValue)
    toast.success('Meta salva')
    cancelEditingGoal()
  } catch (error) {
    console.error(error)
    toast.error('Erro ao salvar meta')
  }
}

  return {
    goals: mergedGoals,
    editingCategory,
    draftValue,
    setDraftValue,
    startEditingGoal,
    cancelEditingGoal,
    saveEditingGoal,
  }
}