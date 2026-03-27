"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Star, Shield, Zap, TrendingUp, Hexagon } from "lucide-react";

// Mock Leaderboard Data
const LEADERBOARD_DATA = [
  { id: "1", rank: 1, name: "Budi Santoso", class: "XI TJKT 1", xp: 12500, level: 16, badges: 12, trend: "up" },
  { id: "2", name: "Siti Nurhaliza", class: "XI TJKT 2", xp: 11200, level: 14, badges: 10, trend: "same" },
  { id: "3", name: "Anton Wijaya", class: "X TJKT 1", xp: 10850, level: 14, badges: 9, trend: "up" },
  { id: "4", rank: 4, name: "Putri Larasati", class: "XI TJKT 1", xp: 9500, level: 12, badges: 8, trend: "down" },
  { id: "5", rank: 5, name: "Ahmad Rizky", class: "X TJKT 2", xp: 8200, level: 11, badges: 6, trend: "same" },
  { id: "6", rank: 6, name: "Diana Permata", class: "XI TJKT 2", xp: 7900, level: 10, badges: 5, trend: "up" },
];

const RECENT_BADGES = [
  { id: "b1", name: "First Blood", desc: "Selesaikan 1 misi", icon: "🏆", tier: "common", color: "text-gray-400" },
  { id: "b2", name: "Subnet Master", desc: "Lulus kuis Subnetting dengan nilai >90", icon: "🧮", tier: "rare", color: "text-blue-500" },
  { id: "b3", name: "Terminal Hacker", desc: "Ketik 100 perintah aktif di Linux", icon: "💻", tier: "epic", color: "text-purple-500" },
  { id: "b4", name: "Network Savior", desc: "Perbaiki masalah router klien B", icon: "🛡️", tier: "legendary", color: "text-yellow-500" },
];

export default function LeaderboardPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const renderRankMedal = (index: number) => {
    switch (index) {
      case 0: return <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold shadow-glow"><Medal className="w-5 h-5 fill-yellow-500" /></div>;
      case 1: return <div className="w-8 h-8 rounded-full bg-zinc-300/20 text-zinc-400 flex items-center justify-center font-bold"><Medal className="w-5 h-5 fill-zinc-400" /></div>;
      case 2: return <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold"><Medal className="w-5 h-5 fill-orange-500" /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">{index + 1}</div>;
    }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-bold tracking-tight inline-flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-yellow-500" /> Leaderboard Global
        </h1>
        <p className="text-muted-foreground mt-2">Peringkat 100 teratas siswa TJKT berdasarkan Experience Points (XP).</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Leaderboard Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="bg-muted/10 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Hall of Fame
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {LEADERBOARD_DATA.map((user, index) => (
                  <div key={user.id} className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/40 ${index < 3 ? 'bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-10 flex justify-center">
                        {renderRankMedal(index)}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold">{user.name} {index === 0 && <span className="ml-2 text-xs text-yellow-500 font-bold tracking-wider">MVP</span>}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Badge variant="outline" className="text-[10px] px-1 py-0">{user.class}</Badge>
                            <span>Level {user.level}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md text-xs font-semibold">
                        <Shield className="w-3.5 h-3.5 text-primary" /> {user.badges}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-500 text-lg flex items-center justify-end">
                          {user.xp.toLocaleString()} <Zap className="w-4 h-4 ml-1 fill-yellow-500" />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar Badges Spotlight */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
           <Card className="shadow-sm border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Shield className="w-32 h-32" />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center">
                <Medal className="w-5 h-5 mr-2 text-primary" /> Badge Pameran
              </CardTitle>
              <CardDescription>Pencapaian terbaru yang berhasil Anda dapatkan.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              {RECENT_BADGES.map((badge) => (
                <div key={badge.id} className="flex gap-4 items-center bg-card p-3 rounded-xl border hover:border-primary/50 transition-colors group">
                  <div className="text-3xl bg-muted/50 p-3 rounded-xl group-hover:scale-110 transition-transform">{badge.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm leading-none">{badge.name}</p>
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold ${badge.color}`}>{badge.tier}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-2" variant="outline">Lihat Semua Koleksi Badge</Button>
            </CardContent>
           </Card>

           {/* User Current Standing */}
           <Card className="shadow-sm">
             <CardContent className="p-6">
               <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Statistik Pribadi</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-muted px-4 py-3 rounded-xl text-center">
                   <p className="text-2xl font-black text-foreground">1</p>
                   <p className="text-[10px] uppercase text-muted-foreground font-semibold">Peringkat Kelas</p>
                 </div>
                 <div className="bg-muted px-4 py-3 rounded-xl text-center">
                   <p className="text-2xl font-black text-foreground">7</p>
                   <p className="text-[10px] uppercase text-muted-foreground font-semibold">Peringkat Sekolah</p>
                 </div>
               </div>
             </CardContent>
           </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
