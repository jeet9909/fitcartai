import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { productById } from '../data/products'
import ProductImage from '../components/ProductImage'
import { IconLayers, IconSparkle, IconClose, IconArrowR } from '../components/Icon'

export default function Saved() {
  const { saved, deleteSaved, setOutfitSlot, clearSlot, setAvatar, toast } = useApp()
  const nav = useNavigate()

  const openInStudio = (id: string) => {
    const o = saved.find(s => s.id === id)
    if (!o) return
    ;['top', 'bottom', 'outer', 'shoes', 'watch', 'sunglasses', 'accessory'].forEach(clearSlot)
    o.items.forEach(it => setOutfitSlot(it.slot, it.productId, it.size))
    setAvatar(o.avatarId)
    toast('Loaded into Studio', '🪞')
    nav('/studio')
  }

  if (saved.length === 0) return (
    <div className="container section">
      <div className="empty card">
        <div className="ei"><IconLayers size={26} /></div>
        <h3>No saved outfits yet</h3>
        <p className="muted small" style={{ marginTop: 6 }}>Build a look in the Studio and tap “Save outfit”.</p>
        <Link to="/studio" className="btn btn-primary" style={{ marginTop: 16 }}><IconSparkle size={16} /> Open Studio</Link>
      </div>
    </div>
  )

  return (
    <div className="container section" style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Saved outfits</h1>
      <p className="muted small" style={{ marginBottom: 20 }}>{saved.length} look{saved.length !== 1 ? 's' : ''}</p>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {saved.map(o => (
          <div className="card card-pad" key={o.id}>
            <div className="row between" style={{ marginBottom: 10 }}>
              <h3 style={{ fontSize: 16 }}>{o.name}</h3>
              <button className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Delete" onClick={() => { deleteSaved(o.id); toast('Deleted') }}><IconClose size={15} /></button>
            </div>
            <div className="row gap-6" style={{ marginBottom: 10 }}>
              {o.items.slice(0, 5).map((it, i) => {
                const p = productById(it.productId)
                return p ? <div key={i} style={{ width: 46, aspectRatio: '3/4', borderRadius: 7, overflow: 'hidden', border: '1px solid var(--line)' }}><ProductImage product={p} /></div> : null
              })}
            </div>
            <div className="row gap-8" style={{ marginBottom: 12 }}>
              {o.fit != null && <span className="badge badge-accent">Fit {o.fit}</span>}
              {o.outfit != null && <span className="badge badge-good">Outfit {o.outfit}</span>}
              <span className="tiny dim">{o.items.length} items</span>
            </div>
            <button className="btn btn-soft btn-block btn-sm" onClick={() => openInStudio(o.id)}>Open in Studio <IconArrowR size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
