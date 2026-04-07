import { useState } from 'react'
import { Search, Plus, Eye, Pencil, Trash2, FileText, Clock, CheckCircle2, TrendingUp } from 'lucide-react'
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
  { value: 'issued',    label: 'Emitida'   },
  { value: 'paid',      label: 'Pagada'    },
  { value: 'cancelled', label: 'Cancelada' },
]

const statusStyle: Record<InvoiceStatus, { cls: string; label: string }> = {
  draft:     { cls: 'border border-line text-metal-dim bg-raised',              label: 'Borrador'  },
  issued:    { cls: 'border border-metal/30 text-metal bg-metal-faint',         label: 'Emitida'   },
  paid:      { cls: 'border border-white/15 text-white bg-white/5',             label: 'Pagada'    },
  cancelled: { cls: 'border border-accent/30 text-accent-text bg-accent-muted', label: 'Cancelada' },
}

export default function InvoiceList({ invoices, onNavigate, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all')

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

  const paid    = invoices.filter(i => i.status === 'paid')
  const issued  = invoices.filter(i => i.status === 'issued')
  const revenue = paid.reduce((s, i) => s + i.total, 0)

  function handleDelete(inv: Invoice) {
    if (confirm(`¿Eliminar ${inv.number}? Esta acción no se puede deshacer.`)) {
      onDelete(inv.id)
    }
  }

  const stats = [
    { label: 'Total',    value: String(invoices.length), note: 'facturas registradas', icon: FileText,     accent: false },
    { label: 'Emitidas', value: String(issued.length),   note: 'pendientes de cobro',  icon: Clock,        accent: false },
    { label: 'Pagadas',  value: String(paid.length),     note: 'facturas cobradas',    icon: CheckCircle2, accent: false },
    { label: 'Ingresos', value: formatCurrency(revenue), note: 'total cobrado',         icon: TrendingUp,   accent: true  },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-white tracking-tight">Facturas</h1>
          <p className="text-[13px] text-metal-dim mt-0.5">
            {invoices.length} {invoices.length === 1 ? 'factura registrada' : 'facturas registradas'}
          </p>
        </div>
        <button
          onClick={() => onNavigate('create')}
          className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold rounded-md btn-red"
        >
          <Plus size={15} strokeWidth={2.5} />
          Nueva Factura
        </button>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-7">
        {stats.map(({ label, value, note, icon: Icon, accent }) => (
          <div
            key={label}
            className="bg-surface border rounded-xl px-5 py-4 transition-colors"
            style={{
              borderColor: accent ? 'rgba(168,35,24,0.35)' : '#303030',
            }}
          >
            <div className="flex items-start justify-between mb-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#565e6b' }}>
                {label}
              </p>
              <Icon
                size={13}
                strokeWidth={1.5}
                style={{ color: accent ? 'rgba(212,64,48,0.45)' : 'rgba(100,110,125,0.45)', marginTop: '1px' }}
              />
            </div>
            <p className="text-[28px] font-bold text-white tracking-tight leading-none mb-1">
              {value}
            </p>
            <p className="text-[12px]" style={{ color: '#565e6b' }}>{note}</p>
          </div>
        ))}
      </div>

      {/* ── Table panel ── */}
      <div className="bg-surface border border-line rounded-xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center gap-4 px-5 py-3.5 border-b border-line bg-raised">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-metal-dim pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar factura, cliente, placa…"
              className="!pl-9 !py-[7px] !text-[13px] !bg-elevated !border-line hover:!border-lineh"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-2.5 py-1.5 text-[12px] font-medium rounded transition-colors
                  ${filter === f.value
                    ? 'btn-silver'
                    : 'text-metal-dim hover:text-white hover:bg-elevated'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 rounded-full bg-raised border border-line flex items-center justify-center">
              <FileText size={16} className="text-metal-dim" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] text-metal-dim">
              {invoices.length === 0
                ? 'Sin facturas. Usa "Nueva Factura" para crear la primera.'
                : 'Sin resultados para este filtro.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#555f6d' }}>Número</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#555f6d' }}>Cliente</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#555f6d' }}>Vehículo</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#555f6d' }}>Fecha</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#555f6d' }}>Total</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#555f6d' }}>Estado</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => {
                const { cls, label } = statusStyle[inv.status]
                return (
                  <tr
                    key={inv.id}
                    onClick={() => onNavigate('detail', inv.id)}
                    className={`border-b border-line cursor-pointer hover:bg-elevated transition-colors
                      ${i === filtered.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[12.5px] font-semibold text-accent-text">{inv.number}</span>
                    </td>
                    <td className="px-5 py-3.5 text-white font-medium">{inv.clientName}</td>
                    <td className="px-5 py-3.5 text-metal hidden md:table-cell">
                      {inv.vehicle
                        ? <>{inv.vehicle}{inv.licensePlate && <span className="ml-1.5 text-metal-dim">· {inv.licensePlate}</span>}</>
                        : <span className="text-metal-dim">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-metal tabular-nums hidden lg:table-cell">
                      {formatDate(inv.date, inv.language)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-white tabular-nums">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-[3px] rounded text-[11.5px] font-medium ${cls}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-0.5">
                        <IconBtn icon={Eye}    title="Ver"      onClick={() => onNavigate('detail', inv.id)} />
                        <IconBtn icon={Pencil} title="Editar"   onClick={() => onNavigate('edit', inv.id)} />
                        <IconBtn icon={Trash2} title="Eliminar" onClick={() => handleDelete(inv)} danger />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-[11px] mt-2.5 text-right" style={{ color: '#3e4550' }}>
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          {(filter !== 'all' || search) ? ` de ${invoices.length}` : ''}
        </p>
      )}
    </div>
  )
}

function IconBtn({ icon: Icon, title, onClick, danger }: {
  icon: typeof Eye; title: string; onClick: () => void; danger?: boolean
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors
        ${danger
          ? 'text-metal-dim hover:text-accent-text hover:bg-accent-muted'
          : 'text-metal-dim hover:text-white hover:bg-elevated'}`}
    >
      <Icon size={13} strokeWidth={1.75} />
    </button>
  )
}
