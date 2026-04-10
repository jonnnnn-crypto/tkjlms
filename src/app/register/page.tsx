'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { register } from '@/app/actions/auth'

/* ── Benefit list dengan SVG icons ──────────────────── */
const BENEFITS = [
  {
    text: 'Akses materi jaringan komputer lengkap',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
      </svg>
    ),
    color: 'text-indigo-400 bg-indigo-500/15',
  },
  {
    text: 'Quiz interaktif dengan penilaian otomatis',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
      </svg>
    ),
    color: 'text-cyan-400 bg-cyan-500/15',
  },
  {
    text: 'Lab simulasi konfigurasi IP & routing',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V8.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 8.25v9a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"/>
      </svg>
    ),
    color: 'text-violet-400 bg-violet-500/15',
  },
  {
    text: 'Dashboard progres belajar personal',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
      </svg>
    ),
    color: 'text-emerald-400 bg-emerald-500/15',
  },
]

/* ── SVG icon helpers (input fields) ────────────────── */
const IconUser = () => (
  <svg className="h-[1.05rem] w-[1.05rem]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
  </svg>
)
const IconMail = () => (
  <svg className="h-[1.05rem] w-[1.05rem]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
  </svg>
)
const IconLock = () => (
  <svg className="h-[1.05rem] w-[1.05rem]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
  </svg>
)
const IconShield = () => (
  <svg className="h-[1.05rem] w-[1.05rem]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
  </svg>
)

function InputIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
      {children}
    </div>
  )
}

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined)

  return (
    <div className="min-h-screen flex bg-[#080a0f]">

      {/* ── Left: Form ────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">

        {/* Mobile logo */}
        <div className="lg:hidden mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-black text-white">N</div>
            <span className="text-base font-extrabold text-gradient">NetLearnX</span>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">

          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-white mb-1">Buat Akun Gratis</h1>
            <p className="text-slate-500 text-sm">Bergabung dan mulai belajar jaringan komputer hari ini.</p>
          </div>

          {/* Alerts */}
          {state?.error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
              <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-300">
              <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
              </svg>
              {state.success}
            </div>
          )}

          <form action={action} className="space-y-4" autoComplete="on">

            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <InputIcon><IconUser /></InputIcon>
                <input id="reg-name" name="name" type="text" required autoComplete="name"
                  placeholder="Nama lengkapmu" className="input-field pl-10" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Email
              </label>
              <div className="relative">
                <InputIcon><IconMail /></InputIcon>
                <input id="reg-email" name="email" type="email" required autoComplete="email"
                  placeholder="nama@sekolah.sch.id" className="input-field pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <InputIcon><IconLock /></InputIcon>
                <input id="reg-password" name="password" type="password" required autoComplete="new-password"
                  placeholder="Minimal 6 karakter" className="input-field pl-10" />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Konfirmasi Password
              </label>
              <div className="relative">
                <InputIcon><IconShield /></InputIcon>
                <input id="reg-confirm" name="confirm" type="password" required autoComplete="new-password"
                  placeholder="Ulangi password" className="input-field pl-10" />
              </div>
            </div>

            {/* Role note */}
            <div className="flex items-start gap-2.5 rounded-xl border border-indigo-500/15 bg-indigo-500/[0.07] px-3.5 py-3">
              <svg className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd"/>
              </svg>
              <p className="text-xs text-slate-400 leading-relaxed">
                Akun baru sebagai <span className="text-indigo-300 font-semibold">Siswa</span>. Untuk akun Guru, hubungi admin.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={pending} id="register-submit"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3.5 text-sm font-bold text-white transition-all hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed glow-btn hover:-translate-y-0.5"
            >
              {pending ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Membuat akun...
                </>
              ) : (
                <>
                  Buat Akun Gratis
                  <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Benefits panel ─────────────────── */}
      <div className="hidden lg:flex w-[44%] shrink-0 flex-col items-center justify-center px-12 py-10 border-l border-white/[0.05] bg-gradient-to-br from-[#0a0c18] to-[#080a0f] relative overflow-hidden">

        <div className="pointer-events-none absolute inset-0 hero-mesh" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-25" />
        <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-500/8 blur-[80px] -translate-y-1/4 translate-x-1/4" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[60px] translate-y-1/4 -translate-x-1/4" />

        {/* Logo */}
        <div className="absolute top-6 right-6">
          <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-black text-white">N</div>
            <span className="text-sm font-extrabold text-gradient">NetLearnX</span>
          </Link>
        </div>

        <div className="relative w-full max-w-sm">

          <h2 className="text-3xl font-extrabold text-white mb-1.5 leading-tight">
            Yang kamu<br />dapatkan ✨
          </h2>
          <p className="text-slate-500 text-sm mb-8">Semua fitur gratis, selamanya.</p>

          {/* Benefits — SVG icons */}
          <div className="space-y-3 mb-8">
            {BENEFITS.map((b) => (
              <div key={b.text} className="flex items-center gap-3.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 hover:border-indigo-500/20 hover:bg-indigo-500/[0.04] transition-all">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${b.color}`}>
                  {b.icon}
                </div>
                <span className="text-sm text-slate-300 font-medium">{b.text}</span>
                <svg className="h-4 w-4 text-slate-700 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="tag tag-green">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
              </svg>
              Aman &amp; Terpercaya
            </span>
            <span className="tag tag-cyan">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
              </svg>
              Gratis Selamanya
            </span>
            <span className="tag tag-indigo">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
              </svg>
              SMK TJKT
            </span>
          </div>

          {/* Testimonial mini */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex gap-0.5 mb-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <p className="text-xs text-slate-400 italic leading-relaxed mb-3">
              &ldquo;NetLearnX membantu saya lulus CCNA lebih cepat. Lab simulasinya sangat mirip ujian asli!&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-[0.65rem] font-black text-white flex-shrink-0">
                BA
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300">Budi Adi</p>
                <p className="text-[0.65rem] text-slate-600">TJKT · SMK N 1 Surabaya</p>
              </div>
            </div>
          </div>
        </div>

        <p className="absolute bottom-4 text-[0.65rem] text-slate-700">© 2026 NetLearnX</p>
      </div>
    </div>
  )
}
