import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import type { CartLine, OutfitSelection, Order } from '../types'
import { productById } from '../data/products'

interface Toast { id: number; msg: string; icon?: string }

export type TierId = 'guest' | 'style' | 'pro' | 'studio'
export const TIER_RANK: Record<TierId, number> = { guest: 0, style: 1, pro: 2, studio: 3 }

interface AppState {
  guest: boolean
  signedIn: boolean
  tier: TierId
  avatarId: string
  outfit: OutfitSelection
  cart: CartLine[]
  wishlist: string[]
  lastOrder: Order | null
  toasts: Toast[]
  // actions
  setAvatar: (id: string) => void
  setOutfitSlot: (slot: string, productId: string, size: string) => void
  clearSlot: (slot: string) => void
  addToCart: (productId: string, size: string, qty?: number) => void
  removeFromCart: (productId: string, size: string) => void
  setQty: (productId: string, size: string, qty: number) => void
  toggleWishlist: (productId: string) => void
  clearCart: () => void
  placeOrder: (order: Order) => void
  signIn: () => void
  setTier: (t: TierId) => void
  toast: (msg: string, icon?: string) => void
  cartCount: number
  outfitCount: number
}

const Ctx = createContext<AppState | null>(null)
const LS = 'fitcart-demo-v1'

function load() {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = load()
  const [guest] = useState(true)
  const [signedIn, setSignedIn] = useState<boolean>(saved.signedIn ?? false)
  const [tier, setTierState] = useState<TierId>(saved.tier ?? 'guest')
  const [avatarId, setAvatarId] = useState<string>(saved.avatarId ?? 'a-regular')
  const [outfit, setOutfit] = useState<OutfitSelection>(saved.outfit ?? {})
  const [cart, setCart] = useState<CartLine[]>(saved.cart ?? [])
  const [wishlist, setWishlist] = useState<string[]>(saved.wishlist ?? [])
  const [lastOrder, setLastOrder] = useState<Order | null>(saved.lastOrder ?? null)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ signedIn, tier, avatarId, outfit, cart, wishlist, lastOrder })) } catch { /* storage may be unavailable in sandboxed iframes */ }
  }, [signedIn, tier, avatarId, outfit, cart, wishlist, lastOrder])

  const toast = useCallback((msg: string, icon?: string) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, icon }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2400)
  }, [])

  const setAvatar = (id: string) => setAvatarId(id)
  const setOutfitSlot = (slot: string, productId: string, size: string) =>
    setOutfit(o => ({ ...o, [slot]: { productId, size } }))
  const clearSlot = (slot: string) => setOutfit(o => { const n = { ...o }; delete n[slot]; return n })

  const addToCart = (productId: string, size: string, qty = 1) => {
    setCart(c => {
      const i = c.findIndex(l => l.productId === productId && l.size === size)
      if (i >= 0) { const n = [...c]; n[i] = { ...n[i], qty: n[i].qty + qty }; return n }
      return [...c, { productId, size, qty }]
    })
  }
  const removeFromCart = (productId: string, size: string) =>
    setCart(c => c.filter(l => !(l.productId === productId && l.size === size)))
  const setQty = (productId: string, size: string, qty: number) =>
    setCart(c => qty <= 0 ? c.filter(l => !(l.productId === productId && l.size === size))
      : c.map(l => l.productId === productId && l.size === size ? { ...l, qty } : l))
  const toggleWishlist = (productId: string) =>
    setWishlist(w => w.includes(productId) ? w.filter(x => x !== productId) : [...w, productId])
  const clearCart = () => setCart([])
  const placeOrder = (order: Order) => { setLastOrder(order); setCart([]) }
  const signIn = () => setSignedIn(true)
  const setTier = (t: TierId) => { setTierState(t); if (t !== 'guest') setSignedIn(true) }

  const cartCount = cart.reduce((s, l) => s + l.qty, 0)
  const outfitCount = Object.values(outfit).filter(Boolean).length

  return (
    <Ctx.Provider value={{
      guest, signedIn, tier, avatarId, outfit, cart, wishlist, lastOrder, toasts,
      setAvatar, setOutfitSlot, clearSlot, addToCart, removeFromCart, setQty,
      toggleWishlist, clearCart, placeOrder, signIn, setTier, toast, cartCount, outfitCount,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp must be inside AppProvider')
  return c
}

// helper: resolve outfit selection to products
export function outfitProducts(outfit: OutfitSelection) {
  return Object.entries(outfit)
    .filter(([, v]) => v)
    .map(([slot, v]) => ({ slot, product: productById(v!.productId)!, size: v!.size }))
    .filter(x => x.product)
}
