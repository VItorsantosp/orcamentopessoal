import type { FormState } from '../../types/transaction'
import { CATEGORIES } from '../../constants/categories'

type Props = {
  form: FormState
  setForm: (form: FormState) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  editing: boolean
  onCancel: () => void
}

function BudgetForm({ form, setForm, onSubmit, editing, onCancel }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {editing ? 'Editar lançamento' : 'Novo lançamento'}
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Adicione ou edite uma receita ou despesa.
          </p>
        </div>

        {editing && (
          <button
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:bg-white/5"
          >
            Cancelar
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-zinc-300">Tipo</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as any })
            }
            className="mt-1 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white"
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </div>

        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Descrição"
          className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white"
        />

          <select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white"
>
  <option value="">Selecione a categoria</option>
  {CATEGORIES.map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ))}
</select>

          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="Valor"
            className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white"
          />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white"
        />

        <button className="w-full rounded-2xl bg-blue-600 py-3 text-white">
          {editing ? 'Salvar' : 'Adicionar'}
        </button>
      </form>
    </div>
  )
}

export default BudgetForm