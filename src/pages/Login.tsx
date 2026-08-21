import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useApp, TierId } from '../store/AppContext'
import { tierById } from '../data/pricing'
import { IconSparkle, IconShield, IconCheck, IconArrowR } from '../components/Icon'

export default function Login() {
  const { login, setTier, toast } = useApp()
  const nav = useNavigate()
  const loc = useLocation() as { state?: { plan?: TierId; next?: string } }
  const plan = loc.state?.plan
  const next = loc.state?.next

  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [demoCode, setDemoCode] = useState('')
  const [err, setErr] = useState('')

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) { setErr('Enter a valid email'); return }
    const c = String(Math.floor(100000 + Math.random() * 899999))
    setDemoCode(c); setCode(c); setStep('code'); setErr('')  // demo auto-fills the code
  }

  const verify = (e: React.FormEvent) => {
    e.preventDefault()
    if (code !== demoCode) { setErr('Incorrect code'); return }
    login(email, name)
    if (plan && plan !== 'guest') { setTier(plan); toast(`${tierById(plan).name} plan active`, '✓') }
    else toast('Signed in', '✓')
    nav(next || '/studio')
  }

  return (
    <div className="container section" style={{ maxWidth: 460, paddingTop: 50 }}>
      <div className="card card-pad" style={{ padding: 30 }}>
        <div className="stack center" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="logo-mark" style={{ width: 46, height: 46, fontSize: 22, margin: '0 auto 12px' }}>🪞</div>
          <h1 style={{ fontSize: 22 }}>{step === 'email' ? 'Sign in or create account' : 'Enter your code'}</h1>
          <p className="muted small" style={{ marginTop: 6 }}>
            {plan ? <>To activate <strong>{tierById(plan).name}</strong>, verify your email.</>
              : 'Save outfits, keep your avatar, and unlock Pro & Studio features.'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={sendCode} className="stack gap-14">
            <div>
              <label className="field" htmlFor="nm">Name <span className="dim">(optional)</span></label>
              <input id="nm" className="input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="field" htmlFor="em">Email</label>
              <input id="em" className="input" type="email" autoComplete="email" placeholder="you@example.com"
                value={email} onChange={e => { setEmail(e.target.value); setErr('') }} />
            </div>
            {err && <div className="tiny" style={{ color: 'var(--bad)' }}>{err}</div>}
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={!valid}>
              Continue <IconArrowR size={17} />
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="stack gap-14">
            <div className="banner banner-accent"><IconShield size={16} /><div className="tiny">
              Demo code sent to <strong>{email}</strong>: <code style={{ fontSize: 14 }}>{demoCode}</code> (auto-filled)</div>
            </div>
            <div>
              <label className="field" htmlFor="cd">6-digit code</label>
              <input id="cd" className="input mono" inputMode="numeric" maxLength={6} value={code}
                onChange={e => { setCode(e.target.value); setErr('') }} style={{ letterSpacing: '.3em', fontSize: 18 }} />
            </div>
            {err && <div className="tiny" style={{ color: 'var(--bad)' }}>{err}</div>}
            <button className="btn btn-primary btn-block btn-lg" type="submit"><IconCheck size={17} /> Verify & continue</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep('email')}>← Use a different email</button>
          </form>
        )}

        <div className="banner banner-brand" style={{ marginTop: 18 }}>
          <IconSparkle size={16} /><div className="tiny">Demo auth — no real emails or passwords. Your account lives in this browser.</div>
        </div>
      </div>
      <div className="row center" style={{ marginTop: 16 }}>
        <Link to="/explore" className="btn btn-ghost btn-sm">Continue as guest instead</Link>
      </div>
    </div>
  )
}
