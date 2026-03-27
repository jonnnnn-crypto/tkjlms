"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Search, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface TopbarProps {
  userEmail?: string;
  userName?: string;
}

export function Topbar({ userEmail, userName }: TopbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border/40 bg-card z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden sm:block w-64 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search courses..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background"></span>
        </Button>
        <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block"></div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium leading-none">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]">
              {userEmail || "user@example.com"}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center font-semibold text-primary overflow-hidden">
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
