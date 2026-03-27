"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TerminalSimulator } from "@/components/terminal/terminal-simulator";
import { ShieldAlert, Zap, Clock, ChevronLeft, Target, PlayCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Mock Scenario Data
const SCENARIO_DATA = {
  id: "1",
  title: "Misteri Jaringan Terputus",
  description: "Klien di Ruang A tidak bisa mengakses internet. Router gateway tampaknya bermasalah. Temukan penyebabnya!",
  difficulty: "Beginner",
  xpReward: 150,
  timeLimit: 15, // minutes
  objectives: [
    { id: "o1", text: "Periksa koneksi lokal (ping 192.168.1.1)", done: false },
    { id: "o2", text: "Periksa routing table (netstat -rn)", done: false },
    { id: "o3", text: "Temukan titik kegagalan (tracert 8.8.8.8)", done: false },
  ]
};

export default function ChallengeSimulator() {
  const params = useParams();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(SCENARIO_DATA.timeLimit * 60);
  const [objectives, setObjectives] = useState(SCENARIO_DATA.objectives);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted) return;
    
    // Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Waktu Habis! Misi Gagal.");
          router.push('/challenges');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Mock completing objectives over time automatically for demo purposes
    // IN REALITY: Terminal Simulator should expose a hook/callback indicating invoked commands
    const mockTask1 = setTimeout(() => {
      setObjectives(obj => obj.map(o => o.id === "o1" ? { ...o, done: true } : o));
    }, 8000);
    const mockTask2 = setTimeout(() => {
      setObjectives(obj => obj.map(o => o.id === "o2" ? { ...o, done: true } : o));
    }, 15000);
    const mockTask3 = setTimeout(() => {
      setObjectives(obj => obj.map(o => o.id === "o3" ? { ...o, done: true } : o));
      setIsCompleted(true);
    }, 22000);

    return () => {
      clearInterval(timer);
      clearTimeout(mockTask1);
      clearTimeout(mockTask2);
      clearTimeout(mockTask3);
    };
  }, [isCompleted, router]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  if (isCompleted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="text-center shadow-2xl border-t-8 border-t-yellow-500 bg-gradient-to-b from-card to-yellow-500/5">
            <CardHeader className="pt-8">
              <div className="w-24 h-24 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow relative">
                <Trophy className="w-12 h-12" />
                <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-card border-2 border-yellow-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-yellow-500" />
                </div>
              </div>
              <CardTitle className="text-3xl font-black mb-2 uppercase tracking-wide">Misi Berhasil!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">Anda telah menyelesaikan skenario "{SCENARIO_DATA.title}".</p>
              
              <div className="bg-card/80 backdrop-blur border p-4 rounded-xl flex items-center justify-center gap-4 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-yellow-500/10 w-full h-full skeleton-shine pointer-events-none"></div>
                <div className="text-center z-10">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">XP Diperoleh</p>
                  <p className="text-4xl font-black text-yellow-500">+{SCENARIO_DATA.xpReward}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full h-12 text-lg font-bold shadow-lg" onClick={() => router.push('/challenges')}>Kembali ke Arena</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between shrink-0 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="shrink-0">
            <Link href="/challenges">
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="destructive" className="uppercase text-[10px] tracking-wider px-1.5 py-0">{SCENARIO_DATA.difficulty}</Badge>
              <span className="text-xs font-semibold text-yellow-500 flex items-center">+{SCENARIO_DATA.xpReward} XP <Zap className="w-3 h-3 ml-0.5 fill-yellow-500" /></span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">{SCENARIO_DATA.title}</h1>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl font-mono text-xl font-bold shadow-sm border ${timeLeft < 300 ? 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse' : 'bg-card text-foreground'}`}>
          <Clock className="w-5 h-5 shrink-0" />
          {formatTime(timeLeft)}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 min-h-0 grid lg:grid-cols-4 gap-6">
        {/* Objectives Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <Card className="shadow-sm flex-1 flex flex-col border-primary/20 bg-gradient-to-b from-card to-primary/5">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-bold flex items-center uppercase tracking-wide">
                <Target className="w-4 h-4 mr-2 text-primary" />
                Misi Skenario
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {SCENARIO_DATA.description}
              </p>
              
              <div className="space-y-3 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b pb-2">Tugas Berjalan</h4>
                {objectives.map((obj, i) => (
                  <div key={obj.id} className={`flex gap-3 text-sm p-3 rounded-lg border transition-all ${obj.done ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-card border-border'}`}>
                    <div className="shrink-0 mt-0.5">
                      {obj.done ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40" />}
                    </div>
                    <span className={obj.done ? "line-through opacity-80" : "font-medium"}>{obj.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Terminal Simulator */}
        <div className="lg:col-span-3 flex flex-col min-h-0 relative">
          <div className="absolute inset-0 z-0 bg-primary/5 blur-3xl opacity-50 pointer-events-none rounded-full"></div>
          <div className="flex-1 rounded-xl overflow-hidden shadow-2xl relative z-10 border border-zinc-800">
             <TerminalSimulator />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
