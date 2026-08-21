import { Link } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { STORES, storeColor, storeSoft } from '../data/stores'
import { inr } from '../lib/format'
import { IconStore, IconLink, IconSparkle, IconCheck } from '../components/Icon'
import type { StoreId } from '../types'

export default function Orders() {
  const { orders } = useApp()

  if (orders.length === 0) return (
    <div className="container section">
      <div className="empty card">
        <div className="ei"><IconStore size={26} /></div>
        <h3>No orders yet</h3>
        <p className="muted small" style={{ marginTop: 6 }}>When you hand off to a store, your order summary shows up here.</p>
        <Link to="/explore" className="btn btn-primary" style={{ marginTop: 16 }}><IconSparkle size={16} /> Start shopping</Link>
      </div>
    </div>
  )

  return (
    <div className="container section" style={{ paddingTop: 24, maxWidth: 820 }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Order history</h1>
      <p className="muted small" style={{ marginBottom: 20 }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      <div className="stack gap-14">
        {orders.map(o => (
          <div className="card card-pad" key={o.id}>
            <div className="row between wrap gap-8" style={{ marginBottom: 12 }}>
              <div className="row gap-8"><span className="badge badge-neutral mono">{o.id}</span><span className="tiny dim">{o.date}</span></div>
              <div className="row gap-8"><span className="strong">{inr(o.total)}</span><span className="badge badge-good"><IconCheck size={11} /> Completed</span></div>
            </div>
            <div className="row gap-8 wrap">
              {o.groups.map(g => (
                <span key={g.store} className="chip" style={{ background: storeSoft(g.store as StoreId), color: storeColor(g.store as StoreId), border: 0 }}>
                  <IconStore size={12} /> {STORES[g.store as StoreId].name} · {g.items.length}
                </span>
              ))}
            </div>
            <div className="tiny dim row gap-6" style={{ marginTop: 10 }}><IconLink size={12} /> Affiliate earned est. {inr(o.affiliateEarned)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
