import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Demo mode: return a stub client when Supabase is not configured
  if (!url || !key) {
    return {
      auth: {
        signOut: async () => {},
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as any;
  }

  return createBrowserClient(url, key);
}
