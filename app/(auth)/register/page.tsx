import { createClient } from "@/lib/supabase/server";
import RegisterForm from "./register-form";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const supabase = await createClient();

  // Check if registration is open
  const { data: setting } = await supabase
    .from("system_settings")
    .select("value")
    .eq("key", "registration_open")
    .single();

  const isOpen = setting?.value !== "false";

  // Fetch available classes for the active school year
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, grade_level, school_years!inner(is_active)")
    .eq("school_years.is_active", true)
    .order("grade_level")
    .order("name");

  if (!isOpen) {
    return (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">🔒</span>
        </div>
        <h2 className="text-xl font-bold">Registrasi Ditutup</h2>
        <p className="text-sm text-muted-foreground">
          Saat ini pendaftaran siswa baru belum dibuka. Silakan hubungi administrator sekolah untuk informasi lebih lanjut.
        </p>
      </div>
    );
  }

  return <RegisterForm classes={classes ?? []} />;
}
