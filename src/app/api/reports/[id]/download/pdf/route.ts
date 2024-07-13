// src/app/api/reports/[id]/download/pdf/route.ts
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

    // Determine the PDF path
    let pdfPath: string | undefined;
    if (report.compensationReports.length > 0) {
      pdfPath = report.compensationReports[0].pdfPath;
    } else if (report.contractReports.length > 0) {
      pdfPath = report.contractReports[0].pdfPath;
    } else {
      return NextResponse.json(
        { error: "No associated PDF found" },
        { status: 404 }
      );
    }

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { error: "PDF file not found" },
        { status: 404 }
      );
    }

    const file = fs.readFileSync(pdfPath);
    const response = new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=report-${reportId}.pdf`,
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to fetch report PDF:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
