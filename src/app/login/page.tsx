'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'

const STATS = [
  { v: '500+', l: 'Siswa Aktif' },
  { v: '30+',  l: 'Guru Expert' },
  { v: '98%',  l: 'Kepuasan' },
]

/* ── Shared SVG icon wrappers ──────────────────────── */
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

function InputIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
      {children}
    </div>
  )
}

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="min-h-screen flex bg-[#080a0f]">

      {/* ── Left: Info panel ─────────────────────── */}
      <div className="hidden lg:flex w-[44%] shrink-0 flex-col items-center justify-center px-12 py-10 bg-gradient-to-br from-indigo-950/50 to-[#080a0f] border-r border-white/[0.05] relative overflow-hidden">

        <div className="pointer-events-none absolute inset-0 hero-mesh" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-30" />
        <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[80px] -translate-y-1/4 -translate-x-1/4" />

        {/* Logo */}
        <div className="absolute top-6 left-6">
          <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-black text-white">N</div>
            <span className="text-sm font-extrabold text-gradient">NetLearnX</span>
          </Link>
        </div>

        <div className="relative w-full max-w-sm">

          <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight">
            Selamat datang<br />kembali!
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Platform LMS terlengkap untuk SMK TJKT. Belajar jaringan komputer jadi lebih mudah.
          </p>

          {/* Testimonial card */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 mb-7">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed mb-3.5">
              &ldquo;NetLearnX membantu saya lulus ujian CCNA lebih cepat. Lab simulasinya sangat mirip ujian asli!&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                BA
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Budi Adi</p>
                <p className="text-xs text-slate-600">Siswa TJKT · SMK N 1 Surabaya</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(s => (
              <div key={s.l} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-center">
                <p className="text-xl font-extrabold text-gradient leading-none mb-1">{s.v}</p>
                <p className="text-xs text-slate-600">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="absolute bottom-4 text-[0.65rem] text-slate-700">© 2026 NetLearnX</p>
      </div>

      {/* ── Right: Login form ─────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">

        {/* Mobile logo */}
        <div className="lg:hidden mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-black text-white">N</div>
            <span className="text-base font-extrabold text-gradient">NetLearnX</span>
          </Link>
        </div>

        <div className="w-full max-w-[380px]">

          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-white mb-1">Masuk ke Akun</h1>
            <p className="text-slate-500 text-sm">Lanjutkan perjalanan belajarmu hari ini.</p>
          </div>

          {/* Error */}
          {state?.error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
              <svg className="h-4 w-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4" autoComplete="on">

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Email
              </label>
              <div className="relative">
                <InputIcon><IconMail /></InputIcon>
                <input id="login-email" name="email" type="email" required
                  autoComplete="email" placeholder="nama@sekolah.sch.id"
                  className="input-field pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Lupa password?
                </a>
              </div>
              <div className="relative">
                <InputIcon><IconLock /></InputIcon>
                <input id="login-password" name="password" type="password" required
                  autoComplete="current-password" placeholder="Password kamu"
                  className="input-field pl-10" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={pending} id="login-submit"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3.5 text-sm font-bold text-white transition-all hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed glow-btn hover:-translate-y-0.5"
            >
              {pending ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-slate-700">atau</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Daftar gratis sekarang
            </Link>
          </p>

          {/* Security note — SVG icon, no emoji */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            <svg className="h-3.5 w-3.5 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
            </svg>
            <p className="text-xs text-slate-700">Akun baru mendapat peran Siswa secara otomatis.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
