import { Language } from '../types'

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(iso: string, lang: Language): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return lang === 'es' ? `${d}/${m}/${y}` : `${m}/${d}/${y}`
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function serviceSubtotal(qty: number, price: number): number {
  return Math.round(qty * price * 100) / 100
}

export function calcTotals(
  services: { quantity: number; price: number }[],
  taxRate: number
) {
  const subtotal = services.reduce(
    (sum, s) => sum + serviceSubtotal(s.quantity, s.price),
    0
  )
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100
  const total     = Math.round((subtotal + taxAmount) * 100) / 100
  return { subtotal, taxAmount, total }
}
