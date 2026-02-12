import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response = NextResponse.next({
                            request: { headers: request.headers },
                        })
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // ─── Protect /dashboard/* routes ─────────────────────────────────────────
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        // Allow unauthenticated access to the login page
        if (request.nextUrl.pathname === '/dashboard/login') {
            // If already logged in, redirect away from login
            if (session) {
                return NextResponse.redirect(new URL('/dashboard', request.url))
            }
            return response
        }

        // Everything else under /dashboard requires a session
        if (!session) {
            return NextResponse.redirect(new URL('/dashboard/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all routes except static assets:
         * _next/static, _next/image, favicon.ico, images
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
