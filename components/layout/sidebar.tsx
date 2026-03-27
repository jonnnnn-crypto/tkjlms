"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Trophy,
  Target,
  Settings,
  ShieldAlert,
  Users
} from "lucide-react";

interface SidebarProps {
  role?: "admin" | "teacher" | "student" | string;
}

export function Sidebar({ role = "student" }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["student"] },
    { name: "Dashboard", href: "/teacher", icon: LayoutDashboard, roles: ["teacher"] },
    { name: "Dashboard", href: "/admin", icon: ShieldAlert, roles: ["admin"] },
    
    { name: "Courses", href: "/courses", icon: BookOpen, roles: ["student", "teacher", "admin"] },
    { name: "Assignments", href: "/assignments", icon: ClipboardList, roles: ["student", "teacher"] },
    
    { name: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
    
    { name: "Challenges", href: "/challenges", icon: Target, roles: ["student", "teacher", "admin"] },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy, roles: ["student"] },
  ];

  const filteredLinks = links.filter((link) => link.roles.includes(role));

  return (
    <aside className="w-64 border-r bg-card hidden md:block flex-shrink-0">
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <div className="w-8 h-8 bg-primary/10 flex items-center justify-center rounded-lg mr-3 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          </div>
          <span className="font-bold tracking-tight text-lg">TJKT LMS</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border/40">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
