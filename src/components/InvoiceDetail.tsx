import { Printer, Pencil, Trash2, ChevronLeft, Download } from 'lucide-react'
import { Invoice, ShopConfig, View } from '../types'
import { formatCurrency, formatDate, serviceSubtotal } from '../utils/format'
import InvoicePrint from './InvoicePrint'

interface Props {
  invoice: Invoice
  shopConfig: ShopConfig
  onNavigate: (v: View, id?: string) => void
  onDelete: (id: string) => void
}

const statusStyle: Record<Invoice['status'], { cls: string; label: string }> = {
  draft:     { cls: 'border border-line text-metal-dim bg-raised',              label: 'Borrador'  },
  issued:    { cls: 'border border-metal/30 text-metal bg-metal-faint',         label: 'Emitida'   },
  paid:      { cls: 'border border-white/15 text-white bg-white/5',             label: 'Pagada'    },
  cancelled: { cls: 'border border-accent/30 text-accent-text bg-accent-muted', label: 'Cancelada' },
}

export default function InvoiceDetail({ invoice, shopConfig, onNavigate, onDelete }: Props) {
  const { cls, label } = statusStyle[invoice.status]

  function handleDelete() {
    if (confirm(`¿Eliminar la factura ${invoice.number}? Esta acción no se puede deshacer.`)) {
      onDelete(invoice.id)
      onNavigate('list')
    }
  }

  function handleDownloadPDF() {
    const originalTitle = document.title
    document.title = invoice.number
    window.print()
    setTimeout(() => {
      document.title = originalTitle
    }, 100)
  }

  return (
    <>
      <InvoicePrint key={invoice.id} invoice={invoice} shopConfig={shopConfig} />

      <div className="no-print p-8 max-w-4xl mx-auto">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => onNavigate('list')}
            className="flex items-center gap-1.5 text-[13px] text-metal-dim hover:text-white transition-colors"
          >
            <ChevronLeft size={15} strokeWidth={2} />
            Volver a facturas
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded btn-silver"
            >
              <Download size={13} strokeWidth={1.75} />
              Descargar PDF
            </button>
            <button
              onClick={() => onNavigate('edit', invoice.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded btn-silver"
            >
              <Pencil size={13} strokeWidth={1.75} />
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded btn-red opacity-75 hover:opacity-100 transition-opacity"
            >
              <Trash2 size={13} strokeWidth={1.75} />
              Eliminar
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface border border-line rounded-xl overflow-hidden">
          {/* Red accent bar */}
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #c42b1e 0%, #8f1e13 100%)' }} />

          <div className="p-7">
            {/* Number + status */}
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-line">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#555f6d' }}>
                  Factura
                </p>
                <h1 className="text-[24px] font-semibold text-white font-mono tracking-tight leading-none">
                  {invoice.number}
                </h1>
              </div>
              <span className={`px-2.5 py-1 rounded text-[11.5px] font-semibold tracking-wide ${cls}`}>
                {label}
              </span>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6 pb-5 border-b border-line">
              {[
                {
                  label: 'Fecha',
                  value: formatDate(invoice.date, invoice.language),
                  sub: null,
                },
                ...(invoice.dueDate ? [{
                  label: 'Vencimiento',
                  value: formatDate(invoice.dueDate, invoice.language),
                  sub: null,
                }] : []),
                {
                  label: 'Cliente',
                  value: invoice.clientName,
                  sub: [invoice.clientId, invoice.clientPhone].filter(Boolean).join(' · ') || null,
                },
                ...(invoice.vehicle ? [{
                  label: 'Vehículo',
                  value: invoice.vehicle,
                  sub: invoice.licensePlate ?? null,
                  mono: true,
                }] : []),
              ].map(({ label: lbl, value, sub, mono }: any) => (
                <div key={lbl}>
                  <p className="text-[11px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#555f6d' }}>
                    {lbl}
                  </p>
                  <p className="text-[13px] font-medium text-white">{value}</p>
                  {sub && (
                    <p className={`text-[12px] text-metal mt-0.5 ${mono ? 'font-mono' : ''}`}>{sub}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#555f6d' }}>
                Servicios
              </p>
              <table className="w-full text-[13px] border border-line rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-raised border-b border-line">
                    <th className="px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#555f6d' }}>Descripción</th>
                    <th className="px-3.5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider w-16" style={{ color: '#555f6d' }}>Cant.</th>
                    <th className="px-3.5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider w-28" style={{ color: '#555f6d' }}>Precio</th>
                    <th className="px-3.5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider w-28" style={{ color: '#555f6d' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.services.map((s, i) => (
                    <tr key={s.id} className={`border-b border-line last:border-b-0 ${i % 2 === 1 ? 'bg-raised/30' : ''}`}>
                      <td className="px-3.5 py-2.5 text-white">{s.description}</td>
                      <td className="px-3.5 py-2.5 text-center text-metal tabular-nums">{s.quantity}</td>
                      <td className="px-3.5 py-2.5 text-right text-metal tabular-nums">{formatCurrency(s.price, shopConfig.currency)}</td>
                      <td className="px-3.5 py-2.5 text-right font-medium text-white tabular-nums">
                        {formatCurrency(serviceSubtotal(s.quantity, s.price), shopConfig.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-52 space-y-2">
                <div className="flex justify-between text-[13px] text-metal">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(invoice.subtotal, shopConfig.currency)}</span>
                </div>
                <div className="flex justify-between text-[13px] text-metal">
                  <span>Impuesto ({invoice.taxRate}%)</span>
                  <span className="tabular-nums">{formatCurrency(invoice.taxAmount, shopConfig.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold text-white pt-2.5 border-t border-line">
                  <span className="text-[13px]">Total</span>
                  <span className="tabular-nums text-accent-text text-[15px]">
                    {formatCurrency(invoice.total, shopConfig.currency)}
                  </span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="bg-raised border border-line rounded-lg p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#555f6d' }}>
                  Notas
                </p>
                <p className="text-[13px] text-metal whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] mt-2.5 text-right" style={{ color: '#3e4550' }}>
          Creada el {new Date(invoice.createdAt).toLocaleDateString()}
          {invoice.updatedAt !== invoice.createdAt &&
            ` · Actualizada el ${new Date(invoice.updatedAt).toLocaleDateString()}`}
        </p>
      </div>
    </>
  )
}
