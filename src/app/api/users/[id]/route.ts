import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from "jsonwebtoken";

// Secret key for JWT verification, you should store this in your environment variables
const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role: userRole, id: authUserId } = decoded as {
    role: string;
    id: number;
  };

  const { id } = params;
  const userId = parseInt(id);

  if (isNaN(userId) || userId <= 0) {
    return NextResponse.json(
      { error: "Invalid or missing user ID" },
      { status: 400 }
    );
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        managedTeams: true,
        team: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Authorization checks
    if (
      userRole === "SalesManager" &&
      (user.role === "Admin" || user.role === "SalesManager")
    ) {
      return NextResponse.json(
        {
          error: "Forbidden: SalesManager cannot delete Admin or SalesManager",
        },
        { status: 403 }
      );
    }

    // Handle disassociating the user from managed teams and their own team
    await prisma.$transaction(async (prisma) => {
      if (user.managedTeams.length > 0) {
        for (const team of user.managedTeams) {
          await prisma.team.update({
            where: { id: team.id },
            data: { managerId: null },
          });
        }
      }

      if (user.team) {
        await prisma.user.update({
          where: { id: user.id },
          data: { teamId: null },
        });
      }

      // Delete the user
      await prisma.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred while deleting user:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role: userRole } = decoded as {
    role: string;
  };

  const { id } = params;
  const userId = parseInt(id);

  if (isNaN(userId) || userId <= 0) {
    return NextResponse.json(
      { error: "Invalid or missing user ID" },
      { status: 400 }
    );
  }

  try {
    const userData = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error occurred while updating user:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the user" },
      { status: 500 }
    );
  }
}
