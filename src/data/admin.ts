// Seeded data for the internal FitCart operator ADMIN console.
// All simulated — no real accounts. Demonstrates how FitCart staff would manage
// the platform: users, stores, B2B partners, moderation, and the revenue/cost guardrail.

export interface Account {
  id: string
  name: string
  email: string
  plan: 'Guest' | 'Member' | 'Pro'
  status: 'Active' | 'Suspended'
  avatar: string          // preset label or 'Personalized'
  tryOns: number
  outfits: number
  purchases: number
  affiliate: number       // ₹ earned from this user
  joined: string
  flagged?: boolean
}

export const PLATFORM = {
  kpis: {
    totalUsers: 128400,
    members: 41900,
    guests30d: 86500,
    proSubs: 6120,
    tryOns30d: 512300,
    handoffs30d: 134700,
    affiliateMTD: 42.8,   // ₹ lakh
    returnReduction: 29,  // %
    fitAccuracy: 81,      // %
    costPerGuest: 1.8,    // ₹ per guest session (inference)
    valuePerGuest: 9.4,   // ₹ affiliate value per guest session
  },
  // ₹ lakh per month
  revenue: [22, 27, 31, 36, 39, 42.8],
  cost:    [9, 10.5, 11.8, 13, 13.9, 14.6],
  months: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
}

export const ACCOUNTS: Account[] = [
  { id: 'U-10241', name: 'Aarav Mehta',    email: 'aarav.m@gmail.com',    plan: 'Member', status: 'Active',    avatar: 'Athletic',     tryOns: 42,  outfits: 9,  purchases: 4, affiliate: 486,  joined: '12 Jun 2026' },
  { id: 'U-10238', name: 'Priya Nair',     email: 'priya.nair@outlook.com', plan: 'Pro',  status: 'Active',    avatar: 'Personalized', tryOns: 118, outfits: 24, purchases: 11, affiliate: 1740, joined: '03 May 2026' },
  { id: 'U-10233', name: 'Zoya Khan',      email: 'zoya.k@gmail.com',     plan: 'Pro',    status: 'Active',    avatar: 'Personalized', tryOns: 96,  outfits: 31, purchases: 14, affiliate: 2210, joined: '21 Apr 2026' },
  { id: 'U-10229', name: 'Rohan Verma',    email: 'rohanv@gmail.com',     plan: 'Member', status: 'Active',    avatar: 'Regular',      tryOns: 18,  outfits: 3,  purchases: 1, affiliate: 92,   joined: '28 Jun 2026' },
  { id: 'U-10224', name: 'Meera Iyer',     email: 'meera.iyer@gmail.com', plan: 'Member', status: 'Active',    avatar: 'Curvy',        tryOns: 54,  outfits: 12, purchases: 6, affiliate: 720,  joined: '15 May 2026' },
  { id: 'U-10219', name: 'Guest · a19f2c', email: '—',                    plan: 'Guest',  status: 'Active',    avatar: 'Plus',         tryOns: 3,   outfits: 1,  purchases: 0, affiliate: 0,    joined: '18 Aug 2026' },
  { id: 'U-10211', name: 'Kabir Bose',     email: 'kabir.bose@yahoo.com', plan: 'Member', status: 'Active',    avatar: 'Tall',         tryOns: 27,  outfits: 6,  purchases: 3, affiliate: 344,  joined: '02 Jun 2026' },
  { id: 'U-10205', name: 'Ananya Rao',     email: 'ananya.rao@gmail.com', plan: 'Pro',    status: 'Active',    avatar: 'Personalized', tryOns: 73,  outfits: 19, purchases: 9, affiliate: 1305, joined: '11 Apr 2026' },
  { id: 'U-10198', name: 'Guest · 7bd004', email: '—',                    plan: 'Guest',  status: 'Suspended', avatar: 'Slim',         tryOns: 61,  outfits: 0,  purchases: 0, affiliate: 0,    joined: '17 Aug 2026', flagged: true },
  { id: 'U-10192', name: 'Sana Kapoor',    email: 'sana.k@gmail.com',     plan: 'Member', status: 'Active',    avatar: 'Regular',      tryOns: 12,  outfits: 2,  purchases: 1, affiliate: 118,  joined: '30 Jun 2026' },
  { id: 'U-10187', name: 'Dev Sharma',     email: 'dev.sharma@proton.me', plan: 'Member', status: 'Active',    avatar: 'Athletic',     tryOns: 39,  outfits: 8,  purchases: 5, affiliate: 610,  joined: '24 May 2026' },
  { id: 'U-10180', name: 'Ishita Ghosh',   email: 'ishita.g@gmail.com',   plan: 'Pro',    status: 'Active',    avatar: 'Personalized', tryOns: 88,  outfits: 22, purchases: 10, affiliate: 1490, joined: '08 Apr 2026' },
]

export interface ModItem { id: string; type: string; ref: string; reason: string; severity: 'high' | 'medium' | 'low' }
export const MODERATION: ModItem[] = [
  { id: 'M-3021', type: 'Cost abuse', ref: 'Guest · 7bd004', reason: '61 try-ons in 20 min — automated burst (cost-bomb guard)', severity: 'high' },
  { id: 'M-3018', type: 'Reported render', ref: 'Outfit #48213', reason: 'User reported an inaccurate body render', severity: 'medium' },
  { id: 'M-3015', type: 'Duplicate accounts', ref: 'U-10205 / U-10241', reason: 'Same device fingerprint, 2 free trials', severity: 'medium' },
  { id: 'M-3009', type: 'Content flag', ref: 'Shared render r/9f21', reason: 'Auto-flagged shared link — pending review', severity: 'low' },
]

export interface PartnerReq { id: string; brand: string; plan: string; contact: string; status: 'Pending' | 'Approved' | 'Rejected' }
export const PARTNER_REQUESTS: PartnerReq[] = [
  { id: 'B-208', brand: 'Roadster', plan: 'Fit-SDK Pilot', contact: 'partners@roadster.in', status: 'Approved' },
  { id: 'B-214', brand: 'HERE&NOW', plan: 'Fit-SDK Growth', contact: 'bd@hereandnow.com', status: 'Pending' },
  { id: 'B-217', brand: 'Vincent Chase', plan: 'Analytics', contact: 'growth@vc.co', status: 'Pending' },
  { id: 'B-221', brand: 'Bewakoof', plan: 'Fit-SDK Pilot', contact: 'api@bewakoof.com', status: 'Pending' },
]

export interface StoreOps { id: string; feed: 'Healthy' | 'Delayed' | 'Down'; lastSync: string; enabled: boolean }
export const STORE_OPS: Record<string, StoreOps> = {
  myntra:   { id: 'myntra',   feed: 'Healthy', lastSync: '4 min ago',  enabled: true },
  ajio:     { id: 'ajio',     feed: 'Healthy', lastSync: '2 min ago',  enabled: true },
  amazon:   { id: 'amazon',   feed: 'Healthy', lastSync: '1 min ago',  enabled: true },
  flipkart: { id: 'flipkart', feed: 'Delayed', lastSync: '38 min ago', enabled: true },
  nykaa:    { id: 'nykaa',    feed: 'Healthy', lastSync: '6 min ago',  enabled: true },
  meesho:   { id: 'meesho',   feed: 'Down',    lastSync: '3 hr ago',   enabled: false },
}
