import { ReactNode, useEffect } from 'react'
import { IconClose } from './Icon'

export default function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title || 'Dialog'}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 19 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close" style={{ width: 34, height: 34 }}><IconClose size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
