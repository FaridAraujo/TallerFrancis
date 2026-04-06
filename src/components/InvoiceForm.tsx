import { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'
import { Invoice, Service, ShopConfig, View, CreateInvoiceData, InvoiceStatus, Language } from '../types'
import { todayISO, calcTotals, formatCurrency } from '../utils/format'
import ServiceTable from './ServiceTable'

interface Props {
  invoice?: Invoice
  shopConfig: ShopConfig
  onCreate?: (data: CreateInvoiceData) => Invoice
  onUpdate?: (id: string, updates: Partial<Invoice>) => void
  onNavigate: (v: View, id?: string) => void
}

function emptyService(): Service {
  return { id: `${Date.now()}`, description: '', quantity: 1, price: 0 }
}

interface FormState {
  clientName:   string
  clientPhone:  string
  clientEmail:  string
  vehicle:      string
  licensePlate: string
  date:         string
  dueDate:      string
  taxRate:      number
  services:     Service[]
  notes:        string
  status:       InvoiceStatus
  language:     Language
}

function initForm(inv: Invoice | undefined, cfg: ShopConfig): FormState {
  if (inv) {
    return {
      clientName:   inv.clientName,
      clientPhone:  inv.clientPhone  ?? '',
      clientEmail:  inv.clientEmail  ?? '',
      vehicle:      inv.vehicle      ?? '',
      licensePlate: inv.licensePlate ?? '',
      date:         inv.date,
      dueDate:      inv.dueDate      ?? '',
      taxRate:      inv.taxRate,
      services:     inv.services,
      notes:        inv.notes        ?? '',
      status:       inv.status,
      language:     inv.language,
    }
  }
  return {
    clientName:   '',
    clientPhone:  '',
    clientEmail:  '',
    vehicle:      '',
    licensePlate: '',
    date:         todayISO(),
    dueDate:      '',
    taxRate:      cfg.taxRate,
    services:     [emptyService()],
    notes:        '',
    status:       'draft',
    language:     'es',
  }
}

const statusOptions: { value: InvoiceStatus; label: string }[] = [
  { value: 'draft',     label: 'Borrador'  },
  { value: 'issued',    label: 'Emitida'   },
  { value: 'paid',      label: 'Pagada'    },
  { value: 'cancelled', label: 'Cancelada' },
]

export default function InvoiceForm({ invoice, shopConfig, onCreate, onUpdate, onNavigate }: Props) {
  const isEdit = Boolean(invoice)
  const [form, setForm] = useState<FormState>(() => initForm(invoice, shopConfig))
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setForm(initForm(invoice, shopConfig))
  }, [invoice?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  const totals = calcTotals(form.services, form.taxRate)

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.clientName.trim()) e.clientName = 'Requerido'
    const validServices = form.services.filter(s => s.description.trim())
    if (validServices.length === 0) e.services = 'Agrega al menos un servicio'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const clean = {
      ...form,
      services: form.services.filter(s => s.description.trim()),
    }

    if (isEdit && invoice && onUpdate) {
      onUpdate(invoice.id, clean)
      onNavigate('detail', invoice.id)
    } else if (onCreate) {
      const created = onCreate(clean)
      onNavigate('detail', created.id)
    }
  }

  const label = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
  const field = 'mb-4'

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="animate-slideInRight" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {isEdit ? `Editar ${invoice?.number}` : 'Nueva Factura'}
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {isEdit ? 'Modifica los datos y guarda los cambios' : 'Completa los datos del cliente y los servicios'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate(isEdit ? 'detail' : 'list', invoice?.id)}
          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-brand-hover/60 transition-colors"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Section: Cliente */}
        <div className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-lg border-2 border-brand-border p-6 mb-6 animate-fadeInUp shadow-lg"
          style={{ animationDelay: '0.15s', backgroundImage: 'linear-gradient(135deg, transparent, rgba(192,57,43,0.03))' }}>
          <h2 className="text-xs font-black text-brand-red uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-brand-red to-brand-burn" />
            Datos del Cliente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
            <div className={`${field} md:col-span-1`}>
              <label className={label}>Nombre / Empresa *</label>
              <input
                type="text"
                value={form.clientName}
                onChange={e => set('clientName', e.target.value)}
                placeholder="Nombre completo o empresa"
              />
              {errors.clientName && <p className="text-xs text-red-400 mt-1">{errors.clientName}</p>}
            </div>
            <div className={field}>
              <label className={label}>Teléfono</label>
              <input
                type="tel"
                value={form.clientPhone}
                onChange={e => set('clientPhone', e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className={field}>
              <label className={label}>Email</label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={e => set('clientEmail', e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
            <div className={field}>
              <label className={label}>Vehículo</label>
              <input
                type="text"
                value={form.vehicle}
                onChange={e => set('vehicle', e.target.value)}
                placeholder="Marca Modelo Año (ej. Toyota Corolla 2020)"
              />
            </div>
            <div className={field}>
              <label className={label}>Placa / Matrícula</label>
              <input
                type="text"
                value={form.licensePlate}
                onChange={e => set('licensePlate', e.target.value.toUpperCase())}
                placeholder="ABC-1234"
              />
            </div>
          </div>
        </div>

        {/* Section: Factura */}
        <div className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-lg border-2 border-brand-border p-6 mb-6 animate-fadeInUp shadow-lg"
          style={{ animationDelay: '0.25s', backgroundImage: 'linear-gradient(135deg, transparent, rgba(230,126,34,0.02))' }}>
          <h2 className="text-xs font-black text-brand-burn uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-brand-burn to-brand-red" />
            Datos de la Factura
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4">
            <div className={field}>
              <label className={label}>Fecha *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </div>
            <div className={field}>
              <label className={label}>Vencimiento</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
              />
            </div>
            <div className={field}>
              <label className={label}>Estado</label>
              <select value={form.status} onChange={e => set('status', e.target.value as InvoiceStatus)}>
                {statusOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className={field}>
              <label className={label}>Idioma PDF</label>
              <select value={form.language} onChange={e => set('language', e.target.value as Language)}>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className={field}>
              <label className={label}>Impuesto (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.taxRate}
                onChange={e => set('taxRate', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Section: Servicios */}
        <div className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-lg border-2 border-brand-border p-6 mb-6 animate-fadeInUp shadow-lg"
          style={{ animationDelay: '0.35s' }}>
          <h2 className="text-xs font-black text-brand-red uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-red" />
            Servicios
          </h2>
          {errors.services && (
            <p className="text-xs text-red-400 mb-3">{errors.services}</p>
          )}
          <ServiceTable
            services={form.services}
            currency={shopConfig.currency}
            onChange={s => set('services', s)}
          />

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal, shopConfig.currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Impuesto ({form.taxRate}%)</span>
                <span>{formatCurrency(totals.taxAmount, shopConfig.currency)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white border-t border-brand-border pt-2 mt-2">
                <span>TOTAL</span>
                <span className="text-brand-red">{formatCurrency(totals.total, shopConfig.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Notas */}
        <div className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-lg border-2 border-brand-border p-6 mb-8 animate-fadeInUp shadow-lg"
          style={{ animationDelay: '0.45s' }}>
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1 h-3 bg-gray-600" />
            Notas / Observaciones
          </h2>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            placeholder="Información adicional, condiciones de pago, garantía…"
            className="resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end animate-fadeInUp" style={{ animationDelay: '0.55s' }}>
          <button
            type="button"
            onClick={() => onNavigate(isEdit ? 'detail' : 'list', invoice?.id)}
            className="px-6 py-3 rounded-lg text-sm font-bold text-gray-400 uppercase tracking-widest
              border-2 border-brand-border hover:border-brand-burn hover:text-brand-burn
              transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest
              bg-gradient-to-br from-brand-red to-brand-red/80
              hover:from-brand-red-h hover:to-brand-red
              text-white transition-all duration-200 shadow-lg shadow-brand-red/40
              hover:shadow-brand-red/60 hover:-translate-y-0.5"
          >
            <Save size={16} strokeWidth={2.5} />
            {isEdit ? 'Guardar Cambios' : 'Crear Factura'}
          </button>
        </div>
      </form>
    </div>
  )
}
