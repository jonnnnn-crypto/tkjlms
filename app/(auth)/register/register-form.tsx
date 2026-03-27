"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, Lock, User, AlertCircle, GraduationCap } from "lucide-react";

interface ClassOption {
  id: string;
  name: string;
  grade_level: number;
}

interface Props {
  classes: ClassOption[];
}

export default function RegisterForm({ classes }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Group classes by grade
  const grouped = classes.reduce<Record<number, ClassOption[]>>((acc, c) => {
    if (!acc[c.grade_level]) acc[c.grade_level] = [];
    acc[c.grade_level].push(c);
    return acc;
  }, {});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId) { setError("Pilih kelas terlebih dahulu."); return; }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "student" },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Update profile with class_id (trigger creates the profile row first)
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "student",
        class_id: classId,
      });
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    
    // Note: Class assignment for Google signups will need to be handled 
    // after they log in, perhaps by intercepting in dashboard if class_id is null.
    // For now, they just register via Google.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-semibold">Daftar Akun Baru</h2>
        <p className="text-sm text-muted-foreground">Isi data diri dan pilih kelas Anda</p>
      </div>

      {error && (
        <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="fullName">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input id="fullName" placeholder="contoh: Budi Santoso" type="text"
              className={inputClass} value={fullName}
              onChange={(e) => setFullName(e.target.value)} required />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input id="email" placeholder="nama@siswa.sch.id" type="email"
              autoCapitalize="none" autoComplete="email" autoCorrect="off"
              className={inputClass} value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input id="password" type="password" placeholder="Minimal 8 karakter" minLength={8}
              className={inputClass} value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>

        {/* Class Select */}
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="class">Kelas</label>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <select id="class" value={classId} onChange={(e) => setClassId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none" required>
              <option value="">-- Pilih Kelas --</option>
              {[10, 11, 12].map((grade) => (
                grouped[grade]?.length ? (
                  <optgroup key={grade} label={`Kelas ${grade === 10 ? "X" : grade === 11 ? "XI" : "XII"}`}>
                    {grouped[grade].map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </optgroup>
                ) : null
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full disabled:opacity-50 disabled:pointer-events-none">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">ATAU</span>
        </div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleLogin}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full transition-colors"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Daftar dengan Google (Khusus Siswa)
      </button>

      <div className="text-center text-sm">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">Masuk di sini</Link>
      </div>
    </div>
  );
}
