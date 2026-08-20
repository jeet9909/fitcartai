import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { productById } from '../data/products'
import { STORES, storeColor, storeSoft } from '../data/stores'
import ProductImage from '../components/ProductImage'
import { inr } from '../lib/format'
import { IconCart, IconArrowR, IconStore, IconLink, IconSparkle } from '../components/Icon'
import type { StoreId } from '../types'

export default function Cart() {
  const { cart, setQty, removeFromCart, toast } = useApp()
  const nav = useNavigate()

  const lines = cart.map(l => ({ ...l, product: productById(l.productId)! })).filter(l => l.product)
  const byStore = lines.reduce((acc, l) => { (acc[l.product.store] ||= []).push(l); return acc }, {} as Record<StoreId, typeof lines>)
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
  const commission = lines.reduce((s, l) => s + l.product.price * l.qty * (STORES[l.product.store].commissionPct / 100), 0)

  if (lines.length === 0) return (
    <div className="container section">
      <div className="empty card">
        <div className="ei"><IconCart size={28} /></div>
        <h3>Your FitCart is empty</h3>
        <p className="muted small" style={{ marginTop: 6, maxWidth: 380, margin: '6px auto 0' }}>Build an outfit in the studio or add items from Explore — everything you try on lands here.</p>
        <div className="row center gap-10" style={{ marginTop: 18 }}>
          <Link to="/studio" className="btn btn-primary"><IconSparkle size={16} /> Open Studio</Link>
          <Link to="/explore" className="btn btn-ghost">Explore products</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container section" style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>FitCart</h1>
      <p className="muted small" style={{ marginBottom: 20 }}>Grouped by store — you’ll complete each purchase on the store itself.</p>

      <div className="cart-grid">
        <div>
          {Object.entries(byStore).map(([sid, items]) => {
            const s = STORES[sid as StoreId]
            return (
              <div className="store-group" key={sid}>
                <div className="sg-head">
                  <span className="pill-store" style={{ background: storeSoft(sid as StoreId), color: storeColor(sid as StoreId) }}><IconStore size={12} /> {s.name}</span>
                  <span className="tiny dim">{items.length} item{items.length > 1 ? 's' : ''}</span>
                  <span className="grow" />
                  {s.cartWrite === 'PARTNER_ONLY'
                    ? <span className="badge badge-good">Partner · cart-sync</span>
                    : <span className="badge badge-neutral">Deep-link checkout</span>}
                </div>
                {items.map(l => (
                  <div className="line-item" key={l.productId + l.size}>
                    <div className="li-thumb"><ProductImage product={l.product} /></div>
                    <div className="grow">
                      <Link to={`/product/${l.product.id}`} className="strong small">{l.product.brand} — {l.product.name}</Link>
                      <div className="tiny dim" style={{ marginTop: 3 }}>Size {l.size} · {l.product.colorName}</div>
                      <div className="row between" style={{ marginTop: 8 }}>
                        <div className="qty">
                          <button onClick={() => setQty(l.productId, l.size, l.qty - 1)} aria-label="Decrease">−</button>
                          <span>{l.qty}</span>
                          <button onClick={() => setQty(l.productId, l.size, l.qty + 1)} aria-label="Increase">+</button>
                        </div>
                        <div className="row gap-12">
                          <span className="strong">{inr(l.product.price * l.qty)}</span>
                          <button className="tiny" style={{ color: 'var(--bad)', border: 0, background: 'none', cursor: 'pointer', fontWeight: 600 }} onClick={() => { removeFromCart(l.productId, l.size); toast('Removed from cart') }}>Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <aside className="summary card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Summary</h3>
          <div className="line"><span className="muted">Items ({lines.reduce((s, l) => s + l.qty, 0)})</span><span className="mono">{inr(subtotal)}</span></div>
          <div className="line"><span className="muted">Stores</span><span>{Object.keys(byStore).length}</span></div>
          <hr className="divider" style={{ margin: '10px 0' }} />
          <div className="line" style={{ fontSize: 16 }}><span className="strong">Total</span><span className="strong mono">{inr(subtotal)}</span></div>
          <div className="banner banner-accent" style={{ marginTop: 14 }}>
            <IconLink size={16} />
            <div className="tiny">FitCart earns an est. <strong>{inr(Math.round(commission))}</strong> affiliate commission if you buy — even as a guest. Prices are paid on each store.</div>
          </div>
          <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }} onClick={() => nav('/checkout')}>
            Proceed to handoff <IconArrowR size={17} />
          </button>
          <Link to="/explore" className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>Continue shopping</Link>
        </aside>
      </div>
    </div>
  )
}
