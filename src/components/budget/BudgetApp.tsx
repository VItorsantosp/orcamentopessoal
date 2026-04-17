import { useState } from 'react'
import type { User } from 'firebase/auth'
import { toPng } from 'html-to-image'
import toast from 'react-hot-toast'
import BudgetForm from './BudgetForm'
import BudgetCharts from './BudgetCharts'
import BudgetTransactions from './BudgetTransactions'
import BudgetGoals from './BudgetGoals'
import BudgetInsights from './BudgetInsights'
import { useTransactions } from '../../hooks/useTransactions'
import { useGoals } from '../../hooks/useGoals'
import { exportBudgetPdf } from '../../services/pdfService'

type BudgetAppProps = {
  user: User
}

function BudgetApp({ user }: BudgetAppProps) {
  const {
    filteredTransactions,
    filter,
    setFilter,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    loading,
    form,
    setForm,
    editingId,
    summary,
    chartData,
    monthlyData,
    insights,
    startEdit,
    resetForm,
    addTransaction,
    removeTransaction,
  } = useTransactions({ user })

  const {
    goals,
    editingCategory,
    draftValue,
    setDraftValue,
    startEditingGoal,
    cancelEditingGoal,
    saveEditingGoal,
  } = useGoals({ user })

  const [exportingPdf, setExportingPdf] = useState(false)

  const currency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)

  const shortCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)

  const balanceTone =
    summary.balance > 0
      ? 'text-emerald-400'
      : summary.balance < 0
        ? 'text-rose-400'
        : 'text-zinc-200'

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true)

      let chartImageDataUrl: string | undefined

      const chartNode = document.getElementById('budget-charts-export')

      if (chartNode) {
        chartImageDataUrl = await toPng(chartNode, {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: '#09090b',
        })
      }

      exportBudgetPdf({
        selectedMonth,
        summary,
        transactions: filteredTransactions,
        chartData,
        goals,
        chartImageDataUrl,
      })

      toast.success('PDF exportado')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao exportar PDF')
    } finally {
      setExportingPdf(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="h-[480px] animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="h-24 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
            <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
            <div className="h-36 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
          </div>
          <div className="h-56 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
          <div className="h-80 animate-pulse rounded-[28px] border border-white/10 bg-white/5" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="xl:col-span-1">
        <BudgetForm
          form={form}
          setForm={setForm}
          onSubmit={addTransaction}
          editing={!!editingId}
          onCancel={resetForm}
        />
      </div>

      <div className="xl:col-span-2 space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white">Filtro por mês</p>
              <p className="mt-1 text-sm text-zinc-400">
                Resumo, gráficos e lista seguem o mês selecionado.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-white outline-none focus:border-blue-500 sm:w-[220px]"
              >
                {(availableMonths.length > 0 ? availableMonths : [selectedMonth]).map(
                  (month) => (
                    <option key={month} value={month}>
                      {new Date(`${month}-01T00:00:00`).toLocaleDateString(
                        'pt-BR',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </option>
                  )
                )}
              </select>

              <button
                onClick={handleExportPdf}
                disabled={exportingPdf}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exportingPdf ? 'Exportando...' : 'Exportar PDF'}
              </button>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-emerald-500/10 bg-emerald-500/5 p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1">
            <p className="text-sm text-zinc-400">Entradas</p>
            <h3 className="mt-3 text-3xl font-bold text-emerald-400">
              {currency(summary.income)}
            </h3>
            <p className="mt-2 text-sm text-zinc-500">Receitas do mês</p>
          </div>

          <div className="rounded-[28px] border border-rose-500/10 bg-rose-500/5 p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1">
            <p className="text-sm text-zinc-400">Saídas</p>
            <h3 className="mt-3 text-3xl font-bold text-rose-400">
              {currency(summary.expense)}
            </h3>
            <p className="mt-2 text-sm text-zinc-500">Despesas do mês</p>
          </div>

          <div className="rounded-[28px] border border-blue-500/10 bg-blue-500/5 p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1">
            <p className="text-sm text-zinc-400">Saldo</p>
            <h3 className={`mt-3 text-3xl font-bold ${balanceTone}`}>
              {currency(summary.balance)}
            </h3>
            <p className="mt-2 text-sm text-zinc-500">Resultado do mês</p>
          </div>
        </section>

        <BudgetInsights insights={insights} />

        <BudgetCharts
          chartData={chartData}
          monthlyData={monthlyData}
          summaryExpense={summary.expense}
          currency={currency}
          shortCurrency={shortCurrency}
        />

        <BudgetGoals
          chartData={chartData}
          goals={goals}
          currency={currency}
          editingCategory={editingCategory}
          draftValue={draftValue}
          setDraftValue={setDraftValue}
          onStartEdit={startEditingGoal}
          onCancelEdit={cancelEditingGoal}
          onSaveEdit={saveEditingGoal}
        />

        <BudgetTransactions
          transactions={filteredTransactions}
          filter={filter}
          setFilter={setFilter}
          onEdit={startEdit}
          onDelete={removeTransaction}
          currency={currency}
        />
      </div>
    </div>
  )
}

export default BudgetApp