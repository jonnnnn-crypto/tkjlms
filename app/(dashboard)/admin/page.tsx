import { createClient } from "@/lib/supabase/server";
import UserManagement from "@/components/admin/user-management";
import AdminSettings from "@/components/admin/admin-settings";

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch all users
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, xp, level, created_at")
    .order("created_at", { ascending: false });

  // Fetch stats
  const { count: courseCount } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true });

  // Fetch system settings
  const { data: settingsRows } = await supabase
    .from("system_settings")
    .select("key, value");

  const settings: Record<string, string> = {};
  settingsRows?.forEach((s: { key: string; value: string }) => { settings[s.key] = s.value; });

  const stats = {
    totalUsers: users?.length ?? 0,
    totalTeachers: users?.filter((u: { role: string }) => u.role === "teacher").length ?? 0,
    totalCourses: courseCount ?? 0,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <UserManagement users={users ?? []} stats={stats} />
      <AdminSettings initialSettings={settings} />
    </div>
  );
}
