"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Trophy, Target, FileWarning, Clock, Zap, Target as TargetIcon, Search } from "lucide-react";
import Link from "next/link";

const SCENARIOS = [
  {
    id: "1",
    title: "Misteri Jaringan Terputus",
    description: "Klien di Ruang A tidak bisa mengakses internet. Router gateway tampaknya bermasalah. Temukan penyebabnya!",
    difficulty: "Beginner",
    xpReward: 150,
    timeLimit: 15,
    completions: 432,
    status: "available", // available, locked, completed
    icon: Search,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500"
  },
  {
    id: "2",
    title: "Serangan DNS Spoofing",
    description: "Website sekolah dialihkan ke halaman asing. Analisis koneksi dan temukan server DNS palsu di jaringan lokal.",
    difficulty: "Advanced",
    xpReward: 500,
    timeLimit: 45,
    completions: 89,
    status: "locked",
    icon: ShieldAlert,
    color: "from-red-500/20 to-rose-500/20",
    iconColor: "text-red-500"
  },
  {
    id: "3",
    title: "Konflik IP Address",
    description: "Dua server kritis mengalami intermittent connection. Identifikasi perangkat yang menggunakan IP duplikat via arp.",
    difficulty: "Intermediate",
    xpReward: 300,
    timeLimit: 25,
    completions: 215,
    status: "completed",
    icon: FileWarning,
    color: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-500"
  },
];

export default function ChallengesList() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight border-l-4 border-red-500 pl-4">Troubleshooting Arena</h1>
          <p className="text-muted-foreground mt-2 pl-4">Skenario dunia nyata. Selesaikan masalah jaringan, kumpulkan XP, dan raih badge kebanggaan.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border shadow-sm rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Level Anda</p>
              <p className="text-sm font-bold">Network Technician (Lv.12)</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SCENARIOS.map((scenario) => (
          <Card key={scenario.id} className={`group overflow-hidden flex flex-col h-full transition-all ${scenario.status === "locked" ? "opacity-75 grayscale-[0.5]" : "hover:border-primary/50 hover:shadow-md cursor-pointer"}`}>
            <div className={`h-32 bg-gradient-to-br ${scenario.color} relative p-6 flex flex-col items-center justify-center`}>
              <div className="absolute top-3 right-3 flex gap-2">
                {scenario.status === "completed" && <Badge className="bg-emerald-500 shadow-sm text-[10px] uppercase font-bold tracking-wider">Selesai</Badge>}
                <Badge variant={scenario.difficulty === "Beginner" ? "secondary" : scenario.difficulty === "Advanced" ? "destructive" : "default"} className="opacity-90 shadow-sm text-[10px] uppercase font-bold tracking-wider">
                  {scenario.difficulty}
                </Badge>
              </div>
              <scenario.icon className={`w-16 h-16 ${scenario.iconColor} drop-shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 ease-out`} />
            </div>
            
            <CardHeader className="pb-3 flex-1">
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{scenario.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-xs mt-2">{scenario.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="grid grid-cols-3 gap-2 border-t pt-4">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">XP Reward</p>
                  <p className="text-sm font-bold text-yellow-500 flex items-center justify-center">+{scenario.xpReward} <Zap className="w-3 h-3 ml-1" /></p>
                </div>
                <div className="text-center border-l">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Waktu</p>
                  <p className="text-sm font-medium flex items-center justify-center">{scenario.timeLimit} m <Clock className="w-3 h-3 ml-1 text-muted-foreground" /></p>
                </div>
                <div className="text-center border-l">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Penyelesaian</p>
                  <p className="text-sm font-medium flex items-center justify-center">{scenario.completions} <Trophy className="w-3 h-3 ml-1 text-muted-foreground" /></p>
                </div>
              </div>
            </CardContent>
            
            <div className="px-6 pb-6 pt-0 mt-auto">
              {scenario.status === "locked" ? (
                 <Button variant="secondary" className="w-full" disabled>Terkunci (Butuh Lv.15)</Button>
              ) : scenario.status === "completed" ? (
                 <Button variant="outline" className="w-full text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/10" asChild>
                   <Link href={`/challenges/${scenario.id}`}>Mainkan Lagi (+{Math.floor(scenario.xpReward/4)} XP)</Link>
                 </Button>
              ) : (
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white" asChild>
                  <Link href={`/challenges/${scenario.id}`}>Mulai Skenario</Link>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
