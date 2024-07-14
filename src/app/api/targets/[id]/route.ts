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

  const targetId = parseInt(id, 10);

  if (role !== "Admin" && role !== "SalesManager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!targetId) {
    return NextResponse.json({ error: "Invalid target ID" }, { status: 400 });
  }

  try {
    // Fetch the target
    const target = await prisma.target.findUnique({
      where: { id: targetId },
      include: {
        team: true,
        individual: true,
      },
    });

    if (!target) {
      return NextResponse.json({ error: "Target not found" }, { status: 404 });
    }

    // Fetch related compensation reports
    const compensationReports = await prisma.compensationReport.findMany({
      where: {
        OR: [
          { teamId: target.teamId ?? undefined },
          { salesmanId: target.userId ?? undefined },
        ],
      },
    });

    const pdfPaths = compensationReports.map((report) => report.pdfPath);
    const excelPaths = compensationReports.map((report) => report.excelPath);

    // Delete related compensation reports from the database
    const deletedCompensationReports =
      await prisma.compensationReport.deleteMany({
        where: {
          OR: [
            { teamId: target.teamId ?? undefined },
            { salesmanId: target.userId ?? undefined },
          ],
        },
      });

    // Delete the target
    await prisma.target.delete({
      where: {
        id: targetId,
      },
    });

    // Delete the PDF and Excel files from the filesystem
    const filePaths = [...pdfPaths, ...excelPaths];
    filePaths.forEach((filePath) => {
      const fullPath = path.isAbsolute(filePath)
        ? filePath
        : path.join(process.cwd(), "public", filePath);
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

    // Check if any of the reports are now orphaned and should be deleted
    const orphanedReportIds = compensationReports.map(
      (report) => report.reportId
    );

    for (const reportId of orphanedReportIds) {
      const compensationReportCount = await prisma.compensationReport.count({
        where: { reportId },
      });
      const contractReportCount = await prisma.contractReport.count({
        where: { reportId },
      });

      if (compensationReportCount === 0 && contractReportCount === 0) {
        await prisma.report.delete({ where: { id: reportId } });
      }
    }

    return NextResponse.json(
      {
        message:
          "Target and associated compensation reports deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete target:", error);
    return NextResponse.json(
      { error: "Failed to delete target" },
      { status: 500 }
    );
  }
}
