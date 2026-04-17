function SummaryCards() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/20">
        <p className="text-sm text-zinc-400">Saldo total</p>
        <h3 className="mt-3 text-3xl font-bold text-white">R$ 8.450,00</h3>
        <p className="mt-2 text-sm text-emerald-400">+12% este mês</p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/20">
        <p className="text-sm text-zinc-400">Receitas</p>
        <h3 className="mt-3 text-3xl font-bold text-blue-400">R$ 5.200,00</h3>
        <p className="mt-2 text-sm text-zinc-500">Entradas registradas</p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/20">
        <p className="text-sm text-zinc-400">Despesas</p>
        <h3 className="mt-3 text-3xl font-bold text-rose-400">R$ 2.140,00</h3>
        <p className="mt-2 text-sm text-zinc-500">Saídas do período</p>
      </div>
    </section>
  )
}

export default SummaryCards