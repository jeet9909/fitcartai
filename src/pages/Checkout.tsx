import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { productById } from '../data/products'
import { STORES, storeColor, storeSoft } from '../data/stores'
import { inr, orderId } from '../lib/format'
import { IconStore, IconLink, IconCheck, IconArrowR, IconShield } from '../components/Icon'
import type { StoreId, Order } from '../types'

export default function Checkout() {
  const { cart, placeOrder, toast } = useApp()
  const nav = useNavigate()
  const [opened, setOpened] = useState<Record<string, boolean>>({})

  const lines = cart.map(l => ({ ...l, product: productById(l.productId)! })).filter(l => l.product)
  if (lines.length === 0) { return (
    <div className="container section"><div className="empty card"><h3>Nothing to check out</h3><Link to="/explore" className="btn btn-soft" style={{ marginTop: 14 }}>Explore products</Link></div></div>
  )}

  const byStore = lines.reduce((acc, l) => { (acc[l.product.store] ||= []).push(l); return acc }, {} as Record<StoreId, typeof lines>)
  const groups = Object.entries(byStore)
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
  const allOpened = groups.every(([sid]) => opened[sid])

  const confirm = () => {
    const order: Order = {
      id: orderId(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      total,
      affiliateEarned: Math.round(lines.reduce((s, l) => s + l.product.price * l.qty * (STORES[l.product.store].commissionPct / 100), 0)),
      groups: groups.map(([sid, items]) => ({
        store: sid as StoreId,
        action: STORES[sid as StoreId].cartWrite === 'PARTNER_ONLY' ? 'cart_sync' : 'deeplink',
        commission: Math.round(items.reduce((s, l) => s + l.product.price * l.qty * (STORES[sid as StoreId].commissionPct / 100), 0)),
        items: items.map(l => ({ product: l.product, size: l.size, qty: l.qty })),
      })),
    }
    placeOrder(order)
    nav('/confirmation')
  }

  return (
    <div className="container section" style={{ paddingTop: 24, maxWidth: 820 }}>
      <div className="steps">
        <div className="step done"><span className="dot"><IconCheck size={13} /></span> Cart</div>
        <div className="step-line" />
        <div className="step on"><span className="dot">2</span> Store handoff</div>
        <div className="step-line" />
        <div className="step"><span className="dot">3</span> Confirmation</div>
      </div>

      <div className="banner banner-brand" style={{ marginBottom: 20 }}>
        <IconShield size={18} />
        <div><strong>How FitCart checkout works.</strong> We don’t take your payment — you complete each purchase on the store you already trust. FitCart opens each store with your items ready (affiliate-attributed). Partner stores can sync straight to their cart.</div>
      </div>

      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Open your stores</h1>
      <p className="muted small" style={{ marginBottom: 18 }}>{groups.length} store{groups.length > 1 ? 's' : ''} · {lines.length} items</p>

      {groups.map(([sid, items]) => {
        const s = STORES[sid as StoreId]
        const partner = s.cartWrite === 'PARTNER_ONLY'
        const isOpen = opened[sid]
        return (
          <div className="store-group" key={sid} style={{ marginBottom: 14 }}>
            <div className="sg-head">
              <span className="pill-store" style={{ background: storeSoft(sid as StoreId), color: storeColor(sid as StoreId) }}><IconStore size={12} /> {s.name}</span>
              <span className="grow" />
              {partner ? <span className="badge badge-good">Partner · cart-sync</span> : <span className="badge badge-neutral">Deep-link</span>}
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div className="stack gap-4" style={{ marginBottom: 12 }}>
                {items.map(l => <div className="row between small" key={l.productId + l.size}><span className="muted">{l.product.name} <span className="dim">· {l.size} · ×{l.qty}</span></span><span className="mono">{inr(l.product.price * l.qty)}</span></div>)}
              </div>
              <button className={`btn ${isOpen ? 'btn-soft' : partner ? 'btn-primary' : 'btn-dark'} btn-block`} onClick={() => { setOpened(o => ({ ...o, [sid]: true })); toast(partner ? `Synced to ${s.name} cart` : `Opened ${s.name} (demo)`, isOpen ? '✓' : '↗') }}>
                {isOpen ? <><IconCheck size={16} /> {partner ? 'Synced to cart' : `Opened in ${s.name}`}</>
                  : partner ? <><IconLink size={16} /> Sync {items.length} to {s.name} cart</>
                    : <><IconLink size={16} /> Open in {s.name}</>}
              </button>
            </div>
          </div>
        )
      })}

      <div className="card card-pad" style={{ marginTop: 16 }}>
        <div className="row between" style={{ fontSize: 16 }}><span className="strong">Order total (paid on stores)</span><span className="strong mono">{inr(total)}</span></div>
        <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 14 }} disabled={!allOpened} onClick={confirm}>
          {allOpened ? <>I’ve completed my purchases <IconArrowR size={17} /></> : `Open all ${groups.length} stores to continue`}
        </button>
        {!allOpened && <p className="tiny dim" style={{ textAlign: 'center', marginTop: 8 }}>Open each store above to simulate finishing checkout.</p>}
      </div>
    </div>
  )
}
