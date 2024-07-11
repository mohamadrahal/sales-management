import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import TargetSchema from "../../schemas/validationSchemas";
import { TargetType } from "@prisma/client"; // Adjust the path as needed
import { z } from "zod";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role } = decoded as { userId: number; role: string };
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const filter = url.searchParams.get("filter") || "team";

  try {
    const skip = (page - 1) * limit;
    const whereClause: any = {};

    if (role === "SalesManager") {
      whereClause.OR = [
        { team: { managerId: userId } },
        { individual: { team: { managerId: userId } } },
      ];
    } else if (role === "Salesman") {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        if (user.teamId !== null) {
          whereClause.OR = [
            { userId: userId },
            { teamId: { equals: user.teamId } },
          ];
        } else {
          whereClause.OR = [{ userId: userId }];
        }
      } else {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    }

    if (filter === "team") {
      whereClause.teamId = { not: null };
    } else if (filter === "salesman") {
      whereClause.userId = { not: null };
    }

    console.log(filter);

    const targets = await prisma.target.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        team: true,
        individual: true,
      },
    });

    const formattedTargets = targets.map((target) => ({
      ...target,
      periodFrom: formatDate(target.periodFrom),
      periodTo: formatDate(target.periodTo),
    }));

    const totalCount = await prisma.target.count({ where: whereClause });

    return NextResponse.json({ targets: formattedTargets, totalCount });
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
    console.log("Request body:", body);

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
      console.log(
        "Owner not found:",
        parsedBody.targetType,
        parsedBody.targetOwnerId
      );
      return NextResponse.json(
        { error: `${parsedBody.targetType} not found` },
        { status: 404 }
      );
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
      data.teamId = parsedBody.targetOwnerId;
      console.log("Assigning to team:", data.teamId);
    } else if (parsedBody.targetType === TargetType.Salesman) {
      data.userId = parsedBody.targetOwnerId;
      console.log("Assigning to salesman:", data.userId);
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
