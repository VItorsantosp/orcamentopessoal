type InsightItem = {
  title: string
  description: string
  tone: 'blue' | 'emerald' | 'rose'
}

type Props = {
  insights: InsightItem[]
}

const toneClasses: Record<Props['insights'][number]['tone'], string> = {
  blue: 'border-blue-500/15 bg-blue-500/5 text-blue-300',
  emerald: 'border-emerald-500/15 bg-emerald-500/5 text-emerald-300',
  rose: 'border-rose-500/15 bg-rose-500/5 text-rose-300',
}

function BudgetInsights({ insights }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">Insights do mês</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Leitura rápida do seu comportamento financeiro.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className={`rounded-2xl border p-4 ${toneClasses[insight.tone]}`}
          >
            <p className="text-sm font-semibold text-white">{insight.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BudgetInsights