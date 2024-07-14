// src/app/api/availableTargets/route.ts
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
    let teams: { id: number; name: string }[] = [];
    let salesmen: { id: number; name: string }[] = [];

    if (role === "SalesManager") {
      teams = await prisma.team.findMany({
        where: { managerId: userId },
        select: { id: true, name: true },
      });

      salesmen = await prisma.user.findMany({
        where: { teamId: { in: teams.map((team) => team.id) } },
        select: { id: true, name: true },
      });
    } else if (role === "Admin") {
      teams = await prisma.team.findMany({
        select: { id: true, name: true },
      });
      salesmen = await prisma.user.findMany({
        where: { role: "Salesman" },
        select: { id: true, name: true },
      });
    }

    return NextResponse.json({ teams, salesmen });
  } catch (error) {
    console.error("Failed to fetch available targets:", error);
    return NextResponse.json(
      { error: "Failed to fetch available targets" },
      { status: 500 }
    );
  }
}
