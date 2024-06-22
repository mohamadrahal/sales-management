import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "ar"],
  // Used when no locale matches
  defaultLocale: "en",
});

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect to the login page if the pathname is root
  if (pathname === "/") {
    const locale = req.cookies.get("NEXT_LOCALE")?.value || "en"; // Default to 'en' if no locale cookie is set
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Use the next-intl middleware for locale handling
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en)/:path*"],
};
