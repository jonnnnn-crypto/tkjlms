"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUp, ChevronLeft, CalendarClock, BookOpen, AlertCircle, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ASSIGNMENT_DETAIL = {
  id: "1",
  title: "Laporan Konfigurasi MikroTik Dasar",
  course: "Administrasi Sistem Jaringan",
  description: "Dalam tugas ini, Anda wajib mengumpulkan dokumentasi laporan konfigurasi MikroTik. Laporan harus mencakup skema topologi jaringan, langkah-langkah setting IP Address, konfigurasi NAT (Network Address Translation), dan pembuktian konektivitas klien (Ping tes).\n\nKetentuan:\n1. Format file PDF\n2. Maksimal ukuran file 5MB\n3. Wajib menyertakan screenshot hasil ping\n\nJika ada pertanyaan, diskusikan di forum modul.",
  dueDate: "2023-11-20T23:59:00",
  status: "pending", 
};

export default function AssignmentSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <motion.div 
      className="space-y-6 max-w-4xl mx-auto pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Button variant="ghost" size="sm" asChild className="mb-4 text-muted-foreground hover:text-foreground">
          <Link href="/assignments">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Tugas
          </Link>
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <BookOpen className="w-3 h-3 mr-1" /> {ASSIGNMENT_DETAIL.course}
              </Badge>
              {ASSIGNMENT_DETAIL.status === "pending" && (
                <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/10">Belum Dikerjakan</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{ASSIGNMENT_DETAIL.title}</h1>
            
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground bg-card p-6 rounded-xl border">
              {ASSIGNMENT_DETAIL.description.split('\n').map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          </div>

          <Card className="border-t-4 border-t-primary shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-xl">Kumpulkan Tugas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-500 mb-2">Tugas Berhasil Dikumpulkan!</h3>
                  <p className="text-muted-foreground mb-6">Penilaian akan dilakukan oleh guru dalam waktu dekat. Anda dapat mengubah pengumpulan selama belum melebihi tenggat waktu.</p>
                  <Button variant="outline" onClick={() => setSubmitted(false)}>
                    Ubah Pengumpulan
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Unggah File (PDF, DOCX, ZIP)</label>
                    <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                      <FileUp className="w-10 h-10 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium">Klik untuk mengunggah atau seret file ke sini</p>
                      <p className="text-xs text-muted-foreground mt-1">Maksimal ukuran file: 5MB</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Komentar / Jawaban Teks (Opsional)</label>
                    <textarea 
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ketikkan pesan, link Github, atau jawaban teks di sini..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex gap-3 text-orange-600 dark:text-orange-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>Pastikan file yang diunggah tidak rusak dan sesuai dengan instruksi. Pengumpulan setelah tenggat mungkin akan dikenai pengurangan nilai.</p>
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                    {isSubmitting ? "Mengirim..." : "Kumpulkan Pekerjaan"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Informasi Tugas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-start gap-4 hover:bg-muted/20">
                  <CalendarClock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Batas Waktu</p>
                    <p className="text-sm font-medium text-destructive">
                      {new Date(ASSIGNMENT_DETAIL.dueDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}<br/>
                      <span className="font-bold">23:59 WIB</span>
                    </p>
                  </div>
                </div>
                <div className="p-4 flex items-start gap-4 hover:bg-muted/20">
                  <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Format File</p>
                    <p className="text-sm font-medium">PDF, DOCX, ZIP</p>
                  </div>
                </div>
                <div className="p-4 flex items-start gap-4 hover:bg-muted/20">
                  <BookOpen className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Mata Pelajaran</p>
                    <p className="text-sm font-medium">{ASSIGNMENT_DETAIL.course}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
