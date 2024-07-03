// src/app/api/teams/managed-by/[id].ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const salesManagerId = parseInt(params.id);

  try {
    const teams = await prisma.team.findMany({
      where: { managerId: salesManagerId },
      select: { id: true, name: true },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Failed to fetch teams managed by Sales Manager:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
