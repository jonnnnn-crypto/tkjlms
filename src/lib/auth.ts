import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Role } from '@/lib/types'

/**
 * Get current authenticated user (server-side).
 * Returns null if not authenticated.
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Get current user's profile from `profiles` table.
 * Returns null if not found.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !data) return null
  return data as Profile
}

/**
 * Require authentication + optional role check.
 * Redirects to /login if not authenticated.
 * Redirects to /dashboard if role doesn't match.
 */
export async function requireAuth(allowedRoles?: Role[]) {
  const profile = await getProfile()

  if (!profile) {
    redirect('/login')
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    redirect('/dashboard')
  }

  return profile
}

/**
 * Require that user is NOT authenticated.
 * Redirects to /dashboard if already logged in.
 */
export async function requireGuest() {
  const user = await getUser()
  if (user) redirect('/dashboard')
}
