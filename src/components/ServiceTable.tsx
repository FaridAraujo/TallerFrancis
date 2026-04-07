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
    onChange(services.map(s => {
      if (s.id !== id) return s
      if (field === 'description') return { ...s, description: raw }
      const n = parseFloat(raw)
      return { ...s, [field]: isNaN(n) ? 0 : n }
    }))
  }

  function addRow() { onChange([...services, emptyRow()]) }
  function removeRow(id: string) {
    if (services.length === 1) return
    onChange(services.filter(s => s.id !== id))
  }

  const subtotal = services.reduce((sum, s) => sum + serviceSubtotal(s.quantity, s.price), 0)

  return (
    <div className="border border-line rounded overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_72px_116px_116px_36px] bg-raised border-b border-line">
        {['Descripción', 'Cant.', 'Precio unit.', 'Total', ''].map((h, i) => (
          <div
            key={i}
            className={`px-3 py-2.5 text-[11px] font-semibold text-metal-dim uppercase tracking-wider
              ${i === 1 ? 'text-center' : i >= 2 && i < 4 ? 'text-right' : 'text-left'}`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {services.map((s, i) => (
        <div
          key={s.id}
          className={`grid grid-cols-[1fr_72px_116px_116px_36px] items-center border-b border-line
            ${i % 2 === 0 ? 'bg-surface' : 'bg-raised/50'}`}
        >
          <div className="px-2 py-1">
            <input
              type="text"
              value={s.description}
              onChange={e => updateRow(s.id, 'description', e.target.value)}
              placeholder="Descripción del servicio"
              className="!border-0 !shadow-none !bg-transparent !rounded-none !px-1 !py-1.5 text-sm text-white placeholder:!text-metal-dim focus:!box-shadow-none"
            />
          </div>
          <div className="px-2 py-1">
            <input
              type="number" min="1" step="1" value={s.quantity}
              onChange={e => updateRow(s.id, 'quantity', e.target.value)}
              className="!border-0 !shadow-none !bg-transparent !rounded-none !px-1 !py-1.5 text-sm text-center text-white"
            />
          </div>
          <div className="px-2 py-1">
            <input
              type="number" min="0" step="0.01"
              value={s.price === 0 ? '' : s.price}
              onChange={e => updateRow(s.id, 'price', e.target.value)}
              placeholder="0.00"
              className="!border-0 !shadow-none !bg-transparent !rounded-none !px-1 !py-1.5 text-sm text-right text-white tabular-nums"
            />
          </div>
          <div className="px-3 py-1.5 text-right text-sm font-medium text-metal tabular-nums">
            {formatCurrency(serviceSubtotal(s.quantity, s.price), currency)}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => removeRow(s.id)}
              disabled={services.length === 1}
              className="p-1 text-metal-dim hover:text-accent-text disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      ))}

      {/* Add row */}
      <div className="px-3 py-2.5 border-b border-line bg-surface">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 text-xs font-medium text-accent-text hover:text-accent transition-colors"
        >
          <Plus size={13} strokeWidth={2.5} />
          Agregar línea
        </button>
      </div>

      {/* Subtotal */}
      <div className="flex items-center justify-end gap-6 px-4 py-3 bg-raised">
        <span className="text-[11px] font-semibold text-metal-dim uppercase tracking-wider">Subtotal</span>
        <span className="text-sm font-semibold text-white tabular-nums w-28 text-right">
          {formatCurrency(subtotal, currency)}
        </span>
      </div>
    </div>
  )
}
