import type { Product, Category } from '../types'

// Category glyph paths (simple, recognizable apparel silhouettes) drawn in the garment colour.
const GLYPH: Record<Category, string> = {
  shirt: 'M50 18l16 8-6 12-8-4v40H32V34l-8 4-6-12 16-8c2 4 14 4 16 0Z',
  tshirt: 'M50 20l14 6-5 11-7-3v38H36V34l-7 3-5-11 14-6c2 3 12 3 13 0Z',
  dress: 'M40 18h20l-3 10 9 40H34l9-40-3-10Z',
  jeans: 'M34 18h32l-3 54H50l-2-30-2 30H35L34 18Z',
  trousers: 'M35 18h30l-2 54H51l-3-32-3 32H37L35 18Z',
  jacket: 'M38 16l-12 8v48h14V16ZM62 16l12 8v48H60V16ZM38 16h24v56H38zM50 16v56',
  shoes: 'M14 60h72a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6ZM14 60l3-22 12 6 9-12c6 9 15 13 48 16v12Z',
  watch: 'M50 30a20 20 0 1 0 0 40 20 20 0 0 0 0-40ZM50 42v10l7 4M38 8h24l-3 16M38 92h24l-3-16',
  sunglasses: 'M22 42a12 12 0 1 0 24 0 12 12 0 0 0-24 0ZM54 42a12 12 0 1 0 24 0 12 12 0 0 0-24 0ZM46 40c2-3 6-3 8 0M10 34l12-6M90 34l-12-6',
  accessory: 'M30 34h40l4 40H26l4-40ZM40 34v-6a10 10 0 0 1 20 0v6',
}

export default function ProductImage({ product, className }: { product: Product; className?: string }) {
  const c = product.hex
  const light = product.category === 'shoes' || product.category === 'watch' || product.category === 'sunglasses'
  return (
    <svg viewBox="0 0 100 133" className={className} style={{ width: '100%', height: '100%', display: 'block' }}
      role="img" aria-label={`${product.brand} ${product.name}`}>
      <defs>
        <linearGradient id={`bg-${product.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor={`hsl(${product.hue} 40% 95%)`} />
        </linearGradient>
        <linearGradient id={`gl-${product.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity={light ? 0.95 : 1} />
          <stop offset="1" stopColor={c} stopOpacity={0.72} />
        </linearGradient>
      </defs>
      <rect width="100" height="133" fill={`url(#bg-${product.id})`} />
      <g transform="translate(0,20) scale(1)">
        <path d={GLYPH[product.category]} fill={`url(#gl-${product.id})`} stroke={`hsl(${product.hue} 30% 40% / .25)`} strokeWidth="1" />
      </g>
      <circle cx="86" cy="16" r="7" fill={c} stroke="#fff" strokeWidth="1.5" />
    </svg>
  )
}
