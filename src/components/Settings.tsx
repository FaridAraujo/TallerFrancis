import { useState, useRef } from 'react'
import { Save, Upload, X, Wrench } from 'lucide-react'
import { ShopConfig } from '../types'

interface Props {
  config: ShopConfig
  onSave: (c: ShopConfig) => void
}

const currencies = ['USD', 'EUR', 'MXN', 'COP', 'VES', 'ARS', 'CLP', 'PEN', 'BRL']

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
    if (file.size > 500_000) {
      alert('El logo no debe superar 500 KB')
      return
    }
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

  const label = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
  const field = 'mb-4'

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fadeIn">
      <div className="mb-8 animate-slideInRight" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-3xl font-black text-white tracking-tight">Configuración del Taller</h1>
        <p className="text-sm text-gray-500 mt-1 font-medium">Esta información aparece en todas las facturas</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Logo */}
        <div className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-lg border-2 border-brand-border p-6 mb-6 animate-fadeInUp shadow-lg"
          style={{ animationDelay: '0.15s' }}>
          <h2 className="text-xs font-black text-brand-red uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-red" />
            Logo del Taller
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg border border-brand-border bg-brand-raised flex items-center justify-center overflow-hidden shrink-0">
              {form.logo ? (
                <img src={form.logo} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <Wrench size={28} className="text-gray-600" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                  border border-brand-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
              >
                <Upload size={13} />
                Subir logo
              </button>
              {form.logo && (
                <button
                  type="button"
                  onClick={() => set('logo', undefined)}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <X size={12} />
                  Quitar logo
                </button>
              )}
              <p className="text-[11px] text-gray-600">PNG, JPG · Máx 500 KB</p>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>

        {/* Info */}
        <div className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-lg border-2 border-brand-border p-6 mb-6 animate-fadeInUp shadow-lg"
          style={{ animationDelay: '0.25s' }}>
          <h2 className="text-xs font-black text-brand-burn uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-gradient-to-b from-brand-burn to-brand-red" />
            Información del Taller
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <div className={`${field} sm:col-span-2`}>
              <label className={label}>Nombre del Taller *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Nombre de tu taller"
                required
              />
            </div>
            <div className={field}>
              <label className={label}>Teléfono</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className={field}>
              <label className={label}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="contacto@taller.com"
              />
            </div>
            <div className={`${field} sm:col-span-2`}>
              <label className={label}>Dirección</label>
              <input
                type="text"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="Calle, ciudad, estado, código postal"
              />
            </div>
            <div className={field}>
              <label className={label}>Sitio Web</label>
              <input
                type="text"
                value={form.website ?? ''}
                onChange={e => set('website', e.target.value)}
                placeholder="www.tu-taller.com"
              />
            </div>
            <div className={field}>
              <label className={label}>RIF / ID Fiscal</label>
              <input
                type="text"
                value={form.taxId ?? ''}
                onChange={e => set('taxId', e.target.value)}
                placeholder="J-12345678-9"
              />
            </div>
          </div>
        </div>

        {/* Facturación */}
        <div className="bg-gradient-to-br from-brand-surface to-brand-raised rounded-lg border-2 border-brand-border p-6 mb-8 animate-fadeInUp shadow-lg"
          style={{ animationDelay: '0.35s' }}>
          <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-1 h-4 bg-gray-600" />
            Configuración de Facturación
          </h2>
          <div className="grid grid-cols-2 gap-x-4">
            <div className={field}>
              <label className={label}>Impuesto por defecto (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.taxRate}
                onChange={e => set('taxRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className={field}>
              <label className={label}>Moneda</label>
              <select value={form.currency} onChange={e => set('currency', e.target.value)}>
                {currencies.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end animate-fadeInUp" style={{ animationDelay: '0.45s' }}>
          {saved && (
            <span className="text-sm text-green-400 font-bold uppercase tracking-widest">✓ Guardado</span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest
              bg-gradient-to-br from-brand-red to-brand-red/80
              hover:from-brand-red-h hover:to-brand-red
              text-white transition-all duration-200 shadow-lg shadow-brand-red/40
              hover:shadow-brand-red/60 hover:-translate-y-0.5"
          >
            <Save size={16} strokeWidth={2.5} />
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}
