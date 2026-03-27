"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Terminal, Trophy, Users, Server, ShieldCheck, Zap } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function LandingPage() {
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-6 lg:px-14 py-4 flex items-center justify-between border-b bg-background/60 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Server className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">TJKT LMS Platform</span>
          <span className="font-bold text-xl tracking-tight sm:hidden">TJKT LMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Masuk
          </Link>
          <Link href="/register" className="group relative text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-full overflow-hidden transition-all shadow-md hover:shadow-primary/25">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <span className="relative">Mulai Gratis</span>
          </Link>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <section className="relative px-6 lg:px-14 pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden flex items-center justify-center min-h-[90vh]">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[10%] top-[20%] -z-10 m-auto h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-[10%] bottom-[10%] -z-10 m-auto h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[150px]"
          />
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto text-center space-y-8 z-10"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-semibold mb-4">
              <Zap className="w-4 h-4 fill-primary" />
              <span>Platform LMS Generasi Baru Khusus TJKT</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]"
            >
              Kuasai Jaringan dengan <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary bg-300% animate-gradient">
                Cara Interaktif & Modern
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium"
            >
              Sistem Manajemen Pembelajaran revolusioner yang dirancang spesifik untuk siswa Teknik Jaringan Komputer. Belajar teori, praktek terminal, dan capai leaderboard!
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Link href="/register" className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl">
                Jelajahi Sekarang 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary/80 transition-all">
                Sudah punya akun?
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Staggered Grid */}
        <section className="px-6 lg:px-14 py-32 bg-card relative z-20 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20 space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Lebih dari sekadar LMS biasa</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Dirancang untuk menjembatani teori akademik dengan kebutuhan praktek industri IT sesungguhnya.</p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <BookOpen className="w-8 h-8 text-blue-500" />,
                  title: "Kurikulum Terstruktur",
                  desc: "Materi PDF, Video interaktif, dan kuis yang disusun runut dari dasar jaringan hingga administrasi server tingkat lanjut."
                },
                {
                  icon: <Terminal className="w-8 h-8 text-green-500" />,
                  title: "Simulator Virtual",
                  desc: "Akses terminal Linux virtual bawaan. Latihan konfigurasi IP, routing, dan firewall langsung dari dalam browser Anda."
                },
                {
                  icon: <Trophy className="w-8 h-8 text-yellow-500" />,
                  title: "Sistem Gamifikasi",
                  desc: "Belajar tidak lagi membosankan. Selesaikan tantangan untuk mendapatkan XP, Lencana (Badges), dan naik level."
                },
                {
                  icon: <Server className="w-8 h-8 text-indigo-500" />,
                  title: "Manajemen Penugasan",
                  desc: "Platform upload tugas praktek yang mudah, dilengkapi dengan sistem feedback otomatis dari instuktur."
                },
                {
                  icon: <ShieldCheck className="w-8 h-8 text-rose-500" />,
                  title: "Keamanan Enterprise",
                  desc: "Dibangun di atas infrastruktur modern dengan perlindungan Row Level Security & Authentication tingkat dewa."
                },
                {
                  icon: <Users className="w-8 h-8 text-teal-500" />,
                  title: "Komunitas TJKT",
                  desc: "Fitur forum diskusi di setiap materi memungkinkan siswa bertanya dan berdiskusi secara real-time."
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeInUp}
                  className="group bg-background p-8 rounded-3xl border border-muted shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="px-6 lg:px-14 py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 20 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-background to-blue-500/10 border border-primary/20 rounded-[3rem] p-12 md:p-20 space-y-8 backdrop-blur-sm"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Siap Memulai Karir Jaringan Anda?</h2>
            <p className="text-xl text-muted-foreground">Bergabung dengan platform belajar paling canggih untuk siswa TJKT. Gratis pendaftaran untuk siswa sekolah yang berkolaborasi.</p>
            <Link href="/register" className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold text-xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/25">
              Bergabung Sekarang <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-12 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Server className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground/80">TJKT LMS</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Development by <span className="font-bold text-primary">Ghifari Azhar</span> &middot; Production by <span className="font-bold text-foreground">LTEC SMK NEGERI 1 LIWA</span>
            </p>
            <p className="text-sm text-muted-foreground/60">&copy; {new Date().getFullYear()} TJKT LMS. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
