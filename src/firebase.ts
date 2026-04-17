import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyA_TeF6Epw3y_6HmVqusx6z-NICPchAlEM",
  authDomain: "orcamento-pessoal-57f96.firebaseapp.com",
  projectId: "orcamento-pessoal-57f96",
  storageBucket: "orcamento-pessoal-57f96.firebasestorage.app",
  messagingSenderId: "81414554228",
  appId: "1:81414554228:web:0a04e928a15c05876fc721"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()