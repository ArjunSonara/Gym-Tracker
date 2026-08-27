import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

/**
 * Trigger Google OAuth sign-in flow
 */
export async function signInWithGoogle() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }
  const redirectUrl = window.location.origin + window.location.pathname
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (error) throw error
}

/**
 * Sign out from Supabase
 */
export async function signOutSupabase() {
  if (!supabase) return
  await supabase.auth.signOut()
}

/**
 * Push gym state to Supabase user_state table
 */
export async function pushSupabaseState(state) {
  if (!supabase) return false
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('user_state')
    .upsert({
      user_id: user.id,
      state,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (error) {
    console.warn('[Supabase] pushState error:', error.message)
    return false
  }
  return true
}

/**
 * Pull gym state from Supabase user_state table
 */
export async function pullSupabaseState() {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_state')
    .select('state, updated_at')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
    console.warn('[Supabase] pullState error:', error.message)
    return null
  }
  return data?.state || null
}
