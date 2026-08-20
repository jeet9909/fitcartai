import { useMemo, useState } from 'react'
import { PRODUCTS, CATEGORIES } from '../data/products'
import { STORE_LIST } from '../data/stores'
import ProductCard from '../components/ProductCard'
import { IconSearch, IconSparkle } from '../components/Icon'
import type { Category, StoreId } from '../types'

const SORTS = [
  { id: 'pop', label: 'Popularity' },
  { id: 'lowhigh', label: 'Price: Low to High' },
  { id: 'highlow', label: 'Price: High to Low' },
  { id: 'off', label: 'Discount' },
]

export default function Explore() {
  const [q, setQ] = useState('')
  const [cats, setCats] = useState<Category[]>([])
  const [stores, setStores] = useState<StoreId[]>([])
  const [maxPrice, setMaxPrice] = useState(10000)
  const [sort, setSort] = useState('pop')

  const toggle = <T,>(arr: T[], v: T, set: (a: T[]) => void) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])

  const results = useMemo(() => {
    let r = PRODUCTS.filter(p =>
      (!q || (p.name + p.brand + p.colorName + p.category).toLowerCase().includes(q.toLowerCase())) &&
      (cats.length === 0 || cats.includes(p.category)) &&
      (stores.length === 0 || stores.includes(p.store)) &&
      p.price <= maxPrice)
    if (sort === 'lowhigh') r = [...r].sort((a, b) => a.price - b.price)
    else if (sort === 'highlow') r = [...r].sort((a, b) => b.price - a.price)
    else if (sort === 'off') r = [...r].sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
    else r = [...r].sort((a, b) => b.ratingCount - a.ratingCount)
    return r
  }, [q, cats, stores, maxPrice, sort])

  return (
    <div className="container section" style={{ paddingTop: 28 }}>
      <div className="banner banner-accent" style={{ marginBottom: 20 }}>
        <IconSparkle size={18} />
        <div><strong>Guest Explore</strong> — browsing free, no login. Prices &amp; availability shown are the connected stores’ own. Tap any item to try it on your avatar.</div>
      </div>

      <div className="row between wrap gap-12" style={{ marginBottom: 20 }}>
        <div><h1 style={{ fontSize: 26 }}>Explore across stores</h1><p className="muted small" style={{ marginTop: 4 }}>{results.length} products from {STORE_LIST.length} stores</p></div>
        <div className="searchbar" style={{ minWidth: 280, flex: 1, maxWidth: 420 }}>
          <IconSearch size={18} />
          <input className="input" placeholder="Search shirts, sneakers, watches…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search products" />
        </div>
        <select className="select" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
          {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="explore">
        <aside className="filters card card-pad">
          <div className="filter-group">
            <h4>Store</h4>
            {STORE_LIST.map(s => (
              <label className="check" key={s.id}>
                <input type="checkbox" checked={stores.includes(s.id)} onChange={() => toggle(stores, s.id, setStores)} />{s.name}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Category</h4>
            {CATEGORIES.map(c => (
              <label className="check" key={c.id}>
                <input type="checkbox" checked={cats.includes(c.id)} onChange={() => toggle(cats, c.id, setCats)} />{c.label}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Max price: ₹{maxPrice.toLocaleString('en-IN')}</h4>
            <input type="range" min={299} max={10000} step={100} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%', accentColor: 'var(--brand)' }} aria-label="Max price" />
          </div>
          {(cats.length > 0 || stores.length > 0 || q || maxPrice < 10000) && (
            <button className="btn btn-soft btn-sm btn-block" onClick={() => { setCats([]); setStores([]); setQ(''); setMaxPrice(10000) }}>Clear filters</button>
          )}
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="empty card">
              <div className="ei"><IconSearch size={26} /></div>
              <h3>No products match</h3>
              <p className="muted small" style={{ marginTop: 6 }}>Try clearing a filter or searching something else.</p>
            </div>
          ) : (
            <div className="grid prod-grid">
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
