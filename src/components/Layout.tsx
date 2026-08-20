import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { tierById } from '../data/pricing'
import { IconCart, IconHeart, IconUser, IconMenu, IconClose, IconSparkle, IconCheck } from './Icon'

function Toaster() {
  const { toasts } = useApp()
  return (
    <div className="toast-wrap" aria-live="polite">
      {toasts.map(t => <div className="toast" key={t.id}><span aria-hidden>{t.icon ?? '✓'}</span>{t.msg}</div>)}
    </div>
  )
}

export default function Layout() {
  const { cartCount, outfitCount, tier, wishlist } = useApp()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const close = () => setOpen(false)
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo" onClick={close}>
            <span className="logo-mark">🪞</span> FitCart <span style={{ color: 'var(--brand)' }}>AI</span>
          </Link>
          <nav className={`nav${open ? ' open' : ''}`}>
            <NavLink to="/explore" className={({ isActive }) => isActive ? 'on' : ''} onClick={close}>Explore</NavLink>
            <NavLink to="/studio" className={({ isActive }) => isActive ? 'on' : ''} onClick={close}>Try-On Studio</NavLink>
            <NavLink to="/pricing" className={({ isActive }) => isActive ? 'on' : ''} onClick={close}>Pricing</NavLink>
            <NavLink to="/how-it-works" className={({ isActive }) => isActive ? 'on' : ''} onClick={close}>How it works</NavLink>
            <NavLink to="/partner" className={({ isActive }) => isActive ? 'on' : ''} onClick={close}>For Brands</NavLink>
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'on' : ''} onClick={close}>Admin</NavLink>
          </nav>
          <div className="header-actions">
            <button className="guest-tag" title="Your plan — click to compare" onClick={() => nav('/pricing')} style={{ border: 0, cursor: 'pointer' }}>
              {tier === 'guest' ? <><IconSparkle size={13} /> Guest</> : <><IconCheck size={13} /> {tierById(tier).name}</>}
            </button>
            <button className="icon-btn" aria-label="Wishlist" onClick={() => nav('/explore')}>
              <IconHeart size={19} />{wishlist.length > 0 && <span className="count-dot">{wishlist.length}</span>}
            </button>
            <button className="icon-btn" aria-label="Cart" onClick={() => nav('/cart')}>
              <IconCart size={19} />{cartCount > 0 && <span className="count-dot">{cartCount}</span>}
            </button>
            <button className="icon-btn" aria-label="Profile" onClick={() => nav('/studio')}>
              <IconUser size={19} />{outfitCount > 0 && <span className="count-dot">{outfitCount}</span>}
            </button>
            <button className="icon-btn menu-toggle" aria-label="Menu" onClick={() => setOpen(o => !o)}>
              {open ? <IconClose size={19} /> : <IconMenu size={19} />}
            </button>
          </div>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="container footer-inner">
          <div className="stack gap-6">
            <div className="logo" style={{ fontSize: 16 }}><span className="logo-mark" style={{ width: 24, height: 24, fontSize: 12 }}>🪞</span> FitCart AI</div>
            <span className="tiny dim">An AI try-on & fit-intelligence layer between shoppers and the stores they already use.</span>
          </div>
          <div className="row gap-16 wrap tiny dim">
            <span>Interactive stakeholder demo</span><span>·</span>
            <span>Simulated data</span><span>·</span>
            <span>No real accounts or payments</span>
          </div>
        </div>
      </footer>
      <Toaster />
    </>
  )
}
