import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { contractSchema } from "@/app/schemas/contractSchema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = contractSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  try {
    const newContract = await prisma.contract.create({
      data: {
        salesmanId: body.salesmanId,
        type: body.type,
        companyName: body.companyName,
        businessType: body.businessType,
        ownerName: body.ownerName,
        ownerMobileNumber: body.ownerMobileNumber,
        companyMobileNumber: body.companyMobileNumber,
        contactPersonName: body.contactPersonName,
        contactPersonMobileNumber: body.contactPersonMobileNumber,
        bcdAccountNumber: body.bcdAccountNumber,
        numberOfBranches: body.numberOfBranches,
        documentPath: body.documentPath,
        status: body.status,
        branches: {
          create: body.branches,
        },
      },
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    console.error("Failed to create contract:", error);
    return NextResponse.json(
      { error: "Failed to create contract" },
      { status: 500 }
    );
  }
}
