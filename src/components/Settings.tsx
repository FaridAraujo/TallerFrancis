import { useState, useRef } from 'react'
import { Save, Upload, X, Wrench } from 'lucide-react'
import { ShopConfig } from '../types'

interface Props {
  config: ShopConfig
  onSave: (c: ShopConfig) => void
}

const currencies = ['USD', 'EUR', 'MXN', 'COP', 'VES', 'ARS', 'CLP', 'PEN', 'BRL']

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold text-metal-dim uppercase tracking-wider mb-1.5">
      {children}
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

export default function Settings({ config, onSave }: Props) {
  const [form, setForm] = useState<ShopConfig>({ ...config })
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof ShopConfig>(key: K, val: ShopConfig[K]) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500_000) { alert('El logo no debe superar 500 KB'); return }
    const reader = new FileReader()
    reader.onload = ev => set('logo', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-white">Configuración del Taller</h1>
        <p className="text-xs text-metal-dim mt-0.5">Esta información aparece en todas las facturas generadas</p>
      </div>

      <form onSubmit={handleSubmit}>

        <Section title="Logo">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-line rounded bg-raised flex items-center justify-center overflow-hidden shrink-0">
              {form.logo
                ? <img src={form.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                : <Wrench size={22} className="text-metal-dim" strokeWidth={1.5} />
              }
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded btn-silver"
              >
                <Upload size={12} strokeWidth={2} />
                Subir imagen
              </button>
              {form.logo && (
                <button
                  type="button"
                  onClick={() => set('logo', undefined)}
                  className="flex items-center gap-1 text-xs text-accent-text hover:text-accent transition-colors"
                >
                  <X size={11} strokeWidth={2} />
                  Quitar logo
                </button>
              )}
              <p className="text-[11px] text-metal-dim">PNG, JPG, SVG · Máx. 500 KB</p>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </Section>

        <Section title="Información del taller">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Nombre del taller *</Label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre del taller" required />
            </div>
            <div>
              <Label>Teléfono</Label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <Label>Email</Label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contacto@taller.com" />
            </div>
            <div className="sm:col-span-2">
              <Label>Dirección</Label>
              <input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Dirección completa" />
            </div>
            <div>
              <Label>Sitio web</Label>
              <input type="text" value={form.website ?? ''} onChange={e => set('website', e.target.value)} placeholder="www.tu-taller.com" />
            </div>
            <div>
              <Label>RIF / ID Fiscal</Label>
              <input type="text" value={form.taxId ?? ''} onChange={e => set('taxId', e.target.value)} placeholder="J-12345678-9" />
            </div>
          </div>
        </Section>

        <Section title="Facturación">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Impuesto por defecto (%)</Label>
              <input
                type="number" min="0" max="100" step="0.1"
                value={form.taxRate}
                onChange={e => set('taxRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Moneda</Label>
              <select value={form.currency} onChange={e => set('currency', e.target.value)}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </Section>

        <div className="flex items-center justify-end gap-3">
          {saved && <span className="text-xs font-medium text-metal-light">Configuración guardada</span>}
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded btn-red"
          >
            <Save size={14} strokeWidth={2.5} />
            Guardar
          </button>
        </div>

      </form>
    </div>
  )
}
