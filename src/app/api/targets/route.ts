// api/targets.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    const [targets, totalCount] = await Promise.all([
      prisma.target.findMany({
        skip: offset,
        take: limit,
        include: {
          team: true,
          individual: true,
        },
      }),
      prisma.target.count(),
    ]);

    return NextResponse.json({ targets, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch targets:", error);
    return NextResponse.json(
      { error: "Failed to fetch targets" },
      { status: 500 }
    );
  }
}
