"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Clock, FileWarning, CheckCircle, ChevronRight, TrendingUp } from "lucide-react";

const OVERVIEW = [
  { title: "Total Students", value: "124", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Active Courses", value: "4", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Pending Grading", value: "18", icon: FileWarning, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Avg Performance", value: "86%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const PENDING_TASKS = [
  { id: "1", student: "Budi Santoso", task: "MikroTik Setup Report", course: "ASJ", time: "2 hours ago" },
  { id: "2", student: "Sinta Maharani", task: "Subnetting Quiz (Essay)", course: "TLJ", time: "5 hours ago" },
  { id: "3", student: "Anton Wijaya", task: "Linux Installation Video", course: "KJD", time: "1 day ago" },
];

const RECENT_CLASSES = [
  { id: "1", name: "XI TJKT 1", course: "Administrasi Sistem Jaringan", avgProgress: 65 },
  { id: "2", name: "X TJKT 2", course: "Komputer dan Jaringan Dasar", avgProgress: 42 },
];

export default function TeacherDashboard() {
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
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your courses, grading, and student performance.</p>
        </div>
        <Button>
          Create Assignment
        </Button>
      </motion.div>

      {/* Stats/Overview Row */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW.map((stat, i) => (
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
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Pending Grading Tasks */}
        <motion.div variants={itemVariants} className="md:col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <CardTitle className="text-lg font-semibold flex items-center">
                <FileWarning className="w-5 h-5 mr-4 text-orange-500" />
                Pending Grading (Needs Action)
              </CardTitle>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Grade All
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {PENDING_TASKS.map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                        {task.student.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{task.task}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{task.course}</Badge>
                          <span className="text-xs text-muted-foreground">by {task.student} • {task.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">
                      Review & Grade
                    </Button>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t bg-muted/20 text-center">
                <Button variant="link" size="sm" className="text-muted-foreground">
                  View full grading queue
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Classes Overview / Student Performance Monitor */}
        <motion.div variants={itemVariants} className="md:col-span-4 space-y-6">
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <BookOpen className="w-5 h-5 mr-3 text-primary" />
                Active Classes Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {RECENT_CLASSES.map((cls) => (
                <div key={cls.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{cls.name}</span>
                    <span className="text-muted-foreground">{cls.avgProgress}% Avg</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{cls.course}</p>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${cls.avgProgress}%` }} />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full flex items-center justify-center" size="sm">
                View Detailed Reports <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
