import { ShopConfig } from '../types'

export const DEFAULT_CONFIG: ShopConfig = {
  name: 'AutoPro Taller',
  phone: '+1 (555) 123-4567',
  address: '123 Industrial Ave, Miami, FL 33101',
  email: 'contacto@autopro-taller.com',
  website: 'www.autopro-taller.com',
  taxId: 'XX-XXXXXXX',
  taxRate: 10,
  currency: 'USD',
}

const KEY = 'shop_config'

export function loadShopConfig(): ShopConfig {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return { ...DEFAULT_CONFIG }
}

export function saveShopConfig(config: ShopConfig): void {
  localStorage.setItem(KEY, JSON.stringify(config))
}
