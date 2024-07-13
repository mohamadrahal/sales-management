// src/app/api/reports/[id]/download/excel/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../../prisma/client";
import jwt from "jsonwebtoken";
import fs from "fs";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reportId = parseInt(params.id, 10);

  try {
    // Fetch the report
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        compensationReports: true,
        contractReports: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Determine the Excel path
    let excelPath: string | undefined;
    if (report.compensationReports.length > 0) {
      excelPath = report.compensationReports[0].excelPath;
    } else if (report.contractReports.length > 0) {
      excelPath = report.contractReports[0].excelPath;
    } else {
      return NextResponse.json(
        { error: "No associated Excel file found" },
        { status: 404 }
      );
    }

    if (!excelPath || !fs.existsSync(excelPath)) {
      return NextResponse.json(
        { error: "Excel file not found" },
        { status: 404 }
      );
    }

    const file = fs.readFileSync(excelPath);
    const response = new NextResponse(file, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=report-${reportId}.xlsx`,
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to fetch report Excel file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
