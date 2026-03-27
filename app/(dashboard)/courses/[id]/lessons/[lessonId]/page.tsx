"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, PlayCircle, FileText, CheckCircle2, ChevronRight, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Lesson Data
const LESSON_DATA = {
  id: "l1",
  title: "Video: Apa itu SO Jaringan?",
  type: "video", // "video" | "text" | "pdf" | "terminal"
  content: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Video URL or markdown text
  description: "Dalam video ini kita akan membahas dasar-dasar Sistem Operasi Jaringan, fungsi utamanya, dan perbedaannya dengan SO desktop biasa.",
  nextLessonId: "l2",
  prevLessonId: null,
  isCompleted: false,
};

export default function LessonViewer() {
  const params = useParams();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const renderContent = () => {
    switch (LESSON_DATA.type) {
      case "video":
        return (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg border">
            <iframe 
              src={LESSON_DATA.content} 
              title="YouTube video player" 
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        );
      case "pdf":
        return (
          <div className="w-full aspect-[1/1.4] md:aspect-[4/3] rounded-xl overflow-hidden bg-muted border flex items-center justify-center flex-col">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">PDF Viewer will be implemented here.</p>
            <Button variant="outline" className="mt-4">Download PDF</Button>
          </div>
        );
      case "text":
        return (
          <div className="prose prose-zinc dark:prose-invert max-w-none bg-card rounded-xl p-6 md:p-8 border shadow-sm">
            <h3>Apa itu Jaringan Komputer?</h3>
            <p>Jaringan komputer adalah ...</p>
            {/* Render actual markdown here using react-markdown in future */}
            <div className="bg-muted p-4 rounded-lg my-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="m-0 text-sm">Catatan: Pastikan Anda memahami konsep IP Address sebelum mengonfigurasi routing.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8 text-center bg-card rounded-xl border">
            <p>Tipe konten tidak didukung.</p>
          </div>
        );
    }
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground self-start pl-0">
          <Link href={`/courses/${params.id}`}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Kurikulum
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {LESSON_DATA.prevLessonId && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/courses/${params.id}/lessons/${LESSON_DATA.prevLessonId}`}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Link>
            </Button>
          )}
          {LESSON_DATA.nextLessonId && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/courses/${params.id}/lessons/${LESSON_DATA.nextLessonId}`}>
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{LESSON_DATA.title}</h1>
        <p className="text-muted-foreground mb-8">{LESSON_DATA.description}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8">
        {renderContent()}
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6 mt-8">
        <Button variant="secondary" className="w-full sm:w-auto">
          <MessageSquare className="w-4 h-4 mr-2" /> Diskusi Pelajaran
        </Button>
        
        <div className="flex gap-3 w-full sm:w-auto">
          {LESSON_DATA.isCompleted ? (
            <Button variant="outline" className="w-full sm:w-auto text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/10 cursor-default">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Selesai
            </Button>
          ) : (
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Selesai
            </Button>
          )}
          
          {LESSON_DATA.nextLessonId && (
            <Button className="w-full sm:w-auto" asChild>
              <Link href={`/courses/${params.id}/lessons/${LESSON_DATA.nextLessonId}`}>
                Lanjut <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
