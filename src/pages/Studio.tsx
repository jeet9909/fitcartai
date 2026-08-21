import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import ProductImage from '../components/ProductImage'
import { ScoreRing, Meter, fitTone, Confidence } from '../components/Scores'
import { AVATARS, avatarById } from '../data/avatars'
import { PRODUCTS, productById } from '../data/products'
import { STORES, storeColor, storeSoft } from '../data/stores'
import { useApp, outfitProducts, TIER_RANK } from '../store/AppContext'
import { tierById } from '../data/pricing'
import { fitReport, outfitScore } from '../lib/scoring'
import { inr } from '../lib/format'
import type { Slot, Product } from '../types'
import {
  IconShirt, IconPants, IconJacket, IconShoe, IconWatch, IconGlasses, IconBag,
  IconRotate, IconZoomIn, IconZoomOut, IconSparkle, IconCart, IconArrowR, IconCheck, IconShield, IconClose,
  IconLayers, IconRuler,
} from '../components/Icon'

const SLOTS: { slot: Slot; label: string; icon: any; cats: string[] }[] = [
  { slot: 'top', label: 'Top', icon: IconShirt, cats: ['shirt', 'tshirt', 'dress'] },
  { slot: 'bottom', label: 'Bottom', icon: IconPants, cats: ['jeans', 'trousers'] },
  { slot: 'outer', label: 'Jacket', icon: IconJacket, cats: ['jacket'] },
  { slot: 'shoes', label: 'Shoes', icon: IconShoe, cats: ['shoes'] },
  { slot: 'watch', label: 'Watch', icon: IconWatch, cats: ['watch'] },
  { slot: 'sunglasses', label: 'Sunglasses', icon: IconGlasses, cats: ['sunglasses'] },
  { slot: 'accessory', label: 'Accessory', icon: IconBag, cats: ['accessory'] },
]

const ANGLE_LABEL = (a: number) => {
  const n = ((a % 360) + 360) % 360
  if (n < 23 || n >= 338) return 'Front'
  if (n < 68) return 'Front ¾'
  if (n < 113) return 'Right side'
  if (n < 158) return 'Back ¾'
  if (n < 203) return 'Back'
  if (n < 248) return 'Back ¾'
  if (n < 293) return 'Left side'
  return 'Front ¾'
}

