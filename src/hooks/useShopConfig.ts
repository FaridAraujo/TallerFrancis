import { useState } from 'react'
import { ShopConfig } from '../types'
import { loadShopConfig, saveShopConfig } from '../data/shopConfig'

export function useShopConfig() {
  const [config, setConfig] = useState<ShopConfig>(loadShopConfig)

  function updateConfig(next: ShopConfig) {
    saveShopConfig(next)
    setConfig(next)
  }

  return { config, updateConfig }
}
