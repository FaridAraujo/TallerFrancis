import { useState, useEffect } from 'react'
import { Save, X, ChevronLeft } from 'lucide-react'
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

const CAR_BRANDS = [
  // Más comunes en Costa Rica
  'Toyota', 'Honda', 'Hyundai', 'Nissan', 'Chevrolet', 'Kia', 'Ford', 'Mazda',
  'Jeep', 'Mitsubishi', 'Suzuki', 'Subaru', 'Volkswagen',
  // Otros
  'Audi', 'BMW', 'Mercedes-Benz', 'Volvo', 'Land Rover', 'Dodge', 'RAM', 'Chrysler',
  'Fiat', 'Renault', 'Peugeot', 'Seat', 'Daihatsu', 'Hino', 'JAC', 'GAC', 'BYD',
  'Otro',
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1979 }, (_, i) => String(CURRENT_YEAR - i))

function parseVehicle(v: string): { brand: string; model: string; year: string } {
  if (!v) return { brand: '', model: '', year: '' }
  const parts = v.trim().split(/\s+/)
  const last = parts[parts.length - 1]
  const hasYear = /^\d{4}$/.test(last) && parseInt(last) >= 1980 && parseInt(last) <= CURRENT_YEAR + 1
  const year = hasYear ? last : ''
  const rest = hasYear ? parts.slice(0, -1) : parts
  if (rest.length === 0) return { brand: '', model: '', year }
  const potential = rest[0]
  if (CAR_BRANDS.includes(potential)) {
    return { brand: potential, model: rest.slice(1).join(' '), year }
  }
  return { brand: '', model: rest.join(' '), year }
}

interface FormState {
  clientName: string; clientId: string;
  phoneCountry: string; clientPhone: string; clientEmail: string
  vehicleBrand: string; vehicleCustomBrand: string; vehicleModel: string; vehicleYear: string
  licensePlate: string
  date: string; dueDate: string
  taxRate: number; services: Service[]
  notes: string; status: InvoiceStatus; language: Language
}

// Formato: "1-2345-6789" (cédula CR)
function formatClientId(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 10)
  if (clean.length <= 1) return clean
  if (clean.length <= 5) return clean.slice(0, 1) + '-' + clean.slice(1)
  return clean.slice(0, 1) + '-' + clean.slice(1, 5) + '-' + clean.slice(5)
}

// Formato: "8888-8888" (solo dígitos, sin código país)
function formatPhone(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 8)
  if (clean.length === 0) return ''
  if (clean.length <= 4) return clean
  return clean.slice(0, 4) + '-' + clean.slice(4)
}

// Formato: "ABC-123" (placa CR)
// Ordena automáticamente letras primero, números después
function formatPlate(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z0-9-]/g, '')

  // Extraer todas las letras y números
  const allLetters = clean.replace(/\d/g, '').slice(0, 3)
  const allNumbers = clean.replace(/[A-Z-]/g, '').slice(0, 3)

  if (!allNumbers) return allLetters
  return allLetters + '-' + allNumbers
}

function initForm(inv: Invoice | undefined, cfg: ShopConfig): FormState {
  if (inv) {
    const { brand, model, year } = parseVehicle(inv.vehicle ?? '')
    const isCustomBrand = brand === 'Otro' || (brand && !CAR_BRANDS.includes(brand))
    // Extraer país del teléfono
    const phone = inv.clientPhone ?? ''
    const phoneMatch = phone.match(/^\+(\d+)\s/)
    const country = phoneMatch ? '+' + phoneMatch[1] : '+506'
    const phoneDigits = phone.replace(/[^\d-]/g, '')
    return {
      clientName: inv.clientName, clientId: inv.clientId ?? '',
      phoneCountry: country, clientPhone: phoneDigits, clientEmail: inv.clientEmail ?? '',
      vehicleBrand: isCustomBrand ? 'Otro' : brand,
      vehicleCustomBrand: isCustomBrand ? brand : '',
      vehicleModel: model, vehicleYear: year,
      licensePlate: inv.licensePlate ?? '', date: inv.date,
      dueDate: inv.dueDate ?? '', taxRate: cfg.taxRate,
      services: inv.services, notes: inv.notes ?? '',
      status: inv.status, language: inv.language,
    }
  }
  return {
    clientName: '', clientId: '', phoneCountry: '+506', clientPhone: '', clientEmail: '',
    vehicleBrand: '', vehicleCustomBrand: '', vehicleModel: '', vehicleYear: '',
    licensePlate: '', date: todayISO(), dueDate: '',
    taxRate: cfg.taxRate, services: [emptyService()],
    notes: '', status: 'draft', language: 'es',
  }
}

