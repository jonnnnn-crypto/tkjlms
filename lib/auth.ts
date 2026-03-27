import { createClient } from "./supabase/server";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "teacher" | "student";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  xp: number;
  level: number;
}

export async function getUserSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) return null;
  return session;
}

export async function getUserProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;

  return profile as Profile;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!allowedRoles.includes(profile.role)) {
    redirect("/dashboard"); // Redirect to default dashboard or an "unauthorized" page
  }

  return profile;
}
