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

      <div className="text-center text-sm">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">Masuk di sini</Link>
      </div>
    </div>
  );
}
