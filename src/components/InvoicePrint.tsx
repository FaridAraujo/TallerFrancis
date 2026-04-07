import { Invoice, ShopConfig } from '../types'
import { tr } from '../utils/i18n'
import { formatCurrency, formatDate, serviceSubtotal } from '../utils/format'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  invoice: Invoice
  shopConfig: ShopConfig
}

const statusColor: Record<Invoice['status'], string> = {
  draft:     '#6b7280',
  issued:    '#3b82f6',
  paid:      '#22c55e',
  cancelled: '#ef4444',
}

export default function InvoicePrint({ invoice, shopConfig }: Props) {
  const lang = invoice.language
  const T    = tr(lang)

  return (
    <div
      className="print-zone"
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize:   '13px',
        color:      '#111',
        background: '#fff',
        padding:    '32px 40px',
      }}
    >
      {/* Sello PAGADA */}
      {invoice.status === 'paid' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          fontSize: '72px',
          fontWeight: 'bold',
          color: '#22c55e',
          opacity: 0.15,
          textTransform: 'uppercase',
          letterSpacing: '8px',
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          PAGADA
        </div>
      )}
      {/* ── Header ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <tbody>
          <tr style={{ verticalAlign: 'top' }}>
            {/* Left: Shop Info */}
            <td style={{ width: '30%', paddingRight: '20px', verticalAlign: 'middle' }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '6px', color: '#111' }}>
                {shopConfig.name}
              </div>
              <div style={{ color: '#555', lineHeight: '1.7', fontSize: '12px' }}>
                {shopConfig.address && <div>{shopConfig.address}</div>}
                {shopConfig.phone && <div>{shopConfig.phone}</div>}
                {shopConfig.email && <div>{shopConfig.email}</div>}
              </div>
            </td>

            {/* Center: Logo */}
            <td style={{ width: '40%', textAlign: 'center', paddingBottom: '10px' }}>
              <img
                src="/logo-color.png"
                alt="logo"
                style={{ height: '160px', objectFit: 'contain', display: 'block', margin: '0 auto' }}
              />
            </td>

            {/* Right: Invoice Info */}
            <td style={{ verticalAlign: 'top', textAlign: 'right' }}>
              <div style={{
                fontSize: '26px', fontWeight: 900,
                color: '#c0392b', letterSpacing: '-0.5px', marginBottom: '6px'
              }}>
                {T.invoice}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '12px', fontFamily: 'monospace', letterSpacing: '1px' }}>
                {invoice.number}
              </div>
              <table style={{ marginLeft: 'auto', borderCollapse: 'collapse', marginBottom: '12px' }}>
                <tbody>
                  <tr>
                    <td style={{ color: '#777', paddingRight: '12px', paddingBottom: '4px', textAlign: 'right', fontSize: '12px' }}>
                      {T.date}:
                    </td>
                    <td style={{ paddingBottom: '4px', textAlign: 'right' }}>
                      {formatDate(invoice.date, lang)}
                    </td>
                  </tr>
                  {invoice.dueDate && (
                    <tr>
                      <td style={{ color: '#777', paddingRight: '12px', paddingBottom: '4px', textAlign: 'right', fontSize: '12px' }}>
                        {T.dueDate}:
                      </td>
                      <td style={{ paddingBottom: '4px', textAlign: 'right' }}>
                        {formatDate(invoice.dueDate, lang)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ color: '#777', paddingRight: '12px', textAlign: 'right', fontSize: '12px' }}>
                      Estado:
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        background: statusColor[invoice.status] + '20',
                        color: statusColor[invoice.status],
                        border: `1px solid ${statusColor[invoice.status]}40`,
                      }}>
                        {T.status[invoice.status]}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Divider ── */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg,#c0392b,#e74c3c,#c0392b)', marginBottom: '20px' }} />

      {/* ── Bill to ── */}
      <div style={{
        background: '#f9f9f9', border: '1px solid #e8e8e8',
        borderRadius: '8px', padding: '14px 16px', marginBottom: '24px',
        position: 'relative',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#c0392b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
          {T.billTo}
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '2px' }}>{invoice.clientName}</div>
        <div style={{ color: '#555', fontSize: '13px', marginTop: '4px', lineHeight: '1.7' }}>
          {invoice.clientPhone && <span>{T.phone}: {invoice.clientPhone} &nbsp;</span>}
          {invoice.clientEmail && <span>{T.email}: {invoice.clientEmail}</span>}
          {(invoice.vehicle || invoice.licensePlate) && (
            <div>
              {invoice.vehicle && <span>{T.vehicle}: {invoice.vehicle} &nbsp;</span>}
              {invoice.licensePlate && <span>{T.plate}: <strong>{invoice.licensePlate}</strong></span>}
            </div>
          )}
        </div>
      </div>

      {/* ── Services Table ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ background: '#1a1a1a', color: '#fff' }}>
            <th style={{ padding: '9px 12px', textAlign: 'left',  fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', width: '32px' }}>#</th>
            <th style={{ padding: '9px 12px', textAlign: 'left',  fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{T.description}</th>
            <th style={{ padding: '9px 12px', textAlign: 'center',fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', width: '60px' }}>{T.qty}</th>
            <th style={{ padding: '9px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', width: '110px' }}>{T.unitPrice}</th>
            <th style={{ padding: '9px 12px', textAlign: 'right', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', width: '110px' }}>{T.amount}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.services.map((s, i) => (
            <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8f8f8', borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '9px 12px', color: '#888', fontSize: '12px' }}>{i + 1}</td>
              <td style={{ padding: '9px 12px' }}>{s.description}</td>
              <td style={{ padding: '9px 12px', textAlign: 'center', color: '#555' }}>{s.quantity}</td>
              <td style={{ padding: '9px 12px', textAlign: 'right', color: '#555' }}>
                {formatCurrency(s.price, shopConfig.currency)}
              </td>
              <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 500 }}>
                {formatCurrency(serviceSubtotal(s.quantity, s.price), shopConfig.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Totals ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
        <table style={{ borderCollapse: 'collapse', width: '240px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '5px 12px', color: '#555', fontSize: '12px' }}>{T.subtotal}</td>
              <td style={{ padding: '5px 12px', textAlign: 'right' }}>
                {formatCurrency(invoice.subtotal, shopConfig.currency)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '5px 12px', color: '#555', fontSize: '12px' }}>
                {T.tax} ({invoice.taxRate}%)
              </td>
              <td style={{ padding: '5px 12px', textAlign: 'right' }}>
                {formatCurrency(invoice.taxAmount, shopConfig.currency)}
              </td>
            </tr>
            <tr style={{ background: '#1a1a1a', color: '#fff' }}>
              <td style={{ padding: '10px 12px', fontWeight: 'bold', fontSize: '14px', borderRadius: '0 0 0 6px' }}>
                {T.total}
              </td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#e74c3c', borderRadius: '0 0 6px 0' }}>
                {formatCurrency(invoice.total, shopConfig.currency)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Notes ── */}
      {invoice.notes && (
        <div style={{
          border: '1px solid #e8e8e8', borderRadius: '8px',
          padding: '12px 16px', marginBottom: '28px', background: '#fafafa',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#c0392b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            {T.notes}
          </div>
          <p style={{ color: '#555', lineHeight: '1.6', margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {invoice.notes}
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{
        borderTop: '1px solid #e8e8e8', paddingTop: '16px',
        textAlign: 'center', color: '#888', fontSize: '12px',
        marginTop: '28px',
        position: 'relative',
      }}>
        <p style={{ margin: '0 0 4px' }}>{T.thanks}</p>
        <p style={{ margin: 0, color: '#c0392b', fontWeight: 'bold', fontSize: '13px' }}>
          {shopConfig.name}
        </p>
        <div style={{ position: 'absolute', bottom: '16px', right: '0' }}>
          <QRCodeSVG
            value={`${invoice.number}|${formatDate(invoice.date, lang)}|${formatCurrency(invoice.total, 'USD')}`}
            size={50}
            level="H"
            includeMargin={false}
          />
        </div>
      </div>
    </div>
  )
}
