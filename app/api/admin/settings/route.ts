import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET: fetch current settings
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.from("system_settings").select("*");
  const settings: Record<string, string> = {};
  data?.forEach((s: { key: string; value: string }) => { settings[s.key] = s.value; });
  return NextResponse.json(settings);
}

// PATCH: update a setting (admin only)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const admin = createAdminClient();

  for (const [key, value] of Object.entries(body)) {
    await admin.from("system_settings").update({ value: String(value), updated_at: new Date().toISOString() }).eq("key", key);
  }

  return NextResponse.json({ success: true });
}
