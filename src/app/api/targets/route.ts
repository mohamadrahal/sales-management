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
    console.log("Parsed body:", parsedBody);

    // Check if the owner exists based on targetType
    let ownerExists;
    if (parsedBody.targetType === TargetType.Team) {
      ownerExists = await prisma.team.findUnique({
        where: { id: parsedBody.targetOwnerId },
      });
      console.log("Owner (Team) exists:", ownerExists);
    } else if (parsedBody.targetType === TargetType.Salesman) {
      ownerExists = await prisma.user.findUnique({
        where: { id: parsedBody.targetOwnerId },
      });
      console.log("Owner (Salesman) exists:", ownerExists);
    }

    if (!ownerExists) {
      return NextResponse.json({ error: `${parsedBody.targetType} not found` }, { status: 404 });
    }

    // Create new target
    const data: any = {
      periodFrom: new Date(parsedBody.periodFrom),
      periodTo: new Date(parsedBody.periodTo),
      targetType: parsedBody.targetType,
      numberOfContracts: parsedBody.numberOfContracts,
      totalAmountLYD: parsedBody.totalAmountLYD,
      bonusAmount: parsedBody.bonusAmount || null,
    };

    if (parsedBody.targetType === TargetType.Team) {
      data.team = { connect: { id: parsedBody.targetOwnerId } };
      console.log("Assigning to team:", data.team);
    } else if (parsedBody.targetType === TargetType.Salesman) {
      data.individual = { connect: { id: parsedBody.targetOwnerId } };
      console.log("Assigning to salesman:", data.individual);
    }

    const newTarget = await prisma.target.create({ data });
    console.log("New target created:", newTarget);

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