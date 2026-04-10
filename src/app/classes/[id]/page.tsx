import { notFound }     from 'next/navigation'
import { requireAuth }  from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Navbar           from '@/components/Navbar'
import Sidebar          from '@/components/Sidebar'
import Link             from 'next/link'
import type { Metadata } from 'next'
import {
  IconBook, IconVideoCamera, IconDocumentText, IconLink,
  IconPhoto, IconClipboardDocument, IconBeaker
} from '@/components/Icons'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id }   = await params
  const supabase = await createClient()
  const { data } = await supabase.from('classes').select('name').eq('id', id).single()
  return { title: data?.name ?? 'Detail Kelas' }
}

const TYPE_ICON: Record<string, { icon: React.ReactNode; color: string }> = {
  text:  { icon: <IconDocumentText />, color: 'bg-indigo-500/15 text-indigo-400' },
  video: { icon: <IconVideoCamera />, color: 'bg-red-500/15 text-red-400' },
  pdf:   { icon: <IconBook />, color: 'bg-orange-500/15 text-orange-400' },
  link:  { icon: <IconLink />, color: 'bg-cyan-500/15 text-cyan-400' },
  slide: { icon: <IconPhoto />, color: 'bg-violet-500/15 text-violet-400' },
}

const DIFF_CONFIG: Record<string, { label: string; class: string }> = {
  easy:   { label: 'Mudah',   class: 'tag-green' },
  medium: { label: 'Sedang',  class: 'tag-amber' },
  hard:   { label: 'Susah',   class: 'tag-red' },
}

