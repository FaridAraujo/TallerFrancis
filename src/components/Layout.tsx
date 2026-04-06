import { FileText, Plus, Settings, Wrench, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { View } from '../types'

interface Props {
  view: View
  onNavigate: (v: View) => void
  children: React.ReactNode
}

const nav = [
  { id: 'list',     label: 'Facturas',       icon: FileText },
  { id: 'create',   label: 'Nueva Factura',  icon: Plus },
  { id: 'settings', label: 'Configuración',  icon: Settings },
] as const

export default function Layout({ view, onNavigate, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-brand-black">
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 lg:hidden animate-fadeIn"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 flex flex-col bg-gradient-to-b from-brand-surface via-brand-surface to-brand-raised
          border-r border-brand-border shadow-2xl
          transform transition-all duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          backgroundImage: `
            linear-gradient(135deg, transparent 0%, rgba(192, 57, 43, 0.04) 100%),
            linear-gradient(to bottom, #1a1a1a, #242424)
          `
        }}
      >
        {/* Logo section with accent */}
        <div className="px-5 py-6 border-b border-brand-border bg-gradient-to-r from-brand-red/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-red blur opacity-50" />
              <div className="relative w-10 h-10 bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/50">
                <Wrench size={20} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-white truncate leading-tight tracking-tight">AutoPro</p>
              <p className="text-xs text-brand-burn font-medium leading-tight">Facturación</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {nav.map(({ id, label, icon: Icon }, i) => {
            const active = view === id
            return (
              <button
                key={id}
                onClick={() => { onNavigate(id as View); setOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-500 transition-all duration-200
                  text-left relative group overflow-hidden
                  ${active
                    ? 'bg-gradient-to-r from-brand-red to-brand-red/80 text-white shadow-lg shadow-brand-red/30'
                    : 'text-gray-400 hover:text-white'}
                `}
                style={{
                  animation: active ? `slideInRight 0.3s ease-out ${i * 50}ms backwards` : 'none'
                }}
              >
                {!active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <Icon size={17} className="relative z-10" strokeWidth={2} />
                <span className="relative z-10">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer with version */}
        <div className="px-5 py-4 border-t border-brand-border text-center">
          <p className="text-xs text-gray-600 font-mono tracking-widest">v1.0.0</p>
          <p className="text-[10px] text-brand-burn/60 mt-1 font-medium">OFFLINE MODE</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-brand-bg">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-brand-surface border-b border-brand-border shrink-0 shadow-sm">
          <button
            onClick={() => setOpen(true)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="text-sm font-bold text-white">AutoPro Taller</span>
          <div className="w-7" />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
