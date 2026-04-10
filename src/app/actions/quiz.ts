'use server'

import { revalidatePath }  from 'next/cache'
import { redirect }        from 'next/navigation'
import { createClient }    from '@/lib/supabase/server'
import { requireAuth }     from '@/lib/auth'
import type { ActionState, Question } from '@/lib/types'

/** STUDENT: Submit quiz answers and auto-grade */
export async function submitQuiz(
  quizId: string,
  answers: Record<string, string>  // { questionId: selectedOption }
): Promise<{ score: number; total: number } | { error: string }> {
  const profile = await requireAuth(['student'])
  const supabase = await createClient()

  // Check if already submitted
  const { data: existing } = await supabase
    .from('submissions')
    .select('id, score')
    .eq('user_id', profile.id)
    .eq('quiz_id', quizId)
    .single()

  if (existing) {
    return { error: 'Kamu sudah mengerjakan quiz ini.' }
  }

  // Fetch questions with correct answers
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('id, correct_answer')
    .eq('quiz_id', quizId)

  if (qErr || !questions) return { error: 'Gagal memproses quiz.' }

  // Auto-grade
  const total = questions.length
  let correct = 0
  questions.forEach((q: Pick<Question, 'id' | 'correct_answer'>) => {
    if (answers[q.id] === q.correct_answer) correct++
  })

  const score = total > 0 ? Math.round((correct / total) * 100) : 0

  // Save submission
  const { error } = await supabase.from('submissions').insert({
    user_id: profile.id,
    quiz_id: quizId,
    answers,
    score,
  })

  if (error) return { error: 'Gagal menyimpan jawaban.' }

  revalidatePath(`/quiz/${quizId}`)
  return { score, total }
}

/** TEACHER: Create quiz */
export async function createQuiz(formData: FormData): Promise<ActionState> {
  await requireAuth(['teacher', 'admin'])

  const class_id = formData.get('class_id') as string
  const title    = (formData.get('title') as string)?.trim()
  const duration = parseInt(formData.get('duration') as string) || 30

  if (!class_id || !title) return { error: 'Data quiz tidak lengkap.' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quizzes')
    .insert({ class_id, title, duration })
    .select('id')
    .single()

  if (error || !data) return { error: 'Gagal membuat quiz.' }

  revalidatePath(`/classes/${class_id}`)
  redirect(`/quiz/${data.id}/edit`)
}
