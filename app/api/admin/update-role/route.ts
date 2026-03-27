import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    // 1. Verify caller is an Admin using standard middleware session checker
    const res = await updateSession(request);
    
    // To ensure admin access, we must verify their profile role here manually. 
    // We create a standard client using the session cookies:
    const cookieStore = require("next/headers").cookies;
    const { createServerClient } = require("@supabase/ssr");
    
    const standardClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore().getAll(); },
          setAll() {},
        },
      }
    );
    
    // Check if the current user requesting the role change is an admin
    const { data: { user } } = await standardClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { data: profile } = await standardClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    // 2. We're clear. Get the target user context
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["admin", "teacher", "student"].includes(role)) {
       return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    // 3. Perform the update with the high-privilege Service Role Key
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await serviceClient
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error: any) {
    console.error("Failed to update role:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
