import type { Product, AvatarPreset } from '../types'

/* ============ FIT ENGINE (demo) ============
   Deterministic estimate — NEVER a guaranteed measurement. Always returns a confidence.
   (Blueprint: ai/fit-engine.md) */

export type FitLabel = 'tight' | 'snug' | 'regular' | 'relaxed' | 'loose'
export interface RegionFit { name: string; label: FitLabel; delta: number; score: number }
export interface FitReport {
  regions: RegionFit[]
  score: number        // 0–10
  confidence: number   // 0–1
  issues: string[]
  recommendation: string
  sizeSuggestion?: string
}

function classify(easeCm: number): { label: FitLabel; score: number } {
  // ease = garment measurement − body measurement (cm)
  if (easeCm < -1) return { label: 'tight', score: 4.2 }
  if (easeCm < 3) return { label: 'snug', score: 7.4 }
  if (easeCm < 10) return { label: 'regular', score: 9.2 }
  if (easeCm < 16) return { label: 'relaxed', score: 8.2 }
  return { label: 'loose', score: 6.0 }
}

export function fitReport(avatar: AvatarPreset, product: Product, size: string): FitReport {
  const m = avatar.measurements
  const chart = product.sizeChart[size]
  const regions: RegionFit[] = []
  const issues: string[] = []

  if (chart && (product.slot === 'top' || product.slot === 'outer')) {
    if (chart.chest != null) {
      const ease = chart.chest - m.chest
      const c = classify(ease)
      regions.push({ name: 'chest', delta: ease, ...c })
      if (c.label === 'tight') issues.push('Chest may feel tight — consider sizing up.')
    }
    if (chart.shoulder != null) {
      const ease = chart.shoulder - m.shoulder
      const c = classify(ease + 4)
      regions.push({ name: 'shoulder', delta: ease, ...c })
      if (c.label === 'tight') issues.push('Shoulder seams may sit narrow.')
    }
    if (chart.length != null) {
      const ideal = avatar.heightCm * 0.4
      const ease = chart.length - ideal
      const c = classify(ease + 6)
      regions.push({ name: 'length', delta: ease, ...c })
      if (c.label === 'loose') issues.push('Hem may run slightly long.')
    }
  } else if (chart && product.slot === 'bottom') {
    if (chart.waist != null) {
      const ease = chart.waist - m.waist
      const c = classify(ease)
      regions.push({ name: 'waist', delta: ease, ...c })
      if (c.label === 'tight') issues.push('Waist may feel tight — size up for comfort.')
    }
    if (chart.hip != null) {
      const ease = chart.hip - m.hip
      const c = classify(ease)
      regions.push({ name: 'hip', delta: ease, ...c })
    }
    if (chart.inseam != null) {
      const ideal = avatar.heightCm * 0.45
      const ease = chart.inseam - ideal
      const c = classify(ease + 6)
      regions.push({ name: 'inseam', delta: ease, ...c })
      if (ease > 6) issues.push('Trouser length may run long — a small hem could help.')
      if (ease < -4) issues.push('Trouser length may run short.')
    }
  } else {
    // accessories / shoes / watch — proportion only
    regions.push({ name: 'proportion', delta: 0, label: 'regular', score: 9.0 })
  }

  const avg = regions.reduce((s, r) => s + r.score, 0) / (regions.length || 1)
  const hasChart = Object.keys(product.sizeChart).length > 0 || product.slot === 'accessory' || product.slot === 'shoes' || product.slot === 'watch' || product.slot === 'sunglasses'
  const confidence = Math.min(0.95, avatar.confidence * (hasChart ? 1 : 0.7))

  // size suggestion
  let sizeSuggestion: string | undefined
  const order = ['S', 'M', 'L', 'XL', 'XXL']
  const idx = order.indexOf(size)
  const tight = regions.some(r => r.label === 'tight')
  const loose = regions.filter(r => r.label === 'loose').length >= 2
  if (tight && idx >= 0 && idx < order.length - 1) sizeSuggestion = order[idx + 1]
  if (loose && idx > 0) sizeSuggestion = order[idx - 1]

  const recommendation =
    issues.length === 0
      ? 'True to size for your body — a confident fit.'
      : sizeSuggestion
        ? `Consider size ${sizeSuggestion}. ` + issues[0]
        : issues[0]

  return {
    regions,
    score: Math.round(avg * 10) / 10,
    confidence: Math.round(confidence * 100) / 100,
    issues,
    recommendation,
    sizeSuggestion,
  }
}

