// src/pages/api/teams/index.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role } = decoded as { userId: number; role: string };

  try {
    let teams;
    if (role === "Admin") {
      teams = await prisma.team.findMany({
        select: { id: true, name: true },
      });
    } else if (role === "SalesManager") {
      teams = await prisma.team.findMany({
        where: { managerId: userId },
        select: { id: true, name: true },
      });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
