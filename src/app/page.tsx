import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NetLearnX — Platform Belajar SMK TJKT',
  description: 'Platform LMS terbaik untuk siswa dan guru SMK jurusan TJKT. Materi terstruktur, quiz otomatis, dan simulasi lab jaringan.',
}

/* ── Feature cards ──────────────────────────────────── */
const FEATURES = [
  {
    title: 'Materi Jaringan',
    desc: 'Kurikulum TJKT lengkap: CCNA, MikroTik, fiber optik, keamanan jaringan, dan lebih banyak lagi.',
    tag: 'TJKT',
    color: 'from-indigo-500/15 to-indigo-500/5',
    border: 'hover:border-indigo-500/40',
    iconColor: 'bg-indigo-500/20 text-indigo-400',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
      </svg>
    ),
  },
  {
    title: 'Lab Simulasi',
    desc: 'Latihan konfigurasi IP, routing, topologi, dan Ping Test secara interaktif tanpa hardware fisik.',
    tag: 'Interactive',
    color: 'from-cyan-500/15 to-cyan-500/5',
    border: 'hover:border-cyan-500/40',
    iconColor: 'bg-cyan-500/20 text-cyan-400',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V8.25a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 8.25v9a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"/>
      </svg>
    ),
  },
  {
    title: 'Quiz Otomatis',
    desc: 'Soal pilihan ganda dengan timer, penilaian instan, dan rekap nilai yang tersimpan otomatis.',
    tag: 'Auto-Grade',
    color: 'from-violet-500/15 to-violet-500/5',
    border: 'hover:border-violet-500/40',
    iconColor: 'bg-violet-500/20 text-violet-400',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
      </svg>
    ),
  },
  {
    title: 'Kelas Digital',
    desc: 'Guru buat kelas dengan kode unik. Siswa bergabung instan. Kelola materi, quiz & lab dalam satu dashboard.',
    tag: 'Classes',
    color: 'from-emerald-500/15 to-emerald-500/5',
    border: 'hover:border-emerald-500/40',
    iconColor: 'bg-emerald-500/20 text-emerald-400',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
      </svg>
    ),
  },
]

const STATS = [
  { v: '500+', l: 'Siswa Aktif' },
  { v: '30+',  l: 'Guru Expert' },
  { v: '100+', l: 'Materi'     },
  { v: '98%',  l: 'Kepuasan'  },
]

const TECH = ['CCNA', 'MikroTik', 'Linux Server', 'Cisco IOS', 'Fiber Optik', 'Keamanan Jaringan', 'Cloud Computing', 'VLAN', 'Static Routing', 'Subnetting', 'DNS & DHCP', 'Firewall']

