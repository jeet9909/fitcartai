import { useNavigate } from 'react-router-dom'
import type { Product } from '../types'
import ProductImage from './ProductImage'
import { STORES, storeColor, storeSoft } from '../data/stores'
import { useApp } from '../store/AppContext'
import { inr, off } from '../lib/format'
import { IconHeart, IconStar } from './Icon'

export default function ProductCard({ product }: { product: Product }) {
  const nav = useNavigate()
  const { wishlist, toggleWishlist, toast } = useApp()
  const wished = wishlist.includes(product.id)
  const s = STORES[product.store]
  return (
    <article className="card pcard hover-lift" onClick={() => nav(`/product/${product.id}`)}
      role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && nav(`/product/${product.id}`)}>
      <div className="thumb">
        <ProductImage product={product} />
        <span className="pill-store store-tag" style={{ background: storeSoft(product.store), color: storeColor(product.store) }}>{s.name}</span>
        <button className={`wish${wished ? ' on' : ''}`} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); toast(wished ? 'Removed from wishlist' : 'Saved to wishlist', '♥') }}>
          <IconHeart size={17} />
        </button>
      </div>
      <div className="pbody">
        <div className="row between">
          <span className="pbrand">{product.brand}</span>
          <span className="rating"><IconStar size={11} />{product.rating}</span>
        </div>
        <span className="pname">{product.name}</span>
        <div className="prow">
          <span className="price">{inr(product.price)}</span>
          <span className="mrp">{inr(product.mrp)}</span>
          <span className="off">{off(product.mrp, product.price)}% off</span>
        </div>
      </div>
    </article>
  )
}
