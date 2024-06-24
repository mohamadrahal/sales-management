// pages/api/logout.ts
import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

export async function POST(req: NextRequest) {
  try {
    const { locale } = await req.json();

    if (!locale) {
      return NextResponse.json(
        { error: "Locale is required" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ message: "Logout successful" });
    response.headers.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
        path: "/",
      })
    );

    // Construct the absolute URL for redirection
    const url = new URL(req.url);
    const redirectUrl = `${url.protocol}//${url.host}/${locale}/login`;

    // Redirect to the locale-specific login page
    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.headers.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0),
        path: "/",
      })
    );

    return redirectResponse;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
