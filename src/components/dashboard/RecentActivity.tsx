function RecentActivity() {
  return (
    <div className="xl:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Atividade recente
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Últimos lançamentos do orçamento
          </p>
        </div>

        <button className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white">
          Ver tudo
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4">
          <div>
            <p className="font-medium text-white">Supermercado</p>
            <p className="text-sm text-zinc-400">Alimentação</p>
          </div>
          <span className="font-semibold text-rose-400">- R$ 180,00</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4">
          <div>
            <p className="font-medium text-white">Salário</p>
            <p className="text-sm text-zinc-400">Receita</p>
          </div>
          <span className="font-semibold text-emerald-400">+ R$ 3.500,00</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-zinc-950 p-4">
          <div>
            <p className="font-medium text-white">Internet</p>
            <p className="text-sm text-zinc-400">Serviços</p>
          </div>
          <span className="font-semibold text-rose-400">- R$ 120,00</span>
        </div>
      </div>
    </div>
  )
}

export default RecentActivity