import { db } from '../firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import type { FormState } from '../types/transaction'

export async function createTransaction(userId: string, form: FormState) {
  const amount = Number(form.amount)

  return addDoc(collection(db, 'transactions'), {
    userId,
    type: form.type,
    description: form.description,
    category: form.category,
    amount,
    date: form.date,
  })
}

export async function editTransaction(id: string, form: FormState) {
  const amount = Number(form.amount)

  return updateDoc(doc(db, 'transactions', id), {
    type: form.type,
    description: form.description,
    category: form.category,
    amount,
    date: form.date,
  })
}

export async function deleteTransaction(id: string) {
  return deleteDoc(doc(db, 'transactions', id))
}