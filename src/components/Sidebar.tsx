import Link from 'next/link'
import type { Role } from '@/lib/types'

interface SidebarProps {
  role: Role
  currentPath: string
}

const STUDENT_ITEMS = [
  { label: 'Dashboard',   href: '/dashboard',       icon: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
    </svg>
  )},
  { label: 'Kelas Saya',  href: '/classes',         icon: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
    </svg>
  )},
  { label: 'Nilai Saya',  href: '/dashboard/grades', icon: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
    </svg>
  )},
]

const TEACHER_ITEMS = [
  { label: 'Dashboard',   href: '/dashboard',         icon: STUDENT_ITEMS[0].icon },
  { label: 'Kelas Saya',  href: '/classes',            icon: STUDENT_ITEMS[1].icon },
  { label: 'Laporan',     href: '/dashboard/reports',  icon: STUDENT_ITEMS[2].icon },
]

const ADMIN_ITEMS = [
  { label: 'Dashboard',   href: '/dashboard',     icon: STUDENT_ITEMS[0].icon },
  { label: 'Kelas',       href: '/classes',        icon: STUDENT_ITEMS[1].icon },
  { label: 'Pengguna',    href: '/admin/users',    icon: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
    </svg>
  )},
  { label: 'Laporan',     href: '/admin/reports',  icon: STUDENT_ITEMS[2].icon },
]

const NAV_BY_ROLE = { student: STUDENT_ITEMS, teacher: TEACHER_ITEMS, admin: ADMIN_ITEMS }

export default function Sidebar({ role, currentPath }: SidebarProps) {
  const items = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.student

  return (
    <aside className="hidden md:flex flex-col gap-0.5 w-56 shrink-0 border-r border-white/[0.05] bg-[#080a0f] px-2.5 py-4 min-h-[calc(100vh-56px)]">

      {/* Section label */}
      <p className="px-3 text-[0.65rem] font-black uppercase tracking-widest text-slate-600 mb-2">
        Menu Utama
      </p>

      {items.map(item => {
        const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
              isActive
                ? 'bg-indigo-500/15 text-indigo-300 shadow-sm'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
            }`}
          >
            <span className={isActive ? 'text-indigo-400' : 'text-slate-600'}>
              {item.icon}
            </span>
            {item.label}
            {isActive && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
            )}
          </Link>
        )
      })}

      {/* Bottom section */}
      <div className="mt-auto pt-4 border-t border-white/[0.05]">
        <a
          href="https://supabase.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-white/[0.04] hover:text-slate-400 transition-all"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
          </svg>
          Bantuan
        </a>
      </div>
    </aside>
  )
}
