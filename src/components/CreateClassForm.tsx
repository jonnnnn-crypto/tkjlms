'use client'

import { useActionState } from 'react'
import { createClass }    from '@/app/actions/classes'

export function CreateClassForm() {
  const [state, action, pending] = useActionState(createClass, undefined)
  return (
    <div className="flex flex-col items-end gap-1.5">
      {state?.success && <p className="text-xs text-green-400 max-w-xs text-right">{state.success}</p>}
      {state?.error   && <p className="text-xs text-red-400">{state.error}</p>}
      <form action={action} className="flex gap-2">
        <input
          name="name"
          placeholder="Nama kelas baru..."
          className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none w-48"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          {pending ? '...' : '+ Buat Kelas'}
        </button>
      </form>
    </div>
  )
}
