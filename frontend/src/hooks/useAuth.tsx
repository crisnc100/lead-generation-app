import { useState, useEffect, createContext, useContext } from 'react'
import type { User, AuthError, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// =====================================================
// Auth Context Interface
// =====================================================
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

// =====================================================
// Create Auth Context
// =====================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// =====================================================
// Auth Provider Component
// =====================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // =====================================================
  // Sign Up Function
  // =====================================================
  // IMPORTANT: Auto-creates workspace + member entry on signup
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })

    // CRITICAL: After signup, create workspace + member entry
    if (data.user && !error) {
      try {
        // Create workspace for new user
        const { data: workspace, error: workspaceError } = await supabase
          .from('workspaces')
          .insert({
            name: `${email.split('@')[0]}'s Workspace`,
            owner_id: data.user.id,
            plan: 'free',
            monthly_lead_limit: 50,
          })
          .select()
          .single()

        if (workspaceError) {
          console.error('Error creating workspace:', workspaceError)
          throw workspaceError
        }

        // Add user as owner of workspace
        const { error: memberError } = await supabase.from('members').insert({
          user_id: data.user.id,
          workspace_id: workspace.id,
          role: 'owner',
        })

        if (memberError) {
          console.error('Error creating member:', memberError)
          throw memberError
        }

        console.log('✅ Workspace created successfully:', workspace.id)
      } catch (err) {
        console.error('❌ Failed to create workspace:', err)
        // Note: User is still created, workspace creation failed
        // You may want to show a warning to the user
      }
    }

    return { error }
  }

  // =====================================================
  // Sign In Function
  // =====================================================
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  // =====================================================
  // Sign Out Function
  // =====================================================
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setSession(null)
      // Clear workspace from localStorage
      localStorage.removeItem('active_workspace_id')
    }
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// =====================================================
// useAuth Hook
// =====================================================
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
