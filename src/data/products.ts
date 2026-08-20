import type { Product, Category, Slot, StoreId } from '../types'

const slotFor: Record<Category, Slot> = {
  shirt: 'top', tshirt: 'top', dress: 'top', jeans: 'bottom', trousers: 'bottom',
  jacket: 'outer', shoes: 'shoes', watch: 'watch', sunglasses: 'sunglasses', accessory: 'accessory',
}

// Build a size chart (garment inner measurement in cm) for tops/bottoms.
function chart(cat: Category, base: number, fit: 'slim' | 'regular' | 'relaxed') {
  const ease = fit === 'slim' ? 4 : fit === 'regular' ? 8 : 12
  const sizes = ['S', 'M', 'L', 'XL', 'XXL']
  const step = 6
  const out: Product['sizeChart'] = {}
  sizes.forEach((s, i) => {
    const v = base + ease + (i - 1) * step
    if (slotFor[cat] === 'top') out[s] = { chest: v, shoulder: 40 + i * 1.5, length: 68 + i * 2 }
    else out[s] = { waist: v, hip: v + 8, inseam: 76 + i * 1 }
  })
  return out
}

let n = 0
const uid = () => `p${(++n).toString().padStart(2, '0')}`

interface Seed {
  name: string; brand: string; store: StoreId; category: Category; price: number; mrp: number;
  colorName: string; hex: string; hue: number; rating: number; ratingCount: number;
  occasion: Product['occasion']; styleTags: string[]; fitType?: Product['fitType']; base?: number; desc: string;
}

