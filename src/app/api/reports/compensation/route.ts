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
    console.error("Invalid token:", error);
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
    periodStart.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00

    const periodEnd = new Date(periodTo);
    periodEnd.setUTCHours(23, 59, 59, 999); // Set time to 23:59:59

    let target;
    let contracts;

    if (secondSelect === "team") {
      target = await prisma.target.findFirst({
        where: {
          teamId: Number(lastSelect),
          periodFrom: {
            gte: periodStart,
          },
          periodTo: {
            lte: periodEnd,
          },
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
          periodFrom: {
            gte: periodStart,
          },
          periodTo: {
            lte: periodEnd,
          },
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

    // Calculate amount paid for salesman reports
    let amountPaid;
    if (secondSelect === "team") {
      amountPaid = target.totalAmountLYD;
    } else {
      amountPaid = contracts.length * (target.amountPerContract || 0);
    }

    // Generate the PDF report
    const pdfPath = await generatePDF(
      contracts,
      target,
      targetAchieved,
      amountPaid
    );

    // Generate the Excel report
    const excelPath = await generateExcel(
      contracts,
      target,
      targetAchieved,
      amountPaid
    );

    // Prepare data for compensation report creation
    const compensationReportData: any = {
      report: {
        create: {
          type: "Compensation",
          periodFrom: periodStart,
          periodTo: periodEnd,
        },
      },
      bonusAmount: target.bonusAmount,
      pdfPath,
      excelPath,
      amountPaid,
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
