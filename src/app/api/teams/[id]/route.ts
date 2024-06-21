import prisma from "../../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const id = parseInt(pathname.split("/").pop()!, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Team ID is invalid" }, { status: 400 });
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        salesmen: true, // Include related salesmen data
        _count: {
          select: { salesmen: true },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const teamWithSalesmenCount = {
      ...team,
      salesmenCount: team._count?.salesmen || 0,
    };

    return NextResponse.json(teamWithSalesmenCount, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch team details:", error);
    return NextResponse.json(
      { error: "Failed to fetch team details" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const id = parseInt(pathname.split("/").pop()!, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Team ID is invalid" }, { status: 400 });
  }

  try {
    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Team deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const id = parseInt(pathname.split("/").pop()!, 10);
  const body = await request.json();

  if (isNaN(id)) {
    return NextResponse.json({ error: "Team ID is invalid" }, { status: 400 });
  }

  try {
    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name: body.name,
        location: body.location,
      },
    });

    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    console.error("Failed to update team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}
