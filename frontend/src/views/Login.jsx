import { useStore } from '../store/useStore.js'
import { useUI } from '../store/useUI.js'
import { t } from '../lib/i18n.js'
import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'

export default function Login() {
  const { setUser, setGuest } = useStore()
  const [name, setName] = useState('')
  const toast = useUI(s => s.toast)

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
      <div className="muted" style={{ marginBottom: 28 }}>
        {t('Your workouts. Your weights. Your profile.')}
      </div>

      <form onSubmit={createAccount} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          className="input"
          placeholder={t('Enter your name (e.g. Alex)')}
          maxLength={40}
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <Button variant="primary" icon="sparkles" onClick={createAccount}>
          {t('Create Free Account')}
        </Button>
      </form>

      <div style={{ marginTop: 12 }}>
        <Button variant="ghost" className="dim" onClick={continueGuest}>
          {t('Continue as Guest')}
        </Button>
      </div>

      <div className="dim small" style={{ marginTop: 28, lineHeight: 1.5 }}>
        {t('100% Free & Private — all your workouts, routines, and weights are stored securely on this device.')}
      </div>
    </div>
  )
}
