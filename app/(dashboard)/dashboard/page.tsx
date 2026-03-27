import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen, Trophy, Clock, PlayCircle, Star, Target, Zap, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

function XPBar({ xp, level }: { xp: number; level: number }) {
  const xpForLevel = level * 500;
  const progress = Math.min(100, Math.round((xp % xpForLevel) / xpForLevel * 100));
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">Level {level}</span>
        <span className="font-semibold text-primary">{xp % xpForLevel} / {xpForLevel} XP</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, classes(name)")
    .eq("id", user.id)
    .single();

  // Fetch enrolled courses (via class_id)
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, description, subjects(name, category)")
    .eq("class_id", profile?.class_id ?? "")
    .limit(4);

  // Fetch pending assignments
  const { data: pendingAssignments } = await supabase
    .from("assignments")
    .select("id, title, deadline, courses!inner(class_id)")
    .eq("courses.class_id", profile?.class_id ?? "")
    .gt("deadline", new Date().toISOString())
    .order("deadline", { ascending: true })
    .limit(3);

  const firstName = profile?.full_name?.split(" ")[0] ?? "Siswa";
  const className = (profile as any)?.classes?.name ?? "Belum ada kelas";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/90 to-primary p-6 md:p-8 text-primary-foreground shadow-lg flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2">
          <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider">Selamat datang kembali 👋</p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{profile?.full_name ?? "Siswa"}</h1>
          <p className="text-primary-foreground/80 text-sm">{className} &middot; {pendingAssignments?.length ?? 0} tugas menunggu</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Link href="/courses" className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors text-sm font-semibold px-3 py-1.5 rounded-lg">
              <PlayCircle className="w-4 h-4" /> Mulai Belajar
            </Link>
            <Link href="/assignments" className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 transition-colors text-sm px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4" /> Lihat Tugas
            </Link>
          </div>
        </div>
        <div className="bg-white/10 rounded-xl p-5 min-w-[200px] space-y-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
            <span className="font-bold text-lg">Level {profile?.level ?? 1}</span>
          </div>
          <XPBar xp={profile?.xp ?? 0} level={profile?.level ?? 1} />
          <div className="flex items-center gap-2 text-xs text-primary-foreground/70">
            <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            {profile?.xp ?? 0} XP total
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Kursus Aktif</h2>
            <Link href="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">Lihat Semua <ChevronRight className="w-4 h-4" /></Link>
          </div>

          {(courses?.length ?? 0) === 0 ? (
            <div className="rounded-xl border-2 border-dashed p-8 text-center text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada kursus untuk kelas Anda.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {courses?.map((c: { id: string; title: string; description: string; subjects?: { name: string; code?: string; category?: string }[] | null }) => (
                <Link key={c.id} href={`/courses/${c.id}`}
                  className="group block rounded-xl border bg-card p-4 hover:border-primary/50 hover:shadow-md transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Activity className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{(c as any).subjects?.code}</p>
                    <h3 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><Target className="w-5 h-5 text-orange-500" /> Tugas Mendatang</h2>
          {(pendingAssignments?.length ?? 0) === 0 ? (
            <div className="rounded-xl border-2 border-dashed p-6 text-center text-muted-foreground text-sm">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Tidak ada tugas tertunda. 🎉
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAssignments?.map((a: { id: string; title: string; deadline?: string | null }) => {
                const dl = a.deadline ? new Date(a.deadline) : null;
                const isToday = dl && dl.toDateString() === new Date().toDateString();
                return (
                  <Link key={a.id} href={`/assignments/${a.id}`}
                    className="block rounded-xl border bg-card p-4 hover:border-orange-500/40 hover:shadow-sm transition-all">
                    <p className="font-semibold text-sm">{a.title}</p>
                    {dl && (
                      <p className={`text-xs mt-1 flex items-center gap-1 ${isToday ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                        <Clock className="w-3 h-3" />
                        {isToday ? "Hari ini!" : dl.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
                      </p>
                    )}
                  </Link>
                );
              })}
              <Link href="/assignments" className="block text-center text-sm text-primary hover:underline mt-2">
                Lihat semua tugas →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
