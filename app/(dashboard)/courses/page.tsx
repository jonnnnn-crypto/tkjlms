"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, BookOpen, Clock, Users, PlayCircle, Star } from "lucide-react";
import Link from "next/link";

const COURSES = [
  {
    id: "1",
    title: "Administrasi Sistem Jaringan (ASJ)",
    category: "Produktif TJKT",
    description: "Pelajari cara mengkonfigurasi server Linux, DNS, Web Server, dan Mail Server untuk infrastruktur jaringan perusahaan.",
    level: "Intermediate",
    students: 124,
    modules: 8,
    progress: 45, // For enrolled students
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500"
  },
  {
    id: "2",
    title: "Teknologi Layanan Jaringan (TLJ)",
    category: "Produktif TJKT",
    description: "Memahami protokol VoIP, konfigurasi PBX, dan layanan komunikasi data streaming pada jaringan skala luas.",
    level: "Advanced",
    students: 98,
    modules: 12,
    progress: 0,
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500"
  },
  {
    id: "3",
    title: "Komputer dan Jaringan Dasar (KJD)",
    category: "Dasar Kejuruan",
    description: "Fondasi perakitan PC, instalasi SO, topologi jaringan, dan subnetting IPv4 dasar.",
    level: "Beginner",
    students: 312,
    modules: 10,
    progress: 100,
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-500"
  },
];

export default function CoursesCatalog() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight border-l-4 border-primary pl-4">Kursus & Materi</h1>
          <p className="text-muted-foreground mt-2 pl-4">Jelajahi kurikulum TJKT dan tingkatkan skill jaringan-mu.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari kursus..."
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Recommended or Active Course Hero */}
      <motion.div variants={itemVariants} className="w-full">
        <div className="rounded-2xl border bg-card overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
          <div className="md:w-1/3 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
             <BookOpen className="w-32 h-32 text-primary drop-shadow-lg" />
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Lanjutkan Belajar</Badge>
              <div className="flex items-center text-yellow-500 font-bold text-sm">
                <Star className="w-4 h-4 mr-1 fill-yellow-500" /> 4.9
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Administrasi Sistem Jaringan (ASJ)</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl text-sm leading-relaxed">
              Anda sedang berada di Modul 4: Konfigurasi DNS Server menggunakan BIND9 pada Debian 11. Segera selesaikan kuis subnetting untuk membuka modul praktikum.
            </p>
            
            <div className="space-y-2 mb-6 max-w-md">
              <div className="flex justify-between text-sm font-medium">
                <span>Progres Keseluruhan</span>
                <span className="text-primary">45%</span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[45%]" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild>
                <Link href="/courses/1">
                  <PlayCircle className="w-4 h-4 mr-2" /> Lanjutkan (DNS Server)
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Grid */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold mb-4 mt-8 flex items-center">
          Semua Kursus <Badge variant="secondary" className="ml-3">{COURSES.length}</Badge>
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((course) => (
            <Card key={course.id} className="group overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all hover:shadow-md cursor-pointer">
              <div className={`h-32 bg-gradient-to-br ${course.color} relative p-6 flex items-center justify-center`}>
                <div className="absolute top-3 right-3">
                  <Badge variant={course.level === "Beginner" ? "secondary" : course.level === "Advanced" ? "destructive" : "default"} className="opacity-90 shadow-sm text-[10px] uppercase font-bold tracking-wider">
                    {course.level}
                  </Badge>
                </div>
                <BookOpen className={`w-16 h-16 ${course.iconColor} drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out`} />
              </div>
              <CardHeader className="pb-3 flex-1">
                <div className="text-xs font-semibold text-primary mb-1 tracking-wider uppercase">{course.category}</div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs mt-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                    <Users className="w-3.5 h-3.5" /> {course.students}
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                    <BookOpen className="w-3.5 h-3.5" /> {course.modules} Modul
                  </div>
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-0 mt-auto">
                {course.progress > 0 && course.progress < 100 ? (
                  <Button variant="secondary" className="w-full bg-primary/10 text-primary hover:bg-primary/20" asChild>
                    <Link href={`/courses/${course.id}`}>Lanjutkan ({course.progress}%)</Link>
                  </Button>
                ) : course.progress === 100 ? (
                  <Button variant="outline" className="w-full text-green-500 border-green-500/50 hover:bg-green-500/10" asChild>
                    <Link href={`/courses/${course.id}`}>Selesai Dipelajari</Link>
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href={`/courses/${course.id}`}>Mulai Belajar</Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
