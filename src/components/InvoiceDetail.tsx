import { Printer, Pencil, Trash2, ArrowLeft, CheckCircle, Clock, XCircle, FileText } from 'lucide-react'
import { Invoice, ShopConfig, View } from '../types'
import { formatCurrency, formatDate, serviceSubtotal } from '../utils/format'
import InvoicePrint from './InvoicePrint'

interface Props {
  invoice: Invoice
  shopConfig: ShopConfig
  onNavigate: (v: View, id?: string) => void
  onDelete: (id: string) => void
}

const statusMeta: Record<Invoice['status'], { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  draft:     { label: 'Borrador',  color: 'text-gray-400',   bg: 'bg-gray-800/60',   icon: FileText    },
  issued:    { label: 'Emitida',   color: 'text-blue-400',   bg: 'bg-blue-900/40',   icon: Clock       },
  paid:      { label: 'Pagada',    color: 'text-green-400',  bg: 'bg-green-900/40',  icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'text-red-400',    bg: 'bg-red-900/30',    icon: XCircle     },
}

export default function InvoiceDetail({ invoice, shopConfig, onNavigate, onDelete }: Props) {
  const meta = statusMeta[invoice.status]
  const StatusIcon = meta.icon

  function handleDelete() {
    if (confirm(`¿Eliminar la factura ${invoice.number}? Esta acción no se puede deshacer.`)) {
      onDelete(invoice.id)
      onNavigate('list')
    }
  }

  function handlePrint() {
    window.print()
  }

  return (
    <>
      {/* ── Print template (hidden on screen, shown on print) ── */}
      <InvoicePrint invoice={invoice} shopConfig={shopConfig} />

      {/* ── Screen view ── */}
      <div className="no-print p-6 max-w-4xl mx-auto animate-fadeIn">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('list')}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-burn
              transition-all duration-200 uppercase tracking-widest"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
            Volver
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest
                bg-brand-raised border-2 border-brand-border text-gray-300
                hover:border-brand-burn hover:text-brand-burn transition-all duration-200"
            >
              <Printer size={16} strokeWidth={2} />
              PDF
            </button>
            <button
              onClick={() => onNavigate('edit', invoice.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest
                bg-brand-raised border-2 border-brand-border text-gray-300
                hover:border-brand-burn hover:text-brand-burn transition-all duration-200"
            >
              <Pencil size={16} strokeWidth={2} />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest
                bg-red-950/30 border-2 border-red-900/60 text-red-400
                hover:bg-red-900/50 hover:border-red-700 transition-all duration-200"
            >
              <Trash2 size={16} strokeWidth={2} />
              Eliminar
            </button>
          </div>
        </div>

        {/* Invoice card */}
        <div className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-xl border-2 border-brand-border overflow-hidden shadow-2xl">
          {/* Header strip with gradient */}
          <div className="h-2 bg-gradient-to-r from-brand-red-d via-brand-red via-brand-burn to-brand-red-h" />

          <div className="p-8">
            {/* Top: number + status */}
            <div className="flex items-start justify-between mb-8">
              <div className="animate-slideInRight" style={{ animationDelay: '0.1s' }}>
                <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-2">Número de Factura</p>
                <h1 className="text-5xl font-black text-white tracking-tighter font-courier">{invoice.number}</h1>
              </div>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.color}`}>
                <StatusIcon size={12} />
                {meta.label}
              </span>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-brand-border">
              <div>
                <p className="text-xs text-gray-500 mb-1">Fecha</p>
                <p className="text-sm font-medium text-white">{formatDate(invoice.date, invoice.language)}</p>
              </div>
              {invoice.dueDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Vencimiento</p>
                  <p className="text-sm font-medium text-white">{formatDate(invoice.dueDate, invoice.language)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">Cliente</p>
                <p className="text-sm font-medium text-white">{invoice.clientName}</p>
              </div>
              {invoice.vehicle && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Vehículo</p>
                  <p className="text-sm font-medium text-white">{invoice.vehicle}</p>
                </div>
              )}
              {invoice.licensePlate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Placa</p>
                  <p className="text-sm font-medium text-white tracking-wider">{invoice.licensePlate}</p>
                </div>
              )}
              {invoice.clientPhone && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                  <p className="text-sm font-medium text-white">{invoice.clientPhone}</p>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-brand-red uppercase tracking-widest mb-3">Servicios</h3>
              <div className="rounded-lg overflow-hidden border border-brand-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-muted text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-4 py-2.5 text-left">Descripción</th>
                      <th className="px-4 py-2.5 text-center">Cant.</th>
                      <th className="px-4 py-2.5 text-right">Precio</th>
                      <th className="px-4 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.services.map((s, i) => (
                      <tr key={s.id} className={`border-t border-brand-border ${i % 2 === 0 ? '' : 'bg-brand-raised/40'}`}>
                        <td className="px-4 py-2.5 text-gray-200">{s.description}</td>
                        <td className="px-4 py-2.5 text-center text-gray-400">{s.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-gray-400">{formatCurrency(s.price, shopConfig.currency)}</td>
                        <td className="px-4 py-2.5 text-right text-white font-medium">
                          {formatCurrency(serviceSubtotal(s.quantity, s.price), shopConfig.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-60 space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(invoice.subtotal, shopConfig.currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Impuesto ({invoice.taxRate}%)</span>
                  <span>{formatCurrency(invoice.taxAmount, shopConfig.currency)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white border-t border-brand-border pt-2">
                  <span>TOTAL</span>
                  <span className="text-brand-red text-lg">{formatCurrency(invoice.total, shopConfig.currency)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="bg-brand-raised rounded-lg p-4 border border-brand-border">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notas</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
