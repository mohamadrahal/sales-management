import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id);
  const { action } = await req.json();

  if (!id || !action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const contract = await prisma.contract.findUnique({
      where: { id: Number(id) },
      include: { branches: true },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    console.log(contract.branches.length);

    if (action === "approve") {
      if (contract.branches.length === 0) {
        return NextResponse.json(
          { error: "Cannot approve contract with no branches" },
          { status: 400 }
        );
      }

      const updatedContract = await prisma.contract.update({
        where: { id: Number(id) },
        data: { status: "Approved" },
      });

      return NextResponse.json(updatedContract, { status: 200 });
    } else if (action === "decline") {
      const updatedContract = await prisma.contract.update({
        where: { id: Number(id) },
        data: { status: "Declined" },
      });

      return NextResponse.json(updatedContract, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error(`Failed to ${action} contract:`, error);
    return NextResponse.json(
      { error: "Failed to update contract" },
      { status: 500 }
    );
  }
}
