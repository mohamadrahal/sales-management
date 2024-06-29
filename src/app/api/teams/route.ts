import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { teamSchema } from "@/app/schemas/teamSchema";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    const [teams, totalCount] = await Promise.all([
      prisma.team.findMany({
        skip: offset,
        take: limit,
        include: {
          _count: {
            select: { salesmen: true },
          },
        },
      }),
      prisma.team.count(),
    ]);

    const teamsWithSalesmenCount = teams.map((team) => ({
      ...team,
      salesmenCount: team._count?.salesmen || 0,
    }));

    return NextResponse.json(
      { teams: teamsWithSalesmenCount, totalCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = decoded as { role: string };
  if (role !== "Admin" && role !== "SalesManager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const validation = teamSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newTeam = await prisma.team.create({
    data: { name: body.name, location: body.location },
  });

  return NextResponse.json(newTeam, { status: 201 });
}
