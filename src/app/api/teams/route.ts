import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { teamSchema } from "@/app/schemas/teamSchema";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        _count: {
          select: { salesmen: true },
        },
      },
    });

    // Map the response to include the count of salesmen
    const teamsWithSalesmenCount = teams.map((team) => ({
      ...team,
      salesmenCount: team._count?.salesmen || 0,
    }));

    return NextResponse.json(teamsWithSalesmenCount, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
