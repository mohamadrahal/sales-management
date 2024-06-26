// pages/api/branches/index.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    const [branches, totalCount] = await Promise.all([
      prisma.branch.findMany({
        skip: offset,
        take: limit,
        include: {
          contract: true,
        },
      }),
      prisma.branch.count(),
    ]);

    return NextResponse.json({ branches, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, name, phone, city, locationX, locationY } = body;

    // Convert contractId to an integer
    const parsedContractId = parseInt(contractId, 10);
    const parsedLocationX = parseFloat(locationX);
    const parsedLocationY = parseFloat(locationY);

    if (isNaN(parsedContractId)) {
      return NextResponse.json(
        { error: "Invalid contract ID. Must be an integer." },
        { status: 400 }
      );
    }

    // Check if the contract exists
    const contractExists = await prisma.contract.findUnique({
      where: { id: parsedContractId },
    });

    if (!contractExists) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Create the new branch
    const newBranch = await prisma.branch.create({
      data: {
        contractId: parsedContractId,
        name,
        phone,
        city,
        locationX: parsedLocationX,
        locationY: parsedLocationY,
      },
    });

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error("Failed to create branch:", error);
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
