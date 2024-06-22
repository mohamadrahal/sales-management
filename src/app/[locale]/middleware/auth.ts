// middleware/auth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL(`/${req.nextUrl.locale}/login`, req.url)
    );
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(
      new URL(`/${req.nextUrl.locale}/login`, req.url)
    );
  }
}

export const authConfig = {
  matcher: ["/:locale/home/:path*"],
};
