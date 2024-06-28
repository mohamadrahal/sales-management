import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "../../schemas/userSchema";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { role, teamIds = [], ...userData } = validation.data;
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  try {
    // Check if a user with the same mobile number already exists
    const existingUser = await prisma.user.findUnique({
      where: { mobileNumber: userData.mobileNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this mobile number already exists." },
        { status: 400 }
      );
    }

    if (role === "SalesManager" && teamIds.length > 0) {
      // Ensure each team can only have one manager
      const teamsWithManagers = await prisma.team.findMany({
        where: {
          id: { in: teamIds },
          managerId: { not: null },
        },
      });

      if (teamsWithManagers.length > 0) {
        return NextResponse.json(
          { error: "One or more teams already have a manager assigned." },
          { status: 400 }
        );
      }

      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role,
          managedTeams: {
            connect: teamIds.map((id: number) => ({ id })),
          },
        },
      });

      // Update each team to set the new user as the manager
      await prisma.team.updateMany({
        where: { id: { in: teamIds } },
        data: { managerId: newUser.id },
      });

      return NextResponse.json(newUser, { status: 201 });
    } else if (role === "Salesman" && teamIds.length === 1) {
      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role,
          team: { connect: { id: teamIds[0] } },
        },
      });

      return NextResponse.json(newUser, { status: 201 });
    } else {
      return NextResponse.json(
        { error: "Invalid team assignment" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    if (error.code === "P2002") {
      // Unique constraint failed
      return NextResponse.json(
        {
          error: `A user with this ${
            error.meta.target.includes("username")
              ? "username"
              : "mobile number"
          } already exists.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while creating the user." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        skip: offset,
        take: limit,
        include: {
          team: true,
          managedTeams: true, // Include managed teams
        },
      }),
      prisma.user.count(),
    ]);

    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ users, totalCount, teams }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
