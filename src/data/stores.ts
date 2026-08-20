import type { Store, StoreId } from '../types'

export const STORES: Record<StoreId, Store> = {
  myntra:  { id: 'myntra',  name: 'Myntra',        hue: 330, catalog: 'FEED', cartWrite: 'UNSUPPORTED',  checkout: 'DEEPLINK', commissionPct: 6,  partner: false },
  ajio:    { id: 'ajio',    name: 'AJIO',          hue: 20,  catalog: 'FEED', cartWrite: 'PARTNER_ONLY', checkout: 'PARTNER',  commissionPct: 7,  partner: true  },
  amazon:  { id: 'amazon',  name: 'Amazon Fashion',hue: 35,  catalog: 'API',  cartWrite: 'UNSUPPORTED',  checkout: 'DEEPLINK', commissionPct: 5,  partner: false },
  flipkart:{ id: 'flipkart',name: 'Flipkart',      hue: 210, catalog: 'FEED', cartWrite: 'UNSUPPORTED',  checkout: 'DEEPLINK', commissionPct: 6,  partner: false },
  nykaa:   { id: 'nykaa',   name: 'Nykaa Fashion', hue: 345, catalog: 'FEED', cartWrite: 'UNSUPPORTED',  checkout: 'DEEPLINK', commissionPct: 8,  partner: false },
  meesho:  { id: 'meesho',  name: 'Meesho',        hue: 280, catalog: 'FEED-limited', cartWrite: 'UNSUPPORTED', checkout: 'DEEPLINK', commissionPct: 5, partner: false },
}

export const STORE_LIST = Object.values(STORES)
export const storeColor = (id: StoreId) => `hsl(${STORES[id].hue} 70% 46%)`
export const storeSoft = (id: StoreId) => `hsl(${STORES[id].hue} 70% 96%)`
