import { CATEGORY_COLORS } from '../../constants/categories'
import type { ChartItem } from '../../types/transaction'

type Props = {
  chartData: ChartItem[]
  goals: Record<string, number>
  currency: (value: number) => string
  editingCategory: string | null
  draftValue: string
  setDraftValue: (value: string) => void
  onStartEdit: (category: string) => void
  onCancelEdit: () => void
  onSaveEdit: () => void
}

function BudgetGoals({
  chartData,
  goals,
  currency,
  editingCategory,
  draftValue,
  setDraftValue,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: Props) {
  const goalsData = Object.entries(goals).map(([category, goal]) => {
    const found = chartData.find((item) => item.name === category)
    const spent = found ? found.value : 0
    const progress = goal > 0 ? Math.min((spent / goal) * 100, 100) : 0
    const remaining = Math.max(goal - spent, 0)
    const exceeded = spent > goal

    return {
      category,
      goal,
      spent,
      progress,
      remaining,
      exceeded,
    }
  })

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">Metas por categoria</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Acompanhe quanto já foi gasto em relação ao limite definido.
        </p>
      </div>

      <div className="space-y-4">
        {goalsData.map((item) => (
          <div
            key={item.category}
            className="rounded-2xl border border-white/5 bg-zinc-950/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[item.category] || '#a1a1aa',
                  }}
                />
                <span className="font-medium text-white">{item.category}</span>
              </div>

              {editingCategory === item.category ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    className="w-24 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none"
                  />
                  <button
                    onClick={onSaveEdit}
                    className="rounded-xl bg-blue-600 px-3 py-2 text-xs text-white"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-300"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      item.exceeded ? 'text-rose-400' : 'text-zinc-300'
                    }`}
                  >
                    {currency(item.spent)} / {currency(item.goal)}
                  </span>
                  <button
                    onClick={() => onStartEdit(item.category)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Editar meta
                  </button>
                </div>
              )}
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full ${
                  item.exceeded ? 'bg-rose-500' : 'bg-blue-500'
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-zinc-500">
                {item.progress.toFixed(0)}% usado
              </span>
              <span className={item.exceeded ? 'text-rose-400' : 'text-zinc-500'}>
                {item.exceeded
                  ? `Ultrapassou ${currency(item.spent - item.goal)}`
                  : `Restam ${currency(item.remaining)}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BudgetGoals