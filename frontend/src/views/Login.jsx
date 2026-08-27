import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { t } from '../lib/i18n.js'
import { useState } from 'react'
import { signInWithGoogle, isSupabaseConfigured } from '../lib/supabase.js'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'

export default function Login() {
  const { setUser, setGuest } = useStore()
  const [name, setName] = useState('')
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const toast = useUI(s => s.toast)

  const handleGoogleSignIn = async () => {
    try {
      setLoadingGoogle(true)
      await signInWithGoogle()
    } catch (err) {
      setLoadingGoogle(false)
      toast(err.message || t('Google sign-in failed'))
    }
  }

  const createAccount = (e) => {
    e?.preventDefault?.()
    const trimmed = name.trim() || t('Athlete')
    const user = { name: trimmed, id: 'user_' + Date.now() }
    setUser(user)
    toast(t('Welcome, {0}!', trimmed))
  }

  const continueGuest = () => {
    setGuest(true)
    toast(t('Welcome!'))
  }

  const head = (
    <>
      <div style={{ fontSize: 54, display: 'flex', justifyContent: 'center', color: 'var(--acc)' }}>
        <Icon name="dumbbell" />
      </div>
      <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-.028em', margin: '10px 0 4px' }}>
        Gym Tracker
      </h1>
    </>
  )

  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '78vh',
    textAlign: 'center'
  }

  return (
    <div className="narrow" style={wrap}>
      {head}
      <div className="muted" style={{ marginBottom: 24 }}>
        {t('Your workouts. Your weights. Your profile.')}
      </div>

      {/* Google Sign-in Button */}
      <button
        type="button"
        className="btn"
        disabled={loadingGoogle}
        onClick={handleGoogleSignIn}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          backgroundColor: '#ffffff',
          color: '#1f1f1f',
          fontWeight: 600,
          fontSize: 15,
          padding: '12px 16px',
          borderRadius: 'var(--radius)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          width: '100%',
          border: 'none',
          marginBottom: 16
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        {loadingGoogle ? t('Connecting...') : t('Continue with Google')}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 16px', color: 'var(--label-3)', fontSize: 13 }}>
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
        <span style={{ padding: '0 12px' }}>{t('or continue without Google')}</span>
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
      </div>

      <form onSubmit={createAccount} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          className="input"
          placeholder={t('Enter your name (e.g. Alex)')}
          maxLength={40}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button variant="primary" icon="sparkles" onClick={createAccount}>
          {t('Create Local Profile')}
        </Button>
      </form>

      <div style={{ marginTop: 12 }}>
        <Button variant="ghost" className="dim" onClick={continueGuest}>
          {t('Continue as Guest')}
        </Button>
      </div>

      <div className="dim small" style={{ marginTop: 24, lineHeight: 1.5 }}>
        {t('Sign in with Google to sync your workouts across all your devices, or use a local profile to keep everything in this browser.')}
      </div>
    </div>
  )
}
