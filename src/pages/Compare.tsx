import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp, TIER_RANK, SavedOutfit } from '../store/AppContext'
import { avatarById } from '../data/avatars'
import { productById } from '../data/products'
import Avatar from '../components/Avatar'
import { IconLayers, IconSparkle, IconArrowR, IconCheck } from '../components/Icon'

function OutfitPanel({ o }: { o: SavedOutfit }) {
  const avatar = avatarById(o.avatarId)
  const garments: any = {}
  o.items.forEach(it => { const p = productById(it.productId); if (p) garments[it.slot] = p })
  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 16, marginBottom: 8 }}>{o.name}</h3>
      <div style={{ aspectRatio: '3/4', background: 'radial-gradient(120% 90% at 50% 6%,#fff,#efeaf9)', borderRadius: 14, overflow: 'hidden' }}>
        <Avatar avatar={avatar} garments={garments} angle={15} zoom={1} />
      </div>
      <div className="row gap-8" style={{ marginTop: 12 }}>
        {o.fit != null && <span className="badge badge-accent">Fit {o.fit}</span>}
        {o.outfit != null && <span className="badge badge-good">Outfit {o.outfit}</span>}
        <span className="tiny dim">{o.items.length} items</span>
      </div>
      <div className="stack gap-4" style={{ marginTop: 10 }}>
        {o.items.map((it, i) => {
          const p = productById(it.productId)
          return p ? <div key={i} className="small muted">• {p.brand} <span className="dim">{p.name} · {it.size}</span></div> : null
        })}
      </div>
    </div>
  )
}

export default function Compare() {
  const { tier, saved } = useApp()
  const nav = useNavigate()
  const [a, setA] = useState(saved[0]?.id ?? '')
  const [b, setB] = useState(saved[1]?.id ?? '')

  if (TIER_RANK[tier] < TIER_RANK.pro) return (
    <div className="container section" style={{ maxWidth: 560 }}>
      <div className="card card-pad" style={{ textAlign: 'center', padding: 32, background: 'linear-gradient(135deg,var(--brand-050),#fff)' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}><IconLayers size={26} /></div>
        <h1 style={{ fontSize: 22 }}>Compare outfits is a Pro feature</h1>
        <p className="muted" style={{ marginTop: 8 }}>Put two looks side by side — fit, outfit score and every item — to decide with confidence.</p>
        <button className="btn btn-primary btn-lg" style={{ marginTop: 18 }} onClick={() => nav('/pricing')}>See Pro <IconArrowR size={16} /></button>
      </div>
    </div>
  )

  if (saved.length < 2) return (
    <div className="container section">
      <div className="empty card">
        <div className="ei"><IconLayers size={26} /></div>
        <h3>Save at least two outfits to compare</h3>
        <p className="muted small" style={{ marginTop: 6 }}>Build looks in the Studio and tap “Save”.</p>
        <Link to="/studio" className="btn btn-primary" style={{ marginTop: 16 }}><IconSparkle size={16} /> Open Studio</Link>
      </div>
    </div>
  )

  const oa = saved.find(s => s.id === a)
  const ob = saved.find(s => s.id === b)

  return (
    <div className="container section" style={{ paddingTop: 24 }}>
      <div className="row gap-8" style={{ marginBottom: 6 }}>
        <h1 style={{ fontSize: 26 }}>Compare outfits</h1><span className="badge badge-brand">Pro</span>
      </div>
      <p className="muted small" style={{ marginBottom: 20 }}>Two looks, side by side.</p>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <label className="field">Outfit A</label>
          <select className="select" value={a} onChange={e => setA(e.target.value)}>
            {saved.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div style={{ marginTop: 12 }}>{oa && <OutfitPanel o={oa} />}</div>
        </div>
        <div>
          <label className="field">Outfit B</label>
          <select className="select" value={b} onChange={e => setB(e.target.value)}>
            {saved.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div style={{ marginTop: 12 }}>{ob && <OutfitPanel o={ob} />}</div>
        </div>
      </div>
      {oa && ob && oa.outfit != null && ob.outfit != null && (
        <div className="banner banner-accent" style={{ marginTop: 18 }}>
          <IconCheck size={18} /><div className="small">
            {oa.outfit === ob.outfit ? 'Both looks score evenly — pick by mood.'
              : <>“<strong>{(oa.outfit > ob.outfit ? oa : ob).name}</strong>” scores higher overall ({Math.max(oa.outfit, ob.outfit)} vs {Math.min(oa.outfit, ob.outfit)}).</>}
          </div>
        </div>
      )}
    </div>
  )
}
