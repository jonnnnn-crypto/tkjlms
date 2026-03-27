"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, ToggleLeft, TrendingUp, Loader2, X, CheckCircle, School } from "lucide-react";

interface Props {
  initialSettings: Record<string, string>;
}

export default function AdminSettings({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [newYearName, setNewYearName] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan pengaturan");
      setSettings((s) => ({ ...s, [key]: value }));
      setMsg({ type: "success", text: "Pengaturan berhasil disimpan." });
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = async () => {
    if (!newYearName.trim()) { setMsg({ type: "error", text: "Nama tahun ajaran wajib diisi." }); return; }
    setPromoting(true);
    try {
      const res = await fetch("/api/admin/promote-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSchoolYearName: newYearName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMsg({ type: "success", text: `✅ Naik kelas selesai! ${json.promoted} siswa naik kelas, ${json.graduated} siswa lulus. Tahun ajaran baru: ${json.newSchoolYear}.` });
      setShowPromoteModal(false);
      setNewYearName("");
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setPromoting(false);
    }
  };

  const isRegOpen = settings["registration_open"] !== "false";

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Pengaturan Sistem</h2>
          <p className="text-sm text-muted-foreground">Konfigurasi pendaftaran, tahun ajaran, dan kenaikan kelas.</p>
        </div>
      </div>

      {msg && (
        <div className={`p-3 text-sm rounded-lg border flex items-start gap-2 ${msg.type === "success" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
          {msg.type === "success" ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <X className="w-4 h-4 mt-0.5 shrink-0" />}
          <span>{msg.text}</span>
          <button className="ml-auto shrink-0" onClick={() => setMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Registration Toggle */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ToggleLeft className="w-4 h-4 text-primary" /> Status Pendaftaran Siswa
            </CardTitle>
            <CardDescription>
              Aktifkan atau tutup pendaftaran siswa baru via halaman /register.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
              <div className={`w-3 h-3 rounded-full ${isRegOpen ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
              <span className="font-medium text-sm">{isRegOpen ? "Pendaftaran TERBUKA" : "Pendaftaran DITUTUP"}</span>
              <Badge variant={isRegOpen ? "default" : "secondary"} className="ml-auto">
                {isRegOpen ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={isRegOpen ? "outline" : "default"} size="sm"
                disabled={saving || !isRegOpen}
                onClick={() => saveSetting("registration_open", "false")}>
                {saving && !isRegOpen ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                🔒 Tutup Pendaftaran
              </Button>
              <Button variant={isRegOpen ? "default" : "outline"} size="sm"
                disabled={saving || isRegOpen}
                onClick={() => saveSetting("registration_open", "true")}>
                {saving && isRegOpen ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                🔓 Buka Pendaftaran
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grade Promotion */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Kenaikan Kelas
            </CardTitle>
            <CardDescription>
              Naikkan semua siswa satu tingkat dan mulai tahun ajaran baru. Siswa kelas XII akan diluluskan. Aksi ini tidak dapat dibatalkan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg space-y-1">
              <div className="flex items-center gap-2"><School className="w-3 h-3" /> Tahun Ajaran Aktif: <strong>{settings["current_school_year"] ?? "-"}</strong></div>
              <div>• X TJKT → XI TJKT &nbsp;|&nbsp; XI TJKT → XII TJKT</div>
              <div>• XII TJKT → Lulusan (kelas dihapus)</div>
            </div>
            <Button className="w-full" variant="default"
              onClick={() => setShowPromoteModal(true)}>
              <TrendingUp className="w-4 h-4 mr-2" /> Mulai Kenaikan Kelas
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Promote Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPromoteModal(false)}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-card border rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-destructive">⚠️ Konfirmasi Kenaikan Kelas</h3>
              <button onClick={() => setShowPromoteModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground">Masukkan nama tahun ajaran baru. Semua siswa akan otomatis dinaikkan. <strong>Aksi ini permanen.</strong></p>
            <input type="text" placeholder="contoh: 2026/2027"
              value={newYearName} onChange={(e) => setNewYearName(e.target.value)}
              className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setShowPromoteModal(false)}>Batal</Button>
              <Button variant="destructive" onClick={handlePromote} disabled={promoting}>
                {promoting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
                {promoting ? "Memproses..." : "Ya, Naikan Kelas"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
