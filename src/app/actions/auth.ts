'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionState } from '@/lib/types'

/** LOGIN */
export async function login(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email atau password salah.' }
  }

  redirect('/dashboard')
}

/** REGISTER */
export async function register(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const name     = formData.get('name') as string
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const confirm  = formData.get('confirm') as string

  if (!name || !email || !password) {
    return { error: 'Semua field wajib diisi.' }
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter.' }
  }

  if (password !== confirm) {
    return { error: 'Konfirmasi password tidak cocok.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Email sudah terdaftar. Silakan login.' }
    }
    return { error: error.message }
  }

  redirect('/dashboard')
}

/** LOGOUT */
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
