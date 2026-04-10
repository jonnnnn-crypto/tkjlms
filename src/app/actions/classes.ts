'use server'

import { revalidatePath } from 'next/cache'
import { redirect }       from 'next/navigation'
import { createClient }   from '@/lib/supabase/server'
import { requireAuth }    from '@/lib/auth'
import type { ActionState } from '@/lib/types'

/** TEACHER: Create a new class */
export async function createClass(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const profile = await requireAuth(['teacher', 'admin'])

  const name        = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim()

  if (!name) return { error: 'Nama kelas wajib diisi.' }

  // Generate unique 6-char class code
  const class_code = Math.random().toString(36).substring(2, 8).toUpperCase()

  const supabase = await createClient()
  const { error } = await supabase.from('classes').insert({
    name,
    description: description || null,
    teacher_id: profile.id,
    class_code,
  })

  if (error) return { error: 'Gagal membuat kelas. Coba lagi.' }

  revalidatePath('/classes')
  revalidatePath('/dashboard')
  return { success: `Kelas "${name}" berhasil dibuat! Kode: ${class_code}` }
}

/** STUDENT: Join class by code */
export async function joinClass(
  _prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const profile = await requireAuth(['student'])

  const code = (formData.get('code') as string)?.trim().toUpperCase()
  if (!code) return { error: 'Kode kelas wajib diisi.' }

  const supabase = await createClient()

  // Find class
  const { data: cls, error: classError } = await supabase
    .from('classes')
    .select('id, name')
    .eq('class_code', code)
    .single()

  if (classError || !cls) return { error: 'Kode kelas tidak ditemukan.' }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', profile.id)
    .eq('class_id', cls.id)
    .single()

  if (existing) return { error: 'Kamu sudah terdaftar di kelas ini.' }

  // Enroll
  const { error } = await supabase.from('enrollments').insert({
    user_id: profile.id,
    class_id: cls.id,
  })

  if (error) return { error: 'Gagal bergabung. Coba lagi.' }

  revalidatePath('/classes')
  revalidatePath('/dashboard')
  redirect(`/classes/${cls.id}`)
}

/** TEACHER: Add material to class */
export async function addMaterial(formData: FormData): Promise<ActionState> {
  await requireAuth(['teacher', 'admin'])

  const class_id = formData.get('class_id') as string
  const title    = (formData.get('title') as string)?.trim()
  const content  = (formData.get('content') as string)?.trim()
  const type     = (formData.get('type') as string) || 'text'

  if (!class_id || !title) return { error: 'Data materi tidak lengkap.' }

  const supabase = await createClient()
  const { error } = await supabase.from('materials').insert({
    class_id, title, content, type,
  })

  if (error) return { error: 'Gagal menyimpan materi.' }

  revalidatePath(`/classes/${class_id}`)
  return { success: 'Materi berhasil ditambahkan.' }
}
