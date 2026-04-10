import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import type { Profile } from '@/lib/types'

interface NavbarProps {
  profile: Profile
}

const ROLE_CONFIG: Record<string, { label: string; class: string; icon: string }> = {
  admin:   { label: 'Admin',   class: 'tag-red',    icon: '⚡' },
  teacher: { label: 'Guru',    class: 'tag-cyan',   icon: '👨‍🏫' },
  student: { label: 'Siswa',   class: 'tag-indigo', icon: '🎓' },
}

export default function Navbar({ profile }: NavbarProps) {
  const cfg = ROLE_CONFIG[profile.role] ?? ROLE_CONFIG.student
  const initials = (profile.name ?? 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-white/[0.06] bg-[#080a0f]/90 backdrop-blur-2xl flex items-center">
      <div className="flex w-full items-center justify-between px-5 gap-4">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-black text-white shadow shadow-indigo-500/30">
            N
          </div>
          <span className="hidden sm:block font-extrabold text-[0.95rem] text-gradient">NetLearnX</span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Role badge */}
          <span className={`hidden sm:inline-flex tag ${cfg.class}`}>
            {cfg.icon} {cfg.label}
          </span>

          {/* Notification bell (UI only) */}
          <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.06] hover:text-slate-300 transition-colors">
            <svg className="h-4.5 w-4.5 h-[1.125rem] w-[1.125rem]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>

          {/* Avatar + name + logout */}
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] pl-2.5 pr-3 py-1.5 hover:bg-white/[0.06] transition-colors">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-[0.6rem] font-black text-white flex-shrink-0">
              {initials}
            </div>
            <span className="hidden md:block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
              {profile.name ?? profile.role}
            </span>
          </div>

          {/* Logout */}
          <form action={logout}>
            <button
              type="submit"
              title="Keluar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