export default function Studio() {
  const { avatarId, setAvatar, outfit, setOutfitSlot, clearSlot, addToCart, toast, tier, setTier, signedIn, saveOutfit } = useApp()
  const nav = useNavigate()
  const avatar = avatarById(avatarId)
  const [angle, setAngle] = useState(20)
  const [zoom, setZoom] = useState(1)
  const [picker, setPicker] = useState<Slot | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [fitImgOpen, setFitImgOpen] = useState(false)
  const [personalized, setPersonalized] = useState(false)

  const rank = TIER_RANK[tier]
  const canFitImage = rank >= TIER_RANK.pro       // Pro+ → AI Fit Images
  const can3D = rank >= TIER_RANK.studio          // Studio 3D → personalized 3D avatar
  const is3D = personalized && can3D
  const watermark = rank < TIER_RANK.style        // guest renders are watermarked

  const garments = useMemo(() => {
    const g: any = {}
    for (const { slot } of SLOTS) { const sel = outfit[slot]; if (sel) g[slot] = productById(sel.productId) }
    return g
  }, [outfit])

  const chosen = outfitProducts(outfit)
  const apparel = chosen.filter(c => ['top', 'bottom', 'outer', 'shoes'].includes(c.slot))
  const oScore = useMemo(() => outfitScore(chosen.map(c => c.product), avatar), [chosen, avatar])

  const addOutfitToCart = () => {
    if (chosen.length === 0) { toast('Add some items first', '!'); return }
    chosen.forEach(c => addToCart(c.product.id, c.size))
    toast(`${chosen.length} item${chosen.length > 1 ? 's' : ''} added to FitCart`, '🛒')
  }

  const onSaveOutfit = () => {
    if (chosen.length === 0) { toast('Add some items first', '!'); return }
    if (!signedIn) { toast('Sign in to save outfits', '🔒'); nav('/login', { state: { next: '/studio' } }); return }
    const fitScores = apparel.map(({ product, size }) => fitReport(avatar, product, size).score)
    const fitAvg = fitScores.length ? Math.round((fitScores.reduce((s, v) => s + v, 0) / fitScores.length) * 10) / 10 : undefined
    saveOutfit({
      name: oScore ? `${oScore.occasionLabel.replace('-', ' ')} look` : 'My outfit',
      avatarId,
      items: chosen.map(c => ({ slot: c.slot, productId: c.product.id, size: c.size })),
      fit: fitAvg,
      outfit: oScore?.composite,
    })
    toast('Outfit saved to your looks', '💾')
  }

  return (
    <div className="container section" style={{ paddingTop: 24 }}>
      <div className="row between wrap gap-12" style={{ marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 26 }}>Try-On Studio</h1>
          <p className="muted small" style={{ marginTop: 4 }}>Pick an avatar, build an outfit across stores, and read the fit &amp; outfit report.</p>
        </div>
        <Link to="/explore" className="btn btn-soft"><IconSparkle size={16} /> Add items from Explore</Link>
      </div>

      {/* plan bar */}
      <div className="card card-pad row between wrap gap-12" style={{ marginBottom: 18, padding: '12px 16px' }}>
        <div className="row gap-10">
          <span className="tier-badge" style={{ background: 'var(--brand-050)', color: tierById(tier).accent }}><IconShield size={13} /> {tierById(tier).name} plan</span>
          <span className="small muted">
            {can3D ? 'Personalized 3D avatar unlocked'
              : canFitImage ? 'AI Fit Images unlocked · 3D avatar is Studio-only'
              : 'Preset avatars · upgrade for AI Fit Images & 3D'}
          </span>
        </div>
        {!can3D && <button className="btn btn-primary btn-sm" onClick={() => nav('/pricing')}><IconSparkle size={14} /> Upgrade plan</button>}
      </div>

      <div className="studio">
        {/* ---------------- STAGE ---------------- */}
        <div className="stage">
          <div className="stage-top">
            <span className="badge badge-brand"><IconSparkle size={13} /> {is3D ? 'Your 3D avatar' : `${avatar.label} avatar`}</span>
            {is3D
              ? <span className="badge badge-good" title="Studio 3D: personalized avatar + real 360°">● Real 360° 3D</span>
              : <span className="badge badge-neutral" title="Renders a set of angles, not free-camera 3D">Simulated multi-angle</span>}
          </div>

          <div className="avatar-frame" style={is3D ? { boxShadow: 'inset 0 0 0 2px #7c3aed33' } : undefined}>
            <Avatar avatar={avatar} garments={garments} angle={angle} zoom={zoom} />
            <span className="angle-label" style={{ position: 'absolute', top: 12, left: 12 }}>{ANGLE_LABEL(angle)}</span>
            {is3D && <span className="badge" style={{ position: 'absolute', top: 12, right: 12, background: '#7c3aed', color: '#fff' }}>3D</span>}
            {watermark && <span className="tiny" style={{ position: 'absolute', bottom: 10, right: 12, color: 'var(--ink-3)', opacity: .6, fontWeight: 700, letterSpacing: '.05em' }}>FitCart • preview</span>}
            {chosen.length === 0 && (
              <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center' }}>
                <span className="chip">Add items to dress your avatar →</span>
              </div>
            )}
          </div>

          <div className="angle-ctrl">
            <IconRotate size={18} className="dim" />
            <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)} aria-label="Rotate avatar" />
            <div className="zoom-ctrl">
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setZoom(z => Math.max(0.8, +(z - 0.15).toFixed(2)))} aria-label="Zoom out"><IconZoomOut size={16} /></button>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setZoom(z => Math.min(1.6, +(z + 0.15).toFixed(2)))} aria-label="Zoom in"><IconZoomIn size={16} /></button>
            </div>
          </div>
          <div className="row gap-6 wrap" style={{ marginTop: 12 }}>
            {[0, 45, 90, 180, 270].map(a => (
              <button key={a} className={`chip${ANGLE_LABEL(angle) === ANGLE_LABEL(a) ? ' active' : ''}`} onClick={() => setAngle(a)}>{ANGLE_LABEL(a)}</button>
            ))}
          </div>

          {/* premium actions */}
          <div className="row gap-8 wrap" style={{ marginTop: 14 }}>
            <button className="btn btn-ghost btn-sm grow" onClick={() => (canFitImage ? setFitImgOpen(true) : nav('/pricing'))}>
              <IconLayers size={15} /> AI Fit Image {!canFitImage && <span className="badge badge-brand" style={{ marginLeft: 4 }}>Pro</span>}
            </button>
            <button className="btn btn-sm grow" style={is3D ? { background: 'var(--good-bg)', color: 'var(--good)' } : { background: '#f2ecfe', color: '#7c3aed' }}
              onClick={() => setUploadOpen(true)}>
              <IconSparkle size={15} /> {is3D ? '3D avatar active' : 'Make my 3D avatar'} {!can3D && <span className="badge" style={{ marginLeft: 4, background: '#7c3aed', color: '#fff' }}>Studio</span>}
            </button>
          </div>

          {/* avatar picker */}
          <div className="divider" style={{ margin: '16px 0' }} />
          <label className="field">Body / avatar <span className="tiny dim">— guest presets</span></label>
          <div className="row gap-8 wrap">
            {AVATARS.map(a => (
              <button key={a.id} className={`chip${avatarId === a.id ? ' active' : ''}`} onClick={() => setAvatar(a.id)}>{a.label}</button>
            ))}
            <button className="chip" onClick={() => setUploadOpen(true)}>+ Upload photo{!can3D && ' 🔒'}</button>
          </div>
        </div>

        {/* ---------------- CONTROLS / SCORES ---------------- */}
        <div className="stack gap-16">
          {/* outfit slots */}
          <div className="card card-pad">
            <div className="row between" style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 16 }}>Your outfit</h3>
              <span className="tiny dim">{chosen.length} item{chosen.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="slot-list">
              {SLOTS.map(({ slot, label, icon: Ic }) => {
                const sel = outfit[slot]; const p = sel ? productById(sel.productId) : null
                return (
                  <div className={`slot${p ? ' filled' : ''}`} key={slot}>
                    <div className="slot-ic"><Ic size={19} /></div>
                    <div className="grow">
                      <div className="slot-name">{label}</div>
                      {p ? <div className="slot-prod">{p.brand} · <span className="muted">{p.name}</span></div>
                        : <div className="small dim">Not added</div>}
                    </div>
                    {p ? (
                      <div className="row gap-6">
                        <span className="pill-store" style={{ background: storeSoft(p.store), color: storeColor(p.store) }}>{STORES[p.store].name}</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => setPicker(slot)}>Swap</button>
                        <button className="icon-btn" style={{ width: 32, height: 32 }} aria-label={`Remove ${label}`} onClick={() => { clearSlot(slot); toast(`${label} removed`) }}><IconClose size={15} /></button>
                      </div>
                    ) : (
                      <button className="btn btn-soft btn-sm" onClick={() => setPicker(slot)}>Add</button>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="row gap-8" style={{ marginTop: 14 }}>
              <button className="btn btn-ghost" onClick={onSaveOutfit} title="Save this look">💾 Save</button>
              <button className="btn btn-primary grow" onClick={addOutfitToCart}>
                <IconCart size={18} /> Add to FitCart <IconArrowR size={16} />
              </button>
            </div>
          </div>

          {/* OUTFIT SCORE */}
          {oScore ? (
            <div className="card card-pad">
              <div className="score-head">
                <ScoreRing value={oScore.composite} label="outfit" color="var(--brand)" />
                <div className="grow">
                  <h3 style={{ fontSize: 16 }}>Outfit Score</h3>
                  <p className="small muted" style={{ textTransform: 'capitalize' }}>Best for: {oScore.occasionLabel.replace('-', ' ')}</p>
                </div>
                <span className="badge badge-brand">{oScore.composite >= 8 ? 'Great match' : 'Workable'}</span>
              </div>
              <div className="stack gap-8" style={{ marginTop: 14 }}>
                {[['Colour harmony', oScore.colorHarmony], ['Occasion', oScore.occasion], ['Body-shape', oScore.bodyShape], ['Style', oScore.styleCompat]].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="row between small"><span className="muted">{k}</span><span className="strong mono">{(v as number).toFixed(1)}</span></div>
                    <Meter value={v as number} color="var(--brand)" />
                  </div>
                ))}
              </div>
              {(oScore.rationale.length > 0 || oScore.suggestions.length > 0) && (
                <div className="stack gap-6" style={{ marginTop: 14 }}>
                  {oScore.rationale.slice(0, 2).map((r, i) => <div key={i} className="small muted row gap-6"><span style={{ color: 'var(--good)', display: 'inline-flex' }}><IconCheck size={14} /></span> {r}</div>)}
                  {oScore.suggestions.map((r, i) => <div key={i} className="small" style={{ color: 'var(--brand)' }}>💡 {r}</div>)}
                </div>
              )}
            </div>
          ) : (
            <div className="card card-pad small muted">Add at least two items to see the <strong>Outfit Score</strong> (colour, occasion, body-shape, style).</div>
          )}

          {/* FIT REPORTS */}
          {apparel.length > 0 && (
            <div className="card card-pad">
              <div className="row between" style={{ marginBottom: 6 }}>
                <h3 style={{ fontSize: 16 }}>Fit Report</h3>
                <span className="tiny dim">estimate — never a guaranteed measurement</span>
              </div>
              <div className="stack gap-16" style={{ marginTop: 8 }}>
                {apparel.map(({ product, size, slot }) => {
                  const fr = fitReport(avatar, product, size)
                  return (
                    <div key={slot} style={{ borderTop: '1px solid var(--line-2)', paddingTop: 12 }}>
                      <div className="score-head">
                        <ScoreRing value={fr.score} color="var(--accent)" />
                        <div className="grow">
                          <div className="strong small">{product.brand} — {product.name}</div>
                          <div className="row gap-8" style={{ marginTop: 2 }}>
                            <span className="tiny dim">Size {size}</span><Confidence v={fr.confidence} />
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        {fr.regions.map(r => {
                          const t = fitTone(r.label)
                          return (
                            <div className="region" key={r.name}>
                              <span className="rname">{r.name}</span>
                              <Meter value={r.score} color={t.color} />
                              <span className={`badge ${t.cls}`} style={{ justifySelf: 'end', textTransform: 'capitalize' }}>{r.label}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className={`banner ${fr.issues.length ? 'banner-warn' : 'banner-accent'}`} style={{ marginTop: 10 }}>
                        {fr.issues.length ? '⚠️' : <IconCheck size={16} />}<div>{fr.recommendation}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SLOT PICKER MODAL */}
      <SlotPicker slot={picker} onClose={() => setPicker(null)} onPick={(p, size) => { setOutfitSlot(p.slot, p.id, size); setPicker(null); toast(`${p.name} added`, '🪞') }} />

      {/* 3D AVATAR MODAL (Studio-tier gated) */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title={can3D ? 'Build your personalized 3D avatar' : 'Personalized 3D avatar — Studio 3D'}>
        {can3D ? (
          <>
            <div className="banner banner-accent" style={{ marginBottom: 14 }}>
              <IconShield size={18} />
              <div>Upload a full-body photo. We validate pose, lighting, distance &amp; visibility, build your <strong>true 3D avatar</strong>, then delete the photo. Every fit estimate still shows a confidence score.</div>
            </div>
            <label className="field">Full-body photo</label>
            <div style={{ border: '2px dashed var(--line)', borderRadius: 12, padding: 26, textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 30 }}>📷</div>
              <p className="small muted" style={{ marginTop: 6 }}>Drag a photo here, or tap to choose (demo — no real upload)</p>
            </div>
            <div className="row gap-10">
              <button className="btn btn-primary grow" style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                onClick={() => { setPersonalized(true); setUploadOpen(false); toast('Your 3D avatar is ready — real 360° unlocked', '✨') }}>
                <IconSparkle size={16} /> Generate 3D avatar
              </button>
              <button className="btn btn-ghost" onClick={() => setUploadOpen(false)}>Use a preset</button>
            </div>
          </>
        ) : (
          <>
            <div className="banner" style={{ marginBottom: 14, background: '#f2ecfe', color: '#5b21b6', border: '1px solid #ddd0fb' }}>
              <IconSparkle size={18} />
              <div>A true <strong>3D avatar of yourself</strong> — built from your photos, spun in real 360° — is the flagship <strong>Studio 3D</strong> perk. It’s the most compute-heavy thing we do, so it lives on the top tier.</div>
            </div>
            <ul className="small muted" style={{ margin: '0 0 16px', paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Personalized 3D avatar from your photos</li>
              <li>Real 360° free-camera viewer + 4K studio renders</li>
              <li>Everything in Pro (incl. AI Fit Images)</li>
            </ul>
            <div className="row gap-10">
              <button className="btn btn-primary grow" style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                onClick={() => { setUploadOpen(false); if (!signedIn) { nav('/login', { state: { plan: 'studio', next: '/studio' } }) } else { setTier('studio'); toast('Studio 3D unlocked', '✨') } }}>{signedIn ? 'Unlock Studio 3D' : 'Sign in to unlock'}</button>
              <button className="btn btn-ghost" onClick={() => { setUploadOpen(false); nav('/pricing') }}>Compare plans</button>
            </div>
          </>
        )}
      </Modal>

      {/* AI FIT IMAGE MODAL (Pro-tier gated) */}
      <Modal open={fitImgOpen} onClose={() => setFitImgOpen(false)} title="AI Fit Image">
        {chosen.length === 0 ? (
          <p className="small muted">Add at least one item to your outfit to generate an AI Fit Image.</p>
        ) : (
          <>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--line)', background: 'linear-gradient(180deg,#f7f3ff,#eef7f7)', position: 'relative' }}>
              <div style={{ aspectRatio: '4/5', display: 'grid', placeItems: 'center' }}>
                <Avatar avatar={avatar} garments={garments} angle={12} zoom={1.05} />
              </div>
              <span className="badge badge-brand" style={{ position: 'absolute', top: 12, left: 12 }}><IconLayers size={12} /> AI Fit Image · HD</span>
              {/* fit-check overlay */}
              <div style={{ position: 'absolute', right: 12, top: 12, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                {apparel.slice(0, 3).flatMap(({ product, size }) => {
                  const fr = fitReport(avatar, product, size)
                  return fr.regions.slice(0, 1).map(r => {
                    const t = fitTone(r.label)
                    return <span key={product.id + r.name} className={`badge ${t.cls}`} style={{ textTransform: 'capitalize' }}><IconRuler size={11} /> {r.name}: {r.label}</span>
                  })
                })}
              </div>
            </div>
            <div className="row between" style={{ marginTop: 12 }}>
              <div className="small muted">How this outfit looks on your <strong>{avatar.label}</strong> body — with a live Fit Check overlay.</div>
            </div>
            <div className="row gap-10" style={{ marginTop: 12 }}>
              <button className="btn btn-primary grow" onClick={() => { setFitImgOpen(false); toast('Fit Image saved to your looks (demo)', '🖼') }}>Save this look</button>
              <button className="btn btn-ghost" onClick={() => setFitImgOpen(false)}>Close</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}

/* ---- Slot picker (choose a product + size for a slot) ---- */
function SlotPicker({ slot, onClose, onPick }: { slot: Slot | null; onClose: () => void; onPick: (p: Product, size: string) => void }) {
  const meta = SLOTS.find(s => s.slot === slot)
  const items = slot ? PRODUCTS.filter(p => meta!.cats.includes(p.category)) : []
  const [sel, setSel] = useState<Product | null>(null)
  const [size, setSize] = useState('')
  const needSize = sel && sel.sizes.length > 1
  const close = () => { setSel(null); setSize(''); onClose() }
  return (
    <Modal open={!!slot} onClose={close} title={`Choose a ${meta?.label ?? ''}`}>
      {!sel ? (
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', maxHeight: 420, overflow: 'auto', paddingRight: 4 }}>
          {items.map(p => (
            <button key={p.id} className="card hover-lift pcard" style={{ textAlign: 'left', border: '1px solid var(--line)', cursor: 'pointer' }} onClick={() => { setSel(p); setSize(p.sizes.length > 1 ? '' : p.sizes[0]) }}>
              <div className="thumb" style={{ aspectRatio: '3/4' }}><ProductImage product={p} /></div>
              <div className="pbody">
                <span className="pbrand">{p.brand}</span>
                <span className="pname">{p.name}</span>
                <span className="price">{inr(p.price)}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="stack gap-14">
          <div className="row gap-12">
            <div style={{ width: 90, aspectRatio: '3/4', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}><ProductImage product={sel} /></div>
            <div className="grow">
              <div className="strong">{sel.brand}</div>
              <div className="small muted">{sel.name}</div>
              <div className="price" style={{ marginTop: 6 }}>{inr(sel.price)}</div>
              <span className="pill-store" style={{ background: storeSoft(sel.store), color: storeColor(sel.store), marginTop: 6, display: 'inline-block' }}>{STORES[sel.store].name}</span>
            </div>
          </div>
          {sel.sizes.length > 1 && (
            <div>
              <label className="field">Select size</label>
              <div className="size-row">{sel.sizes.map(sz => <button key={sz} className={`size-chip${size === sz ? ' on' : ''}`} onClick={() => setSize(sz)}>{sz}</button>)}</div>
            </div>
          )}
          <div className="row gap-10">
            <button className="btn btn-ghost" onClick={() => setSel(null)}>← Back</button>
            <button className="btn btn-primary grow" disabled={!!needSize && !size} onClick={() => onPick(sel, size || sel.sizes[0])}>Add to avatar</button>
          </div>
        </div>
      )}
    </Modal>
  )
}
