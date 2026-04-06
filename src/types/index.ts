export interface Service {
  id: string
  description: string
  quantity: number
  price: number
}

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled'
export type Language = 'es' | 'en'

export interface Invoice {
  id: string
  number: string         // FAC-0001
  date: string           // YYYY-MM-DD
  dueDate?: string       // YYYY-MM-DD
  clientName: string
  clientPhone?: string
  clientEmail?: string
  vehicle?: string       // "Marca Modelo Año"
  licensePlate?: string
  services: Service[]
  taxRate: number        // porcentaje (0–100)
  subtotal: number
  taxAmount: number
  total: number
  notes?: string
  status: InvoiceStatus
  language: Language
  createdAt: string      // ISO
  updatedAt: string      // ISO
}

export interface ShopConfig {
  name: string
  phone: string
  address: string
  email: string
  website?: string
  taxId?: string
  taxRate: number
  currency: string
  logo?: string          // base64 data URL
}

export type View = 'list' | 'create' | 'edit' | 'detail' | 'settings'

export type CreateInvoiceData = Omit<Invoice,
  'id' | 'number' | 'subtotal' | 'taxAmount' | 'total' | 'createdAt' | 'updatedAt'
>
