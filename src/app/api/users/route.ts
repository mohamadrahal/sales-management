import prisma from "../../../../prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/app/schemas/userSchema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const newUser = await prisma.user.create({
    data: validation.data,
  });

  return NextResponse.json(newUser, { status: 201 });
}
