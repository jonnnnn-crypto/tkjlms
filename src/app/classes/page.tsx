import { requireAuth }     from '@/lib/auth'
import { createClient }    from '@/lib/supabase/server'
import Navbar              from '@/components/Navbar'
import Sidebar             from '@/components/Sidebar'
import { JoinClassForm }   from '@/components/JoinClassForm'
import { CreateClassForm } from '@/components/CreateClassForm'
import Link                from 'next/link'
import type { Metadata }   from 'next'

export const metadata: Metadata = { title: 'Kelas — NetLearnX' }

const CLASS_COLORS = [
  'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/50',
  'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/50',
  'from-violet-500/20 to-violet-500/5 border-violet-500/20 hover:border-violet-500/50',
  'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50',
  'from-amber-500/20 to-amber-500/5 border-amber-500/20 hover:border-amber-500/50',
  'from-rose-500/20 to-rose-500/5 border-rose-500/20 hover:border-rose-500/50',
]

export default async function ClassesPage() {
  const profile  = await requireAuth()
  const supabase = await createClient()

  let classes: any[] = []

  if (profile.role === 'student') {
    const { data } = await supabase
      .from('enrollments')
      .select('class_id, enrolled_at, classes(id, name, description, class_code, subject, profiles(name))')
      .eq('user_id', profile.id)
      .order('enrolled_at', { ascending: false })
    classes = (data ?? []).map((e: any) => ({ ...e.classes, enrolled_at: e.enrolled_at })).filter(Boolean)
  } else if (profile.role === 'teacher') {
    const { data } = await supabase
      .from('classes')
      .select('*, profiles(name)')
      .eq('teacher_id', profile.id)
      .order('created_at', { ascending: false })
    classes = data ?? []
  } else {
    // Admin sees all
    const { data } = await supabase
      .from('classes')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false })
    classes = data ?? []
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#080a0f]">
      <Navbar profile={profile} />
      <div className="flex flex-1">
        <Sidebar role={profile.role} currentPath="/classes" />

        <main className="flex-1 p-5 md:p-7 overflow-auto">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-7">
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {profile.role === 'student' ? '📚 Kelas Saya' : '🏫 Kelola Kelas'}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {classes.length > 0
                  ? `${classes.length} kelas ${profile.role === 'student' ? 'diikuti' : 'tersedia'}`
                  : 'Belum ada kelas'}
              </p>
            </div>
            <div>
              {profile.role === 'student' ? <JoinClassForm /> : <CreateClassForm />}
            </div>
          </div>

          {/* Grid */}
          {classes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] py-20 text-center">
              <p className="text-5xl mb-4">{profile.role === 'student' ? '📚' : '🏫'}</p>
              <p className="font-bold text-slate-300 text-lg mb-1">
                {profile.role === 'student' ? 'Belum bergabung ke kelas' : 'Buat kelas pertamamu!'}
              </p>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                {profile.role === 'student'
                  ? 'Masukkan kode kelas dari guru untuk mulai belajar.'
                  : 'Buat kelas dan undang siswa dengan kode unik kamu.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls: any, i: number) => {
                const colorClass = CLASS_COLORS[i % CLASS_COLORS.length]
                return (
                  <Link key={cls.id} href={`/classes/${cls.id}`} className="group">
                    <div className={`relative rounded-2xl border bg-gradient-to-br ${colorClass} p-5 h-full transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30`}>

                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.08] text-2xl flex-shrink-0">
                          📡
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[0.65rem] font-bold tracking-wider text-slate-500 bg-white/[0.06] px-2 py-0.5 rounded-md">
                            {cls.class_code}
                          </span>
                        </div>
                      </div>

                      {/* Name */}
                      <h2 className="font-bold text-slate-100 mb-1 line-clamp-2 leading-snug">{cls.name}</h2>
                      {cls.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{cls.description}</p>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {cls.subject && <span className="tag tag-indigo">{cls.subject}</span>}
                        {cls.semester && <span className="tag tag-cyan text-[0.6rem]">{cls.semester}</span>}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
                        <p className="text-xs text-slate-600">
                          {cls.profiles?.name ? `👨‍🏫 ${cls.profiles.name}` : 'Kelas'}
                        </p>
                        <span className="text-xs font-semibold text-slate-500 group-hover:text-indigo-400 transition-colors">
                          Buka →
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
