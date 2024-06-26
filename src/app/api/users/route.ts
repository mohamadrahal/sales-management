import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/app/schemas/userSchema";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(validation.data.password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        ...validation.data,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
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
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({ users, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