const seeds: Seed[] = [
  // ---- Tops ----
  { name: 'Oxford Cotton Slim Shirt', brand: 'Roadster', store: 'myntra', category: 'shirt', price: 1299, mrp: 2199, colorName: 'Sky Blue', hex: '#7db0d8', hue: 205, rating: 4.3, ratingCount: 8421, occasion: ['formal','smart-casual'], styleTags: ['classic','minimal'], fitType: 'slim', base: 96, desc: 'Breathable Oxford cotton with a tailored slim silhouette. A wardrobe staple for work and evenings.' },
  { name: 'Linen Blend Casual Shirt', brand: 'HERE&NOW', store: 'ajio', category: 'shirt', price: 1499, mrp: 2999, colorName: 'Sand Beige', hex: '#d8c3a0', hue: 40, rating: 4.1, ratingCount: 3120, occasion: ['casual','smart-casual'], styleTags: ['relaxed','summer'], fitType: 'regular', base: 100, desc: 'Airy linen-blend shirt with a soft drape — effortless summer smart-casual.' },
  { name: 'Essential Crew Tee', brand: 'Amazon Brand - Symbol', store: 'amazon', category: 'tshirt', price: 499, mrp: 999, colorName: 'Charcoal', hex: '#3a3a41', hue: 240, rating: 4.2, ratingCount: 15230, occasion: ['casual','sport'], styleTags: ['minimal','everyday'], fitType: 'regular', base: 98, desc: 'Combed-cotton crew neck with a clean fit. The reliable everyday tee.' },
  { name: 'Graphic Oversized Tee', brand: 'Bewakoof', store: 'flipkart', category: 'tshirt', price: 599, mrp: 1299, colorName: 'Off White', hex: '#efe9de', hue: 40, rating: 4.0, ratingCount: 6740, occasion: ['casual'], styleTags: ['streetwear','bold'], fitType: 'relaxed', base: 104, desc: 'Drop-shoulder oversized tee with a statement print for a relaxed street look.' },
  { name: 'Floral A-Line Dress', brand: 'Nykaa Fashion', store: 'nykaa', category: 'dress', price: 1899, mrp: 3499, colorName: 'Blush Rose', hex: '#e6a6b4', hue: 345, rating: 4.4, ratingCount: 2210, occasion: ['party','smart-casual'], styleTags: ['feminine','trend'], fitType: 'regular', base: 92, desc: 'Flowy A-line midi dress with a delicate floral print — day-to-evening ready.' },

  // ---- Bottoms ----
  { name: 'Slim Fit Stretch Jeans', brand: 'Levis', store: 'myntra', category: 'jeans', price: 2799, mrp: 3999, colorName: 'Indigo', hex: '#31445f', hue: 215, rating: 4.5, ratingCount: 12040, occasion: ['casual','smart-casual'], styleTags: ['classic','denim'], fitType: 'slim', base: 82, desc: 'Signature slim jeans with just-enough stretch for all-day comfort.' },
  { name: 'Relaxed Tapered Jeans', brand: 'AJIO Own', store: 'ajio', category: 'jeans', price: 1599, mrp: 2799, colorName: 'Washed Grey', hex: '#8a8b90', hue: 230, rating: 4.0, ratingCount: 4100, occasion: ['casual'], styleTags: ['relaxed','denim'], fitType: 'relaxed', base: 86, desc: 'Roomy through the thigh with a tapered ankle — modern relaxed denim.' },
  { name: 'Flat-Front Chino Trousers', brand: 'Arrow', store: 'amazon', category: 'trousers', price: 1799, mrp: 3299, colorName: 'Olive', hex: '#6f7350', hue: 75, rating: 4.2, ratingCount: 5680, occasion: ['formal','smart-casual'], styleTags: ['classic','versatile'], fitType: 'regular', base: 84, desc: 'Wrinkle-resistant cotton chinos with a crisp flat front for office or weekend.' },
  { name: 'Tailored Formal Trousers', brand: 'Van Heusen', store: 'flipkart', category: 'trousers', price: 2199, mrp: 3799, colorName: 'Navy', hex: '#26314d', hue: 222, rating: 4.3, ratingCount: 3980, occasion: ['formal'], styleTags: ['formal','sharp'], fitType: 'slim', base: 82, desc: 'Sharp tailored trousers in a fine twill weave — boardroom-ready.' },

  // ---- Outerwear ----
  { name: 'Textured Bomber Jacket', brand: 'Roadster', store: 'myntra', category: 'jacket', price: 2499, mrp: 4499, colorName: 'Black', hex: '#232227', hue: 240, rating: 4.3, ratingCount: 2890, occasion: ['casual','party'], styleTags: ['streetwear','layering'], fitType: 'regular', base: 104, desc: 'Ribbed-hem bomber with a subtle texture — the go-to layering piece.' },
  { name: 'Denim Trucker Jacket', brand: 'Wrangler', store: 'ajio', category: 'jacket', price: 3299, mrp: 5499, colorName: 'Mid Blue', hex: '#4a6484', hue: 210, rating: 4.4, ratingCount: 1760, occasion: ['casual','smart-casual'], styleTags: ['denim','classic'], fitType: 'regular', base: 106, desc: 'Timeless trucker jacket in rigid denim that only gets better with wear.' },

  // ---- Shoes ----
  { name: 'Retro Court Sneakers', brand: 'Puma', store: 'amazon', category: 'shoes', price: 3499, mrp: 5999, colorName: 'White', hex: '#f2f0ea', hue: 40, rating: 4.5, ratingCount: 9330, occasion: ['casual','smart-casual','sport'], styleTags: ['minimal','versatile'], desc: 'Clean court-style leather sneakers that pair with everything.' },
  { name: 'Chunky Trail Sneakers', brand: 'ASICS', store: 'flipkart', category: 'shoes', price: 5999, mrp: 8999, colorName: 'Grey/Lime', hex: '#9aa06a', hue: 80, rating: 4.4, ratingCount: 2140, occasion: ['sport','casual'], styleTags: ['streetwear','bold'], desc: 'Cushioned chunky sneakers with a sporty trail-inspired sole.' },
  { name: 'Suede Derby Shoes', brand: 'Clarks', store: 'myntra', category: 'shoes', price: 4999, mrp: 7499, colorName: 'Tan', hex: '#a9723f', hue: 30, rating: 4.3, ratingCount: 1520, occasion: ['formal','smart-casual'], styleTags: ['classic','formal'], desc: 'Soft suede derbies with a cushioned footbed — smart yet comfortable.' },

  // ---- Watches ----
  { name: 'Minimalist Mesh Watch', brand: 'Daniel Wellington', store: 'nykaa', category: 'watch', price: 8999, mrp: 13999, colorName: 'Rose Gold', hex: '#c78d6b', hue: 20, rating: 4.6, ratingCount: 980, occasion: ['formal','smart-casual','party'], styleTags: ['minimal','premium'], desc: 'Slim mesh-strap watch with a clean dial — understated elegance.' },
  { name: 'Sport Chronograph Watch', brand: 'Fossil', store: 'amazon', category: 'watch', price: 7495, mrp: 11995, colorName: 'Steel Blue', hex: '#4c6a7f', hue: 210, rating: 4.4, ratingCount: 2670, occasion: ['casual','sport'], styleTags: ['sporty','bold'], desc: 'Stainless chronograph with a bold dial — rugged everyday character.' },

  // ---- Sunglasses ----
  { name: 'Classic Wayfarer Shades', brand: 'Ray-Ban', store: 'myntra', category: 'sunglasses', price: 6490, mrp: 8990, colorName: 'Black', hex: '#1f1e22', hue: 240, rating: 4.7, ratingCount: 4210, occasion: ['casual','party','smart-casual'], styleTags: ['classic','iconic'], desc: 'The iconic wayfarer silhouette with UV400 protection.' },
  { name: 'Aviator Metal Sunglasses', brand: 'Vincent Chase', store: 'flipkart', category: 'sunglasses', price: 1299, mrp: 2499, colorName: 'Gunmetal', hex: '#5b5d63', hue: 230, rating: 4.2, ratingCount: 3050, occasion: ['casual','smart-casual'], styleTags: ['classic','versatile'], desc: 'Lightweight metal aviators with polarised lenses.' },

  // ---- Accessories ----
  { name: 'Leather Weave Belt', brand: 'Tommy Hilfiger', store: 'ajio', category: 'accessory', price: 1999, mrp: 3499, colorName: 'Brown', hex: '#734a2c', hue: 28, rating: 4.3, ratingCount: 1240, occasion: ['formal','smart-casual'], styleTags: ['classic','leather'], desc: 'Full-grain leather belt with a woven texture and matte buckle.' },
  { name: 'Canvas Tote Bag', brand: 'Nykaa Fashion', store: 'nykaa', category: 'accessory', price: 899, mrp: 1699, colorName: 'Ecru', hex: '#e0d6c0', hue: 45, rating: 4.1, ratingCount: 760, occasion: ['casual','smart-casual'], styleTags: ['minimal','everyday'], desc: 'Sturdy canvas tote with an interior pocket — carry-everything staple.' },
  { name: 'Knit Beanie Cap', brand: 'H&M', store: 'meesho', category: 'accessory', price: 399, mrp: 799, colorName: 'Mustard', hex: '#c59b3a', hue: 45, rating: 3.9, ratingCount: 2380, occasion: ['casual'], styleTags: ['streetwear','winter'], desc: 'Soft ribbed-knit beanie that adds a pop of colour to any layer.' },
  { name: 'Silk Blend Pocket Square', brand: 'Raymond', store: 'meesho', category: 'accessory', price: 299, mrp: 699, colorName: 'Wine', hex: '#7a2f3c', hue: 350, rating: 4.0, ratingCount: 540, occasion: ['formal','party'], styleTags: ['formal','detail'], desc: 'A finishing-touch pocket square in a rich wine tone.' },
]

