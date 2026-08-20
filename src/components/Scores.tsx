import type { FitLabel } from '../lib/scoring'

export function ScoreRing({ value, label, color = 'var(--accent)' }: { value: number; label?: string; color?: string }) {
  const pct = Math.round((value / 10) * 100)
  return (
    <div className="score-ring" style={{ ['--v' as any]: pct, background: `conic-gradient(${color} calc(${pct}*1%), var(--line-2) 0)` }}>
      <div className="inner">
        <span>{value.toFixed(1)}</span>
        {label && <span className="tiny dim" style={{ fontSize: 9 }}>{label}</span>}
      </div>
    </div>
  )
}

export function Meter({ value, max = 10, color = 'var(--brand)' }: { value: number; max?: number; color?: string }) {
  return <div className="meter"><span style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} /></div>
}

export const fitTone = (l: FitLabel): { cls: string; color: string } => {
  if (l === 'regular') return { cls: 'badge-good', color: 'var(--good)' }
  if (l === 'snug' || l === 'relaxed') return { cls: 'badge-warn', color: 'var(--warn)' }
  return { cls: 'badge-bad', color: 'var(--bad)' } // tight / loose
}

export function Confidence({ v }: { v: number }) {
  const p = Math.round(v * 100)
  const tone = p >= 80 ? 'var(--good)' : p >= 65 ? 'var(--warn)' : 'var(--bad)'
  return <span className="tiny strong" style={{ color: tone }}>{p}% confidence</span>
}
