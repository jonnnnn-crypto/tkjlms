'use client'

import { useState, useEffect } from 'react'
import { createClient }        from '@/lib/supabase/client'
import Link                    from 'next/link'

interface Props { params: Promise<{ id: string }> }

type Step = 'intro' | 'config' | 'result'

interface Config {
  ip: string
  gateway: string
  subnet: string
  dns: string
}

function isValidIPv4(ip: string): boolean {
  const parts = ip.split('.')
  if (parts.length !== 4) return false
  return parts.every(p => {
    const n = parseInt(p)
    return !isNaN(n) && n >= 0 && n <= 255 && p === String(n)
  })
}

function getSubnetMask(prefix: number): string {
  const mask = []
  for (let i = 0; i < 4; i++) {
    const bits = Math.min(8, Math.max(0, prefix - i * 8))
    mask.push(256 - Math.pow(2, 8 - bits))
  }
  return mask.join('.')
}

function ipToNum(ip: string): number {
  return ip.split('.').reduce((acc, oct) => (acc * 256) + parseInt(oct), 0)
}

function sameSubnet(ip: string, gateway: string, subnet: string): boolean {
  const ipNum  = ipToNum(ip)  & ipToNum(subnet)
  const gwNum  = ipToNum(gateway) & ipToNum(subnet)
  return ipNum === gwNum
}

function validateNetwork(cfg: Config, answer: { ip: string; gateway: string; subnet: string; dns?: string }) {
  const errors: string[] = []
  const results: { label: string; ok: boolean; detail: string }[] = []

  // Check IP validity
  const ipOk = isValidIPv4(cfg.ip)
  results.push({ label: 'Format IP Address', ok: ipOk, detail: ipOk ? cfg.ip : 'IP tidak valid' })

  // Check Gateway validity
  const gwOk = isValidIPv4(cfg.gateway)
  results.push({ label: 'Format Gateway', ok: gwOk, detail: gwOk ? cfg.gateway : 'Gateway tidak valid' })

  // Check Subnet validity
  const snOk = isValidIPv4(cfg.subnet)
  results.push({ label: 'Format Subnet Mask', ok: snOk, detail: snOk ? cfg.subnet : 'Subnet tidak valid' })

  // Check same subnet
  if (ipOk && gwOk && snOk) {
    const sameNet = sameSubnet(cfg.ip, cfg.gateway, cfg.subnet)
    results.push({
      label: 'IP & Gateway satu subnet',
      ok: sameNet,
      detail: sameNet ? 'Dalam subnet yang sama' : 'IP dan Gateway di subnet berbeda!'
    })
  }

  // Compare with answer
  const ipMatch = cfg.ip === answer.ip
  results.push({ label: 'IP Address benar', ok: ipMatch, detail: ipMatch ? '✓ Sesuai konfigurasi' : `Harusnya: ${answer.ip}` })

  const gwMatch = cfg.gateway === answer.gateway
  results.push({ label: 'Gateway benar', ok: gwMatch, detail: gwMatch ? '✓ Sesuai konfigurasi' : `Harusnya: ${answer.gateway}` })

  const snMatch = cfg.subnet === answer.subnet
  results.push({ label: 'Subnet Mask benar', ok: snMatch, detail: snMatch ? '✓ Sesuai konfigurasi' : `Harusnya: ${answer.subnet}` })

  const allOk = results.every(r => r.ok)
  return { results, allOk }
}

