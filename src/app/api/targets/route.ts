// api/targets.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { TargetSchema } from "../../schemas/validationSchemas";
import { TargetType } from "@prisma/client"; // Adjust the path as needed
import { z } from "zod";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    const [targets, totalCount] = await Promise.all([
      prisma.target.findMany({
        skip: offset,
        take: limit,
        include: {
          team: true,
          individual: true,
        },
      }),
      prisma.target.count(),
    ]);

    return NextResponse.json({ targets, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch targets:", error);
    return NextResponse.json(
      { error: "Failed to fetch targets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const parsedBody = TargetSchema.parse(body);

    // Check if the owner exists based on targetType
    if (parsedBody.targetType === "Team") {
      const teamExists = await prisma.team.findUnique({
        where: { id: parsedBody.targetOwnerId },
      });
      if (!teamExists) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
    } else if (parsedBody.targetType === "Salesman") {
      const userExists = await prisma.user.findUnique({
        where: { id: parsedBody.targetOwnerId },
      });
      if (!userExists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    // Create new target
    const newTarget = await prisma.target.create({
      data: {
        targetOwnerId: parsedBody.targetOwnerId,
        periodFrom: new Date(parsedBody.periodFrom),
        periodTo: new Date(parsedBody.periodTo),
        targetType: parsedBody.targetType,
        numberOfContracts: parsedBody.numberOfContracts,
        totalAmountLYD: parsedBody.totalAmountLYD,
        bonusAmount: parsedBody.bonusAmount || null,
      },
    });

    return NextResponse.json(newTarget);
  } catch (error) {
    console.error("Error creating target:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
