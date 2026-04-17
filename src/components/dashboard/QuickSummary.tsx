function QuickSummary() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="text-xl font-semibold text-white">Resumo rápido</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Distribuição inicial do seu orçamento
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-300">Moradia</span>
            <span className="text-zinc-500">40%</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-800">
            <div className="h-3 w-[40%] rounded-full bg-blue-500" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-300">Lazer</span>
            <span className="text-zinc-500">22%</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-800">
            <div className="h-3 w-[22%] rounded-full bg-violet-500" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-300">Contas</span>
            <span className="text-zinc-500">18%</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-800">
            <div className="h-3 w-[18%] rounded-full bg-emerald-500" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-zinc-300">Outros</span>
            <span className="text-zinc-500">20%</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-800">
            <div className="h-3 w-[20%] rounded-full bg-rose-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickSummary