import { Language } from '../types'

const t = {
  es: {
    invoice:    'FACTURA',
    number:     'Número',
    date:       'Fecha',
    dueDate:    'Vencimiento',
    billTo:     'Facturar a',
    phone:      'Teléfono',
    email:      'Email',
    vehicle:    'Vehículo',
    plate:      'Placa',
    item:       '#',
    description:'Descripción',
    qty:        'Cant.',
    unitPrice:  'Precio Unit.',
    amount:     'Monto',
    subtotal:   'Subtotal',
    tax:        'Impuesto',
    total:      'TOTAL',
    notes:      'Notas / Observaciones',
    thanks:     'Gracias por su preferencia',
    status: {
      draft:     'Borrador',
      issued:    'Emitida',
      paid:      'Pagada',
      cancelled: 'Cancelada',
    },
  },
  en: {
    invoice:    'INVOICE',
    number:     'Number',
    date:       'Date',
    dueDate:    'Due Date',
    billTo:     'Bill To',
    phone:      'Phone',
    email:      'Email',
    vehicle:    'Vehicle',
    plate:      'License Plate',
    item:       '#',
    description:'Description',
    qty:        'Qty',
    unitPrice:  'Unit Price',
    amount:     'Amount',
    subtotal:   'Subtotal',
    tax:        'Tax',
    total:      'TOTAL',
    notes:      'Notes',
    thanks:     'Thank you for your business',
    status: {
      draft:     'Draft',
      issued:    'Issued',
      paid:      'Paid',
      cancelled: 'Cancelled',
    },
  },
} as const

export function tr(lang: Language) {
  return t[lang]
}
