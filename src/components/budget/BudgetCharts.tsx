import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import type { ChartItem, Transaction } from '../../types/transaction'

type MonthlyItem = {
  name: string
  receitas: number
  despesas: number
}

type Props = {
  chartData: ChartItem[]
  monthlyData: MonthlyItem[]
  summaryExpense: number
  currency: (value: number) => string
  shortCurrency: (value: number) => string
}

const PIE_COLORS = [
  '#3b82f6',
  '#06b6d4',
  '#8b5cf6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#6366f1',
]

function BudgetCharts({
  chartData,
  monthlyData,
  summaryExpense,
  currency,
  shortCurrency,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Despesas por categoria
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Distribuição visual dos seus gastos.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-400">
            {chartData.length} categorias
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-zinc-500">
            Adicione despesas para visualizar o gráfico.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="flex justify-center overflow-x-auto">
              <PieChart width={280} height={280}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={2}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number) => currency(value)}
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </div>

            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-950/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-zinc-500">
                        {summaryExpense > 0
                          ? `${((item.value / summaryExpense) * 100).toFixed(1)}% do total`
                          : '0% do total'}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-zinc-200">
                    {currency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white">Visão mensal</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Compare receitas e despesas ao longo do tempo.
          </p>
        </div>

        {monthlyData.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-zinc-500">
            Adicione lançamentos para visualizar o gráfico mensal.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <BarChart
              width={Math.max(monthlyData.length * 90, 320)}
              height={320}
              data={monthlyData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis dataKey="name" stroke="#71717a" />
              <YAxis
                stroke="#71717a"
                tickFormatter={(value) => shortCurrency(Number(value))}
              />
              <Tooltip
                formatter={(value: number) => currency(value)}
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="receitas" radius={[8, 8, 0, 0]} fill="#10b981" />
              <Bar dataKey="despesas" radius={[8, 8, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetCharts