import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { AVATARS } from '../data/avatars'
import { productById } from '../data/products'
import { STORE_LIST } from '../data/stores'
import { IconArrowR, IconShield, IconRuler, IconLayers, IconSparkle, IconStore, IconUser, IconCheck, IconTag } from '../components/Icon'

const heroGarments = {
  top: productById('p01'),      // sky blue shirt
  bottom: productById('p06'),   // indigo jeans
  shoes: productById('p12'),    // white sneakers
  watch: productById('p16'),
  sunglasses: productById('p18'),
}

const VALUES = [
  { icon: <IconRuler size={22} />, title: 'Will it fit me?', body: 'A personalized Fit Score with confidence — per shoulder, chest, waist, length — not just "how it looks."' },
  { icon: <IconLayers size={22} />, title: 'Does the outfit work?', body: 'Outfit intelligence scores colour harmony, occasion, body-shape and style across every piece.' },
  { icon: <IconStore size={22} />, title: 'Across your stores', body: 'Build one outfit from Myntra, AJIO, Amazon, Flipkart, Nykaa & more — the cross-store layer marketplaces can’t build.' },
  { icon: <IconShield size={22} />, title: 'Private by design', body: 'Your photos stay yours — preset avatars for guests, honest confidence, delete anytime.' },
]

export default function Landing() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">AI try-on · fit intelligence · cross-store</span>
            <h1 style={{ marginTop: 14 }}>Try it on. <span className="grad">Before you buy.</span><br />Across every store you shop.</h1>
            <p className="lead">FitCart AI builds a personalized avatar from your photos, dresses it in outfits from all your fashion apps, and tells you whether it <strong>fits</strong> and whether the <strong>look works</strong> — then hands you off to the store to check out.</p>
            <div className="hero-cta">
              <Link to="/studio" className="btn btn-primary btn-lg">Launch the Try-On Studio <IconArrowR size={18} /></Link>
              <Link to="/explore" className="btn btn-ghost btn-lg">Explore as guest — no login</Link>
            </div>
            <div className="trust-strip">
              <span className="t"><IconCheck size={15} /> Free guest mode</span>
              <span className="t"><IconShield size={15} /> Photos stay private</span>
              <span className="t"><IconTag size={15} /> Real prices from your stores</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="vh">
              <span className="badge badge-brand"><IconSparkle size={13} /> Live preview</span>
              <span className="badge badge-neutral">360° · multi-angle</span>
            </div>
            <div style={{ aspectRatio: '1/1', background: 'radial-gradient(120% 90% at 50% 6%, #fff, #efeaf9)', borderRadius: 16, overflow: 'hidden' }}>
              <Avatar avatar={AVATARS[2]} garments={heroGarments as any} angle={20} zoom={1} />
            </div>
            <div className="row between" style={{ marginTop: 12 }}>
              <div className="row gap-8">
                <span className="badge badge-accent">Fit 8.6 · 82%</span>
                <span className="badge badge-good">Outfit 8.4</span>
              </div>
              <span className="tiny dim">Athletic avatar · 5 items · 3 stores</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Why FitCart</span>
            <h2>Everyone else shows you how it looks. We tell you if it fits.</h2>
            <p>The visualization is the hook. The fit &amp; outfit intelligence — and the cross-store layer — are the point.</p>
          </div>
          <div className="grid val-grid">
            {VALUES.map(v => (
              <div className="card card-pad val-card hover-lift" key={v.title}>
                <div className="vi">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERMEDIARY DIAGRAM */}
      <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">The model</span>
            <h2>Not a marketplace — the intelligence layer in between</h2>
            <p>FitCart sits between the shopper and the stores. We don’t hold inventory or run checkout; we make shoppers confident and route the sale to the store (earning an affiliate commission).</p>
          </div>
          <div className="grid mid">
            <div className="mid-node">
              <div className="mi" style={{ background: 'var(--accent-050)', color: '#0b7f7e' }}><IconUser size={20} /></div>
              <h3 style={{ fontSize: 16 }}>Shopper</h3>
              <p className="small muted" style={{ marginTop: 6 }}>Uploads a photo, builds an outfit, wants to know it fits.</p>
            </div>
            <div className="mid-arrow">→</div>
            <div className="mid-node center">
              <div className="mi" style={{ background: 'linear-gradient(135deg,var(--brand-500),var(--accent))', color: '#fff' }}>🪞</div>
              <h3 style={{ fontSize: 16 }}>FitCart AI</h3>
              <p className="small muted" style={{ marginTop: 6 }}>Avatar · try-on · Fit Score · Outfit Score · cross-store cart · affiliate handoff.</p>
            </div>
            <div className="mid-arrow">→</div>
            <div className="mid-node">
              <div className="mi" style={{ background: 'var(--brand-050)', color: 'var(--brand)' }}><IconStore size={20} /></div>
              <h3 style={{ fontSize: 16 }}>Stores &amp; Brands</h3>
              <p className="small muted" style={{ marginTop: 6 }}>Myntra, AJIO, Amazon, Flipkart, Nykaa, Meesho — checkout &amp; fulfilment stay theirs.</p>
            </div>
          </div>
          <div className="row center gap-16 wrap" style={{ marginTop: 30 }}>
            {STORE_LIST.map(s => <span key={s.id} className="chip">{s.name}</span>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 40, textAlign: 'center', background: 'linear-gradient(135deg, var(--brand), #4c1d95)', color: '#fff', border: 0 }}>
            <h2 style={{ fontSize: 30 }}>See the whole journey in 90 seconds</h2>
            <p style={{ opacity: .9, marginTop: 10, maxWidth: 560, margin: '10px auto 0' }}>Pick an avatar, build a cross-store outfit, read the fit report, and hand off to checkout — all in the interactive studio.</p>
            <div className="row center gap-12" style={{ marginTop: 22 }}>
              <Link to="/studio" className="btn btn-lg" style={{ background: '#fff', color: 'var(--brand)' }}>Open Try-On Studio <IconArrowR size={18} /></Link>
              <Link to="/partner" className="btn btn-lg btn-ghost" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.4)' }}>See the Brand dashboard</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
