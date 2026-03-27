import { createClient } from "@/lib/supabase/server";
import { Trophy, Medal, Star, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Top 20 students by XP
  const { data: leaders } = await supabase
    .from("profiles")
    .select("id, full_name, xp, level, role, classes(name)")
    .eq("role", "student")
    .order("xp", { ascending: false })
    .limit(20);

  // Fetch badge counts per user
  const { data: badgeCounts } = await supabase
    .from("student_badges")
    .select("student_id");

  const badgeMap: Record<string, number> = {};
  badgeCounts?.forEach((b: { student_id: string }) => {
    badgeMap[b.student_id] = (badgeMap[b.student_id] ?? 0) + 1;
  });

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("xp, level")
    .eq("id", user?.id ?? "")
    .single();

  const myRank = leaders?.findIndex((l: { id: string }) => l.id === user?.id) ?? -1;

  const renderMedal = (index: number) => {
    if (index === 0) return <Medal className="w-5 h-5 fill-yellow-500 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 fill-zinc-400 text-zinc-400" />;
    if (index === 2) return <Medal className="w-5 h-5 fill-orange-500 text-orange-500" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{index + 1}</span>;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center md:text-left mb-6">
        <h1 className="text-3xl font-bold tracking-tight inline-flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-yellow-500" /> Leaderboard Global
        </h1>
        <p className="text-muted-foreground mt-1">Peringkat siswa TJKT berdasarkan Experience Points (XP).</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="bg-muted/10 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Hall of Fame
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {(leaders?.length ?? 0) === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-12">Belum ada data siswa.</p>
                )}
                {leaders?.map((u: { id: string; full_name: string; xp: number; level: number; role: string; classes?: {name: string} | null }, i: number) => (
                  <div key={u.id}
                    className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/40 ${u.id === user?.id ? "bg-primary/5 border-l-2 border-primary" : ""} ${i < 3 ? "bg-primary/5" : ""}`}>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-8 flex justify-center">{renderMedal(i)}</div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-sm">
                          {u.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {u.full_name}
                            {i === 0 && <span className="ml-2 text-xs text-yellow-500 font-bold tracking-wider">MVP</span>}
                            {u.id === user?.id && <span className="ml-2 text-xs text-primary font-bold">(Anda)</span>}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Badge variant="outline" className="text-[10px] px-1 py-0">{(u as any).classes?.name ?? "—"}</Badge>
                            <span>Lv.{u.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {badgeMap[u.id] ? (
                        <div className="hidden sm:flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md text-xs font-semibold">
                          <Shield className="w-3.5 h-3.5 text-primary" /> {badgeMap[u.id]}
                        </div>
                      ) : null}
                      <p className="font-bold text-yellow-500 text-lg flex items-center">
                        {u.xp.toLocaleString("id-ID")} <Zap className="w-4 h-4 ml-1 fill-yellow-500" />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Stats */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> Statistik Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted px-4 py-3 rounded-xl text-center">
                  <p className="text-2xl font-black">{myRank >= 0 ? `#${myRank + 1}` : "—"}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Peringkat</p>
                </div>
                <div className="bg-muted px-4 py-3 rounded-xl text-center">
                  <p className="text-2xl font-black">{myProfile?.level ?? 1}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Level</p>
                </div>
                <div className="bg-muted px-4 py-3 rounded-xl text-center col-span-2">
                  <p className="text-2xl font-black text-yellow-500">{(myProfile?.xp ?? 0).toLocaleString("id-ID")}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
