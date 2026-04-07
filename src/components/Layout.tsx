import { FileText, Plus, Menu, X, Settings } from 'lucide-react'
import { useState } from 'react'
import { View } from '../types'

interface Props {
  view: View
  onNavigate: (v: View) => void
  children: React.ReactNode
}

const nav = [
  { id: 'list',   label: 'Facturas',      icon: FileText },
  { id: 'create', label: 'Nueva Factura', icon: Plus },
] as const

export default function Layout({ view, onNavigate, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {open && (
        <div className="fixed inset-0 bg-black/70 z-20 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-56 flex flex-col
          bg-nav-bg border-r border-nav-border
          transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top accent stripe */}
        <div className="h-[2px] w-full shrink-0" style={{ background: 'linear-gradient(90deg, #c42b1e 0%, #8f1e13 100%)' }} />

        {/* Brand */}
        <div className="flex items-center justify-center px-4 py-4 border-b border-nav-border">
          <img src="/logo-white.png" alt="Grupo Master" className="w-40 h-20" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 pt-2.5 space-y-px">
          {nav.map(({ id, label, icon: Icon }) => {
            const active = view === id
            return (
              <button
                key={id}
                onClick={() => { onNavigate(id as View); setOpen(false) }}
                className={`
                  relative w-full flex items-center gap-2.5 px-3 py-[9px] rounded-md text-[13px] text-left
                  transition-colors duration-150 font-medium
                  ${active
                    ? 'text-white'
                    : 'text-metal hover:bg-elevated hover:text-white'}
                `}
                style={active ? { background: 'rgba(196,43,30,0.13)' } : {}}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r"
                    style={{ background: '#c42b1e' }}
                  />
                )}
                <Icon
                  size={15}
                  strokeWidth={active ? 2 : 1.75}
                  className={active ? 'text-accent-text' : 'text-metal-dim'}
                />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3.5 border-t border-nav-border flex items-center justify-between">
          <p className="text-[11px]" style={{ color: '#3e4450' }}>v1.0.0 · Sin conexión</p>
          <button
            onClick={() => {/* settings */ }}
            className="p-1 rounded transition-colors text-metal-dim hover:text-white hover:bg-elevated"
            title="Configuración"
          >
            <Settings size={13} strokeWidth={1.75} />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-12 bg-surface border-b border-line shrink-0">
          <button onClick={() => setOpen(true)} className="text-metal hover:text-white transition-colors">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <span className="text-[13px] font-semibold text-white tracking-tight">Grupo Master Automotriz</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
