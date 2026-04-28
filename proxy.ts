// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const locales = ["en", "ar"];
// const defaultLocale = "en";

// export function proxy(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     // Check if the pathname is missing a locale
//     const pathnameHasLocale = locales.some(
//         (locale) =>
//             pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//     );

//     if (!pathnameHasLocale) {
//         // Redirect to default locale
//         return NextResponse.redirect(
//             new URL(`/${defaultLocale}${pathname}`, request.url)
//         );
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
// };

// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ar"];
const defaultLocale = "en";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── 1. i18n: strip locale prefix to work with bare pathname ──
    const pathnameLocale = locales.find(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );
    const barePath = pathnameLocale
        ? pathname.slice(`/${pathnameLocale}`.length) || "/"
        : pathname;

    // ── 2. i18n: redirect if no locale prefix ──
    if (!pathnameLocale) {
        return NextResponse.redirect(
            new URL(`/${defaultLocale}${pathname}`, request.url),
        );
    }

    // ── 3. Supabase: refresh session on every request ──
    const response = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) =>
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options),
                    ),
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const locale = pathnameLocale;

    // ── 4. Auth: protect /[locale]/admin/* ──
    if (barePath.startsWith("/admin") && barePath !== "/admin/login") {
        if (!user) {
            return NextResponse.redirect(
                new URL(`/${locale}/admin/login`, request.url),
            );
        }
    }

    // ── 5. Auth: skip login page if already signed in ──
    if (barePath === "/admin/login" && user) {
        return NextResponse.redirect(
            new URL(`/${locale}/admin/dashboard`, request.url),
        );
    }

    return response;
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
