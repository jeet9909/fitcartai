import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { TIERS, MATRIX, FAQ } from '../data/pricing'
import type { TierId } from '../store/AppContext'
import { inr } from '../lib/format'
import { IconCheck, IconClose, IconSparkle, IconShield, IconArrowR, IconRuler, IconLayers, IconTag } from '../components/Icon'

function Cell({ v, accent }: { v: boolean | string; accent: string }) {
  if (v === true) return <span style={{ color: 'var(--good)', display: 'inline-flex' }}><IconCheck size={17} /></span>
  if (v === false) return <span style={{ color: 'var(--line)', display: 'inline-flex' }}><IconClose size={15} /></span>
  return <span className="small strong" style={{ color: accent }}>{v}</span>
}

export default function Pricing() {
  const { tier, setTier, toast } = useApp()
  const nav = useNavigate()
  const [annual, setAnnual] = useState(false)

  const choose = (id: TierId) => {
    setTier(id)
    if (id === 'guest') { toast('Exploring as guest'); nav('/explore') }
    else { toast(`${TIERS.find(t => t.id === id)!.name} unlocked (demo)`, '✓'); nav('/studio') }
  }

  return (
    <div className="container section" style={{ paddingTop: 28 }}>
      <div className="sec-head">
        <span className="eyebrow">Pricing</span>
        <h2 style={{ fontSize: 34 }}>Pay for how you want to see yourself</h2>
        <p>From instant guest try-ons to a true <strong>personalized 3D avatar</strong>. Every tier keeps your photos private and every fit estimate honest.</p>
      </div>

      {/* billing toggle */}
      <div className="row center gap-12" style={{ marginBottom: 28 }}>
        <span className={`small ${!annual ? 'strong' : 'muted'}`}>Monthly</span>
        <button className="bill-toggle" role="switch" aria-checked={annual} onClick={() => setAnnual(a => !a)}>
          <span className="knob" style={{ transform: annual ? 'translateX(22px)' : 'translateX(0)' }} />
        </button>
        <span className={`small ${annual ? 'strong' : 'muted'}`}>Annual <span className="badge badge-good">save ~2 months</span></span>
      </div>

      {/* tier cards */}
      <div className="grid price-grid">
        {TIERS.map(t => {
          const price = annual ? Math.round(t.annual / 12) : t.monthly
          const isCurrent = tier === t.id
          return (
            <div key={t.id} className={`card tier-card${t.highlight ? ' pop' : ''}${t.top ? ' flagship' : ''}`}>
              {t.highlight && <div className="tier-flag">Most popular</div>}
              {t.top && <div className="tier-flag flag-top"><IconSparkle size={12} /> Flagship · 3D</div>}
              <div className="tier-head">
                <h3 style={{ fontSize: 19, color: t.accent }}>{t.name}</h3>
                <p className="tiny muted">{t.tagline}</p>
              </div>
              <div className="tier-price">
                {t.monthly === 0 ? <span className="amt">Free</span>
                  : <><span className="amt">{inr(price)}</span><span className="per">/mo</span></>}
                {annual && t.monthly > 0 && <div className="tiny dim">billed {inr(t.annual)}/yr</div>}
              </div>
              <p className="small muted" style={{ minHeight: 40 }}>{t.blurb}</p>
              <button className={`btn btn-block ${t.top ? 'btn-primary' : t.highlight ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => choose(t.id)} disabled={isCurrent}
                style={t.top ? { background: t.accent, borderColor: t.accent } : undefined}>
                {isCurrent ? 'Current plan' : t.cta}
              </button>
              <ul className="tier-feats">
                {t.features.map((f, i) => (
                  <li key={i}>
                    <span style={{ color: f.startsWith('★') ? t.accent : 'var(--good)', display: 'inline-flex', flex: 'none', marginTop: 2 }}>
                      {f.startsWith('★') ? <IconSparkle size={14} /> : <IconCheck size={14} />}
                    </span>
                    <span className={f.startsWith('★') ? 'strong' : ''}>{f.replace('★ ', '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* the gate, called out */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 26 }}>
        <div className="card card-pad" style={{ borderColor: 'var(--brand)', background: 'linear-gradient(135deg,var(--brand-050),#fff)' }}>
          <div className="row gap-10"><div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><IconLayers size={20} /></div>
            <div><h3 style={{ fontSize: 16 }}>Pro → AI Fit Images</h3><p className="small muted" style={{ marginTop: 4 }}>Fine, HD images of how each outfit looks <strong>on you</strong>, with a Fit Check overlay on shoulders, chest, length &amp; more. Realistic try-on imagery — no 3D reconstruction needed.</p></div>
          </div>
        </div>
        <div className="card card-pad" style={{ borderColor: '#7c3aed', background: 'linear-gradient(135deg,#f2ecfe,#fff)' }}>
          <div className="row gap-10"><div style={{ width: 40, height: 40, borderRadius: 11, background: '#7c3aed', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><IconSparkle size={20} /></div>
            <div><h3 style={{ fontSize: 16 }}>Studio 3D → your own 3D avatar</h3><p className="small muted" style={{ marginTop: 4 }}>The only tier that turns your photos into a <strong>true personalized 3D avatar</strong> you can spin in real 360°. Reserved for the flagship tier to keep it sustainable.</p></div>
          </div>
        </div>
      </div>

      {/* comparison matrix */}
      <h2 style={{ fontSize: 24, margin: '46px 0 6px', textAlign: 'center' }}>Compare every feature</h2>
      <p className="muted small" style={{ textAlign: 'center', marginBottom: 22 }}>Usage and capability by tier.</p>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="dtable matrix">
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Feature</th>
                {TIERS.map(t => <th key={t.id} style={{ textAlign: 'center', color: t.accent }}>{t.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map(g => (
                <Fragment key={g.group}>
                  <tr className="matrix-group"><td colSpan={5}>{g.group}</td></tr>
                  {g.rows.map(r => (
                    <tr key={r.label}>
                      <td><div className="strong small">{r.label}</div>{r.note && <div className="tiny dim">{r.note}</div>}</td>
                      {TIERS.map(t => <td key={t.id} style={{ textAlign: 'center' }}><Cell v={r.vals[t.id]} accent={t.accent} /></td>)}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B2B */}
      <div className="card card-pad" style={{ marginTop: 26, background: 'linear-gradient(135deg,var(--ink),#3a2f5e)', color: '#fff', border: 0 }}>
        <div className="row between wrap gap-12">
          <div className="row gap-12"><div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,.15)', display: 'grid', placeItems: 'center', flex: 'none' }}><IconTag size={22} /></div>
            <div><h3 style={{ fontSize: 17 }}>Are you a brand or retailer?</h3><p className="small" style={{ opacity: .85, marginTop: 3 }}>License FitCart’s fit engine with the B2B Fit-SDK — cut returns, lift conversion.</p></div>
          </div>
          <button className="btn" style={{ background: '#fff', color: 'var(--ink)' }} onClick={() => nav('/partner')}>See Brand console <IconArrowR size={16} /></button>
        </div>
      </div>

      {/* FAQ */}
      <h2 style={{ fontSize: 24, margin: '46px 0 18px', textAlign: 'center' }}>Questions</h2>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {FAQ.map((f, i) => (
          <div className="card card-pad" key={i}>
            <div className="row gap-8" style={{ marginBottom: 6 }}><span style={{ color: 'var(--brand)', display: 'inline-flex' }}><IconRuler size={16} /></span><h3 style={{ fontSize: 15 }}>{f.q}</h3></div>
            <p className="small muted">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="banner banner-accent" style={{ marginTop: 26 }}>
        <IconShield size={18} /><div className="small"><strong>Demo note:</strong> choosing a plan here doesn’t charge anything — it just switches your tier so you can see exactly what unlocks in the Try-On Studio.</div>
      </div>
    </div>
  )
}
