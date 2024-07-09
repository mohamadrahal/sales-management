import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from "jsonwebtoken";
import { generatePDF } from "../../../utils/pdfGenerator"; // Utility function to generate PDF
import { Target } from "@prisma/client";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, role } = decoded as { userId: number; role: string };
  const { reportType, secondSelect, lastSelect, periodFrom, periodTo } =
    await req.json();

  if (role !== "Admin" && role !== "SalesManager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const periodStart = new Date(periodFrom);
    const periodEnd = new Date(periodTo);

    console.log("Selected Period Start:", periodStart);
    console.log("Selected Period End:", periodEnd);

    // Verify if the salesman has achieved the target
    const target = await prisma.target.findFirst({
      where: {
        userId: Number(lastSelect),
        periodFrom: periodStart,
        periodTo: periodEnd,
      },
      include: {
        individual: true, // Include the individual property
      },
    });

    console.log("Found Target:", target);

    if (!target) {
      return NextResponse.json(
        { error: "Target not found for the given period" },
        { status: 404 }
      );
    }

    const contracts = await prisma.contract.findMany({
      where: {
        salesmanId: Number(lastSelect),
        createdAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
    });

    console.log("Contracts Found:", contracts);

    if (contracts.length < target.numberOfContracts) {
      return NextResponse.json(
        { error: "Target not achieved" },
        { status: 400 }
      );
    }

    // Generate the PDF report
    const pdfPath = await generatePDF(contracts, target as Target);

    // Save the report in the database
    const report = await prisma.compensationReport.create({
      data: {
        report: {
          create: {
            type: "Compensation",
            periodFrom: periodStart,
            periodTo: periodEnd,
          },
        },
        salesman: {
          connect: {
            id: Number(lastSelect),
          },
        },
        amountPaid: target.totalAmountLYD,
        bonusAmount: target.bonusAmount,
        pdfPath,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Error issuing report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
