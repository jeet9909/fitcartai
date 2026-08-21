import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../store/AppContext'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { signedIn } = useApp()
  const loc = useLocation()
  if (!signedIn) return <Navigate to="/login" state={{ next: loc.pathname }} replace />
  return <>{children}</>
}
