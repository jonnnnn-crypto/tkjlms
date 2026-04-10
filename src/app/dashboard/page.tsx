import type { Metadata } from 'next'
import { requireAuth }  from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Navbar           from '@/components/Navbar'
import Sidebar          from '@/components/Sidebar'
import { StatCard }     from '@/components/Card'
import ProgressBar      from '@/components/ProgressBar'
import Link             from 'next/link'
import {
  IconBook, IconClipboardDocument, IconStar, IconSchool,
  IconUsers, IconChartBar, IconCog, IconSignal
} from '@/components/Icons'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const profile  = await requireAuth()
  const supabase = await createClient()

  /* ── Student data ── */
  let enrolledClasses: any[] = []
  let recentSubmissions: any[] = []

  if (profile.role === 'student') {
    const { data: enr } = await supabase
      .from('enrollments')
      .select('class_id, enrolled_at, classes(id, name, class_code, profiles(name))')
      .eq('user_id', profile.id)
      .order('enrolled_at', { ascending: false })
      .limit(6)

    enrolledClasses = (enr ?? []).map((e: any) => ({ ...e.classes, enrolled_at: e.enrolled_at })).filter(Boolean)

    const { data: subs } = await supabase
      .from('submissions')
      .select('score, quiz_id, created_at, quizzes(title)')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(5)

    recentSubmissions = subs ?? []
  }

  /* ── Teacher data ── */
  let teacherClasses: any[] = []
  let totalStudents = 0

  if (profile.role === 'teacher') {
    const { data: cls } = await supabase
      .from('classes')
      .select('id, name, class_code')
      .eq('teacher_id', profile.id)

    teacherClasses = cls ?? []
    if (cls?.length) {
      const { count } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .in('class_id', cls.map((c: any) => c.id))
      totalStudents = count ?? 0
    }
  }

  /* ── Admin stats ── */
  let adminStats = { users: 0, classes: 0, submissions: 0 }
  if (profile.role === 'admin') {
    const [{ count: u }, { count: c }, { count: s }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('classes').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }),
    ])
    adminStats = { users: u ?? 0, classes: c ?? 0, submissions: s ?? 0 }
  }

  const avgScore = recentSubmissions.length
    ? Math.round(recentSubmissions.reduce((a: number, s: any) => a + (s.score ?? 0), 0) / recentSubmissions.length)
    : 0

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat Pagi'
    if (h < 15) return 'Selamat Siang'
    if (h < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  })()

  return (
    <div className="flex flex-col min-h-screen bg-[#080a0f]">
      <Navbar profile={profile} />
      <div className="flex flex-1">
        <Sidebar role={profile.role} currentPath="/dashboard" />

        <main className="flex-1 p-5 md:p-7 overflow-auto">

          {/* ── Header with greeting ── */}
          <div className="mb-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{greeting} 👋</p>
                <h1 className="text-2xl font-extrabold text-white">{profile.name ?? 'Pengguna'}</h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Quick action */}
              {profile.role === 'student' && (
                <Link href="/classes" className="flex items-center gap-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/25 px-4 py-2.5 text-sm font-semibold text-indigo-300 transition-all hover:-translate-y-0.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                  Bergabung Kelas
                </Link>
              )}
              {profile.role === 'teacher' && (
                <Link href="/classes" className="flex items-center gap-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/25 px-4 py-2.5 text-sm font-semibold text-cyan-300 transition-all hover:-translate-y-0.5">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                  </svg>
                  Buat Kelas
                </Link>
              )}
            </div>
          </div>

          {/* ══════════════ STUDENT ══════════════ */}
          {profile.role === 'student' && (
            <div className="space-y-7">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard icon={<IconBook />} label="Kelas Diikuti"  value={enrolledClasses.length} sub="kelas aktif" />
                <StatCard icon={<IconClipboardDocument />} label="Quiz Selesai"   value={recentSubmissions.length} sub="soal dikerjakan" />
                <StatCard icon={<IconStar />} label="Rata-rata Nilai" value={`${avgScore}`} sub="dari 100 poin" />
              </div>

              {avgScore > 0 && (
                <div className="rounded-xl border border-white/[0.06] bg-[#0d0f1a] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Progress Nilai Keseluruhan</p>
                  <ProgressBar value={avgScore} label={`${avgScore >= 70 ? '🎉 Di Atas KKM' : '📈 Terus Semangat!'}`} />
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-5">
                {/* Enrolled Classes */}
                <div className="lg:col-span-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-slate-200 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      Kelas Saya
                    </h2>
                    <Link href="/classes" className="text-xs text-indigo-400 hover:text-indigo-300">
                      Lihat semua →
                    </Link>
                  </div>

                  {enrolledClasses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/[0.08] p-10 text-center">
                      <div className="flex justify-center mb-4"><IconBook className="h-10 w-10 text-slate-500" /></div>
                      <p className="text-sm font-semibold text-slate-400">Belum ada kelas</p>
                      <p className="text-xs text-slate-600 mt-1 mb-4">Masukkan kode dari guru untuk bergabung</p>
                      <Link href="/classes" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-500/25 px-3 py-2 rounded-lg">
                        + Bergabung Kelas
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {enrolledClasses.map((cls: any) => (
                        <Link key={cls.id} href={`/classes/${cls.id}`}>
                          <div className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[#0d0f1a] px-4 py-3.5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 text-xl">
                              <IconSignal className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-200 truncate">{cls.name}</p>
                              <p className="text-xs text-slate-600 font-mono mt-0.5">
                                {cls.profiles?.name ? `👨‍🏫 ${cls.profiles.name}` : `#${cls.class_code}`}
                              </p>
                            </div>
                            <svg className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent scores */}
                <div className="lg:col-span-2 space-y-3">
                  <h2 className="font-bold text-slate-200 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    Nilai Terbaru
                  </h2>

                  {recentSubmissions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 text-center">
                      <div className="flex justify-center mb-3"><IconChartBar className="h-8 w-8 text-slate-500" /></div>
                      <p className="text-sm text-slate-500">Belum ada quiz dikerjakan</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {recentSubmissions.map((s: any) => {
                        const score = s.score ?? 0
                        const passed = score >= 70
                        return (
                          <div key={s.quiz_id} className="rounded-xl border border-white/[0.06] bg-[#0d0f1a] p-4">
                            <div className="flex items-center justify-between mb-2.5">
                              <p className="text-xs font-semibold text-slate-300 truncate flex-1 mr-2">
                                {s.quizzes?.title ?? 'Quiz'}
                              </p>
                              <span className={`text-sm font-extrabold flex-shrink-0 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                                {score}
                              </span>
                            </div>
                            <ProgressBar value={score} showPercent={false} size="sm" />
                            <p className={`text-[0.65rem] mt-1.5 font-semibold ${passed ? 'text-green-500' : 'text-red-500'}`}>
                              {passed ? '✓ LULUS' : '✗ BELUM LULUS'}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════ TEACHER ══════════════ */}
          {profile.role === 'teacher' && (
            <div className="space-y-7">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard icon={<IconSchool />} label="Kelas Dibuat"  value={teacherClasses.length} sub="kelas aktif" />
                <StatCard icon={<IconUsers />} label="Total Siswa"   value={totalStudents} sub="terdaftar" />
                <StatCard icon={<IconChartBar />} label="Aktivitas"     value="Aktif" sub="hari ini" />
              </div>

              <div className="flex items-center justify-between mb-0">
                <h2 className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  Kelas Saya
                </h2>
                <Link href="/classes" className="text-xs text-cyan-400 hover:text-cyan-300">
                  + Buat kelas baru →
                </Link>
              </div>

              {teacherClasses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/[0.08] p-14 text-center">
                  <div className="flex justify-center mb-4"><IconSchool className="h-12 w-12 text-slate-500" /></div>
                  <p className="font-semibold text-slate-400 mb-4">Belum ada kelas. Buat sekarang!</p>
                  <Link href="/classes" className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 border border-cyan-500/25 px-4 py-2.5 rounded-lg hover:bg-cyan-500/10 transition-colors">
                    + Buat Kelas Pertama
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {teacherClasses.map((cls: any) => (
                    <Link key={cls.id} href={`/classes/${cls.id}`}>
                      <div className="rounded-xl border border-white/[0.06] bg-[#0d0f1a] p-5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all hover:-translate-y-0.5 group">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/10 text-xl"><IconSignal className="h-5 w-5 text-cyan-400" /></div>
                          <span className="text-xs font-mono text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded-md">{cls.class_code}</span>
                        </div>
                        <p className="font-bold text-slate-200 mb-0.5">{cls.name}</p>
                        <p className="text-xs text-cyan-400 group-hover:underline mt-2">Kelola kelas →</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════ ADMIN ══════════════ */}
          {profile.role === 'admin' && (
            <div className="space-y-7">
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard icon={<IconUsers />} label="Total Pengguna" value={adminStats.users} sub="akun terdaftar" />
                <StatCard icon={<IconSchool />} label="Total Kelas"    value={adminStats.classes} sub="kelas aktif" />
                <StatCard icon={<IconClipboardDocument />} label="Total Submisi"  value={adminStats.submissions} sub="quiz dikerjakan" />
              </div>
              <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-indigo-500/8 to-cyan-500/5 p-8 text-center">
                <div className="flex justify-center mb-4"><IconCog className="h-12 w-12 text-slate-400" /></div>
                <p className="font-bold text-slate-200 text-lg">Panel Administrator</p>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                  Kelola semua pengguna, kelas, dan konten melalui navigasi di sidebar.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
