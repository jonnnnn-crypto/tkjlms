import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s — NetLearnX',
    default: 'NetLearnX — LMS SMK TJKT',
  },
  description: 'Platform pembelajaran digital untuk siswa dan guru SMK jurusan Teknik Jaringan Komputer dan Telekomunikasi. Materi, quiz otomatis, dan simulasi lab jaringan.',
  keywords: ['LMS', 'SMK', 'TJKT', 'Jaringan Komputer', 'NetLearnX'],
  authors: [{ name: 'NetLearnX' }],
  metadataBase: new URL('https://netlearnx.vercel.app'),
  openGraph: {
    title: 'NetLearnX — LMS SMK TJKT',
    description: 'Platform LMS untuk siswa SMK TJKT. Belajar jaringan komputer lebih mudah.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="bg-[#080a0f] text-slate-100 antialiased min-h-screen font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  )
}