export default function LabPage({ params }: Props) {
  const [labId, setLabId]   = useState('')
  const [lab,   setLab]     = useState<any>(null)
  const [step,  setStep]    = useState<Step>('intro')
  const [cfg,   setCfg]     = useState<Config>({ ip: '', gateway: '', subnet: '', dns: '' })
  const [pinging, setPinging] = useState(false)
  const [pingResult, setPingResult] = useState<{ results: any[]; allOk: boolean } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { params.then(p => setLabId(p.id)) }, [params])

  useEffect(() => {
    if (!labId) return
    const supabase = createClient()
    supabase.from('labs').select('*').eq('id', labId).single()
      .then(({ data }) => { setLab(data); setLoading(false) })
  }, [labId])

  const handlePing = async () => {
    if (!lab?.answer) return
    setPinging(true)
    await new Promise(r => setTimeout(r, 1200)) // simulate ping delay
    const res = validateNetwork(cfg, lab.answer)
    setPingResult(res)
    setPinging(false)

    // Save to Supabase
    if (!submitted) {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('lab_submissions').insert({
          user_id: user.id,
          lab_id: labId,
          answers: cfg,
          is_correct: res.allOk,
        })
        setSubmitted(true)
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
      <div className="text-slate-400 animate-pulse">Memuat lab...</div>
    </div>
  )

  if (!lab) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14] text-red-400">
      Lab tidak ditemukan.
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d0f14]">
      {/* Header */}
      <div className="border-b border-white/[0.07] bg-[#0d0f14]/90 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧪</span>
          <div>
            <p className="font-bold text-slate-200">{lab.title}</p>
            <p className="text-xs text-cyan-400">Simulasi Jaringan — TJKT</p>
          </div>
        </div>
        <Link href="/classes" className="text-sm text-slate-500 hover:text-slate-300">← Kelas</Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Description */}
        {lab.description && (
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 mb-6">
            <p className="text-sm text-slate-300">{lab.description}</p>
          </div>
        )}

        {/* Instructions */}
        {lab.config?.instructions && (
          <div className="rounded-xl border border-white/[0.07] bg-[#13161d] p-5 mb-6">
            <h2 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
              📋 Instruksi Lab
            </h2>
            <p className="text-sm text-slate-400 whitespace-pre-line">{lab.config.instructions}</p>
          </div>
        )}

        {/* Network Topology Visual */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#13161d] p-6 mb-6">
          <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
            🖧 Topologi Jaringan
          </h2>
          <div className="flex items-center justify-center gap-4 py-4 overflow-x-auto">
            {[
              { icon: '💻', label: 'PC Kamu' },
              { icon: '——', label: '' },
              { icon: '🔀', label: 'Switch' },
              { icon: '——', label: '' },
              { icon: '📡', label: 'Router/Gateway' },
              { icon: '——', label: '' },
              { icon: '🌐', label: 'Internet' },
            ].map((n, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                <span className="text-2xl">{n.icon}</span>
                {n.label && <span className="text-xs text-slate-500">{n.label}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Config Form */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#13161d] p-6 mb-6">
          <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
            ⚙️ Konfigurasi IP
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'ip',      label: 'IP Address',  ph: 'mis. 192.168.1.10' },
              { key: 'subnet',  label: 'Subnet Mask',  ph: 'mis. 255.255.255.0' },
              { key: 'gateway', label: 'Default Gateway', ph: 'mis. 192.168.1.1' },
              { key: 'dns',     label: 'DNS Server',   ph: 'mis. 8.8.8.8' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{f.label}</label>
                <input
                  type="text"
                  value={cfg[f.key as keyof Config]}
                  onChange={e => setCfg(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.ph}
                  className="w-full rounded-lg border border-white/[0.08] bg-black/30 px-4 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Ping Button */}
          <button
            onClick={handlePing}
            disabled={pinging || !cfg.ip || !cfg.gateway || !cfg.subnet}
            className="mt-5 w-full py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            {pinging ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                Melakukan Ping Test...
              </span>
            ) : (
              '🔌 Ping Test — Cek Koneksi'
            )}
          </button>
        </div>

        {/* Results */}
        {pingResult && (
          <div className={`rounded-2xl border p-6 animate-fade-up ${pingResult.allOk ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{pingResult.allOk ? '✅' : '❌'}</span>
              <div>
                <h2 className="font-bold text-slate-200">
                  {pingResult.allOk ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}
                </h2>
                <p className="text-sm text-slate-400">
                  {pingResult.allOk
                    ? 'Semua konfigurasi jaringan benar. Ping sukses!'
                    : 'Ada kesalahan konfigurasi. Periksa kembali pengaturanmu.'}
                </p>
              </div>
            </div>

            {/* Terminal output style */}
            <div className="rounded-xl bg-black/60 border border-white/[0.08] p-4 font-mono text-xs space-y-1.5">
              <p className="text-slate-500"># Ping Test Results ─────────────────</p>
              {pingResult.results.map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={r.ok ? 'text-green-400' : 'text-red-400'}>
                    {r.ok ? '✓' : '✗'}
                  </span>
                  <span className="text-slate-400">{r.label}:</span>
                  <span className={r.ok ? 'text-green-300' : 'text-red-300'}>{r.detail}</span>
                </div>
              ))}
              {pingResult.allOk && (
                <>
                  <p className="text-slate-700">─────────────────────────────────────</p>
                  <p className="text-green-400">PING 8.8.8.8: 4 packets transmitted, 4 received, 0% loss</p>
                  <p className="text-green-400">rtt min/avg/max = 12.3/14.7/18.2 ms</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
