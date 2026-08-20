import { Link } from 'react-router-dom'
import { IconArrowR, IconShield, IconLink } from '../components/Icon'

const STEPS = [
  { t: 'Explore across your stores', d: 'Browse a unified catalog pulled from Myntra, AJIO, Amazon, Flipkart, Nykaa & Meesho. Search, filter and compare — no app-switching.' },
  { t: 'Pick or build your avatar', d: 'Guests use realistic preset avatars instantly. Signed-in users generate a personalized avatar from a photo (pose, lighting & full-body validated), with an honest confidence score.' },
  { t: 'Build a complete outfit', d: 'Add a top, bottom, jacket, shoes, watch, sunglasses and accessories — mixing items from different stores into one look.' },
  { t: 'Try it on & inspect', d: 'See the outfit on your avatar, rotate through multiple angles and zoom into detail. (MVP renders a set of angles — not free-camera 3D, and we say so.)' },
  { t: 'Read the Fit & Outfit reports', d: 'Per-region Fit Score with confidence (“trousers may run slightly long”) plus an Outfit Score for colour, occasion, body-shape and style.' },
  { t: 'Hand off to the store', d: 'Add to FitCart and check out on the original store — deep-linked and affiliate-attributed. Partner stores can sync straight to their cart.' },
]

export default function HowItWorks() {
  return (
    <div className="container section" style={{ paddingTop: 28, maxWidth: 860 }}>
      <div className="sec-head" style={{ margin: '0 0 22px', textAlign: 'left' }}>
        <span className="eyebrow">How it works</span>
        <h2 style={{ fontSize: 30, marginTop: 8 }}>From “will it fit?” to checkout — in one flow</h2>
        <p style={{ marginTop: 10 }}>FitCart is the intelligence layer between you and the stores. Here’s the full loop.</p>
      </div>

      <div className="card card-pad">
        {STEPS.map((s, i) => (
          <div className="how-step" key={i} style={i === STEPS.length - 1 ? { borderBottom: 0 } : undefined}>
            <div className="n">{i + 1}</div>
            <div><h3 style={{ fontSize: 17 }}>{s.t}</h3><p className="muted small" style={{ marginTop: 5 }}>{s.d}</p></div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 20 }}>
        <div className="banner banner-accent"><IconShield size={18} /><div className="small"><strong>Private by design.</strong> Body photos are treated as sensitive data — preset avatars for guests, deletion after use, and a confidence score on every estimate. We never claim a guaranteed measurement.</div></div>
        <div className="banner banner-warn"><IconLink size={18} /><div className="small"><strong>Honest about carts.</strong> No public API lets us write to most stores’ carts, so we deep-link (with affiliate) by default. True cart-sync is a partner-only feature — never faked.</div></div>
      </div>

      <div className="row center gap-12" style={{ marginTop: 26 }}>
        <Link to="/studio" className="btn btn-primary btn-lg">Try it now <IconArrowR size={18} /></Link>
        <Link to="/explore" className="btn btn-ghost btn-lg">Browse products</Link>
      </div>
    </div>
  )
}
