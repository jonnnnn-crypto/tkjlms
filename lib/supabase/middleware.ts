import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Demo mode bypass — remove once Supabase is configured
  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path.startsWith("/teacher") ||
    path.startsWith("/courses") ||
    path.startsWith("/assignments") ||
    path.startsWith("/quiz") ||
    path.startsWith("/challenges") ||
    path.startsWith("/leaderboard");

  // Not logged in → redirect to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Logged in on auth route → redirect based on role
  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "student";
    const url = request.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin" : role === "teacher" ? "/teacher" : "/dashboard";
    return NextResponse.redirect(url);
  }

  // Logged in user accessing wrong role portal → redirect to correct one
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "student";

    const adminOnly = path.startsWith("/admin");
    const teacherOnly = path.startsWith("/teacher");

    if (adminOnly && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = role === "teacher" ? "/teacher" : "/dashboard";
      return NextResponse.redirect(url);
    }
    if (teacherOnly && role === "student") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
