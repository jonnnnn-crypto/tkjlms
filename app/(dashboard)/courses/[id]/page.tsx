"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Lock, PlayCircle, Terminal, FileText, FileQuestion, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Data for a single Course Curriculum
const COURSE_DETAIL = {
  id: "1",
  title: "Administrasi Sistem Jaringan (ASJ)",
  description: "Pelajari cara mengkonfigurasi server Linux, DNS, Web Server, dan Mail Server untuk infrastruktur jaringan perusahaan. Modul ini didesain interaktif dengan simulator CLI dan kuis formatif.",
  progress: 45,
  modules: [
    {
      id: "m1",
      title: "Modul 1: Pengenalan Sistem Operasi Jaringan",
      lessons: [
        { id: "l1", title: "Video: Apa itu SO Jaringan?", type: "video", duration: "12 min", isLocked: false, isCompleted: true },
        { id: "l2", title: "Membaca: Karakteristik Linux Debian", type: "text", duration: "5 min", isLocked: false, isCompleted: true },
        { id: "l3", title: "Kuis: Dasar SO Jaringan", type: "quiz", duration: "10 min", isLocked: false, isCompleted: true },
      ]
    },
    {
      id: "m2",
      title: "Modul 2: Konfigurasi Dasar Jaringan Linux",
      lessons: [
        { id: "l4", title: "Membaca: Network Interfaces di Debian", type: "text", duration: "8 min", isLocked: false, isCompleted: true },
        { id: "l5", title: "Simulator CLI: Setup Static IP", type: "terminal", duration: "20 min", isLocked: false, isCompleted: false },
        { id: "l6", title: "Tugas: Konfigurasi Routing Static", type: "assignment", duration: "1 day", isLocked: true, isCompleted: false },
      ]
    },
    {
      id: "m3",
      title: "Modul 3: Domain Name System (DNS) Server",
      lessons: [
        { id: "l7", title: "Video: Konsep Dasar DNS Server", type: "video", duration: "15 min", isLocked: true, isCompleted: false },
        { id: "l8", title: "Instalasi dan Konfigurasi BIND9", type: "text", duration: "10 min", isLocked: true, isCompleted: false },
        { id: "l9", title: "Simulator CLI: Troubleshooting DNS Zone", type: "terminal", duration: "30 min", isLocked: true, isCompleted: false },
      ]
    }
  ]
};

export default function CourseDetail() {
  const params = useParams(); // params.id
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const getLessonIcon = (type: string, isCompleted: boolean, isLocked: boolean) => {
    if (isCompleted) return <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
    if (isLocked) return <Lock className="w-5 h-5 text-muted-foreground shrink-0" />;
    
    switch (type) {
      case "video": return <PlayCircle className="w-5 h-5 text-blue-500 shrink-0" />;
      case "text": return <FileText className="w-5 h-5 text-purple-500 shrink-0" />;
      case "terminal": return <Terminal className="w-5 h-5 text-orange-500 shrink-0" />;
      case "quiz": return <FileQuestion className="w-5 h-5 text-rose-500 shrink-0" />;
      case "assignment": return <BookOpen className="w-5 h-5 text-cyan-500 shrink-0" />;
      default: return <BookOpen className="w-5 h-5 text-muted-foreground shrink-0" />;
    }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Button variant="ghost" size="sm" asChild className="mb-4 text-muted-foreground hover:text-foreground">
          <Link href="/courses">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Katalog
          </Link>
        </Button>
        <div className="bg-card border rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 opacity-5 pointer-events-none">
            <BookOpen className="w-96 h-96 text-primary" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>SMK Kelas XI</Badge>
              <Badge variant="secondary">Internet & Jaringan</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{COURSE_DETAIL.title}</h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              {COURSE_DETAIL.description}
            </p>
            
            <div className="bg-muted/50 p-4 rounded-xl border max-w-md">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Progres Belajar Anda</span>
                <span className="text-primary">{COURSE_DETAIL.progress}%</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[45%]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center mt-8 mb-6">
          <BookOpen className="w-6 h-6 mr-3 text-primary" />
          Kurikulum Kursus
        </h2>

        <div className="space-y-6">
          {COURSE_DETAIL.modules.map((mod, index) => (
            <Card key={mod.id} className="shadow-sm overflow-hidden border">
              <CardHeader className="bg-muted/30 border-b py-4">
                <CardTitle className="text-lg font-semibold">{mod.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {mod.lessons.map((lesson) => {
                    const isAvailable = !lesson.isLocked;
                    
                    return (
                      <Link 
                        key={lesson.id} 
                        href={isAvailable ? `/courses/${params.id}/lessons/${lesson.id}` : '#'}
                        onClick={(e) => !isAvailable && e.preventDefault()}
                        className={`flex items-center justify-between p-4 group transition-colors ${isAvailable ? 'hover:bg-muted/50' : 'opacity-75 cursor-not-allowed'}`}
                      >
                        <div className="flex items-center gap-4">
                          {getLessonIcon(lesson.type, lesson.isCompleted, lesson.isLocked)}
                          <div>
                            <p className={`font-medium sm:text-base text-sm ${lesson.isCompleted ? 'text-muted-foreground line-through' : lesson.isLocked ? 'text-muted-foreground' : 'group-hover:text-primary transition-colors'}`}>
                              {lesson.title}
                            </p>
                            <span className="text-xs text-muted-foreground mt-0.5 inline-block">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          {!lesson.isLocked && !lesson.isCompleted && (
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              Mulai
                            </Button>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
