import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export async function DELETE(
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

  const { role } = decoded as { userId: number; role: string };
  const { id } = params;

  const reportId = parseInt(id, 10);

  if (role !== "Admin" && role !== "SalesManager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!reportId) {
    return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
  }

  try {
    // Find the report to get the PDF and Excel paths
    const contractReports = await prisma.contractReport.findMany({
      where: {
        reportId: reportId,
      },
    });

    const compensationReports = await prisma.compensationReport.findMany({
      where: {
        reportId: reportId,
      },
    });

    const pdfPaths = [
      ...contractReports.map((report) => report.pdfPath),
      ...compensationReports.map((report) => report.pdfPath),
    ];

    const excelPaths = [
      ...contractReports.map((report) => report.excelPath),
      ...compensationReports.map((report) => report.excelPath),
    ];

    // Delete related contract and compensation reports
    await prisma.contractReport.deleteMany({
      where: {
        reportId: reportId,
      },
    });

    await prisma.compensationReport.deleteMany({
      where: {
        reportId: reportId,
      },
    });

    // Delete the report
    await prisma.report.delete({
      where: {
        id: reportId,
      },
    });

    // Delete the PDF and Excel files from the filesystem
    [...pdfPaths, ...excelPaths].forEach((filePath) => {
      const fullPath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), "public", "reports", filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (error) {
          console.error(`Failed to delete file: ${fullPath}`, error);
        }
      } else {
        console.warn(`File not found: ${fullPath}`);
      }
    });

    return NextResponse.json(
      { message: "Report and associated files deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete report:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
