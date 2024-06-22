// middleware/auth.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Define the handler type
type Handler = (req: NextRequest, res: NextResponse) => Promise<NextResponse>;

// Extend the NextRequest type to include user property
declare module "next/server" {
  interface NextRequest {
    user?: any;
  }
}

export function withAuth(handler: Handler) {
  return async (req: NextRequest, res: NextResponse) => {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect("/login");
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return handler(req, res);
    } catch (err) {
      return NextResponse.redirect("/login");
    }
  };
}
