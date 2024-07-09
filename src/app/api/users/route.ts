import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "../../schemas/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const { role, teamIds = [], ...userData } = validation.data;
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  try {
    console.log(
      "Checking for existing user with mobile number:",
      userData.mobileNumber
    );
    const existingUser = await prisma.user.findUnique({
      where: { mobileNumber: userData.mobileNumber },
    });
    console.log("Existing user:", existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this mobile number already exists." },
        { status: 400 }
      );
    }

    if (role === "Admin") {
      if (teamIds.length > 0) {
        return NextResponse.json(
          { error: "Admin users should not be assigned to any team." },
          { status: 400 }
        );
      }

      console.log("Creating new Admin");
      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role,
        },
      });
      console.log("New Admin created:", newUser);
      return NextResponse.json(newUser, { status: 201 });
    }

    if (role === "SalesManager" && teamIds.length > 0) {
      console.log("Ensuring each team can only have one manager");
      const teamsWithManagers = await prisma.team.findMany({
        where: {
          id: { in: teamIds },
          managerId: { not: null },
        },
      });
      console.log("Teams with managers already assigned:", teamsWithManagers);

      if (teamsWithManagers.length > 0) {
        return NextResponse.json(
          { error: "One or more teams already have a manager assigned." },
          { status: 400 }
        );
      }

      console.log("Creating new SalesManager");
      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role,
        },
      });
      console.log("New user created:", newUser);

      // Assign the new user as the manager to the specified teams
      await prisma.team.updateMany({
        where: { id: { in: teamIds } },
        data: { managerId: newUser.id },
      });

      console.log("Teams updated with new manager ID");
      return NextResponse.json(newUser, { status: 201 });
    } else if (role === "Salesman" && teamIds.length === 1) {
      console.log("Creating new Salesman");
      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role,
          team: { connect: { id: teamIds[0] } },
        },
      });
      console.log("New Salesman created:", newUser);
      return NextResponse.json(newUser, { status: 201 });
    } else {
      return NextResponse.json(
        { error: "Invalid team assignment" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error occurred while creating user:", error);

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
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, userId } = decoded as { role: string; userId: number };

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;
  const searchTerm = searchParams.get("searchTerm") || "";
  const searchField = searchParams.get("searchField") || "";

  try {
    let users, totalCount;
    const whereClause: any = {};

    if (searchTerm && searchField) {
      if (searchField === "role") {
        whereClause[searchField] = searchTerm as UserRole;
      } else {
        whereClause[searchField] = {
          contains: searchTerm,
        };
      }
    }

    if (role === "Admin") {
      [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          skip: offset,
          take: limit,
          where: whereClause,
          include: {
            team: true,
            managedTeams: true,
          },
        }),
        prisma.user.count({ where: whereClause }),
      ]);
    } else if (role === "SalesManager") {
      const managedTeams = await prisma.team.findMany({
        where: { managerId: userId },
        select: { id: true },
      });

      const managedTeamIds = managedTeams.map((team) => team.id);

      whereClause.OR = [
        { teamId: { in: managedTeamIds } },
        { managedTeams: { some: { id: { in: managedTeamIds } } } },
      ];

      [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          skip: offset,
          take: limit,
          where: whereClause,
          include: {
            team: true,
            managedTeams: true,
          },
        }),
        prisma.user.count({ where: whereClause }),
      ]);
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ users, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
