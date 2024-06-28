import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
