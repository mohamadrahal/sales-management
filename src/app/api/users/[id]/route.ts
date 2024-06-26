import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const userId = parseInt(id, 10);

  try {
    // Find all contracts related to the user
    const contracts = await prisma.contract.findMany({
      where: { salesmanId: userId },
    });

    // Delete all branches related to the contracts
    for (const contract of contracts) {
      await prisma.branch.deleteMany({
        where: { contractId: contract.id },
      });
    }

    // Delete all contracts related to the user
    await prisma.contract.deleteMany({
      where: { salesmanId: userId },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
