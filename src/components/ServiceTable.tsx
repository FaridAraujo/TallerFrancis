import { Plus, Trash2 } from 'lucide-react'
import { Service } from '../types'
import { formatCurrency, serviceSubtotal } from '../utils/format'

interface Props {
  services: Service[]
  currency?: string
  onChange: (services: Service[]) => void
}

function emptyRow(): Service {
  return {
    id:          `${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    description: '',
    quantity:    1,
    price:       0,
  }
}

export default function ServiceTable({ services, currency = 'USD', onChange }: Props) {
  function updateRow(id: string, field: keyof Service, raw: string) {
    onChange(
      services.map(s => {
        if (s.id !== id) return s
        if (field === 'description') return { ...s, description: raw }
        const n = parseFloat(raw)
        return { ...s, [field]: isNaN(n) ? 0 : n }
      })
    )
  }

  function addRow() {
    onChange([...services, emptyRow()])
  }

  function removeRow(id: string) {
    if (services.length === 1) return
    onChange(services.filter(s => s.id !== id))
  }

  const subtotal = services.reduce(
    (sum, s) => sum + serviceSubtotal(s.quantity, s.price),
    0
  )

  return (
    <div className="rounded-lg overflow-hidden border-2 border-brand-border shadow-lg">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_80px_110px_100px_36px] gap-0 bg-gradient-to-r from-brand-muted to-brand-border text-[11px] font-black uppercase tracking-widest text-gray-300 border-b-2 border-brand-border">
        <div className="px-4 py-3 flex items-center gap-2">
          <span className="w-0.5 h-4 bg-brand-red" />
          Descripción
        </div>
        <div className="px-3 py-3 text-center">Cant.</div>
        <div className="px-3 py-3 text-right">Precio Unit.</div>
        <div className="px-3 py-3 text-right">Total</div>
        <div />
      </div>

      {/* Rows */}
      {services.map((s, i) => (
        <div
          key={s.id}
          className={`grid grid-cols-[2fr_80px_110px_100px_36px] gap-0 items-center
            border-t-2 border-brand-border transition-colors duration-150 group
            ${i % 2 === 0 ? 'bg-brand-surface hover:bg-brand-surface/80' : 'bg-brand-raised hover:bg-brand-raised/80'}`}
        >
          <div className="px-2 py-1.5">
            <input
              type="text"
              value={s.description}
              onChange={e => updateRow(s.id, 'description', e.target.value)}
              placeholder="Descripción del servicio…"
              className="!border-0 !bg-transparent !rounded-none !px-1 !py-1 text-sm"
            />
          </div>
          <div className="px-2 py-1.5">
            <input
              type="number"
              min="1"
              step="1"
              value={s.quantity}
              onChange={e => updateRow(s.id, 'quantity', e.target.value)}
              className="!border-0 !bg-transparent !rounded-none !px-1 !py-1 text-sm text-center"
            />
          </div>
          <div className="px-2 py-1.5">
            <input
              type="number"
              min="0"
              step="0.01"
              value={s.price === 0 ? '' : s.price}
              onChange={e => updateRow(s.id, 'price', e.target.value)}
              placeholder="0.00"
              className="!border-0 !bg-transparent !rounded-none !px-1 !py-1 text-sm text-right"
            />
          </div>
          <div className="px-3 py-1.5 text-right text-sm text-gray-300">
            {formatCurrency(serviceSubtotal(s.quantity, s.price), currency)}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => removeRow(s.id)}
              disabled={services.length === 1}
              className="p-1.5 text-gray-600 hover:text-red-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}

      {/* Add row */}
      <div className="border-t-2 border-brand-border bg-gradient-to-r from-brand-surface to-brand-raised px-4 py-3">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 text-xs font-bold text-brand-red hover:text-brand-red-h
            transition-all duration-200 uppercase tracking-widest group"
        >
          <Plus size={14} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform" />
          Agregar Servicio
        </button>
      </div>

      {/* Subtotal footer */}
      <div className="border-t-2 border-brand-border bg-gradient-to-r from-brand-raised via-brand-muted to-brand-raised px-4 py-4 flex justify-end">
        <span className="text-xs font-black text-gray-500 uppercase tracking-widest mr-6">Subtotal</span>
        <span className="text-base font-black text-brand-burn w-32 text-right font-courier">
          {formatCurrency(subtotal, currency)}
        </span>
      </div>
    </div>
  )
}
