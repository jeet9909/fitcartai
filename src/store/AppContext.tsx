import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react'
import type { CartLine, OutfitSelection, Order } from '../types'
import { productById } from '../data/products'

interface Toast { id: number; msg: string; icon?: string }

export type TierId = 'guest' | 'style' | 'pro' | 'studio'
export const TIER_RANK: Record<TierId, number> = { guest: 0, style: 1, pro: 2, studio: 3 }

export interface Account {
  id: string
  email: string
  name: string
  tier: TierId
  createdAt: string
  avatar3d?: boolean          // has generated a personalized 3D avatar (studio)
}

export interface SavedOutfit {
  id: string
  name: string
  avatarId: string
  items: { slot: string; productId: string; size: string }[]
  createdAt: string
  fit?: number
  outfit?: number
}

export type Feature = 'save' | 'fit_image' | 'avatar_3d' | 'account'

interface AppState {
  // session / account
  user: Account | null
  signedIn: boolean
  tier: TierId
  // shopping state
  avatarId: string
  outfit: OutfitSelection
  cart: CartLine[]
  wishlist: string[]
  saved: SavedOutfit[]
  orders: Order[]
  lastOrder: Order | null
  toasts: Toast[]
  // account actions
  login: (email: string, name?: string) => Account
  logout: () => void
  setTier: (t: TierId) => void
  signIn: () => void                       // legacy: quick demo sign-in
  can: (f: Feature) => boolean
  // shopping actions
  setAvatar: (id: string) => void
  setOutfitSlot: (slot: string, productId: string, size: string) => void
  clearSlot: (slot: string) => void
  addToCart: (productId: string, size: string, qty?: number) => void
  removeFromCart: (productId: string, size: string) => void
  setQty: (productId: string, size: string, qty: number) => void
  toggleWishlist: (productId: string) => void
  clearCart: () => void
  placeOrder: (order: Order) => void
  saveOutfit: (o: Omit<SavedOutfit, 'id' | 'createdAt'>) => void
  deleteSaved: (id: string) => void
  toast: (msg: string, icon?: string) => void
  // derived
  cartCount: number
  outfitCount: number
}

const Ctx = createContext<AppState | null>(null)
const LS = 'fitcart-v2'

function load(): any {
  try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} }
}
const rid = () => Math.random().toString(36).slice(2, 10)

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = load()
  const [accounts, setAccounts] = useState<Account[]>(saved.accounts ?? [])
  const [currentUserId, setCurrentUserId] = useState<string | null>(saved.currentUserId ?? null)
  const [avatarId, setAvatarId] = useState<string>(saved.avatarId ?? 'a-regular')
  const [outfit, setOutfit] = useState<OutfitSelection>(saved.outfit ?? {})
  const [cart, setCart] = useState<CartLine[]>(saved.cart ?? [])
  const [wishlist, setWishlist] = useState<string[]>(saved.wishlist ?? [])
  const [savedByUser, setSavedByUser] = useState<Record<string, SavedOutfit[]>>(saved.savedByUser ?? {})
  const [ordersByUser, setOrdersByUser] = useState<Record<string, Order[]>>(saved.ordersByUser ?? {})
  const [guestOrders, setGuestOrders] = useState<Order[]>(saved.guestOrders ?? [])
  const [lastOrder, setLastOrder] = useState<Order | null>(saved.lastOrder ?? null)
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(LS, JSON.stringify({
        accounts, currentUserId, avatarId, outfit, cart, wishlist,
        savedByUser, ordersByUser, guestOrders, lastOrder,
      }))
    } catch { /* storage unavailable */ }
  }, [accounts, currentUserId, avatarId, outfit, cart, wishlist, savedByUser, ordersByUser, guestOrders, lastOrder])

  const user = useMemo(() => accounts.find(a => a.id === currentUserId) ?? null, [accounts, currentUserId])
  const signedIn = !!user
  const tier: TierId = user?.tier ?? 'guest'
  const uKey = currentUserId ?? '__guest__'
  const saved_outfits = savedByUser[uKey] ?? []
  const orders = currentUserId ? (ordersByUser[currentUserId] ?? []) : guestOrders

  const toast = useCallback((msg: string, icon?: string) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, msg, icon }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2400)
  }, [])

  // --- account ---
  const login = (email: string, name?: string): Account => {
    const existing = accounts.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (existing) { setCurrentUserId(existing.id); return existing }
    const acc: Account = {
      id: rid(), email, name: name || email.split('@')[0],
      tier: 'style', createdAt: new Date().toISOString(),
    }
    setAccounts(a => [...a, acc])
    setCurrentUserId(acc.id)
    return acc
  }
  const logout = () => setCurrentUserId(null)
  const patchUser = (patch: Partial<Account>) =>
    setAccounts(a => a.map(x => x.id === currentUserId ? { ...x, ...patch } : x))
  const setTier = (t: TierId) => {
    if (!currentUserId) {                    // auto-create a demo account so flows never dead-end
      const acc: Account = { id: rid(), email: 'you@fitcart.ai', name: 'You', tier: t, createdAt: new Date().toISOString() }
      setAccounts(a => [...a, acc]); setCurrentUserId(acc.id); return
    }
    patchUser({ tier: t })
  }
  const signIn = () => { if (!currentUserId) login('you@fitcart.ai', 'You') }

  const can = (f: Feature): boolean => {
    if (f === 'account' || f === 'save') return signedIn
    if (f === 'fit_image') return TIER_RANK[tier] >= TIER_RANK.pro
    if (f === 'avatar_3d') return TIER_RANK[tier] >= TIER_RANK.studio
    return true
  }

  // --- shopping ---
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

  const placeOrder = (order: Order) => {
    setLastOrder(order)
    setCart([])
    if (currentUserId) setOrdersByUser(m => ({ ...m, [currentUserId]: [order, ...(m[currentUserId] ?? [])] }))
    else setGuestOrders(o => [order, ...o])
  }
  const saveOutfit = (o: Omit<SavedOutfit, 'id' | 'createdAt'>) => {
    const item: SavedOutfit = { ...o, id: rid(), createdAt: new Date().toISOString() }
    setSavedByUser(m => ({ ...m, [uKey]: [item, ...(m[uKey] ?? [])] }))
  }
  const deleteSaved = (id: string) =>
    setSavedByUser(m => ({ ...m, [uKey]: (m[uKey] ?? []).filter(s => s.id !== id) }))

  const cartCount = cart.reduce((s, l) => s + l.qty, 0)
  const outfitCount = Object.values(outfit).filter(Boolean).length

  return (
    <Ctx.Provider value={{
      user, signedIn, tier, avatarId, outfit, cart, wishlist, saved: saved_outfits, orders, lastOrder, toasts,
      login, logout, setTier, signIn, can,
      setAvatar, setOutfitSlot, clearSlot, addToCart, removeFromCart, setQty,
      toggleWishlist, clearCart, placeOrder, saveOutfit, deleteSaved, toast,
      cartCount, outfitCount,
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

export function outfitProducts(outfit: OutfitSelection) {
  return Object.entries(outfit)
    .filter(([, v]) => v)
    .map(([slot, v]) => ({ slot, product: productById(v!.productId)!, size: v!.size }))
    .filter(x => x.product)
}
