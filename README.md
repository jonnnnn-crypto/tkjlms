# NetLearnX LMS

> Platform LMS modern untuk SMK Jurusan TJKT (Teknik Jaringan Komputer & Telekomunikasi)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-0EA5E9?style=for-the-badge&logo=tailwindcss)

---

## 🚀 Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Role-Based Access** | Admin, Guru, Siswa dengan hak akses berbeda |
| **Kelas Digital** | Guru buat kelas + kode unik, siswa join instan |
| **Materi** | Teks (markdown), video, PDF, link, slide |
| **Quiz Otomatis** | Pilihan ganda + timer + auto-grade + KKM |
| **Lab Simulasi** | Konfigurasi IP, ping test, validasi subnet |
| **Dashboard** | Statistik personal per role |
| **RLS Supabase** | Keamanan data di level database |

---

## ⚙️ Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Styling**: Tailwind CSS v4
- **Auth**: Supabase Auth via `@supabase/ssr`
- **Route Protection**: `proxy.ts` (Next.js 16)

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── actions/          # Server Actions
│   ├── classes/          # Kelas + detail [id]
│   ├── dashboard/        # Dashboard role-aware
│   ├── lab/[id]/         # Lab simulasi
│   ├── login/ register/  # Auth pages
│   ├── quiz/[id]/        # Quiz + timer
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/           # Navbar, Sidebar, Card, dll
└── lib/                  # Auth, types, Supabase clients
proxy.ts                  # Route protection
supabase/schema.sql       # Full SQL + RLS + triggers
```

---

## 🔧 Setup

### 1. Install

```bash
npm install
```

### 2. Setup Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. **SQL Editor** → paste `supabase/schema.sql` → Run

### 3. Isi `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4. Buat Admin

```sql
UPDATE profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@sekolah.sch.id');
```

### 5. Jalankan

```bash
npm run dev
```

---

## 👥 Roles

| Role | Kemampuan |
|---|---|
| **admin** | Lihat semua data, ubah role |
| **teacher** | Buat kelas, materi, quiz, lab |
| **student** | Join kelas, kerjakan quiz & lab |

---

## 🔐 Keamanan

- RLS aktif semua tabel Supabase
- Server Actions untuk semua mutasi
- `proxy.ts` route protection
- Session refresh via `@supabase/ssr`

---

MIT · NetLearnX © 2026
