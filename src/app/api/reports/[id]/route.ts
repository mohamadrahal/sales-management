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
    console.error("Invalid token:", error);
    return null;
  }
};

const deleteFiles = (paths: string[]) => {
  paths.forEach((filePath) => {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), "public", filePath);
    console.log(`Attempting to delete file: ${fullPath}`);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`Deleted file: ${fullPath}`);
      } catch (error) {
        console.error(`Failed to delete file: ${fullPath}`, error);
      }
    } else {
      console.warn(`File not found: ${fullPath}`);
    }
  });
};

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    console.log("Unauthorized: No token provided");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    console.log("Unauthorized: Invalid token");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = decoded as { userId: number; role: string };
  const { id } = params;

  const reportId = parseInt(id, 10);

  if (role !== "Admin" && role !== "SalesManager") {
    console.log("Forbidden: Insufficient permissions");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!reportId) {
    console.log("Invalid report ID");
    return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
  }

  try {
    console.log(`Finding reports related to report ID: ${reportId}`);

    // Find the report to get the PDF and Excel paths
    const contractReports = await prisma.contractReport.findMany({
      where: {
        reportId: reportId,
      },
      select: {
        pdfPath: true,
        excelPath: true,
      },
    });

    const compensationReports = await prisma.compensationReport.findMany({
      where: {
        reportId: reportId,
      },
      select: {
        pdfPath: true,
        excelPath: true,
      },
    });

    console.log("Contract Reports:", contractReports);
    console.log("Compensation Reports:", compensationReports);

    if (contractReports.length === 0 && compensationReports.length === 0) {
      console.warn(
        "No contract or compensation reports found for the given report ID"
      );
    }

    const pdfPaths = [
      ...contractReports.map((report) => report.pdfPath),
      ...compensationReports.map((report) => report.pdfPath),
    ];

    const excelPaths = [
      ...contractReports.map((report) => report.excelPath),
      ...compensationReports.map((report) => report.excelPath),
    ];

    console.log("PDF Paths:", pdfPaths);
    console.log("Excel Paths:", excelPaths);

    // Ensure the arrays are not empty before attempting to delete files
    if (pdfPaths.length > 0) {
      console.log("Deleting PDF files...");
      deleteFiles(pdfPaths);
    } else {
      console.log("No PDF files to delete.");
    }

    if (excelPaths.length > 0) {
      console.log("Deleting Excel files...");
      deleteFiles(excelPaths);
    } else {
      console.log("No Excel files to delete.");
    }

    // Ensure the files are deleted before proceeding
    pdfPaths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        throw new Error(`Failed to delete PDF file: ${filePath}`);
      }
    });

    excelPaths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        throw new Error(`Failed to delete Excel file: ${filePath}`);
      }
    });

    // Delete related contract and compensation reports
    console.log("Deleting contract reports from database...");
    await prisma.contractReport.deleteMany({
      where: {
        reportId: reportId,
      },
    });

    console.log("Deleting compensation reports from database...");
    await prisma.compensationReport.deleteMany({
      where: {
        reportId: reportId,
      },
    });

    // Delete the report
    console.log("Deleting report from database...");
    await prisma.report.delete({
      where: {
        id: reportId,
      },
    });

    console.log("Report and associated files deleted successfully");
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
