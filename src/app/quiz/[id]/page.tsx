'use client'

import { useState, useEffect, useTransition } from 'react'
import { notFound, useRouter }                 from 'next/navigation'
import { createClient }                        from '@/lib/supabase/client'
import { submitQuiz }                          from '@/app/actions/quiz'
import ProgressBar                             from '@/components/ProgressBar'
import Link                                    from 'next/link'

interface Props { params: Promise<{ id: string }> }

export default function QuizPage({ params }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [quizId,    setQuizId]    = useState<string>('')
  const [quiz,      setQuiz]      = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [answers,   setAnswers]   = useState<Record<string, string>>({})
  const [current,   setCurrent]   = useState(0)
  const [result,    setResult]    = useState<{ score: number; total: number } | null>(null)
  const [existing,  setExisting]  = useState<{ score: number } | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [timeLeft,  setTimeLeft]  = useState(0)

  useEffect(() => {
    params.then(p => setQuizId(p.id))
  }, [params])

  useEffect(() => {
    if (!quizId) return

    const supabase = createClient()

    async function load() {
      const { data: q } = await supabase
        .from('quizzes')
        .select('*, classes(name)')
        .eq('id', quizId)
        .single()

      if (!q) { setError('Quiz tidak ditemukan.'); setLoading(false); return }

      const { data: user } = await supabase.auth.getUser()
      if (user.user) {
        const { data: sub } = await supabase
          .from('submissions')
          .select('score')
          .eq('user_id', user.user.id)
          .eq('quiz_id', quizId)
          .single()

        if (sub) { setExisting(sub); setLoading(false); setQuiz(q); return }
      }

      const { data: qs } = await supabase
        .from('questions')
        .select('id, question, options, order_num')
        .eq('quiz_id', quizId)
        .order('order_num')

      setQuiz(q)
      setQuestions(qs ?? [])
      setTimeLeft((q.duration ?? 30) * 60)
      setLoading(false)
    }

    load()
  }, [quizId])

  // Timer countdown
  useEffect(() => {
    if (!quiz || existing || result || timeLeft <= 0) return
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [quiz, existing, result, timeLeft])

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await submitQuiz(quizId, answers)
      if ('error' in res) setError(res.error)
      else setResult(res)
    })
  }

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
  const progress = questions.length ? (Object.keys(answers).length / questions.length) * 100 : 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
      <div className="text-slate-400 animate-pulse">Memuat quiz...</div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
      <div className="text-center text-red-400">{error}</div>
    </div>
  )

  // Already submitted
  if (existing) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14] px-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-2xl border border-white/[0.08] bg-[#13161d] p-8">
          <p className="text-5xl mb-4">✅</p>
          <h1 className="text-xl font-bold mb-2">{quiz?.title}</h1>
          <p className="text-slate-400 mb-6">Kamu sudah mengerjakan quiz ini.</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className={`text-5xl font-extrabold ${existing.score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
              {existing.score}
            </span>
            <span className="text-slate-400 text-2xl">/100</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            {existing.score >= 70 ? '🎉 Selamat! Kamu lulus!' : '💪 Semangat terus belajar!'}
          </p>
          <Link href="/classes" className="block w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
            Kembali ke Kelas
          </Link>
        </div>
      </div>
    </div>
  )

  // Show result after submit
  if (result) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14] px-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-2xl border border-white/[0.08] bg-[#13161d] p-8 animate-fade-up">
          <p className="text-6xl mb-4">{result.score >= 70 ? '🎉' : '💪'}</p>
          <h1 className="text-xl font-bold mb-1">Quiz Selesai!</h1>
          <p className="text-slate-400 mb-6">{quiz?.title}</p>
          <div className="rounded-xl bg-white/[0.04] p-6 mb-6">
            <p className="text-xs text-slate-500 mb-1">Nilai Kamu</p>
            <p className={`text-6xl font-extrabold ${result.score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
              {result.score}
            </p>
            <p className="text-slate-500 text-sm mt-1">dari 100 poin</p>
          </div>
          <ProgressBar value={result.score} label={`${result.score >= 70 ? 'LULUS' : 'BELUM LULUS'}`} />
          <p className="text-sm text-slate-400 mt-4">
            Benar: {Math.round(result.score / 100 * result.total)} / {result.total} soal
          </p>
          <Link href="/classes" className="block w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
            Kembali ke Kelas
          </Link>
        </div>
      </div>
    </div>
  )

  const q = questions[current]
  if (!q) return null

  return (
    <div className="min-h-screen bg-[#0d0f14] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/[0.07] bg-[#0d0f14]/90 backdrop-blur-xl px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-200">{quiz?.title}</p>
            <p className="text-xs text-slate-500">{quiz?.classes?.name}</p>
          </div>
          <div className={`font-mono font-bold text-lg ${timeLeft < 120 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
            ⏱ {fmt(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <ProgressBar value={progress} label={`Soal ${current + 1} dari ${questions.length}`} />
          </div>

          {/* Question */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#13161d] p-6 mb-4">
            <p className="text-sm text-indigo-400 font-semibold mb-3">Soal {current + 1}</p>
            <p className="text-slate-100 text-lg leading-relaxed">{q.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {(q.options as string[]).map((opt: string, i: number) => {
              const key  = ['A','B','C','D'][i]
              const selected = answers[q.id] === key
              return (
                <button
                  key={key}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: key }))}
                  className={`w-full text-left rounded-xl border px-5 py-4 transition-all ${
                    selected
                      ? 'border-indigo-500 bg-indigo-500/15 text-white'
                      : 'border-white/[0.07] bg-[#13161d] text-slate-300 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`inline-block w-7 h-7 rounded-lg text-xs font-bold text-center leading-7 mr-3 flex-shrink-0 ${
                    selected ? 'bg-indigo-500 text-white' : 'bg-white/[0.08] text-slate-400'
                  }`}>
                    {key}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              className="px-5 py-2.5 border border-white/10 text-slate-400 hover:bg-white/[0.05] disabled:opacity-30 rounded-xl transition-colors text-sm font-semibold"
            >
              ← Sebelumnya
            </button>

            {/* Soal dots */}
            <div className="flex gap-1.5 flex-wrap justify-center">
              {questions.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    i === current
                      ? 'bg-indigo-600 text-white'
                      : answers[questions[i].id]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/[0.05] text-slate-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent(c => c + 1)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors text-sm font-semibold"
              >
                Berikutnya →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white rounded-xl transition-colors text-sm font-bold"
              >
                {isPending ? 'Menyimpan...' : 'Selesai & Kumpul ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
