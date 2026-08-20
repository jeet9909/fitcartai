import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container section">
      <div className="empty card">
        <div className="ei" style={{ fontSize: 26 }}>🪞</div>
        <h3>Page not found</h3>
        <p className="muted small" style={{ marginTop: 6 }}>That route doesn’t exist in the demo.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Back home</Link>
      </div>
    </div>
  )
}
