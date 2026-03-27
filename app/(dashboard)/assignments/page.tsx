"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText, CheckCircle2, AlertCircle, CalendarClock, ChevronRight } from "lucide-react";
import Link from "next/link";

const ASSIGNMENTS = [
  {
    id: "1",
    title: "Laporan Konfigurasi MikroTik Dasar",
    course: "Administrasi Sistem Jaringan",
    description: "Buat laporan langkah demi langkah konfigurasi IP, DHCP Server, dan NAT pada router MikroTik.",
    dueDate: "2023-11-20T23:59:00",
    status: "pending", // pending, submitted, late, graded
    score: null,
  },
  {
    id: "2",
    title: "Simulasi Packet Tracer: Routing Statis",
    course: "Teknologi Layanan Jaringan",
    description: "Upload file .pkt simulasi routing statis dengan 3 router dan 3 jaringan lokal yang berbeda.",
    dueDate: "2023-10-15T12:00:00",
    status: "graded",
    score: 85,
  },
  {
    id: "3",
    title: "Makalah Sejarah Perkembangan Linux",
    course: "Komputer dan Jaringan Dasar",
    description: "Tulis makalah minimal 3 halaman mengenai sejarah Linux, mulai dari Minix hingga distro modern.",
    dueDate: "2023-11-05T23:59:00",
    status: "submitted",
    score: null,
  },
];

export default function AssignmentsList() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const getStatusBadge = (status: string, score: number | null) => {
    switch (status) {
      case "graded":
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none">Nilai: {score}</Badge>;
      case "submitted":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 shadow-none">Menunggu Penilaian</Badge>;
      case "late":
        return <Badge variant="destructive">Terlambat</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/10">Belum Dikerjakan</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "submitted": return <FileText className="w-5 h-5 text-blue-500" />;
      case "late": return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "pending":
      default: return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tugas Kuliah</h1>
          <p className="text-muted-foreground mt-1">Kelola dan kumpulkan tugas dari semua kursus Anda.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4">
        {ASSIGNMENTS.map((assignment) => (
          <Card key={assignment.id} className="hover:border-primary/50 transition-colors group">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 mt-1">
                    {getStatusIcon(assignment.status)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px] uppercase">{assignment.course}</Badge>
                      {getStatusBadge(assignment.status, assignment.score)}
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                      {assignment.description}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mt-3 font-medium">
                      <CalendarClock className="w-3.5 h-3.5 mr-1.5" />
                      Tenggat: {new Date(assignment.dueDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 md:pl-4 md:border-l flex md:flex-col items-center justify-center gap-2 self-stretch w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0">
                  <Button asChild variant={assignment.status === "pending" ? "default" : "secondary"} className="w-full">
                    <Link href={`/assignments/${assignment.id}`}>
                      {assignment.status === "pending" ? "Kerjakan" : "Lihat Detail"} <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
