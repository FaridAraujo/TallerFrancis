# Grupo Master Automotriz — Billing System

Cross-platform billing application for an automotive workshop, 
built with React 18, TypeScript, and Vite. Distributed across 
Web (PWA), Windows (Electron), and Android (Capacitor) from a 
single codebase — currently in active use at a real business.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Build Tool | Vite |
| Desktop | Electron (Windows .exe installer + portable) |
| Mobile | Capacitor (Android .apk) |
| PWA | vite-plugin-pwa + Workbox (offline support) |
| Persistence | localStorage via custom React hooks |
| i18n | Custom bilingual layer (ES/EN) |

## Features

- Full invoice lifecycle: Draft → Issued → Paid → Cancelled
- Auto-incremental serial numbers (FAC-0001, FAC-0002...)
- Dynamic service tables with real-time tax calculation
- Dashboard with total revenue and invoice counts by status
- Full-text and status filtering across all records
- Print-optimized PDF with dedicated InvoicePrint component
  and diagonal "PAGADA" watermark on paid invoices
- Configurable shop settings (name, address, logo, tax rate)
- Bilingual invoice output (Spanish / English)
- PWA offline support via Workbox service worker

## Architecture

Custom hooks handle all business logic and persistence:

- `useInvoices` — Full CRUD, filtering, search, 
   and serial number management
- `useShopConfig` — Business settings and configuration

SPA view system (list / create / edit / detail) 
implemented without an external router.

PDF generation uses a dedicated `InvoicePrint` component 
with `@media print` A4 layout — invisible on screen, 
rendered only on print.

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
# Web / PWA
npm run build

# Windows (requires Electron Builder)
npm run electron:build

# Android (requires Capacitor + Android Studio)
npx cap sync
npx cap open android
```

## Distribution

- **Web** — Deploy the `dist/` folder to any static host
- **Windows** — Generates NSIS installer and portable .exe
- **Android** — Generates .apk for direct distribution
