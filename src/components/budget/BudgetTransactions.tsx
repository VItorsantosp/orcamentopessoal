import { CATEGORY_COLORS } from '../../constants/categories'
import type { Transaction } from '../../types/transaction'

type Props = {
  transactions: Transaction[]
  filter: 'all' | 'income' | 'expense'
  setFilter: (filter: 'all' | 'income' | 'expense') => void
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  currency: (value: number) => string
}

function BudgetTransactions({
  transactions,
  filter,
  setFilter,
  onEdit,
  onDelete,
  currency,
}: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">Lançamentos</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Acompanhe tudo que entrou e saiu.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'income', label: 'Receitas' },
            { key: 'expense', label: 'Despesas' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as 'all' | 'income' | 'expense')}
              className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                filter === item.key
                  ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-950/40'
                  : 'border-white/10 bg-zinc-950/70 text-zinc-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 px-5 py-8 text-sm text-zinc-500">
            Nenhum lançamento encontrado.
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
              <div className="grid grid-cols-6 gap-4 bg-zinc-950/80 px-5 py-3 text-sm font-medium text-zinc-500">
                <span>Tipo</span>
                <span>Descrição</span>
                <span>Categoria</span>
                <span>Data</span>
                <span className="text-right">Valor</span>
                <span className="text-right">Ações</span>
              </div>

              <div className="divide-y divide-white/5 bg-zinc-900/40">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="px-5 py-4 transition hover:bg-white/[0.03]"
                  >
                    <div className="grid grid-cols-6 items-center gap-3">
                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            transaction.type === 'income'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                      </div>

                      <div className="font-medium text-white">
                        {transaction.description}
                      </div>

                      <div className="flex items-center gap-2 text-zinc-400">
  <span
    className="h-2.5 w-2.5 rounded-full"
    style={{
      backgroundColor:
        CATEGORY_COLORS[transaction.category] || '#a1a1aa',
    }}
  />
  {transaction.category}
</div>
                      <div className="text-zinc-500">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </div>

                      <div className="font-semibold text-right">
                        <span
                          className={
                            transaction.type === 'income'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }
                        >
                          {transaction.type === 'income' ? '+' : '-'}{' '}
                          {currency(transaction.amount)}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="text-xs text-blue-400 transition hover:text-blue-300"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="text-xs text-zinc-500 transition hover:text-rose-400"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 md:hidden">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          transaction.type === 'income'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>

                      <h4 className="mt-3 font-medium text-white">
                        {transaction.description}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
  <span
    className="h-2.5 w-2.5 rounded-full"
    style={{
      backgroundColor:
        CATEGORY_COLORS[transaction.category] || '#a1a1aa',
    }}
  />
  {transaction.category}
</div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          transaction.type === 'income'
                            ? 'text-emerald-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}{' '}
                        {currency(transaction.amount)}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs text-blue-300"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BudgetTransactions