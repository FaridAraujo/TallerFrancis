# 🔧 Taller Facturas

Sistema de facturación profesional para talleres de enderezado y pintura. **100% offline**, sin backend requerido.

## ✨ Características

- ✅ **Crear, editar y eliminar facturas** — Interfaz intuitiva
- ✅ **Numeración automática** — FAC-0001, FAC-0002, etc.
- ✅ **Tabla de servicios editable** — Cantidad, precio, cálculos automáticos
- ✅ **Totales automáticos** — Subtotal, impuesto, total
- ✅ **PDF/Imprimir** — Plantilla A4 profesional, HTML+CSS puro
- ✅ **Bilingüe** — Facturas en Español e Inglés
- ✅ **Persistencia local** — LocalStorage (offline obligatorio)
- ✅ **PWA** — Funciona sin conexión, instalable
- ✅ **Datos fijos del taller** — Nombre, teléfono, dirección, logo

## 🎨 Diseño

- **Paleta**: Negro profundo, rojo metálico, gris carbón
- **Tipografía**: Poppins + IBM Plex Mono
- **Estética**: Brutalist Industrial Premium
- **Animaciones**: Fade + Slide CSS3

## 🚀 Instalación

```bash
npm install
```

## 🏃 Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## 📦 Producción

```bash
npm run build
```

Genera en `dist/` listo para deploy.

## 💾 Datos

Todo se guarda en **LocalStorage**:
- `invoices` — Array de facturas
- `shop_config` — Configuración del taller

## 🖨️ PDF

Imprimir o guardar como PDF desde el navegador:
1. Abre una factura
2. Click "PDF"
3. `Ctrl+P` / `Cmd+P`
4. Guardar como PDF

## 📱 Mobile

Responsive en tablets y móviles. Sidebar colapsible en pantallas pequeñas.

## ⚙️ Configuración

En **Configuración**:
- Nombre del taller
- Teléfono, email, dirección
- Logo (PNG/JPG, máx 500KB)
- Impuesto por defecto
- Moneda (USD, EUR, MXN, etc.)

---

**Hecho con ❤️ usando React + TypeScript + Tailwind**
