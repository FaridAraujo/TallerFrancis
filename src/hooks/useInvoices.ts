import { useState } from 'react'
import { Invoice, CreateInvoiceData, Service } from '../types'
import { calcTotals } from '../utils/format'

const KEY = 'invoices'

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function nextNumber(list: Invoice[]): string {
  const nums = list.map(inv => {
    const m = inv.number.match(/FAC-(\d+)/)
    return m ? parseInt(m[1], 10) : 0
  })
  const max = nums.length > 0 ? Math.max(...nums) : 0
  return `FAC-${String(max + 1).padStart(4, '0')}`
}

function loadList(): Invoice[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function persist(list: Invoice[]): void {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(loadList)

  function set(list: Invoice[]) {
    persist(list)
    setInvoices(list)
  }

  function createInvoice(data: CreateInvoiceData): Invoice {
    const totals = calcTotals(data.services, data.taxRate)
    const now    = new Date().toISOString()
    const invoice: Invoice = {
      ...data,
      id:        uid(),
      number:    nextNumber(invoices),
      ...totals,
      createdAt: now,
      updatedAt: now,
    }
    set([invoice, ...invoices])
    return invoice
  }

  function updateInvoice(id: string, updates: Partial<Invoice>): void {
    const list = invoices.map(inv => {
      if (inv.id !== id) return inv
      const merged  = { ...inv, ...updates, id }
      const services: Service[] = merged.services ?? inv.services
      const taxRate: number     = merged.taxRate  ?? inv.taxRate
      return {
        ...merged,
        ...calcTotals(services, taxRate),
        updatedAt: new Date().toISOString(),
      }
    })
    set(list)
  }

  function deleteInvoice(id: string): void {
    set(invoices.filter(inv => inv.id !== id))
  }

  function getInvoice(id: string): Invoice | undefined {
    return invoices.find(inv => inv.id === id)
  }

  return { invoices, createInvoice, updateInvoice, deleteInvoice, getInvoice }
}
