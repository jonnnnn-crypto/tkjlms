import Link from "next/link";
import { ArrowRight, BookOpen, Terminal, Trophy, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <header className="px-6 lg:px-14 py-4 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Terminal className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">TJKT LMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Masuk
          </Link>
          <Link href="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
            Daftar Sekarang
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 lg:px-14 py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
          
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Platform Pembelajaran <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Teknik Jaringan Komputer</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              LMS modern yang dirancang khusus untuk siswa kejuruan TJKT. Dilengkapi dengan materi interaktif, simulator terminal, dan sistem gamifikasi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                Mulai Belajar Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-secondary/80 transition-all">
                Sudah punya akun?
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 lg:px-14 py-24 bg-muted/30 border-t">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Fitur Unggulan</h2>
              <p className="text-muted-foreground">Kenapa belajar jaringan di TJKT LMS lebih menyenangkan?</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <BookOpen className="w-6 h-6 text-blue-500" />,
                  title: "Materi Terstruktur",
                  desc: "Silabus yang disusun sesuai dengan kurikulum industri TJKT."
                },
                {
                  icon: <Terminal className="w-6 h-6 text-green-500" />,
                  title: "Simulator Interaktif",
                  desc: "Praktek langsung konfigurasi jaringan di terminal virtual."
                },
                {
                  icon: <Trophy className="w-6 h-6 text-yellow-500" />,
                  title: "Gamifikasi & XP",
                  desc: "Dapatkan XP, capai level tertinggi, dan kumpulkan lencana (badges)."
                },
                {
                  icon: <Users className="w-6 h-6 text-purple-500" />,
                  title: "Komunitas Diskusi",
                  desc: "Tanya jawab dengan instruktur dan teman sebaya secara real-time."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-14 py-24 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 md:p-12 space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold">Siap Menjadi Ahli Jaringan?</h2>
            <p className="text-muted-foreground">Bergabunglah dengan siswa lainnya dan tingkatkan kompetensi kejuruan Anda hari ini.</p>
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-md">
              Daftar Gratis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 px-6 lg:px-14 text-center">
        <p className="text-sm text-muted-foreground font-medium mb-1">
          Development by <span className="text-primary">Ghifari Azhar</span> &middot; Production by <span className="text-foreground">LTEC SMK NEGERI 1 LIWA</span>
        </p>
        <p className="text-xs text-muted-foreground/70">&copy; {new Date().getFullYear()} TJKT LMS. All rights reserved.</p>
      </footer>
    </div>
  );
}
