import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import { generateContractReportPDF } from "../../../utils/contractReportPdfGenerator";
import jwt from "jsonwebtoken";

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
  const { secondSelect, lastSelect, periodFrom, periodTo } = await req.json();

  if (role !== "Admin" && role !== "SalesManager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const periodStart = new Date(periodFrom);
  const periodEnd = new Date(periodTo);

  try {
    let contracts;

    if (secondSelect === "period") {
      contracts = await prisma.contract.findMany({
        where: {
          createdAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        include: {
          salesman: true,
          branches: true,
        },
      });
    } else if (secondSelect === "salesman") {
      contracts = await prisma.contract.findMany({
        where: {
          salesmanId: Number(lastSelect),
          createdAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        include: {
          branches: true,
          salesman: true,
        },
      });
    } else if (secondSelect === "team") {
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
          branches: true,
          salesman: true,
        },
      });
    } else if (secondSelect === "branch") {
      contracts = await prisma.contract.findMany({
        where: {
          branches: {
            some: {
              id: Number(lastSelect),
            },
          },
          createdAt: {
            gte: periodStart,
            lte: periodEnd,
          },
        },
        include: {
          branches: true,
          salesman: true,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid filter type" },
        { status: 400 }
      );
    }

    const pdfPath = await generateContractReportPDF(contracts, {
      secondSelect,
      lastSelect,
      periodFrom,
      periodTo,
    });

    // Create a new report entry
    const report = await prisma.report.create({
      data: {
        type: "Contract",
        periodFrom: new Date(periodFrom),
        periodTo: new Date(periodTo),
      },
    });

    // Create contract reports for each contract
    await Promise.all(
      contracts.map((contract) =>
        prisma.contractReport.create({
          data: {
            contractId: contract.id,
            reportId: report.id,
            pdfPath,
          },
        })
      )
    );

    return NextResponse.json({ pdfPath }, { status: 201 });
  } catch (error) {
    console.error("Error issuing report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
