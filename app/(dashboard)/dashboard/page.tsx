"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, Clock, PlayCircle, Star, Target, Zap, ChevronRight, Activity, Bell } from "lucide-react";

// Mock Data for the Student Dashboard
const MOCK_USER = {
  name: "Budi Santoso",
  level: 12,
  xp: 4500,
  nextLevelXp: 5000,
};

const ACTIVE_COURSES = [
  { id: "1", title: "Administrasi Sistem Jaringan", progress: 65, nextLesson: "Setup DNS Server", icon: Target },
  { id: "2", title: "Teknologi Layanan Jaringan", progress: 30, nextLesson: "VoIP Protocols", icon: Activity },
];

const ASSIGNMENTS = [
  { id: "1", title: "Laporan Konfigurasi MikroTik", course: "ASJ", due: "Today, 23:59", status: "Warning" },
  { id: "2", title: "Simulasi Packet Tracer", course: "TLJ", due: "Tomorrow, 12:00", status: "Normal" },
];

const RECENT_SCORES = [
  { id: "1", title: "Quiz: Subnetting", score: 95, date: "2 days ago" },
  { id: "2", title: "Tugas Instalasi Linux", score: 88, date: "1 week ago" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function StudentDashboard() {
  const xpPercentage = (MOCK_USER.xp / MOCK_USER.nextLevelXp) * 100;

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-8 shadow-sm">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Trophy className="w-64 h-64 text-primary" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {MOCK_USER.name}! 👋</h1>
            <p className="text-muted-foreground text-lg">You have 2 pending assignments due soon. Keep up the good work!</p>
            <div className="pt-4 flex gap-3">
              <Button>
                <PlayCircle className="mr-2 h-4 w-4" />
                Resume Learning
              </Button>
              <Button variant="outline">View Calendar</Button>
            </div>
          </div>
          
          {/* Level / XP Widget */}
          <div className="bg-card/60 backdrop-blur-md rounded-xl border p-5 shadow-sm min-w-[240px] flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-yellow-500 fill-yellow-500 w-5 h-5" />
              <span className="font-bold text-lg">Level {MOCK_USER.level}</span>
            </div>
            
            <div className="w-full relative h-3 bg-secondary rounded-full overflow-hidden mt-2 mb-1">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="w-full flex justify-between text-xs text-muted-foreground mt-1">
              <span>{MOCK_USER.xp} XP</span>
              <span>{MOCK_USER.nextLevelXp} XP</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column (Courses & Progress) */}
        <div className="md:col-span-8 space-y-6">
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold tracking-tight flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Active Courses
              </h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {ACTIVE_COURSES.map((course) => (
                <Card key={course.id} className="group hover:border-primary/50 transition-colors cursor-pointer overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" />
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-start justify-between">
                      <span className="line-clamp-2">{course.title}</span>
                      <course.icon className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mt-2 flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground font-medium">{course.progress}% Completed</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-4">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                    <div className="bg-muted px-3 py-2 rounded-md flex items-center text-xs text-muted-foreground">
                      <PlayCircle className="w-3 h-3 mr-2" />
                      <span className="truncate">Next: {course.nextLesson}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Activity/Recent scores */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold tracking-tight flex items-center mb-4">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {RECENT_SCORES.map((score) => (
                    <div key={score.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold">
                          {score.score}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{score.title}</p>
                          <p className="text-xs text-muted-foreground">{score.date}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs font-normal">Graded</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (Tasks & Notifications) */}
        <div className="md:col-span-4 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="border-t-4 border-t-orange-500 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-orange-500" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ASSIGNMENTS.map((task) => (
                  <div key={task.id} className="group relative border rounded-lg p-3 hover:border-primary/50 hover:bg-muted/20 transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant={task.status === "Warning" ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0">
                        {task.course}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">{task.due}</span>
                    </div>
                    <p className="text-sm font-medium mt-1 group-hover:text-primary transition-colors">{task.title}</p>
                  </div>
                ))}
                
                <Button variant="ghost" className="w-full text-xs" size="sm">
                  View All Assignments
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Feed */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="w-4 h-4 mr-2 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">You earned 'First Blood' badge!</p>
                      <p className="text-xs text-muted-foreground mt-0.5">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New module unlocked in ASJ</p>
                      <p className="text-xs text-muted-foreground mt-0.5">5 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
