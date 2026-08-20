import { useState } from 'react'
import { PARTNER } from '../data/partner'
import { inr } from '../lib/format'
import { IconChart, IconTag, IconStore, IconRuler, IconLink, IconGrid, IconArrowR } from '../components/Icon'

type Tab = 'overview' | 'products' | 'fit' | 'orders'

export default function Partner() {
  const [tab, setTab] = useState<Tab>('overview')
  const p = PARTNER
  const maxBar = Math.max(...p.monthlyTryOns.map(m => m.v))

  return (
    <div className="container section" style={{ paddingTop: 24 }}>
      <div className="row between wrap gap-12" style={{ marginBottom: 20 }}>
        <div>
          <span className="eyebrow">For Brands · B2B</span>
          <h1 style={{ fontSize: 26, marginTop: 6 }}>{p.brand} — Fit Intelligence Console</h1>
          <p className="muted small" style={{ marginTop: 4 }}>The “seller side” of the intermediary: how a brand sees FitCart traffic, fit accuracy, and return reduction.</p>
        </div>
        <span className="badge badge-brand" style={{ height: 'fit-content' }}>{p.plan}</span>
      </div>

      <div className="dash">
        <nav className="dash-nav card card-pad" style={{ padding: 8 }}>
          {([['overview', 'Overview', IconChart], ['products', 'Products', IconTag], ['fit', 'Fit insights', IconRuler], ['orders', 'Incoming', IconStore]] as const).map(([id, label, Ic]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id as Tab)}><Ic size={17} /> {label}</button>
          ))}
        </nav>

        <div className="stack gap-18">
          {tab === 'overview' && (
            <>
              <div className="grid kpi-grid">
                {[
                  { label: 'Try-ons (90d)', val: p.kpis.tryOns.toLocaleString('en-IN'), d: '+18% MoM', tone: 'var(--good)' },
                  { label: 'Store handoffs', val: p.kpis.handoffs.toLocaleString('en-IN'), d: `${p.kpis.handoffRate}% of try-ons`, tone: 'var(--brand)' },
                  { label: 'Return reduction', val: `−${p.kpis.returnReduction}%`, d: 'vs non-FitCart', tone: 'var(--good)' },
                  { label: 'Revenue attributed', val: `₹${p.kpis.revenueAttributed}L`, d: 'this quarter', tone: 'var(--ink)' },
                ].map(k => (
                  <div className="card card-pad kpi" key={k.label}>
                    <span className="tiny dim">{k.label}</span>
                    <div className="kv">{k.val}</div>
                    <div className="kd" style={{ color: k.tone }}>{k.d}</div>
                  </div>
                ))}
              </div>

              <div className="card card-pad">
                <div className="row between" style={{ marginBottom: 6 }}><h3 style={{ fontSize: 16 }}>Monthly try-ons</h3><span className="tiny dim">in thousands</span></div>
                <div className="bars">
                  {p.monthlyTryOns.map(m => (
                    <div className="bar" key={m.m} style={{ height: `${(m.v / maxBar) * 100}%` }} title={`${m.v}k`}><span>{m.m}</span></div>
                  ))}
                </div>
                <div style={{ height: 22 }} />
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="card card-pad">
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>Fit accuracy</h3>
                  <div className="kv" style={{ color: 'var(--accent)' }}>{p.kpis.fitAccuracy}%</div>
                  <p className="small muted" style={{ marginTop: 4 }}>Shoppers who confirmed “fit was accurate” post-purchase — the data flywheel.</p>
                </div>
                <div className="card card-pad">
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>Cross-store reach</h3>
                  <p className="small muted" style={{ marginTop: 4 }}>Your items appear inside outfits alongside 5 other stores — discovery you don’t get in a single-catalog silo.</p>
                  <div className="row gap-6 wrap" style={{ marginTop: 10 }}>{['Myntra', 'AJIO', 'Amazon', 'Flipkart', 'Nykaa'].map(s => <span className="chip" key={s}>{s}</span>)}</div>
                </div>
              </div>
            </>
          )}

          {tab === 'products' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-pad" style={{ paddingBottom: 0 }}><h3 style={{ fontSize: 16 }}><IconGrid size={16} /> Product performance</h3></div>
              <div style={{ overflowX: 'auto' }}>
                <table className="dtable">
                  <thead><tr><th>Product</th><th>Try-ons</th><th>Handoffs</th><th>Avg fit</th><th>True-to-size</th></tr></thead>
                  <tbody>
                    {p.topProducts.map(t => (
                      <tr key={t.name}>
                        <td className="strong">{t.name}</td>
                        <td className="mono">{t.tryOns.toLocaleString('en-IN')}</td>
                        <td className="mono">{t.handoffs.toLocaleString('en-IN')}</td>
                        <td><span className="badge badge-accent">{t.fit.toFixed(1)}</span></td>
                        <td><span className={`badge ${t.trueToSize >= 85 ? 'badge-good' : t.trueToSize >= 72 ? 'badge-warn' : 'badge-bad'}`}>{t.trueToSize}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'fit' && (
            <div className="card card-pad">
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>Aggregate fit insights</h3>
              <p className="small muted" style={{ marginBottom: 14 }}>What FitCart’s fit engine learns about your sizing — actionable signals to cut returns.</p>
              <div className="stack gap-10">
                {p.fitInsights.map(f => (
                  <div className="row between" key={f.region} style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10 }}>
                    <div><div className="strong small">{f.region}</div><div className="tiny muted" style={{ marginTop: 2 }}>{f.signal}</div></div>
                    <span className={`badge ${f.tone === 'good' ? 'badge-good' : 'badge-warn'}`}>{f.tone === 'good' ? 'On target' : 'Adjust size chart'}</span>
                  </div>
                ))}
              </div>
              <div className="banner banner-brand" style={{ marginTop: 16 }}>
                <IconLink size={18} /><div className="small">These signals ship via the <strong>Fit-SDK</strong> — the high-margin B2B product FitCart licenses to brands.</div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-pad" style={{ paddingBottom: 0 }}><h3 style={{ fontSize: 16 }}><IconStore size={16} /> Incoming FitCart handoffs</h3></div>
              <div style={{ overflowX: 'auto' }}>
                <table className="dtable">
                  <thead><tr><th>Order</th><th>Customer</th><th>Avatar</th><th>Items</th><th>Value</th><th>Status</th></tr></thead>
                  <tbody>
                    {p.incomingOrders.map(o => (
                      <tr key={o.id}>
                        <td className="mono strong">{o.id}</td>
                        <td>{o.customer}</td>
                        <td><span className="chip">{o.avatar}</span></td>
                        <td className="mono">{o.items}</td>
                        <td className="mono">{inr(o.value)}</td>
                        <td><span className={`badge ${o.status === 'Purchased' ? 'badge-good' : 'badge-neutral'}`}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card card-pad" style={{ background: 'linear-gradient(135deg,var(--ink),#3a2f5e)', color: '#fff', border: 0 }}>
            <div className="row between wrap gap-12">
              <div><h3 style={{ fontSize: 17 }}>Bring FitCart’s fit engine to your store</h3><p className="small" style={{ opacity: .85, marginTop: 4 }}>Cut returns, lift conversion, and see how your sizing really fits real bodies.</p></div>
              <button className="btn" style={{ background: '#fff', color: 'var(--ink)' }}>Request Fit-SDK access <IconArrowR size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