const STEPS = [
  {
    n: '01', t: 'Daftar Akun',
    d: 'Buat akun gratis sebagai siswa dalam hitungan detik.',
    color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
  },
  {
    n: '02', t: 'Bergabung ke Kelas',
    d: 'Masukkan kode kelas dari gurumu untuk langsung bergabung.',
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    n: '03', t: 'Mulai Belajar',
    d: 'Akses materi, kerjakan quiz, dan latihan di lab simulasi.',
    color: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 overflow-x-hidden">

      {/* ── Navbar ───────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-[#080a0f]/85 backdrop-blur-2xl">
        <div className="mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-black text-white shadow-lg shadow-indigo-500/30">
              N
            </div>
            <span className="text-[1.05rem] font-extrabold tracking-tight text-gradient">NetLearnX</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {[['Fitur','#fitur'], ['Cara Kerja','#cara-kerja'], ['Kontak','#kontak']].map(([l, h]) => (
              <a key={l} href={h} className="px-3.5 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all">
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="group flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all hover:bg-indigo-500 glow-btn">
              Daftar Gratis
              <svg className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 hero-mesh overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute top-1/2 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-600/8 blur-[80px]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">

          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300 mb-8 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
            Platform LMS #1 untuk SMK TJKT Indonesia
          </div>

          <h1 className="animate-fade-up-1 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Belajar Jaringan
            <br />
            <span className="text-gradient">Lebih Mudah &amp; Seru</span>
          </h1>

          <p className="animate-fade-up-2 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform pembelajaran digital untuk siswa &amp; guru SMK jurusan{' '}
            <span className="text-slate-200 font-semibold">Teknik Jaringan Komputer &amp; Telekomunikasi</span>.
            Materi, quiz otomatis, dan lab simulasi dalam satu platform.
          </p>

          <div className="animate-fade-up-3 flex flex-wrap gap-4 justify-center mb-16">
            <Link href="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-base rounded-2xl transition-all hover:-translate-y-1 glow-btn"
            >
              Mulai Belajar Gratis
              <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
            <Link href="/login"
              className="px-8 py-4 border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.07] text-slate-200 font-semibold text-base rounded-2xl transition-all hover:-translate-y-1"
            >
              Sudah punya akun
            </Link>
          </div>

          {/* Stats */}
          <div className="animate-fade-up-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(s => (
              <div key={s.l} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-center backdrop-blur-sm hover:border-white/[0.12] transition-colors">
                <p className="text-2xl font-extrabold text-gradient leading-tight">{s.v}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* ── Tech Marquee ─────────────────────────── */}
      <div className="border-y border-white/[0.05] bg-[#0a0c12] py-4 overflow-hidden">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {[...TECH, ...TECH].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-slate-600 text-sm font-medium">
              <svg className="h-3 w-3 text-indigo-500/60" fill="currentColor" viewBox="0 0 6 6">
                <circle cx="3" cy="3" r="3"/>
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ─────────────────────────────── */}
      <section id="fitur" className="py-24 px-6 bg-[#080a0f]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 tag tag-indigo mb-4">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
              </svg>
              Fitur Lengkap
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Dirancang spesifik untuk kurikulum TJKT, bukan platform belajar generik.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className={`relative rounded-2xl border border-white/[0.07] bg-gradient-to-b ${f.color} p-6 card-hover ${f.border} cursor-default`}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl mb-4 ${f.iconColor}`}>
                  {f.icon}
                </div>
                <span className="tag tag-indigo mb-3 text-[0.65rem]">{f.tag}</span>
                <h3 className="font-bold text-slate-100 text-base mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section id="cara-kerja" className="py-24 px-6 bg-[#0a0c12]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 tag tag-cyan mb-4">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
            </svg>
            Cara Kerja
          </div>
          <h2 className="text-4xl font-extrabold mb-12">Mulai dalam 3 Langkah</h2>

          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map(s => (
              <div key={s.n} className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-left hover:border-white/[0.12] transition-colors">
                <span className={`inline-flex items-center justify-center h-10 w-10 rounded-xl text-sm font-black border ${s.color} mb-4`}>
                  {s.n}
                </span>
                <h3 className="font-bold text-slate-100 mb-2">{s.t}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section id="kontak" className="py-24 px-6 bg-[#080a0f]">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/40 via-[#0d0f14] to-cyan-900/20 p-12 text-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-cyan-600/5" />
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Siap Jadi Ahli Jaringan?
              </h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                Gabung dengan ratusan siswa SMK TJKT yang sudah belajar lebih efektif bersama NetLearnX.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-base rounded-2xl transition-all hover:-translate-y-0.5 shadow-2xl shadow-indigo-500/30"
              >
                Daftar Sekarang — Gratis
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
              <p className="text-xs text-slate-600 mt-4">Tanpa kartu kredit · Akses langsung</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="border-t border-white/[0.05] py-10 px-6 bg-[#080a0f]">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-black text-white">N</div>
            <span className="font-extrabold text-gradient">NetLearnX</span>
          </div>
          <p className="text-sm text-slate-600">© 2026 NetLearnX · Platform LMS SMK TJKT</p>
          <div className="flex gap-5 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-400 transition-colors">Privasi</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
