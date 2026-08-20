import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { PLATFORM, ACCOUNTS, MODERATION, PARTNER_REQUESTS, STORE_OPS, Account, PartnerReq, ModItem } from '../data/admin'
import { STORES, storeColor, storeSoft } from '../data/stores'
import { inr } from '../lib/format'
import {
  IconChart, IconUser, IconStore, IconShield, IconTag, IconGrid, IconSearch,
  IconCheck, IconClose, IconSparkle, IconLink, IconRuler,
} from '../components/Icon'
import type { StoreId } from '../types'

type Tab = 'overview' | 'accounts' | 'stores' | 'partners' | 'moderation' | 'revenue'

export default function Admin() {
  const { toast } = useApp()
  const [authed, setAuthed] = useState(() => { try { return sessionStorage.getItem('fc-admin') === '1' } catch { return false } })
  const [tab, setTab] = useState<Tab>('overview')
  const k = PLATFORM.kpis

  if (!authed) return <AdminGate onAuth={() => { try { sessionStorage.setItem('fc-admin', '1') } catch {}; setAuthed(true); toast('Signed in to Admin', '🛡') }} />

  // interactive state
  const [accounts, setAccounts] = useState<Account[]>(ACCOUNTS)
  const [q, setQ] = useState('')
  const [planF, setPlanF] = useState('all')
  const [statusF, setStatusF] = useState('all')
  const [reqs, setReqs] = useState<PartnerReq[]>(PARTNER_REQUESTS)
  const [mods, setMods] = useState<ModItem[]>(MODERATION)
  const [ops, setOps] = useState(STORE_OPS)

  const filtered = useMemo(() => accounts.filter(a =>
    (!q || (a.name + a.email + a.id).toLowerCase().includes(q.toLowerCase())) &&
    (planF === 'all' || a.plan === planF) &&
    (statusF === 'all' || a.status === statusF)), [accounts, q, planF, statusF])

  const toggleStatus = (id: string) => setAccounts(a => a.map(x => x.id === id
    ? { ...x, status: x.status === 'Active' ? 'Suspended' : 'Active' } : x))
  const del = (id: string) => setAccounts(a => a.filter(x => x.id !== id))

  const maxV = Math.max(...PLATFORM.revenue)
  const lastCost = PLATFORM.cost[PLATFORM.cost.length - 1]

  return (
    <div className="container section" style={{ paddingTop: 24 }}>
      <div className="row between wrap gap-12" style={{ marginBottom: 8 }}>
        <div>
          <span className="eyebrow">Internal · Operator console</span>
          <h1 style={{ fontSize: 26, marginTop: 6 }}>FitCart Admin</h1>
          <p className="muted small" style={{ marginTop: 4 }}>Manage every account, store, partner and the revenue/cost guardrail across the platform.</p>
        </div>
        <div className="row gap-8">
          <span className="tiny dim">Viewing as</span>
          <span className="chip active"><IconShield size={13} /> Admin</span>
          <Link to="/explore" className="chip">Shopper</Link>
          <Link to="/partner" className="chip">Brand</Link>
          <button className="chip" onClick={() => { try { sessionStorage.removeItem('fc-admin') } catch {}; setAuthed(false); toast('Signed out of Admin') }}>Log out</button>
        </div>
      </div>

      <div className="banner banner-warn" style={{ marginBottom: 20 }}>
        <IconShield size={18} />
        <div><strong>Restricted internal tool (demo).</strong> In production this sits behind staff SSO + role-based access + audit logging. Body-data is access-controlled and never exposed here — operators see metadata, not photos.</div>
      </div>

      <div className="dash">
        <nav className="dash-nav card card-pad" style={{ padding: 8 }}>
          {([['overview', 'Overview', IconChart], ['accounts', 'Accounts', IconUser], ['stores', 'Stores', IconStore], ['partners', 'Partners', IconTag], ['moderation', 'Moderation', IconShield], ['revenue', 'Revenue & Cost', IconGrid]] as const).map(([id, label, Ic]) => (
            <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id as Tab)}><Ic size={17} /> {label}</button>
          ))}
        </nav>

        <div className="stack gap-18">
          {/* ---------------- OVERVIEW ---------------- */}
          {tab === 'overview' && (
            <>
              <div className="grid kpi-grid">
                {[
                  { label: 'Total users', val: k.totalUsers.toLocaleString('en-IN'), d: '+9.2% MoM', tone: 'var(--good)' },
                  { label: 'Members / Pro', val: `${k.members.toLocaleString('en-IN')}`, d: `${k.proSubs.toLocaleString('en-IN')} Pro`, tone: 'var(--brand)' },
                  { label: 'Guest sessions (30d)', val: k.guests30d.toLocaleString('en-IN'), d: 'no-login funnel', tone: 'var(--accent)' },
                  { label: 'Affiliate revenue (MTD)', val: `₹${k.affiliateMTD}L`, d: '+10% MoM', tone: 'var(--ink)' },
                ].map(c => (
                  <div className="card card-pad kpi" key={c.label}>
                    <span className="tiny dim">{c.label}</span>
                    <div className="kv">{c.val}</div>
                    <div className="kd" style={{ color: c.tone }}>{c.d}</div>
                  </div>
                ))}
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
                <div className="card card-pad">
                  <div className="row between" style={{ marginBottom: 6 }}><h3 style={{ fontSize: 16 }}>Revenue vs inference cost</h3><span className="tiny dim">₹ lakh / month</span></div>
                  <div className="bars">
                    {PLATFORM.months.map((m, i) => (
                      <div key={m} style={{ flex: 1, display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%', position: 'relative' }}>
                        <div className="bar" style={{ height: `${(PLATFORM.revenue[i] / maxV) * 100}%`, background: 'linear-gradient(180deg,var(--brand-500),var(--brand))' }} title={`Revenue ₹${PLATFORM.revenue[i]}L`} />
                        <div className="bar" style={{ height: `${(PLATFORM.cost[i] / maxV) * 100}%`, background: 'linear-gradient(180deg,#f0b6c1,var(--bad))' }} title={`Cost ₹${PLATFORM.cost[i]}L`}><span>{m}</span></div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 22 }} />
                  <div className="row gap-16 tiny muted"><span className="row gap-6"><i style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--brand)' }} /> Affiliate revenue</span><span className="row gap-6"><i style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--bad)' }} /> Inference cost</span></div>
                </div>

                <div className="card card-pad">
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>Guest guardrail</h3>
                  <p className="tiny muted" style={{ marginBottom: 12 }}>“Don’t break revenue” — cost per guest must stay well below value per guest.</p>
                  <div className="stack gap-10">
                    <div className="row between"><span className="small muted">Value / guest</span><span className="strong" style={{ color: 'var(--good)' }}>{inr(k.valuePerGuest)}</span></div>
                    <div className="row between"><span className="small muted">Cost / guest</span><span className="strong">{inr(k.costPerGuest)}</span></div>
                    <div className="meter"><span style={{ width: `${(k.costPerGuest / k.valuePerGuest) * 100}%`, background: 'var(--bad)' }} /></div>
                    <span className="badge badge-good" style={{ width: 'fit-content' }}><IconCheck size={12} /> Healthy — {Math.round((1 - k.costPerGuest / k.valuePerGuest) * 100)}% margin</span>
                  </div>
                  <hr className="divider" style={{ margin: '14px 0' }} />
                  <div className="row between"><span className="small muted">Fit accuracy</span><span className="badge badge-accent">{k.fitAccuracy}%</span></div>
                  <div className="row between" style={{ marginTop: 8 }}><span className="small muted">Return reduction</span><span className="badge badge-good">−{k.returnReduction}%</span></div>
                </div>
              </div>

              <div className="grid kpi-grid">
                {[
                  { label: 'Try-ons (30d)', val: k.tryOns30d.toLocaleString('en-IN'), i: <IconSparkle size={16} /> },
                  { label: 'Store handoffs (30d)', val: k.handoffs30d.toLocaleString('en-IN'), i: <IconLink size={16} /> },
                  { label: 'Open moderation', val: mods.length, i: <IconShield size={16} /> },
                  { label: 'Partner requests', val: reqs.filter(r => r.status === 'Pending').length, i: <IconTag size={16} /> },
                ].map(c => (
                  <div className="card card-pad kpi" key={c.label}><span className="tiny dim row gap-6">{c.i} {c.label}</span><div className="kv" style={{ fontSize: 22 }}>{c.val}</div></div>
                ))}
              </div>
            </>
          )}

          {/* ---------------- ACCOUNTS ---------------- */}
          {tab === 'accounts' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-pad" style={{ paddingBottom: 12 }}>
                <div className="row between wrap gap-10">
                  <h3 style={{ fontSize: 16 }}><IconUser size={16} /> Accounts <span className="tiny dim">({filtered.length})</span></h3>
                  <div className="row gap-8 wrap">
                    <div className="searchbar" style={{ minWidth: 200 }}>
                      <IconSearch size={16} />
                      <input className="input" placeholder="Search name, email, ID…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search accounts" />
                    </div>
                    <select className="select" style={{ width: 'auto' }} value={planF} onChange={e => setPlanF(e.target.value)} aria-label="Filter plan">
                      <option value="all">All plans</option><option>Guest</option><option>Member</option><option>Pro</option>
                    </select>
                    <select className="select" style={{ width: 'auto' }} value={statusF} onChange={e => setStatusF(e.target.value)} aria-label="Filter status">
                      <option value="all">All status</option><option>Active</option><option>Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="dtable">
                  <thead><tr><th>User</th><th>Plan</th><th>Avatar</th><th>Try-ons</th><th>Purchases</th><th>Affiliate</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
                  <tbody>
                    {filtered.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div className="strong">{a.name} {a.flagged && <span className="badge badge-bad" style={{ marginLeft: 4 }}>flagged</span>}</div>
                          <div className="tiny dim">{a.id} · {a.email}</div>
                        </td>
                        <td><span className={`badge ${a.plan === 'Pro' ? 'badge-brand' : a.plan === 'Member' ? 'badge-accent' : 'badge-neutral'}`}>{a.plan}</span></td>
                        <td><span className="chip">{a.avatar}</span></td>
                        <td className="mono">{a.tryOns}</td>
                        <td className="mono">{a.purchases}</td>
                        <td className="mono">{inr(a.affiliate)}</td>
                        <td><span className={`badge ${a.status === 'Active' ? 'badge-good' : 'badge-bad'}`}>{a.status}</span></td>
                        <td>
                          <div className="row gap-6" style={{ justifyContent: 'flex-end' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => { toggleStatus(a.id); toast(`${a.name} ${a.status === 'Active' ? 'suspended' : 'reactivated'}`) }}>
                              {a.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button className="btn btn-sm" style={{ background: 'var(--bad-bg)', color: 'var(--bad)' }} onClick={() => { del(a.id); toast(`${a.name} deleted (DPDP erase)`, '🗑') }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan={8} className="muted" style={{ textAlign: 'center', padding: 30 }}>No accounts match.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- STORES ---------------- */}
          {tab === 'stores' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-pad" style={{ paddingBottom: 0 }}><h3 style={{ fontSize: 16 }}><IconStore size={16} /> Connected stores</h3></div>
              <div style={{ overflowX: 'auto' }}>
                <table className="dtable">
                  <thead><tr><th>Store</th><th>Catalog</th><th>Cart</th><th>Commission</th><th>Feed</th><th>Last sync</th><th style={{ textAlign: 'right' }}>Enabled</th></tr></thead>
                  <tbody>
                    {Object.values(STORES).map(s => {
                      const o = ops[s.id]
                      return (
                        <tr key={s.id}>
                          <td><span className="pill-store" style={{ background: storeSoft(s.id as StoreId), color: storeColor(s.id as StoreId) }}>{s.name}</span></td>
                          <td><span className="badge badge-neutral">{s.catalog}</span></td>
                          <td>{s.cartWrite === 'PARTNER_ONLY' ? <span className="badge badge-good">Partner sync</span> : <span className="badge badge-neutral">Deep-link</span>}</td>
                          <td className="mono">{s.commissionPct}%</td>
                          <td><span className={`badge ${o.feed === 'Healthy' ? 'badge-good' : o.feed === 'Delayed' ? 'badge-warn' : 'badge-bad'}`}>{o.feed}</span></td>
                          <td className="tiny muted">{o.lastSync}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className={`btn btn-sm ${o.enabled ? 'btn-soft' : 'btn-ghost'}`} onClick={() => { setOps(p => ({ ...p, [s.id]: { ...p[s.id], enabled: !p[s.id].enabled } })); toast(`${s.name} ${o.enabled ? 'disabled' : 'enabled'}`) }}>
                              {o.enabled ? 'On' : 'Off'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- PARTNERS ---------------- */}
          {tab === 'partners' && (
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-pad" style={{ paddingBottom: 0 }}><h3 style={{ fontSize: 16 }}><IconTag size={16} /> B2B partner requests (Fit-SDK)</h3></div>
              <div style={{ overflowX: 'auto' }}>
                <table className="dtable">
                  <thead><tr><th>ID</th><th>Brand</th><th>Plan</th><th>Contact</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th></tr></thead>
                  <tbody>
                    {reqs.map(r => (
                      <tr key={r.id}>
                        <td className="mono">{r.id}</td>
                        <td className="strong">{r.brand}</td>
                        <td>{r.plan}</td>
                        <td className="tiny muted">{r.contact}</td>
                        <td><span className={`badge ${r.status === 'Approved' ? 'badge-good' : r.status === 'Rejected' ? 'badge-bad' : 'badge-warn'}`}>{r.status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          {r.status === 'Pending' ? (
                            <div className="row gap-6" style={{ justifyContent: 'flex-end' }}>
                              <button className="btn btn-sm btn-primary" onClick={() => { setReqs(p => p.map(x => x.id === r.id ? { ...x, status: 'Approved' } : x)); toast(`${r.brand} approved`, '✓') }}><IconCheck size={13} /> Approve</button>
                              <button className="btn btn-sm btn-ghost" onClick={() => { setReqs(p => p.map(x => x.id === r.id ? { ...x, status: 'Rejected' } : x)); toast(`${r.brand} rejected`) }}><IconClose size={13} /></button>
                            </div>
                          ) : <span className="tiny dim">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------- MODERATION ---------------- */}
          {tab === 'moderation' && (
            <div className="card card-pad">
              <h3 style={{ fontSize: 16, marginBottom: 4 }}><IconShield size={16} /> Moderation & abuse queue</h3>
              <p className="small muted" style={{ marginBottom: 14 }}>Flagged renders, reported content, and the cost-abuse guard that protects unit economics.</p>
              {mods.length === 0 ? (
                <div className="empty" style={{ padding: 30 }}><div className="ei"><IconCheck size={24} /></div><h3 style={{ fontSize: 16 }}>Queue clear</h3><p className="muted small">Nothing to review.</p></div>
              ) : (
                <div className="stack gap-10">
                  {mods.map(m => (
                    <div key={m.id} className="row between wrap gap-10" style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 10 }}>
                      <div>
                        <div className="row gap-8">
                          <span className={`badge ${m.severity === 'high' ? 'badge-bad' : m.severity === 'medium' ? 'badge-warn' : 'badge-neutral'}`}>{m.severity}</span>
                          <span className="strong small">{m.type}</span>
                          <span className="tiny dim">· {m.ref}</span>
                        </div>
                        <div className="tiny muted" style={{ marginTop: 4 }}>{m.reason}</div>
                      </div>
                      <div className="row gap-6">
                        <button className="btn btn-sm btn-primary" onClick={() => { setMods(p => p.filter(x => x.id !== m.id)); toast('Action taken — item resolved', '✓') }}>Resolve</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => { setMods(p => p.filter(x => x.id !== m.id)); toast('Dismissed') }}>Dismiss</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------- REVENUE & COST ---------------- */}
          {tab === 'revenue' && (
            <>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="card card-pad kpi"><span className="tiny dim">Affiliate revenue (MTD)</span><div className="kv">₹{k.affiliateMTD}L</div><div className="kd" style={{ color: 'var(--good)' }}>+10% MoM</div></div>
                <div className="card card-pad kpi"><span className="tiny dim">Inference cost (MTD)</span><div className="kv">₹{lastCost}L</div><div className="kd" style={{ color: 'var(--warn)' }}>hosted GPU</div></div>
                <div className="card card-pad kpi"><span className="tiny dim">Gross margin</span><div className="kv" style={{ color: 'var(--good)' }}>{Math.round((1 - (lastCost / k.affiliateMTD)) * 100)}%</div><div className="kd muted">before opex</div></div>
              </div>
              <div className="card card-pad">
                <h3 style={{ fontSize: 15, marginBottom: 10 }}><IconLink size={16} /> Affiliate earnings by store (MTD est.)</h3>
                <div className="stack gap-10">
                  {Object.values(STORES).map((s, i) => {
                    const val = [11.2, 9.8, 7.4, 6.1, 5.3, 3.0][i]
                    return (
                      <div key={s.id}>
                        <div className="row between small"><span className="muted">{s.name} <span className="dim">· {s.commissionPct}%</span></span><span className="strong mono">₹{val}L</span></div>
                        <div className="meter"><span style={{ width: `${(val / 11.2) * 100}%`, background: storeColor(s.id as StoreId) }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="card card-pad" style={{ background: 'linear-gradient(135deg,var(--accent-050),#fff)' }}>
                <div className="row gap-12">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent)', color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}><IconRuler size={22} /></div>
                  <div><h3 style={{ fontSize: 15 }}>Unit economics are the whole game</h3><p className="small muted" style={{ marginTop: 3 }}>Revenue per active user (~₹118) must stay above inference cost per active user. Caching, free-tier caps, and self-hosting at scale keep this positive — tracked live here.</p></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---- Staff login gate ---- */
const DEMO_EMAIL = 'admin@fitcart.ai'
const DEMO_PASS = 'demo1234'

function AdminGate({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim().toLowerCase() === DEMO_EMAIL && pass === DEMO_PASS) onAuth()
    else setErr('Invalid credentials. Use the demo staff login shown below.')
  }

  return (
    <div className="container section" style={{ maxWidth: 440, paddingTop: 60 }}>
      <div className="card card-pad" style={{ padding: 30 }}>
        <div className="stack center" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="logo-mark" style={{ width: 46, height: 46, fontSize: 22, margin: '0 auto 12px' }}><IconShield size={24} /></div>
          <h1 style={{ fontSize: 22 }}>FitCart Admin</h1>
          <p className="muted small" style={{ marginTop: 6 }}>Restricted staff console. Sign in to continue.</p>
        </div>

        <form onSubmit={submit} className="stack gap-14">
          <div>
            <label className="field" htmlFor="ae">Staff email</label>
            <input id="ae" className="input" type="email" autoComplete="username" placeholder="you@fitcart.ai" value={email} onChange={e => { setEmail(e.target.value); setErr('') }} />
          </div>
          <div>
            <label className="field" htmlFor="ap">Password</label>
            <input id="ap" className="input" type="password" autoComplete="current-password" placeholder="••••••••" value={pass} onChange={e => { setPass(e.target.value); setErr('') }} />
          </div>
          {err && <div className="banner banner-warn" style={{ padding: '10px 12px' }}><IconClose size={16} /><div className="tiny">{err}</div></div>}
          <button className="btn btn-primary btn-block btn-lg" type="submit"><IconShield size={17} /> Sign in</button>
        </form>

        <div className="banner banner-brand" style={{ marginTop: 18 }}>
          <IconUser size={16} />
          <div className="tiny">
            <strong>Demo staff login</strong><br />
            Email: <code>admin@fitcart.ai</code> · Password: <code>demo1234</code>
            <button className="btn btn-soft btn-sm" style={{ marginTop: 8 }} onClick={() => { setEmail(DEMO_EMAIL); setPass(DEMO_PASS); setErr('') }}>Fill demo credentials</button>
          </div>
        </div>
        <p className="tiny dim" style={{ textAlign: 'center', marginTop: 14 }}>Production would use staff SSO + role-based access + audit logging. This gate is a demo (session-only).</p>
      </div>
      <div className="row center" style={{ marginTop: 16 }}><Link to="/" className="btn btn-ghost btn-sm">← Back to site</Link></div>
    </div>
  )
}
