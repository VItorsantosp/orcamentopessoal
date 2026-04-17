function Sidebar() {
  return (
    <aside className="border-b border-white/5 bg-zinc-950/90 backdrop-blur-xl lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-950/50">
            $
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Orçamento
            </h1>
            <p className="text-sm text-zinc-400">Controle financeiro pessoal</p>
          </div>
        </div>

        <nav className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-10 lg:grid-cols-1 lg:space-y-3 lg:gap-0">
          <button className="rounded-2xl border border-blue-500/30 bg-blue-600/90 px-4 py-3 text-left text-sm font-medium text-white shadow-lg shadow-blue-950/40 transition duration-200 hover:bg-blue-500">
            Dashboard
          </button>

          <button className="rounded-2xl border border-transparent px-4 py-3 text-left text-sm font-medium text-zinc-300 transition duration-200 hover:border-white/5 hover:bg-white/5 hover:text-white">
            Transações
          </button>

          <button className="rounded-2xl border border-transparent px-4 py-3 text-left text-sm font-medium text-zinc-300 transition duration-200 hover:border-white/5 hover:bg-white/5 hover:text-white">
            Categorias
          </button>

          <button className="rounded-2xl border border-transparent px-4 py-3 text-left text-sm font-medium text-zinc-300 transition duration-200 hover:border-white/5 hover:bg-white/5 hover:text-white">
            Metas
          </button>

          <button className="rounded-2xl border border-transparent px-4 py-3 text-left text-sm font-medium text-zinc-300 transition duration-200 hover:border-white/5 hover:bg-white/5 hover:text-white">
            Relatórios
          </button>
        </nav>

        <div className="mt-6 grid gap-4 lg:mt-8">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-4 transition duration-300 hover:border-blue-500/20 hover:bg-white/[0.07]">
            <p className="text-sm font-medium text-white">Resumo do mês</p>
            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                  <span>Meta mensal</span>
                  <span>78%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 w-[78%] rounded-full bg-blue-500" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
                  <span>Economia</span>
                  <span>54%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 w-[54%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-blue-600/15 to-zinc-900 p-4 shadow-lg shadow-black/20 transition duration-300 hover:border-blue-500/20">
            <p className="text-sm font-medium text-white">Modo foco</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Layout escuro, limpo e moderno para estudar, usar no dia a dia e
              mostrar em portfólio.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar