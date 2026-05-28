import { Session } from '@supabase/supabase-js'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/types/supabase'

type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  session: Session | null
  profile: Profile | null
  isAdmin: boolean
  isSales: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function loadProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('Failed to load profile:', error)
    return null
  }
  return data as Profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }

  const [status, setStatus] = useState<AuthStatus>('initializing')
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  // Track the latest userId we fetched a profile for, to avoid re-fetching on
  // every token refresh.
  const lastProfileUserId = useRef<string | null>(null)

  const applySession = useCallback(async (next: Session | null) => {
    setSession(next)

    const nextUserId = next?.user.id ?? null
    if (nextUserId !== lastProfileUserId.current) {
      lastProfileUserId.current = nextUserId
      if (nextUserId) {
        const p = await loadProfile(nextUserId)
        setProfile(p)
      } else {
        setProfile(null)
      }
    }

    setStatus(next ? 'authenticated' : 'unauthenticated')
  }, [])

  useEffect(() => {
    let cancelled = false
    supabase!.auth.getSession().then(({ data }) => {
      if (cancelled) return
      void applySession(data.session)
    })

    const { data: subscription } = supabase!.auth.onAuthStateChange((_event, next) => {
      void applySession(next)
    })

    return () => {
      cancelled = true
      subscription.subscription.unsubscribe()
    }
  }, [applySession])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase!.auth.signOut()
    if (error) throw error
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    const redirectTo = `${window.location.origin}/reset-password`
    const { error } = await supabase!.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) throw error
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    const { error } = await supabase!.auth.updateUser({ password: newPassword })
    if (error) throw error
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!session) return
    const p = await loadProfile(session.user.id)
    setProfile(p)
  }, [session])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      profile,
      isAdmin: profile?.role === 'admin',
      isSales: profile?.role === 'sales',
      signIn,
      signOut,
      requestPasswordReset,
      updatePassword,
      refreshProfile,
    }),
    [status, session, profile, signIn, signOut, requestPasswordReset, updatePassword, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
