import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { teamSchema } from "@/app/schemas/teamSchema";

export async function GET() {
  const teams = await prisma.team.findMany();
  return NextResponse.json(teams, { status: 200 });
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
