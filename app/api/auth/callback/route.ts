import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [] // Not needed for the callback exchange (cookies handled inside `exchangeCodeForSession`)
          },
          setAll(cookiesToSet) {
            // Not needed for the callback exchange
          },
        },
      }
    )
    
    // We can't use `setAll` in the Route Handler like we do in Middleware, because request/response 
    // context is different. We exchange the code, and then let Middleware handle session persistence 
    // on subsequent requests. But `exchangeCodeForSession` automatically creates cookies on the client 
    // side on redirection. Let's use standard cookie management:
    
    // Actually, following Supabase SSR docs:
    const cookieStore = require('next/headers').cookies
    const cookieClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore().getAll()
          },
          setAll(cookiesToSet: any[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore().set(name, value, options)
              )
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { error } = await cookieClient.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid+Google+Auth+Code`)
}
