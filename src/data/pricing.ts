import type { TierId } from '../store/AppContext'

export interface Tier {
  id: TierId
  name: string
  tagline: string
  monthly: number      // ₹ / month
  annual: number       // ₹ / year (effective)
  highlight?: boolean  // most popular
  top?: boolean        // flagship
  accent: string
  blurb: string
  features: string[]   // headline bullets shown on the card
  cta: string
}

export const TIERS: Tier[] = [
  {
    id: 'guest', name: 'Guest', tagline: 'Explore free, no login', monthly: 0, annual: 0,
    accent: 'var(--ink-3)',
    blurb: 'Get the “aha” instantly — try outfits on realistic preset avatars.',
    features: [
      'Preset demo avatars (6 body types)',
      '5 try-ons / day',
      'Basic Fit Score + Outfit Score',
      'Standard, watermarked previews',
      'Cross-store cart + store handoff',
    ],
    cta: 'Continue as guest',
  },
  {
    id: 'style', name: 'Style', tagline: 'For everyday shoppers', monthly: 199, annual: 1599,
    accent: 'var(--accent)',
    blurb: 'Sign in for unlimited try-ons and the full, confidence-scored fit report.',
    features: [
      'Everything in Guest',
      'Unlimited try-ons, no watermark',
      'Full region Fit Report + confidence',
      'Full Outfit Intelligence score',
      'Save unlimited outfits',
    ],
    cta: 'Choose Style',
  },
  {
    id: 'pro', name: 'Pro', tagline: 'AI Fit Images', monthly: 599, annual: 4999, highlight: true,
    accent: 'var(--brand)',
    blurb: 'Generate fine, HD images of exactly how each outfit looks on you — with a Fit Check overlay.',
    features: [
      'Everything in Style',
      '★ AI Fit Images — see it on you, in HD',
      'Fit Check overlay on every render',
      'Compare two outfits side by side',
      'Texture zoom + super-resolution',
      'Priority processing',
    ],
    cta: 'Go Pro',
  },
  {
    id: 'studio', name: 'Studio 3D', tagline: 'Your personal 3D avatar', monthly: 1499, annual: 12999, top: true,
    accent: '#7c3aed',
    blurb: 'The flagship. Turn your photos into a true personalized 3D avatar and see everything in real 360°.',
    features: [
      'Everything in Pro',
      '★ Personalized 3D avatar of you',
      'Real 360° free-camera viewer',
      '4K studio lookbook renders',
      'Multiple avatars + fit history',
      'Concierge styling + early access',
    ],
    cta: 'Unlock Studio 3D',
  },
]

export const tierById = (id: TierId) => TIERS.find(t => t.id === id)!

// Feature comparison matrix. Values: true | false | string.
export interface Row { label: string; note?: string; vals: Record<TierId, boolean | string> }
export const MATRIX: { group: string; rows: Row[] }[] = [
  {
    group: 'Avatar & try-on',
    rows: [
      { label: 'Preset demo avatars', vals: { guest: true, style: true, pro: true, studio: true } },
      { label: 'AI Fit Images', note: 'fine HD images of the outfit on *you* + Fit Check', vals: { guest: false, style: false, pro: true, studio: true } },
      { label: 'Personalized 3D avatar of yourself', note: 'built from your photos — the flagship perk', vals: { guest: false, style: false, pro: false, studio: true } },
      { label: 'Real 360° free-camera 3D', vals: { guest: false, style: false, pro: false, studio: true } },
      { label: 'Try-ons', vals: { guest: '5 / day', style: 'Unlimited', pro: 'Unlimited', studio: 'Unlimited' } },
      { label: 'Render quality', vals: { guest: 'Standard ·  watermark', style: 'Standard', pro: 'HD', studio: '4K Studio' } },
    ],
  },
  {
    group: 'Intelligence',
    rows: [
      { label: 'Fit Report', vals: { guest: 'Basic score', style: 'Full + confidence', pro: 'Full + history', studio: 'Full + concierge' } },
      { label: 'Fit Check overlay on renders', vals: { guest: false, style: false, pro: true, studio: true } },
      { label: 'Outfit Score', vals: { guest: 'Basic', style: 'Full', pro: 'Full + trend', studio: 'Full + trend' } },
      { label: 'Compare two outfits', vals: { guest: false, style: false, pro: true, studio: true } },
      { label: 'Texture zoom + super-res', vals: { guest: false, style: false, pro: true, studio: true } },
    ],
  },
  {
    group: 'Shopping & support',
    rows: [
      { label: 'Cross-store cart + affiliate handoff', vals: { guest: true, style: true, pro: true, studio: true } },
      { label: 'Saved outfits', vals: { guest: '3', style: 'Unlimited', pro: 'Unlimited', studio: 'Unlimited' } },
      { label: 'Priority GPU queue', vals: { guest: false, style: false, pro: true, studio: 'Highest' } },
      { label: 'Support', vals: { guest: 'Community', style: 'Email', pro: 'Priority', studio: 'Concierge' } },
    ],
  },
]

export const FAQ = [
  { q: 'Why is the personalized 3D avatar only on Studio 3D?', a: 'Building a true 3D avatar from your photos is the most compute-intensive thing we do (GPU reconstruction + rigging). Reserving it for the flagship tier keeps unit economics healthy — the exact “don’t break revenue” guardrail our ops team tracks.' },
  { q: 'What are “AI Fit Images” on Pro?', a: 'Fine, HD generated images showing how each outfit actually looks on you, with a Fit Check overlay (shoulder, chest, length, etc.). It’s the 2D generative try-on — realistic imagery without full 3D reconstruction.' },
  { q: 'Is my photo safe?', a: 'Always. Photos are validated, used to build your avatar, then deleted by default — and you can delete everything anytime. Every fit estimate shows a confidence score; we never claim a guaranteed measurement.' },
  { q: 'Can I cancel or switch tiers?', a: 'Anytime. Upgrades unlock instantly; downgrades apply next cycle. Annual billing saves ~2 months.' },
  { q: 'Do you take a cut of my purchase?', a: 'No — you pay the store directly. FitCart earns an affiliate commission from the store, so the intelligence layer stays aligned with getting you the right fit.' },
]
