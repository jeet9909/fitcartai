import { Link } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { STORES, storeColor, storeSoft } from '../data/stores'
import { inr } from '../lib/format'
import { IconCheck, IconStore, IconLink, IconSparkle, IconArrowR, IconRuler } from '../components/Icon'

export default function Confirmation() {
  const { lastOrder } = useApp()
  if (!lastOrder) return (
    <div className="container section"><div className="empty card"><h3>No recent order</h3><Link to="/studio" className="btn btn-soft" style={{ marginTop: 14 }}>Start a try-on</Link></div></div>
  )
  const o = lastOrder
  return (
    <div className="container section" style={{ paddingTop: 24, maxWidth: 760 }}>
      <div className="steps">
        <div className="step done"><span className="dot"><IconCheck size={13} /></span> Cart</div>
        <div className="step-line" />
        <div className="step done"><span className="dot"><IconCheck size={13} /></span> Handoff</div>
        <div className="step-line" />
        <div className="step on"><span className="dot"><IconCheck size={13} /></span> Done</div>
      </div>

      <div className="card card-pad" style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--good-bg)', color: 'var(--good)', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}><IconCheck size={30} /></div>
        <h1 style={{ fontSize: 26 }}>You’re all set!</h1>
        <p className="muted" style={{ marginTop: 8, maxWidth: 460, margin: '8px auto 0' }}>Your purchases are being completed on each store. Here’s your FitCart summary.</p>
        <div className="row center gap-8" style={{ marginTop: 14 }}>
          <span className="badge badge-neutral mono">Order {o.id}</span>
          <span className="badge badge-neutral">{o.date}</span>
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 18 }}>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Your stores</h3>
        {o.groups.map(g => (
          <div key={g.store} className="row between" style={{ padding: '10px 0', borderBottom: '1px solid var(--line-2)' }}>
            <div className="row gap-10">
              <span className="pill-store" style={{ background: storeSoft(g.store), color: storeColor(g.store) }}><IconStore size={12} /> {STORES[g.store].name}</span>
              <span className="small muted">{g.items.length} item{g.items.length > 1 ? 's' : ''}</span>
            </div>
            <span className={`badge ${g.action === 'cart_sync' ? 'badge-good' : 'badge-neutral'}`}>{g.action === 'cart_sync' ? <><IconLink size={12} /> Cart-synced</> : <><IconLink size={12} /> Deep-linked</>}</span>
          </div>
        ))}
        <div className="row between" style={{ marginTop: 14, fontSize: 16 }}><span className="strong">Total (paid on stores)</span><span className="strong mono">{inr(o.total)}</span></div>
        <div className="banner banner-accent" style={{ marginTop: 12 }}>
          <IconLink size={16} /><div className="small">FitCart earned an estimated <strong>{inr(o.affiliateEarned)}</strong> affiliate commission — revenue preserved even in a free guest session.</div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 18, background: 'linear-gradient(135deg,var(--brand-050),#fff)' }}>
        <div className="row gap-12">
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><IconRuler size={22} /></div>
          <div className="grow">
            <h3 style={{ fontSize: 15 }}>Did it fit? Tell us.</h3>
            <p className="small muted" style={{ marginTop: 3 }}>Post-purchase fit feedback is what makes FitCart’s predictions smarter over time — the data moat.</p>
          </div>
        </div>
        <div className="row gap-10" style={{ marginTop: 12 }}>
          <button className="btn btn-soft grow">👍 Fit was accurate</button>
          <button className="btn btn-ghost grow">👎 Ran off</button>
        </div>
      </div>

      <div className="row center gap-12" style={{ marginTop: 24 }}>
        <Link to="/studio" className="btn btn-primary"><IconSparkle size={16} /> Build another outfit</Link>
        <Link to="/partner" className="btn btn-ghost">See the Brand view <IconArrowR size={16} /></Link>
      </div>
    </div>
  )
}