/* ============ OUTFIT INTELLIGENCE (demo) ============ (Blueprint: ai/outfit-intelligence.md) */
export interface OutfitScore {
  colorHarmony: number
  occasion: number
  bodyShape: number
  styleCompat: number
  composite: number
  occasionLabel: string
  rationale: string[]
  suggestions: string[]
}

function hueDist(a: number, b: number) { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d) }

export function outfitScore(items: Product[], avatar: AvatarPreset): OutfitScore | null {
  if (items.length < 2) return null
  const rationale: string[] = []
  const suggestions: string[] = []

  // ---- color harmony ----
  const hues = items.map(i => i.hue)
  let pairScore = 0, pairs = 0
  for (let i = 0; i < hues.length; i++) for (let j = i + 1; j < hues.length; j++) {
    const d = hueDist(hues[i], hues[j]); pairs++
    // neutral (low chroma via near beige/grey/black hues) treated kindly
    if (d < 25) pairScore += 8.5           // analogous
    else if (d > 150) pairScore += 9.0     // complementary
    else if (d > 95 && d < 135) pairScore += 8.6 // triadic-ish
    else pairScore += 6.6
  }
  const colorHarmony = Math.min(9.6, pairs ? pairScore / pairs : 8)
  if (colorHarmony >= 8.4) rationale.push('Colours sit in a balanced, complementary range.')
  else rationale.push('Colour pairing is workable but a touch busy — a neutral anchor helps.')

  // ---- occasion coherence ----
  const occ = ['casual', 'smart-casual', 'formal', 'party', 'sport']
  let bestOcc = 'smart-casual', bestCount = 0
  occ.forEach(o => { const c = items.filter(i => i.occasion.includes(o as any)).length; if (c > bestCount) { bestCount = c; bestOcc = o } })
  const occasion = 4 + (bestCount / items.length) * 6
  if (bestCount === items.length) rationale.push(`Every piece reads ${bestOcc} — a coherent look.`)
  else rationale.push(`Leans ${bestOcc}; one or two pieces stretch the theme.`)

  // ---- style compatibility ----
  const styley = items.flatMap(i => i.styleTags)
  const clash = styley.includes('formal') && styley.includes('streetwear')
  const styleCompat = clash ? 6.2 : 8.6
  if (clash) { rationale.push('Formal and streetwear elements are mixing — intentional, but bold.'); suggestions.push('Swap one piece to unify the formality level.') }

  // ---- body-shape compatibility ----
  const relaxedBottoms = items.some(i => i.slot === 'bottom' && i.fitType === 'relaxed')
  let bodyShape = 8.2
  if (avatar.bodyType === 'plus' || avatar.bodyType === 'curvy') { bodyShape = relaxedBottoms ? 8.8 : 8.0 }
  if (avatar.bodyType === 'tall') bodyShape = 8.4
  rationale.push('Proportions suit your frame well.')

  // ---- completeness suggestions ----
  const slots = new Set(items.map(i => i.slot))
  if (!slots.has('shoes')) suggestions.push('Add shoes to complete the outfit.')
  if (!slots.has('watch') && !slots.has('accessory') && bestOcc !== 'sport') suggestions.push('A watch or accessory would tie the look together.')

  const composite = Math.round((colorHarmony * 0.3 + occasion * 0.3 + styleCompat * 0.22 + bodyShape * 0.18) * 10) / 10
  return {
    colorHarmony: Math.round(colorHarmony * 10) / 10,
    occasion: Math.round(occasion * 10) / 10,
    bodyShape: Math.round(bodyShape * 10) / 10,
    styleCompat: Math.round(styleCompat * 10) / 10,
    composite,
    occasionLabel: bestOcc,
    rationale,
    suggestions,
  }
}
