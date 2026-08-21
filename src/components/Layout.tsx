import { useState, useRef, useEffect } from 'react'
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

function AccountMenu() {
  const { user, tier, logout, toast } = useApp()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (!user) return (
    <Link to="/login" className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>Sign in</Link>
  )
  const t = tierById(tier)
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="icon-btn" aria-label="Account" onClick={() => setOpen(o => !o)}
        style={{ width: 'auto', padding: '0 10px', gap: 7, display: 'flex' }}>
        <span style={{ width: 24, height: 24, borderRadius: 999, background: 'linear-gradient(135deg,var(--brand-500),var(--accent))', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="small strong" style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
      </button>
      {open && (
        <div className="acct-menu">
          <div className="acct-head">
            <div className="strong small">{user.name}</div>
            <div className="tiny dim">{user.email}</div>
            <span className="tier-badge" style={{ background: 'var(--brand-050)', color: t.accent, marginTop: 8 }}><IconSparkle size={12} /> {t.name} plan</span>
          </div>
          <button onClick={() => { setOpen(false); nav('/account') }}>Account</button>
          <button onClick={() => { setOpen(false); nav('/saved') }}>Saved outfits</button>
          <button onClick={() => { setOpen(false); nav('/orders') }}>Orders</button>
          <button onClick={() => { setOpen(false); nav('/pricing') }}>Plans & upgrade</button>
          <hr className="divider" />
          <button onClick={() => { setOpen(false); logout(); toast('Signed out'); nav('/') }}>Sign out</button>
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  const { cartCount, outfitCount, tier, wishlist, signedIn } = useApp()
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
          </nav>
          <div className="header-actions">
            {!signedIn && <button className="guest-tag" onClick={() => nav('/pricing')} style={{ border: 0, cursor: 'pointer' }}>
              <IconSparkle size={13} /> Guest
            </button>}
            <button className="icon-btn" aria-label="Wishlist" onClick={() => nav('/wishlist')}>
              <IconHeart size={19} />{wishlist.length > 0 && <span className="count-dot">{wishlist.length}</span>}
            </button>
            <button className="icon-btn" aria-label="Cart" onClick={() => nav('/cart')}>
              <IconCart size={19} />{cartCount > 0 && <span className="count-dot">{cartCount}</span>}
            </button>
            <AccountMenu />
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
            <Link to="/how-it-works">How it works</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/partner">For Brands</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </footer>
      <Toaster />
    </>
  )
}