const statusOptions: { value: InvoiceStatus; label: string }[] = [
  { value: 'draft', label: 'Borrador' }, { value: 'issued', label: 'Emitida' },
  { value: 'paid',  label: 'Pagada'  }, { value: 'cancelled', label: 'Cancelada' },
]

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold text-metal-dim uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-accent-text ml-0.5">*</span>}
    </label>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-line rounded-lg overflow-hidden mb-4">
      <div className="px-5 py-2.5 bg-raised border-b border-line">
        <h2 className="text-[11px] font-semibold text-metal uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

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

  const finalBrand = form.vehicleBrand === 'Otro' ? form.vehicleCustomBrand : form.vehicleBrand
  const vehicleString = [finalBrand, form.vehicleModel, form.vehicleYear]
    .filter(Boolean).join(' ')

  const totals = calcTotals(form.services, form.taxRate)

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.clientName.trim()) e.clientName = 'El nombre del cliente es requerido'
    if (!form.services.some(s => s.description.trim())) e.services = 'Agrega al menos un servicio'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function checkOptionalFields(): boolean {
    const missing: string[] = []
    if (!form.clientId.trim()) missing.push('Cédula del cliente')
    if (!form.clientPhone.trim()) missing.push('Teléfono del cliente')
    if (!form.vehicleBrand) missing.push('Marca del vehículo')
    if (form.vehicleBrand === 'Otro' && !form.vehicleCustomBrand.trim()) missing.push('Marca personalizada del vehículo')
    if (!form.vehicleModel.trim()) missing.push('Modelo del vehículo')
    if (!form.vehicleYear) missing.push('Año del vehículo')
    if (!form.licensePlate.trim()) missing.push('Placa del vehículo')

    if (missing.length === 0) return true

    const message = `Faltan los siguientes campos:\n\n${missing.join('\n')}\n\n¿Deseas continuar de todas formas?`
    return confirm(message)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    if (!checkOptionalFields()) return

    const phoneComplete = form.clientPhone ? `${form.phoneCountry} ${form.clientPhone}` : ''
    const data: CreateInvoiceData = {
      ...form,
      vehicle:  vehicleString || undefined,
      clientId: form.clientId.trim() || undefined,
      clientPhone: phoneComplete || undefined,
      services: form.services.filter(s => s.description.trim()),
    }
    if (isEdit && invoice && onUpdate) {
      onUpdate(invoice.id, data)
      onNavigate('detail', invoice.id)
    } else if (onCreate) {
      const created = onCreate(data)
      onNavigate('detail', created.id)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate(isEdit ? 'detail' : 'list', invoice?.id)}
            className="p-1 text-metal-dim hover:text-white transition-colors"
          >
            <ChevronLeft size={18} strokeWidth={2} />
          </button>
          <div>
            <h1 className="text-[17px] font-semibold text-white tracking-tight">
              {isEdit ? `Editar ${invoice?.number}` : 'Nueva Factura'}
            </h1>
            <p className="text-[12px] text-metal-dim mt-0.5">
              {isEdit ? 'Modifica los datos y guarda los cambios' : 'Completa los datos del cliente y los servicios'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate(isEdit ? 'detail' : 'list', invoice?.id)}
          className="p-1.5 text-metal-dim hover:text-white transition-colors"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Cliente ── */}
        <Section title="Datos del cliente">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label required>Nombre / Empresa</Label>
              <input
                type="text"
                value={form.clientName}
                onChange={e => set('clientName', e.target.value)}
                placeholder="Nombre completo o razón social"
              />
              {errors.clientName && <p className="text-[12px] text-accent-text mt-1">{errors.clientName}</p>}
            </div>
            <div>
              <Label>Cédula (CR)</Label>
              <input
                type="text"
                value={form.clientId}
                onChange={e => set('clientId', formatClientId(e.target.value))}
                placeholder="1-2345-6789"
                maxLength={12}
              />
              <p className="text-[11px] text-metal-dim mt-1">Formato: X-XXXX-XXXX</p>
            </div>
            <div className="md:col-span-1">
              <Label>Teléfono</Label>
              <div className="flex gap-2">
                <select
                  value={form.phoneCountry}
                  onChange={e => set('phoneCountry', e.target.value)}
                  className="flex-shrink-0 w-20"
                >
                  <option value="+506">+506 CR</option>
                  <option value="+502">+502 GT</option>
                  <option value="+503">+503 SV</option>
                  <option value="+504">+504 HN</option>
                  <option value="+505">+505 NI</option>
                  <option value="+507">+507 PA</option>
                  <option value="+1">+1 USA</option>
                  <option value="+52">+52 MX</option>
                </select>
                <div className="flex-1">
                  <input
                    type="text"
                    value={form.clientPhone}
                    onChange={e => set('clientPhone', formatPhone(e.target.value))}
                    placeholder="8888-8888"
                    maxLength={9}
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Email</Label>
              <input
                type="email"
                value={form.clientEmail}
                onChange={e => set('clientEmail', e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>
          </div>
        </Section>

        {/* ── Vehículo ── */}
        <Section title="Datos del vehículo">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Marca</Label>
              <select
                value={form.vehicleBrand}
                onChange={e => set('vehicleBrand', e.target.value)}
              >
                <option value="">— Seleccionar marca —</option>
                {CAR_BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {form.vehicleBrand === 'Otro' && (
              <div>
                <Label required>Especificar marca</Label>
                <input
                  type="text"
                  value={form.vehicleCustomBrand}
                  onChange={e => set('vehicleCustomBrand', e.target.value)}
                  placeholder="Ej. Tesla, Geely, etc."
                />
              </div>
            )}

            <div>
              <Label>Modelo</Label>
              <input
                type="text"
                value={form.vehicleModel}
                onChange={e => set('vehicleModel', e.target.value)}
                placeholder="Ej. Corolla, Civic, Tucson…"
              />
            </div>
            <div>
              <Label>Año</Label>
              <select
                value={form.vehicleYear}
                onChange={e => set('vehicleYear', e.target.value)}
              >
                <option value="">— Año —</option>
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Placa / Matrícula</Label>
              <div className="relative">
                <input
                  type="text"
                  value={form.licensePlate}
                  onChange={e => set('licensePlate', formatPlate(e.target.value))}
                  placeholder="ABC-123"
                  maxLength={7}
                />
                {/* Guión superpuesto en color claro */}
                {form.licensePlate.length >= 3 && !form.licensePlate.includes('-') && (
                  <span
                    className="absolute pointer-events-none"
                    style={{
                      left: '38px',
                      top: '7px',
                      color: '#6b7280',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '0.05em'
                    }}
                  >
                    -
                  </span>
                )}
              </div>
              <p className="text-[11px] text-metal-dim mt-1">3 letras - 3 números</p>
            </div>
            {vehicleString && (
              <div className="md:col-span-3 flex items-end pb-[7px]">
                <p className="text-[12px] text-metal-dim">
                  Vista previa: <span className="text-metal font-medium">{vehicleString}</span>
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* ── Factura ── */}
        <Section title="Datos de la factura">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label required>Fecha</Label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </div>
            <div>
              <Label>Vencimiento</Label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => set('dueDate', e.target.value)}
              />
            </div>
            <div>
              <Label>Estado</Label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value as InvoiceStatus)}
              >
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <Label>Idioma PDF</Label>
              <select
                value={form.language}
                onChange={e => set('language', e.target.value as Language)}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <p className="text-[12px] text-metal-dim">
              IVA aplicado: <span className="text-metal font-semibold">{form.taxRate}%</span>
            </p>
          </div>
        </Section>

        {/* ── Servicios ── */}
        <div className="bg-surface border border-line rounded-lg overflow-hidden mb-4">
          <div className="px-5 py-2.5 bg-raised border-b border-line">
            <h2 className="text-[11px] font-semibold text-metal uppercase tracking-widest">Servicios</h2>
          </div>
          <div className="p-6">
            {errors.services && <p className="text-[12px] text-accent-text mb-3">{errors.services}</p>}
            <ServiceTable
              services={form.services}
              currency={shopConfig.currency}
              onChange={s => set('services', s)}
            />
            <div className="mt-5 flex justify-end">
              <div className="w-56 space-y-2">
                <div className="flex justify-between text-[13px] text-metal">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatCurrency(totals.subtotal, shopConfig.currency)}</span>
                </div>
                <div className="flex justify-between text-[13px] text-metal">
                  <span>IVA ({form.taxRate}%)</span>
                  <span className="tabular-nums">{formatCurrency(totals.taxAmount, shopConfig.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold text-white pt-2.5 border-t border-line">
                  <span className="text-[13px]">Total</span>
                  <span className="tabular-nums text-accent-text text-[15px]">
                    {formatCurrency(totals.total, shopConfig.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Notas ── */}
        <Section title="Notas / Observaciones">
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
            placeholder="Condiciones de pago, garantía, observaciones…"
          />
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate(isEdit ? 'detail' : 'list', invoice?.id)}
            className="px-4 py-2 text-[13px] font-medium rounded btn-ghost"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded btn-red"
          >
            <Save size={14} strokeWidth={2.5} />
            {isEdit ? 'Guardar cambios' : 'Crear factura'}
          </button>
        </div>
      </form>
    </div>
  )
}
