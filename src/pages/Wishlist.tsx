import { Link } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { productById } from '../data/products'
import ProductCard from '../components/ProductCard'
import { IconHeart, IconSparkle } from '../components/Icon'

export default function Wishlist() {
  const { wishlist } = useApp()
  const items = wishlist.map(productById).filter(Boolean) as ReturnType<typeof productById>[]

  if (items.length === 0) return (
    <div className="container section">
      <div className="empty card">
        <div className="ei"><IconHeart size={26} /></div>
        <h3>Your wishlist is empty</h3>
        <p className="muted small" style={{ marginTop: 6 }}>Tap the heart on any product to save it here for later.</p>
        <Link to="/explore" className="btn btn-primary" style={{ marginTop: 16 }}><IconSparkle size={16} /> Explore products</Link>
      </div>
    </div>
  )

  return (
    <div className="container section" style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Wishlist</h1>
      <p className="muted small" style={{ marginBottom: 20 }}>{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
      <div className="grid prod-grid">
        {items.map(p => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
