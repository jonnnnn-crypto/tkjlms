interface ProgressBarProps {
  value: number     // 0–100
  label?: string
  showPercent?: boolean
  size?: 'sm' | 'md'
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-slate-400 font-medium">{label}</span>}
          {showPercent && (
            <span className="text-xs font-bold text-indigo-400">{clamped}%</span>
          )}
        </div>
      )}
      <div className={`w-full ${h} rounded-full bg-white/[0.08] overflow-hidden`}>
        <div
          className={`${h} rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-700`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
