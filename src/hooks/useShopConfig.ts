import { SHOP_CONFIG } from '../data/shopConfig'
import { ShopConfig } from '../types'

// Config estática — se edita directamente en src/data/shopConfig.ts
export function useShopConfig(): { config: ShopConfig } {
  return { config: SHOP_CONFIG }
}