export default async function ClassDetailPage({ params }: Props) {
  const { id }   = await params
  const profile  = await requireAuth()
  const supabase = await createClient()

  const { data: cls } = await supabase
    .from('classes')
    .select('*, profiles(id, name)')
    .eq('id', id)
    .single()

  if (!cls) notFound()

  const [
    { data: materials },
    { data: quizzes },
    { data: labs },
    { data: announcements },
    { data: enrollCount },
  ] = await Promise.all([
    supabase.from('materials').select('*').eq('class_id', id).eq('is_published', true).order('order_num'),
    supabase.from('quizzes').select('*').eq('class_id', id).eq('is_active', true).order('created_at'),
    supabase.from('labs').select('*').eq('class_id', id).eq('is_active', true).order('created_at'),
    supabase.from('announcements').select('*, profiles(name)').eq('class_id', id).order('created_at', { ascending: false }).limit(3),
    supabase.from('enrollments').select('id', { count: 'exact', head: true }).eq('class_id', id),
  ])

  const quizIds = (quizzes ?? []).map((q: any) => q.id)
  const { data: mySubmissions } = quizIds.length
    ? await supabase.from('submissions').select('quiz_id, score').eq('user_id', profile.id).in('quiz_id', quizIds)
    : { data: [] }

  const submissionMap = Object.fromEntries((mySubmissions ?? []).map((s: any) => [s.quiz_id, s]))

  const labIds = (labs ?? []).map((l: any) => l.id)
  const { data: myLabSubs } = labIds.length
    ? await supabase.from('lab_submissions').select('lab_id, is_correct').eq('user_id', profile.id).in('lab_id', labIds)
    : { data: [] }

  const labSubMap = Object.fromEntries((myLabSubs ?? []).map((s: any) => [s.lab_id, s]))

  const isTeacher = (profile.role === 'teacher' && cls.teacher_id === profile.id) || profile.role === 'admin'
  const studentCount = typeof enrollCount === 'number' ? enrollCount : 0

  return (
    <div className="flex flex-col min-h-screen bg-[#080a0f]">
      <Navbar profile={profile} />
      <div className="flex flex-1">
        <Sidebar role={profile.role} currentPath="/classes" />

        <main className="flex-1 overflow-auto">
          {/* ── Class Header ── */}
          <div className="relative border-b border-white/[0.05] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 via-[#080a0f] to-cyan-900/20" />
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="relative px-6 py-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                <Link href="/classes" className="hover:text-slate-400 transition-colors">Kelas</Link>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
                <span className="text-slate-400 truncate max-w-xs">{cls.name}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {cls.subject && <span className="tag tag-indigo">{cls.subject}</span>}
                    {cls.semester && <span className="tag tag-cyan">{cls.semester}</span>}
                    {!cls.is_active && <span className="tag tag-red">Tidak Aktif</span>}
                  </div>
                  <h1 className="text-2xl font-extrabold text-white mb-2">{cls.name}</h1>
                  {cls.description && <p className="text-slate-400 text-sm">{cls.description}</p>}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                      </svg>
                      {cls.profiles?.name ?? 'Guru'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                      </svg>
                      {studentCount} siswa
                    </span>
                    <span className="font-mono text-xs bg-white/[0.05] px-2.5 py-1 rounded-lg border border-white/[0.07]">
                      Kode: <span className="text-white font-bold">{cls.class_code}</span>
                    </span>
                  </div>
                </div>

                {isTeacher && (
                  <div className="flex gap-2 flex-wrap">
                    <button className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                      </svg>
                      Tambah Materi
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 border border-white/[0.08] hover:bg-white/[0.05] text-slate-300 text-sm font-semibold rounded-xl transition-all">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                      </svg>
                      Buat Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="grid gap-0 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05] min-h-[calc(100vh-220px)]">

            {/* ── Left: Materials + Announcements ── */}
            <div className="lg:col-span-2 p-6 space-y-8">

              {/* Announcements */}
              {(announcements ?? []).length > 0 && (
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-600 mb-3">📢 Pengumuman</h2>
                  <div className="space-y-2">
                    {(announcements ?? []).map((a: any) => (
                      <div key={a.id} className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                        <p className="text-sm font-semibold text-amber-300 mb-0.5">{a.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">{a.content}</p>
                        <p className="text-xs text-slate-600 mt-1">— {a.profiles?.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Materials */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-1.5">
                    <IconBook className="h-4 w-4" /> Materi Pembelajaran ({materials?.length ?? 0})
                  </h2>
                </div>

                {(materials ?? []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/[0.07] py-12 text-center flex flex-col items-center justify-center">
                    <div className="mb-3"><IconBook className="h-10 w-10 text-slate-500" /></div>
                    <p className="text-sm font-semibold text-slate-400 mb-1">Belum ada materi</p>
                    <p className="text-xs text-slate-600">
                      {isTeacher ? 'Klik "+ Tambah Materi" untuk mulai.' : 'Guru belum menambahkan materi.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {(materials ?? []).map((m: any, i: number) => {
                      const tc = TYPE_ICON[m.type] ?? TYPE_ICON.text
                      return (
                        <div
                          key={m.id}
                          className="group flex items-start gap-4 rounded-xl border border-white/[0.06] bg-[#0d0f1a] px-4 py-4 hover:border-indigo-500/30 hover:bg-indigo-500/[0.03] transition-all cursor-default"
                        >
                          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg ${tc.color}`}>
                            {tc.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[0.6rem] font-bold text-slate-600 tabular-nums">#{String(i + 1).padStart(2, '0')}</span>
                              <p className="text-sm font-semibold text-slate-200">{m.title}</p>
                            </div>
                            {m.content && (
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{m.content.replace(/^#+ /gm, '').slice(0, 120)}</p>
                            )}
                          </div>
                          <svg className="h-4 w-4 text-slate-700 group-hover:text-indigo-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                          </svg>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Quiz + Lab ── */}
            <div className="p-5 space-y-7">

              {/* Quizzes */}
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-600 mb-3 flex items-center gap-1.5">
                  <IconClipboardDocument className="h-4 w-4" /> Quiz ({quizzes?.length ?? 0})
                </h2>

                {(quizzes ?? []).length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/[0.07] py-8 text-center flex flex-col items-center justify-center">
                    <div className="mb-3"><IconClipboardDocument className="h-8 w-8 text-slate-500" /></div>
                    <p className="text-xs text-slate-600">Belum ada quiz.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {(quizzes ?? []).map((q: any) => {
                      const sub  = submissionMap[q.id]
                      const done = !!sub
                      const pass = sub?.score >= (q.pass_score ?? 70)
                      return (
                        <div key={q.id} className={`rounded-xl border p-4 transition-all ${done ? 'border-white/[0.06] bg-[#0d0f1a]' : 'border-white/[0.06] bg-[#0d0f1a] hover:border-indigo-500/30'}`}>
                          <p className="text-sm font-semibold text-slate-200 mb-2 line-clamp-1">{q.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                            <span>⏱ {q.duration} menit</span>
                            <span>·</span>
                            <span>KKM {q.pass_score ?? 70}</span>
                          </div>
                          {done ? (
                            <div className="flex items-center justify-between">
                              <span className={`tag ${pass ? 'tag-green' : 'tag-red'}`}>
                                {pass ? '✓ LULUS' : '✗ BELUM'}
                              </span>
                              <span className={`text-base font-extrabold ${pass ? 'text-green-400' : 'text-red-400'}`}>
                                {sub.score}
                              </span>
                            </div>
                          ) : (
                            <Link
                              href={`/quiz/${q.id}`}
                              className="flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Mulai Quiz
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                              </svg>
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Labs */}
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-600 mb-3 flex items-center gap-1.5">
                  <IconBeaker className="h-4 w-4" /> Lab Simulasi ({labs?.length ?? 0})
                </h2>

                {(labs ?? []).length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/[0.07] py-8 text-center flex flex-col items-center justify-center">
                    <div className="mb-3"><IconBeaker className="h-8 w-8 text-slate-500" /></div>
                    <p className="text-xs text-slate-600">Belum ada lab.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {(labs ?? []).map((lab: any) => {
                      const done = !!labSubMap[lab.id]
                      const ok   = labSubMap[lab.id]?.is_correct
                      const diff = DIFF_CONFIG[lab.difficulty ?? 'medium']
                      return (
                        <Link key={lab.id} href={`/lab/${lab.id}`}>
                          <div className={`rounded-xl border p-4 hover:border-cyan-500/30 hover:bg-cyan-500/[0.03] transition-all ${done ? 'border-white/[0.06] bg-[#0d0f1a]' : 'border-white/[0.06] bg-[#0d0f1a]'}`}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm font-semibold text-slate-200 line-clamp-1 flex-1">{lab.title}</p>
                              <span className={`tag ${diff.class} flex-shrink-0`}>{diff.label}</span>
                            </div>
                            {lab.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 mb-2">{lab.description}</p>
                            )}
                            {done ? (
                              <span className={`tag ${ok ? 'tag-green' : 'tag-amber'}`}>
                                {ok ? '✓ Benar' : '↺ Coba lagi'}
                              </span>
                            ) : (
                              <span className="text-xs text-cyan-400 font-semibold">Kerjakan Lab →</span>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
