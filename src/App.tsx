import { useEffect, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import BudgetApp from './components/budget/BudgetApp'
import { auth, googleProvider } from './firebase'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoadingAuth(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Erro ao fazer login:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-zinc-300">
          Carregando autenticação...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-950/50">
              $
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">Orçamento</h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Entre com sua conta Google para acessar seu painel financeiro.
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="min-h-screen lg:flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <header className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-400/80">
                Visão geral
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                Seu painel financeiro
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Controle receitas, despesas e metas em um só lugar.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                <p className="font-medium text-white">
                  {user.displayName || 'Usuário'}
                </p>
                <p className="text-zinc-400">{user.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-2xl border border-white/10 bg-white/95 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-black/20 transition hover:bg-white"
              >
                Sair
              </button>
            </div>
          </header>

          <BudgetApp user={user} />
        </main>
      </div>
    </div>
  )
}

export default App