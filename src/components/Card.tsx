import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`
        relative rounded-xl border border-white/[0.06] bg-[#0d0f1a] p-5
        ${hover ? 'card-hover' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
}

export function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0d0f1a] p-5">
      {/* Bg glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-widest text-slate-600 mb-2">{label}</p>
          <p className="text-3xl font-extrabold text-gradient leading-none">{value}</p>
          {sub && <p className="text-xs text-slate-600 mt-1.5">{sub}</p>}
        </div>
        <div className="text-indigo-400 opacity-80 h-7 w-7">
          {icon}
        </div>
      </div>
    </div>
  )
}
