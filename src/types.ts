export type StoreId = 'myntra' | 'ajio' | 'amazon' | 'flipkart' | 'nykaa' | 'meesho'

export type Category = 'shirt' | 'tshirt' | 'jeans' | 'trousers' | 'jacket' | 'shoes' | 'watch' | 'sunglasses' | 'accessory' | 'dress'

export type Slot = 'top' | 'bottom' | 'outer' | 'shoes' | 'watch' | 'sunglasses' | 'accessory'

export interface Store {
  id: StoreId
  name: string
  hue: number
  // Honest capability model from the blueprint (research/platform-api-research.md)
  catalog: 'API' | 'FEED' | 'FEED-limited'
  cartWrite: 'UNSUPPORTED' | 'PARTNER_ONLY'
  checkout: 'DEEPLINK' | 'PARTNER'
  commissionPct: number
  partner: boolean
}

export interface Product {
  id: string
  name: string
  brand: string
  store: StoreId
  category: Category
  slot: Slot
  price: number
  mrp: number
  colorName: string
  hex: string
  hue: number
  sizes: string[]
  rating: number
  ratingCount: number
  occasion: ('casual' | 'formal' | 'party' | 'smart-casual' | 'sport')[]
  styleTags: string[]
  description: string
  // per-size chest/waist etc. offsets to drive the fit engine (cm)
  sizeChart: Record<string, { chest?: number; waist?: number; hip?: number; length?: number; shoulder?: number; inseam?: number }>
  fitType: 'slim' | 'regular' | 'relaxed'
}

export interface AvatarPreset {
  id: string
  label: string
  bodyType: 'slim' | 'regular' | 'athletic' | 'curvy' | 'plus' | 'tall'
  skin: string
  heightCm: number
  measurements: { chest: number; waist: number; hip: number; shoulder: number; inseam: number }
  confidence: number
}

export interface CartLine {
  productId: string
  size: string
  qty: number
}

export interface OutfitSelection {
  // slot -> { productId, size }
  [slot: string]: { productId: string; size: string } | undefined
}

export interface Order {
  id: string
  date: string
  groups: { store: StoreId; items: { product: Product; size: string; qty: number }[]; action: 'deeplink' | 'cart_sync'; commission: number }[]
  total: number
  affiliateEarned: number
}
