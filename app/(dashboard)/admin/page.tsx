"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, GraduationCap, ShieldAlert, Activity, UserPlus, Server } from "lucide-react";

const STATS = [
  { title: "Total Users", value: "342", sub: "+12 this week", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Active Teachers", value: "18", sub: "All accounts active", icon: GraduationCap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { title: "Active Courses", value: "24", sub: "+2 this semester", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "System Status", value: "Healthy", sub: "Latency 42ms", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
];

const RECENT_USERS = [
  { id: "1", name: "Adi Putra", email: "adi@smk.tjkt.id", role: "Student", status: "Active" },
  { id: "2", name: "Putri Larasati", email: "putri@smk.tjkt.id", role: "Student", status: "Active" },
  { id: "3", name: "Pak Widodo", email: "widodo@smk.tjkt.id", role: "Teacher", status: "Pending" },
  { id: "4", name: "Siti Nurhaliza", email: "siti@smk.tjkt.id", role: "Student", status: "Active" },
];

export default function AdminDashboard() {
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
      <motion.div variants={itemVariants} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground mt-1">Manage users, classes, and system-wide settings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Server className="w-4 h-4 mr-2" /> Server Logs</Button>
          <Button><UserPlus className="w-4 h-4 mr-2" /> Add User</Button>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
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

      <div className="grid gap-6 md:grid-cols-12">
        {/* User Management Quick View */}
        <motion.div variants={itemVariants} className="md:col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg">Recent Users</CardTitle>
                <CardDescription>Latest registrations across the platform.</CardDescription>
              </div>
              <Button variant="outline" size="sm">Manage All Users</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {RECENT_USERS.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role === "Teacher" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === "Active" ? "outline" : "destructive"} className={user.status === "Active" ? "text-green-500 border-green-500/20 bg-green-500/10" : ""}>
                        {user.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-8">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System & Class Management */}
        <motion.div variants={itemVariants} className="md:col-span-4 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start h-12">
                <ShieldAlert className="w-4 h-4 mr-3 text-red-500" />
                <div className="text-left">
                  <div className="text-sm font-medium">Security Settings</div>
                  <div className="text-xs text-muted-foreground font-normal">Roles & Permissions</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <BookOpen className="w-4 h-4 mr-3 text-blue-500" />
                <div className="text-left">
                  <div className="text-sm font-medium">Academic Configuration</div>
                  <div className="text-xs text-muted-foreground font-normal">Years, Semesters, Subjects</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12">
                <Users className="w-4 h-4 mr-3 text-purple-500" />
                <div className="text-left">
                  <div className="text-sm font-medium">Class Management</div>
                  <div className="text-xs text-muted-foreground font-normal">Assign Students & Homerooms</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
