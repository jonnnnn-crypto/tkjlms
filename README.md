# TJKT Vocational LMS
Learning Management System modern yang dirancang khusus untuk siswa kejuruan TJKT (Teknik Jaringan Komputer dan Telekomunikasi), menampilkan pembelajaran interaktif, simulator terminal, dan gamifikasi.

## 🚀 Panduan Produksi: Konfigurasi Supabase Auth

Karena aplikasi ini siap untuk tahap produksi, fitur otentikasi (Google OAuth & Email) harus dikonfigurasi secara presisi di Supabase Dashboard. Ikuti langkah-langkah wajib di bawah ini.

---

### 1. Pengaturan Google OAuth (SSO)
Google Login dikhususkan untuk **Siswa**.

> [!CAUTION]
> **PENTING UNTUK MENGHINDARI `Error 400: redirect_uri_mismatch`!**
> URL Redirect yang Anda masukkan di Google Cloud Console **HARUS SAMA PERSIS** dengan URL Supabase Anda. Anda **TIDAK MUNGKIN** menggunakan `localhost` ataupun domain web Vercel Anda di dalam pengaturan Google Console. Google Console HANYA berkomunikasi ke Supabase.

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru (misal: "TJKT LMS Auth").
3. Buka **APIs & Services > Credentials** > **Create Credentials > OAuth client ID**.
4. Pilih **Web application**.
5. Di bagian **Authorized redirect URIs**, masukkan Supabase Callback URL spesifik project Anda:
   - **MASUKKAN COPY-PASTE (INI SAJA, TIDAK ADA YANG LAIN):** 
   - `https://fbfdasaegmxnsyhrodqu.supabase.co/auth/v1/callback`
6. Simpan, lalu salin **Client ID** dan **Client Secret**.
7. Buka [Supabase Dashboard](https://supabase.com/dashboard).
8. Masuk ke **Authentication > Providers > Google**.
9. Aktifkan (Enable) toggle, masukkan **Client ID** dan **Client Secret** tadi. Set "Skip nonce check" ke `OFF`.
10. Simpan.

---

### 2. URL Configuration (Redirect URLs)
Supabase butuh tahu ke mana harus mengarahkan user setelah berhasil login atau klik link email.

1. Di Supabase Dashboard, buka **Authentication > URL Configuration**.
2. **Site URL**: Masukkan URL utama website produksi Anda (Contoh: `https://lms.smkn1liwa.sch.id`).
3. **Redirect URLs**: Tambahkan path callback spesifik untuk Next.js App Router agar OAuth bisa me-refresh sesi.
   - Tambahkan: `https://lms.smkn1liwa.sch.id/api/auth/callback`
   - Tambahkan juga URL localhost untuk testing: `http://localhost:3000/api/auth/callback`

---

### 3. Template Email (Email Templates)
Agar email verifikasi dan reset password terlihat profesional dan menggunakan URL yang benar sesuai Next.js.

Buka **Authentication > Email Templates** di Supabase.

#### A. Confirm Signup (Verifikasi Email)
Jika Anda mengaktifkan *Confirm email*, gunakan template ini. Supabase akan mengirimkan link yang harus diganti parameternya.
Ubah isi body email HTML menjadi:
```html
<h2>Selamat datang di TJKT LMS!</h2>
<p>Klik tombol di bawah ini untuk memverifikasi akun Anda:</p>
<p>
  <a href="{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&next=/dashboard" style="display:inline-block;padding:10px 20px;background-color:#2563eb;color:white;text-decoration:none;border-radius:5px;">Verifikasi Email Anda</a>
</p>
```

#### B. Reset Password
Ubah isi body email HTML menjadi:
```html
<h2>TJKT LMS - Reset Password</h2>
<p>Klik tombol di bawah ini untuk mengatur ulang password Anda:</p>
<p>
  <a href="{{ .SiteURL }}/api/auth/callback?code={{ .TokenHash }}&next=/reset-password" style="display:inline-block;padding:10px 20px;background-color:#16a34a;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
</p>
<p><small>Abaikan email ini jika Anda tidak merasa meminta reset password.</small></p>
```

---

### 4. Admin & Guru Login (Email & Password)
**Catatan Penting:** 
- Admin dan Guru **TIDAK** menggunakan tombol "Login dengan Google". 
- Google OAuth terikat dengan trigger SQL (`handle_new_user`) yang otomatis menjadikan pendaftar sebagai **Siswa** (`student`).
- Akun Admin & Guru hanya dapat dibuat dari **Admin Dashboard > User Management** (melalui endpoint API terenkripsi menggunakan *Service Role Key*).
- Admin & Guru harus login manual menggunakan form **Email / Password**.

---

### 5. Deployment Info
Pastikan `.env.local` Anda di server Vercel (production) telah berisi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
```
JANGAN masukkan `SUPABASE_SERVICE_ROLE_KEY` ke `NEXT_PUBLIC` karena itu memberikan bypass izin penuh pada database.

---
*Development by Ghifari Azhar | Production by LTEC SMK NEGERI 1 LIWA*
