import { db } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

export async function saveGoal(userId: string, category: string, value: number) {
  return setDoc(
    doc(db, 'users', userId, 'goals', category),
    {
      category,
      value,
      userId,
    },
    { merge: true }
  )
}