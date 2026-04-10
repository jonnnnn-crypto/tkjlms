'use client'

import { useActionState } from 'react'
import { joinClass }      from '@/app/actions/classes'

export function JoinClassForm() {
  const [state, action, pending] = useActionState(joinClass, undefined)
  return (
    <form action={action} className="flex flex-col items-end gap-1.5">
      {state?.error && <p className="text-xs text-red-400">{state.error}</p>}
      <div className="flex gap-2">
        <input
          name="code"
          placeholder="Kode kelas (mis. ABC123)"
          maxLength={10}
          className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none w-44"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          {pending ? '...' : 'Bergabung'}
        </button>
      </div>
    </form>
  )
}
