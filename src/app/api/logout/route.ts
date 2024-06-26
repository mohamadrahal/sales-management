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

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
