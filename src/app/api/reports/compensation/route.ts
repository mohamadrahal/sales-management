// src/app/api/reports/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from "jsonwebtoken";
import {
  generatePDF,
  generateExcel,
} from "../../../utils/compensationReportGenerator"; // Utility functions to generate PDF and Excel

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

    let target;
    let contracts;

    if (secondSelect === "team") {
      target = await prisma.target.findFirst({
        where: {
          teamId: Number(lastSelect),
          periodFrom: periodStart,
          periodTo: periodEnd,
        },
      });

      contracts = await prisma.contract.findMany({
        where: {
          salesman: {
            teamId: Number(lastSelect),
          },
          createdAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        include: {
          salesman: true,
        },
      });
    } else {
      target = await prisma.target.findFirst({
        where: {
          userId: Number(lastSelect),
          periodFrom: periodStart,
          periodTo: periodEnd,
        },
        include: {
          individual: true, // Include the individual property
        },
      });

      contracts = await prisma.contract.findMany({
        where: {
          salesmanId: Number(lastSelect),
          createdAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        include: {
          salesman: true,
        },
      });
    }

    if (!target) {
      return NextResponse.json(
        { error: "Target not found for the given period" },
        { status: 404 }
      );
    }

    // Check if target is achieved
    const targetAchieved = contracts.length >= target.numberOfContracts;

    // Generate the PDF report
    const pdfPath = await generatePDF(contracts, target, targetAchieved);

    // Generate the Excel report
    const excelPath = await generateExcel(contracts, target, targetAchieved);

    // Prepare data for compensation report creation
    const compensationReportData: any = {
      report: {
        create: {
          type: "Compensation",
          periodFrom: periodStart,
          periodTo: periodEnd,
        },
      },
      amountPaid: target.totalAmountLYD,
      bonusAmount: target.bonusAmount,
      pdfPath,
      excelPath,
    };

    if (secondSelect === "team") {
      compensationReportData.team = { connect: { id: Number(lastSelect) } };
    } else {
      compensationReportData.salesman = { connect: { id: Number(lastSelect) } };
    }

    // Save the report in the database
    const report = await prisma.compensationReport.create({
      data: compensationReportData,
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
