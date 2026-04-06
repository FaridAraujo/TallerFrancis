import { useState } from 'react'
import { Search, Plus, Eye, Pencil, Trash2, TrendingUp, FileText, CheckCircle, Clock } from 'lucide-react'
import { Invoice, View, InvoiceStatus } from '../types'
import { formatCurrency, formatDate } from '../utils/format'

interface Props {
  invoices: Invoice[]
  onNavigate: (v: View, id?: string) => void
  onDelete: (id: string) => void
}

const FILTERS: { value: InvoiceStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'Todas'     },
  { value: 'draft',     label: 'Borrador'  },
  { value: 'issued',    label: 'Emitidas'  },
  { value: 'paid',      label: 'Pagadas'   },
  { value: 'cancelled', label: 'Canceladas'},
]

const statusBadge: Record<InvoiceStatus, string> = {
  draft:     'bg-gray-800 text-gray-400 border-gray-700',
  issued:    'bg-blue-900/40 text-blue-400 border-blue-800/40',
  paid:      'bg-green-900/40 text-green-400 border-green-800/40',
  cancelled: 'bg-red-900/30 text-red-400 border-red-900/40',
}

const statusLabel: Record<InvoiceStatus, string> = {
  draft:     'Borrador',
  issued:    'Emitida',
  paid:      'Pagada',
  cancelled: 'Cancelada',
}

export default function InvoiceList({ invoices, onNavigate, onDelete }: Props) {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState<InvoiceStatus | 'all'>('all')

  const filtered = invoices.filter(inv => {
    const matchStatus = filter === 'all' || inv.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q
      || inv.number.toLowerCase().includes(q)
      || inv.clientName.toLowerCase().includes(q)
      || (inv.vehicle?.toLowerCase().includes(q) ?? false)
      || (inv.licensePlate?.toLowerCase().includes(q) ?? false)
    return matchStatus && matchSearch
  })

  const stats = {
    total:   invoices.length,
    issued:  invoices.filter(i => i.status === 'issued').length,
    paid:    invoices.filter(i => i.status === 'paid').length,
    revenue: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0),
  }

  function handleDelete(inv: Invoice) {
    if (confirm(`¿Eliminar ${inv.number}? Esta acción no se puede deshacer.`)) {
      onDelete(inv.id)
    }
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div className="animate-slideInRight" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl font-black text-white tracking-tight">Facturas</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">{invoices.length} factura{invoices.length !== 1 ? 's' : ''} en total</p>
        </div>
        <button
          onClick={() => onNavigate('create')}
          className="flex items-center gap-2 px-6 py-3 text-sm font-bold
            bg-gradient-to-br from-brand-red to-brand-red/80
            hover:from-brand-red-h hover:to-brand-red
            text-white transition-all duration-200 shadow-lg shadow-brand-red/40
            hover:shadow-brand-red/60 hover:-translate-y-0.5
            active:translate-y-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          Nueva Factura
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FileText,    label: "Total",    value: String(stats.total),   color: "from-gray-600 to-gray-700", accent: "text-gray-300" },
          { icon: Clock,       label: "Emitidas", value: String(stats.issued),  color: "from-blue-600 to-blue-700", accent: "text-blue-300" },
          { icon: CheckCircle, label: "Pagadas",  value: String(stats.paid),    color: "from-green-600 to-green-700", accent: "text-green-300" },
          { icon: TrendingUp,  label: "Ingresos", value: formatCurrency(stats.revenue), color: "from-brand-red to-brand-red-d", accent: "text-brand-burn" },
        ].map(({ icon: Icon, label, value, color, accent }, i) => (
          <div
            key={label}
            className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-lg border border-brand-border p-4
              shadow-lg overflow-hidden relative group hover:border-brand-burn/50 transition-all duration-200"
            style={{ animation: `fadeInUp 0.5s ease-out ${i * 80}ms backwards` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className={accent} strokeWidth={2} />
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{label}</span>
              </div>
              <p className={`text-2xl font-black ${accent} tracking-tight`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-slideInRight" style={{ animationDelay: '0.2s' }}>
        <div className="relative flex-1">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar factura, cliente, vehículo…"
            className="!pl-12 !rounded-lg !border-2 !border-brand-border !bg-brand-surface font-medium
              focus:!border-brand-red focus:!bg-brand-raised"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f, i) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200
                border-2 relative overflow-hidden group
                ${filter === f.value
                  ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/40'
                  : 'border-brand-border text-gray-400 hover:border-brand-burn hover:text-brand-burn'}`}
              style={{ animation: `fadeInUp 0.4s ease-out ${0.3 + i * 40}ms backwards` }}
            >
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {invoices.length === 0
              ? 'Aún no hay facturas. ¡Crea la primera!'
              : 'No se encontraron facturas con ese criterio.'}
          </p>
        </div>
      ) : (
        <div className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[130px_1fr_120px_120px_110px_auto] gap-0
            text-[11px] font-semibold uppercase tracking-widest text-gray-500 bg-brand-muted">
            <div className="px-4 py-3">Número</div>
            <div className="px-4 py-3">Cliente / Vehículo</div>
            <div className="px-4 py-3">Fecha</div>
            <div className="px-4 py-3 text-right">Total</div>
            <div className="px-4 py-3 text-center">Estado</div>
            <div className="px-4 py-3" />
          </div>

          {filtered.map((inv, i) => (
            <div
              key={inv.id}
              className={`
                border-t border-brand-border
                md:grid md:grid-cols-[130px_1fr_120px_120px_110px_auto]
                flex flex-col gap-2 p-4 md:p-0 md:gap-0 items-start
                hover:bg-brand-hover transition-colors cursor-pointer
                ${i === 0 ? 'border-t-0' : ''}
              `}
              onClick={() => onNavigate('detail', inv.id)}
            >
              <div className="md:px-4 md:py-3.5 flex items-center">
                <span className="font-mono text-sm font-bold text-brand-red">{inv.number}</span>
              </div>
              <div className="md:px-4 md:py-3.5">
                <p className="text-sm font-medium text-white truncate">{inv.clientName}</p>
                {inv.vehicle && <p className="text-xs text-gray-500 mt-0.5 truncate">{inv.vehicle}{inv.licensePlate ? ` · ${inv.licensePlate}` : ''}</p>}
              </div>
              <div className="md:px-4 md:py-3.5">
                <p className="text-sm text-gray-400">{formatDate(inv.date, inv.language)}</p>
              </div>
              <div className="md:px-4 md:py-3.5 md:text-right">
                <p className="text-sm font-semibold text-white">{formatCurrency(inv.total)}</p>
              </div>
              <div className="md:px-4 md:py-3.5 md:text-center">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge[inv.status]}`}>
                  {statusLabel[inv.status]}
                </span>
              </div>
              <div
                className="md:px-3 md:py-3 flex items-center gap-1"
                onClick={e => e.stopPropagation()}
              >
                <ActionBtn icon={Eye}    title="Ver"      onClick={() => onNavigate('detail', inv.id)} />
                <ActionBtn icon={Pencil} title="Editar"   onClick={() => onNavigate('edit', inv.id)} />
                <ActionBtn icon={Trash2} title="Eliminar" onClick={() => handleDelete(inv)} danger />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


function ActionBtn({ icon: Icon, title, onClick, danger }: {
  icon: typeof Eye
  title: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-md transition-colors
        ${danger
          ? 'text-gray-600 hover:text-red-400 hover:bg-red-950/40'
          : 'text-gray-600 hover:text-white hover:bg-brand-muted'}`}
    >
      <Icon size={14} />
    </button>
  )
}
