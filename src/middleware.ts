// middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./app/[locale]/middleware/auth"; // Adjust the import path

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect to the login page if the pathname is root
  if (pathname === "/") {
    const locale = req.cookies.get("NEXT_LOCALE")?.value || "en"; // Default to 'en' if no locale cookie is set
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Skip authentication and locale handling for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle authentication for protected routes
  if (pathname.startsWith(`/${req.nextUrl.locale}/home`)) {
    const authResponse = await authMiddleware(req);
    if (authResponse.status === 307) {
      return authResponse;
    }
  }

  // Use the next-intl middleware for locale handling
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/:locale/login", "/:locale/home/:path*"],
};
