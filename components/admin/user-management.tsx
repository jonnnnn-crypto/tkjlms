"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, BookOpen, GraduationCap, ShieldAlert, Activity,
  UserPlus, Server, X, Loader2, Eye, EyeOff, Trash2
} from "lucide-react";

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  xp: number;
  level: number;
  created_at: string;
}

interface AdminPageProps {
  users: UserRow[];
  stats: { totalUsers: number; totalTeachers: number; totalCourses: number };
}

export default function AdminDashboard({ users: initialUsers, stats }: AdminPageProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "teacher" as "teacher" | "admin" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      // Add new user to list
      setUsers(prev => [{
        id: json.user.id,
        full_name: json.user.full_name,
        email: json.user.email,
        role: json.user.role,
        xp: 0,
        level: 1,
        created_at: new Date().toISOString(),
      }, ...prev]);
      setSuccess(`Akun ${form.role === "teacher" ? "Guru" : "Admin"} "${form.full_name}" berhasil dibuat!`);
      setForm({ full_name: "", email: "", password: "", role: "teacher" });
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Hapus akun "${name}"? Aksi ini tidak dapat dibatalkan.`)) return;
    setDeleteId(userId);
    try {
      const res = await fetch("/api/admin/create-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSuccess(`Akun "${name}" berhasil dihapus.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const STAT_CARDS = [
    { title: "Total Pengguna", value: stats.totalUsers, sub: `${users.filter(u => u.role === "student").length} siswa`, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Guru", value: users.filter(u => u.role === "teacher").length, sub: "Akun aktif", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Total Kursus", value: stats.totalCourses, sub: "Semester ini", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Status Sistem", value: "Aktif", sub: "Supabase Connected", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <motion.div className="space-y-6 max-w-7xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground mt-1">Kelola pengguna, kelas, dan pengaturan sistem.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setShowModal(true); setError(null); }}>
            <UserPlus className="w-4 h-4 mr-2" /> Tambah Pengguna
          </Button>
        </div>
      </motion.div>

      {/* Alerts */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" /> {error}
          <button className="ml-auto" onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </motion.div>
      )}
      {success && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 text-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-2">
          ✅ {success}
          <button className="ml-auto" onClick={() => setSuccess(null)}><X className="w-4 h-4" /></button>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* User Table */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-lg">Manajemen Pengguna</CardTitle>
              <CardDescription>Kelola akun guru dan admin di platform ini.</CardDescription>
            </div>
            <Badge variant="secondary">{users.length} pengguna</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {users.length === 0 && (
                <p className="text-center text-muted-foreground py-12 text-sm">Belum ada pengguna terdaftar.</p>
              )}
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      ${user.role === "admin" ? "bg-red-500/20 text-red-500" : user.role === "teacher" ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.role === "admin" ? "destructive" : user.role === "teacher" ? "default" : "secondary"} className="capitalize">
                      {user.role === "admin" ? "Admin" : user.role === "teacher" ? "Guru" : "Siswa"}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden md:block">{user.xp} XP · Lv.{user.level}</span>
                    <Button
                      variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(user.id, user.full_name)}
                      disabled={deleteId === user.id}
                    >
                      {deleteId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md bg-card border rounded-2xl shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Buat Akun Baru</h2>
                <p className="text-sm text-muted-foreground">Tambahkan guru atau admin ke platform.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Role Select */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
                {(["teacher", "admin"] as const).map((r) => (
                  <button
                    type="button" key={r}
                    onClick={() => setForm(f => ({ ...f, role: r }))}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${form.role === r ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {r === "teacher" ? "👨‍🏫 Guru" : "🛡️ Admin"}
                  </button>
                ))}
              </div>

              {[
                { label: "Nama Lengkap", key: "full_name", type: "text", placeholder: "contoh: Pak Budi Santoso" },
                { label: "Email", key: "email", type: "email", placeholder: "guru@smk.sch.id" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type={type} required placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full h-10 rounded-lg border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"} required placeholder="Minimal 8 karakter"
                    minLength={8} value={form.password}
                    onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full h-10 rounded-lg border bg-background px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-muted-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                {loading ? "Membuat Akun..." : `Buat Akun ${form.role === "teacher" ? "Guru" : "Admin"}`}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
