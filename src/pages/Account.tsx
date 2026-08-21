import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { tierById, TIERS } from '../data/pricing'
import { IconShield, IconSparkle, IconArrowR, IconCheck, IconRuler, IconLayers } from '../components/Icon'

export default function Account() {
  const { user, tier, saved, orders, logout, toast, deleteSaved } = useApp()
  const nav = useNavigate()
  if (!user) return null
  const t = tierById(tier)
  const since = new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const wipe = () => {
    saved.forEach(s => deleteSaved(s.id))
    toast('Your saved data was deleted (DPDP)', '🗑')
  }

  return (
    <div className="container section" style={{ paddingTop: 28, maxWidth: 900 }}>
      <div className="row between wrap gap-12" style={{ marginBottom: 20 }}>
        <div className="row gap-14">
          <div style={{ width: 58, height: 58, borderRadius: 16, background: 'linear-gradient(135deg,var(--brand-500),var(--accent))', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 800 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize: 24 }}>{user.name}</h1>
            <p className="muted small">{user.email} · member since {since}</p>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => { logout(); toast('Signed out'); nav('/') }}>Sign out</button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
        <div className="card card-pad" style={{ borderColor: t.accent }}>
          <div className="row between">
            <div>
              <span className="eyebrow" style={{ color: t.accent }}>Current plan</span>
              <h2 style={{ fontSize: 22, marginTop: 4 }}>{t.name}</h2>
              <p className="small muted">{t.tagline}</p>
            </div>
            <span className="tier-badge" style={{ background: 'var(--brand-050)', color: t.accent }}><IconShield size={13} /> {t.name}</span>
          </div>
          <ul className="tier-feats" style={{ marginTop: 14 }}>
            {t.features.slice(0, 4).map((f, i) => (
              <li key={i}><span style={{ color: 'var(--good)', display: 'inline-flex', flex: 'none' }}><IconCheck size={14} /></span>{f.replace('★ ', '')}</li>
            ))}
          </ul>
          <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={() => nav('/pricing')}>
            {tier === 'studio' ? 'Manage plan' : 'Upgrade plan'} <IconArrowR size={16} />
          </button>
        </div>

        <div className="stack gap-14">
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Link to="/saved" className="card card-pad hover-lift" style={{ textDecoration: 'none' }}>
              <div className="row gap-8"><IconLayers size={18} className="" /><span className="tiny dim">Saved outfits</span></div>
              <div className="kv" style={{ fontSize: 26, marginTop: 6 }}>{saved.length}</div>
            </Link>
            <Link to="/orders" className="card card-pad hover-lift" style={{ textDecoration: 'none' }}>
              <div className="row gap-8"><IconRuler size={18} /><span className="tiny dim">Orders</span></div>
              <div className="kv" style={{ fontSize: 26, marginTop: 6 }}>{orders.length}</div>
            </Link>
          </div>
          <div className="card card-pad">
            <h3 style={{ fontSize: 15, marginBottom: 6 }}><IconShield size={15} /> Privacy & data</h3>
            <p className="tiny muted">Your body data stays private and every fit estimate shows a confidence score. Delete anytime.</p>
            <button className="btn btn-sm btn-block" style={{ marginTop: 10, background: 'var(--bad-bg)', color: 'var(--bad)' }} onClick={wipe}>Delete my saved data</button>
          </div>
        </div>
      </div>

      {tier !== 'studio' && (
        <div className="card card-pad" style={{ marginTop: 18, background: 'linear-gradient(135deg,#f2ecfe,#fff)' }}>
          <div className="row between wrap gap-12">
            <div className="row gap-10"><span style={{ color: '#7c3aed', display: 'inline-flex' }}><IconSparkle size={20} /></span>
              <div><h3 style={{ fontSize: 16 }}>Unlock more of FitCart</h3>
                <p className="small muted">{tier === 'guest' || tier === 'style' ? 'Pro adds AI Fit Images; Studio 3D adds your personal 3D avatar.' : 'Studio 3D adds your personal 3D avatar + real 360°.'}</p></div>
            </div>
            <button className="btn btn-primary" onClick={() => nav('/pricing')}>See plans</button>
          </div>
        </div>
      )}
    </div>
  )
}
