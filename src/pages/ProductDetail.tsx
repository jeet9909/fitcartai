import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productById, PRODUCTS } from '../data/products'
import { STORES, storeColor, storeSoft } from '../data/stores'
import { useApp } from '../store/AppContext'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import { inr, off } from '../lib/format'
import { IconStar, IconHeart, IconCart, IconSparkle, IconArrowR, IconLink, IconCheck } from '../components/Icon'

export default function ProductDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const product = productById(id!)
  const { addToCart, setOutfitSlot, toggleWishlist, wishlist, toast } = useApp()
  const [size, setSize] = useState<string>('')

  if (!product) return <div className="container section"><h2>Product not found</h2><Link to="/explore" className="btn btn-soft" style={{ marginTop: 16 }}>Back to Explore</Link></div>
  const s = STORES[product.store]
  const wished = wishlist.includes(product.id)
  const needSize = product.sizes.length > 1
  const chosen = size || (needSize ? '' : product.sizes[0])
  const related = PRODUCTS.filter(p => p.slot === product.slot && p.id !== product.id).slice(0, 4)

  const requireSize = () => { if (needSize && !chosen) { toast('Please select a size', '!'); return false } return true }

  const tryOn = () => {
    if (!requireSize()) return
    setOutfitSlot(product.slot, product.id, chosen)
    toast(`Added to your avatar`, '🪞')
    nav('/studio')
  }
  const addCart = () => {
    if (!requireSize()) return
    addToCart(product.id, chosen)
    toast('Added to FitCart', '🛒')
  }

  return (
    <div className="container section" style={{ paddingTop: 24 }}>
      <div className="tiny dim" style={{ marginBottom: 16 }}>
        <Link to="/explore">Explore</Link> / <span style={{ textTransform: 'capitalize' }}>{product.category}</span> / {product.name}
      </div>

      <div className="pdp">
        <div className="gallery">
          <div className="card" style={{ overflow: 'hidden', aspectRatio: '3/4' }}>
            <ProductImage product={product} />
          </div>
          <div className="row gap-8" style={{ marginTop: 10 }}>
            <span className="badge badge-neutral" style={{ background: storeSoft(product.store), color: storeColor(product.store) }}>{s.name}</span>
            <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{product.colorName}</span>
            <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>{product.fitType} fit</span>
          </div>
        </div>

        <div className="stack gap-16">
          <div>
            <div className="row between">
              <h1 style={{ fontSize: 24 }}>{product.brand}</h1>
              <button className={`icon-btn${wished ? '' : ''}`} aria-label="Wishlist" onClick={() => { toggleWishlist(product.id); toast(wished ? 'Removed' : 'Saved to wishlist', '♥') }} style={{ color: wished ? 'var(--bad)' : 'var(--ink-3)' }}><IconHeart size={20} /></button>
            </div>
            <p className="muted" style={{ fontSize: 16, marginTop: 2 }}>{product.name}</p>
            <div className="row gap-8" style={{ marginTop: 10 }}>
              <span className="rating"><IconStar size={12} />{product.rating}</span>
              <span className="tiny dim">{product.ratingCount.toLocaleString('en-IN')} ratings</span>
            </div>
          </div>

          <div className="row gap-12" style={{ alignItems: 'baseline' }}>
            <span style={{ fontSize: 26, fontWeight: 800 }}>{inr(product.price)}</span>
            <span className="mrp" style={{ fontSize: 15, color: 'var(--ink-3)', textDecoration: 'line-through' }}>{inr(product.mrp)}</span>
            <span className="off" style={{ color: 'var(--good)', fontWeight: 700 }}>{off(product.mrp, product.price)}% off</span>
          </div>

          {needSize && (
            <div>
              <label className="field">Select size {product.slot !== 'accessory' && <Link to="/studio" className="tiny" style={{ color: 'var(--brand)', float: 'right', fontWeight: 600 }}>Get fit help →</Link>}</label>
              <div className="size-row">
                {product.sizes.map(sz => (
                  <button key={sz} className={`size-chip${chosen === sz ? ' on' : ''}`} onClick={() => setSize(sz)}>{sz}</button>
                ))}
              </div>
            </div>
          )}

          <div className="row gap-12 wrap">
            <button className="btn btn-primary btn-lg" onClick={tryOn} style={{ flex: 1, minWidth: 200 }}><IconSparkle size={18} /> Try on my avatar <IconArrowR size={17} /></button>
            <button className="btn btn-ghost btn-lg" onClick={addCart}><IconCart size={18} /> Add to FitCart</button>
          </div>

          <div className="banner banner-brand">
            <IconLink size={18} />
            <div>
              {s.cartWrite === 'PARTNER_ONLY'
                ? <><strong>{s.name} is a FitCart partner</strong> — items can sync straight into your {s.name} cart.</>
                : <><strong>Checkout happens at {s.name}.</strong> FitCart opens the exact product with your cart ready — you pay on the store (affiliate-attributed).</>}
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>Description</h3>
            <p className="small muted">{product.description}</p>
            <div className="row gap-8 wrap" style={{ marginTop: 14 }}>
              {product.occasion.map(o => <span key={o} className="chip" style={{ textTransform: 'capitalize' }}><IconCheck size={12} /> {o}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Complete the look</h2>
        <div className="grid prod-grid">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
      </div>
    </div>
  )
}
