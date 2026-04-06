import { useState } from 'react'
import { View } from './types'
import { useInvoices } from './hooks/useInvoices'
import { useShopConfig } from './hooks/useShopConfig'
import Layout from './components/Layout'
import InvoiceList from './components/InvoiceList'
import InvoiceForm from './components/InvoiceForm'
import InvoiceDetail from './components/InvoiceDetail'
import Settings from './components/Settings'

export default function App() {
  const [view, setView]           = useState<View>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { invoices, createInvoice, updateInvoice, deleteInvoice, getInvoice } = useInvoices()
  const { config, updateConfig } = useShopConfig()

  function navigate(v: View, id?: string) {
    setView(v)
    if (id !== undefined) setSelectedId(id)
  }

  const invoice = selectedId ? getInvoice(selectedId) : undefined

  return (
    <Layout view={view} onNavigate={navigate}>
      {view === 'list' && (
        <InvoiceList
          invoices={invoices}
          onNavigate={navigate}
          onDelete={deleteInvoice}
        />
      )}

      {view === 'create' && (
        <InvoiceForm
          shopConfig={config}
          onCreate={createInvoice}
          onNavigate={navigate}
        />
      )}

      {view === 'edit' && invoice && (
        <InvoiceForm
          key={invoice.id}
          invoice={invoice}
          shopConfig={config}
          onUpdate={updateInvoice}
          onNavigate={navigate}
        />
      )}

      {view === 'detail' && invoice && (
        <InvoiceDetail
          invoice={invoice}
          shopConfig={config}
          onNavigate={navigate}
          onDelete={deleteInvoice}
        />
      )}

      {view === 'settings' && (
        <Settings
          config={config}
          onSave={updateConfig}
        />
      )}
    </Layout>
  )
}