export const PRODUCTS: Product[] = seeds.map(s => {
  const isApparel = ['top', 'bottom', 'outer'].includes(slotFor[s.category])
  return {
    id: uid(),
    name: s.name,
    brand: s.brand,
    store: s.store,
    category: s.category,
    slot: slotFor[s.category],
    price: s.price,
    mrp: s.mrp,
    colorName: s.colorName,
    hex: s.hex,
    hue: s.hue,
    sizes: s.category === 'shoes' ? ['UK6', 'UK7', 'UK8', 'UK9', 'UK10']
      : ['watch', 'sunglasses', 'accessory'].includes(s.category) ? ['One Size']
      : ['S', 'M', 'L', 'XL', 'XXL'],
    rating: s.rating,
    ratingCount: s.ratingCount,
    occasion: s.occasion,
    styleTags: s.styleTags,
    description: s.desc,
    fitType: s.fitType ?? 'regular',
    sizeChart: isApparel ? chart(s.category, s.base ?? 96, s.fitType ?? 'regular') : {},
  }
})

export const productById = (id: string) => PRODUCTS.find(p => p.id === id)
export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'shirt', label: 'Shirts' }, { id: 'tshirt', label: 'T-Shirts' }, { id: 'dress', label: 'Dresses' },
  { id: 'jeans', label: 'Jeans' }, { id: 'trousers', label: 'Trousers' }, { id: 'jacket', label: 'Jackets' },
  { id: 'shoes', label: 'Shoes' }, { id: 'watch', label: 'Watches' }, { id: 'sunglasses', label: 'Sunglasses' },
  { id: 'accessory', label: 'Accessories' },
]
