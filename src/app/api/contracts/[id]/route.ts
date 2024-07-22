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

const deleteUploadedFiles = (paths: string[]) => {
  paths.forEach((filePath) => {
    const fullPath = path.join(process.cwd(), "public", filePath);
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

const deleteReportFiles = (paths: string[]) => {
  paths.forEach((filePath) => {
    console.log(`Attempting to delete file: ${filePath}`);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (error) {
        console.error(`Failed to delete file: ${filePath}`, error);
      }
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  });
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const contractId = parseInt(id, 10);

  if (!contractId) {
    return NextResponse.json({ error: "Invalid contract ID" }, { status: 400 });
  }

  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        branches: true,
        salesman: true,
        contractReports: true,
        documents: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contract, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch contract:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

  if (role !== "Admin" && role !== "SalesManager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  const contractId = parseInt(id, 10);

  if (!contractId) {
    return NextResponse.json({ error: "Invalid contract ID" }, { status: 400 });
  }

  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { salesman: true, documents: true },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    const relatedReports = await prisma.report.findMany({
      where: {
        OR: [
          {
            periodFrom: { lte: contract.createdAt },
            periodTo: { gte: contract.createdAt },
          },
        ],
      },
      include: {
        contractReports: {
          include: {
            contracts: {
              where: { id: contractId },
            },
          },
        },
        compensationReports: {
          where: {
            OR: [
              { salesmanId: contract.salesmanId },
              { teamId: contract.salesman.teamId },
            ],
          },
        },
      },
    });

    const pdfPaths = [];
    const excelPaths = [];
    const reportIdsToDelete = new Set<number>();

    for (const report of relatedReports) {
      for (const contractReport of report.contractReports) {
        if (contractReport.pdfPath) pdfPaths.push(`${contractReport.pdfPath}`);
        if (contractReport.excelPath)
          excelPaths.push(`${contractReport.excelPath}`);
        reportIdsToDelete.add(contractReport.reportId);
      }
      for (const compensationReport of report.compensationReports) {
        if (compensationReport.pdfPath)
          pdfPaths.push(`${compensationReport.pdfPath}`);
        if (compensationReport.excelPath)
          excelPaths.push(`${compensationReport.excelPath}`);
        reportIdsToDelete.add(compensationReport.reportId);
      }
    }

    const uploadedFilePaths = contract.documents.map((doc) => doc.path);

    deleteReportFiles([...pdfPaths, ...excelPaths]);
    deleteUploadedFiles(uploadedFilePaths);

    await prisma.contractReport.deleteMany({
      where: { contracts: { some: { id: contractId } } },
    });

    await prisma.compensationReport.deleteMany({
      where: {
        OR: [
          { salesmanId: contract.salesmanId },
          { teamId: contract.salesman.teamId },
        ],
      },
    });

    await prisma.branch.deleteMany({
      where: { contractId },
    });

    await prisma.contractDocument.deleteMany({
      where: { contractId },
    });

    await prisma.contract.delete({
      where: { id: contractId },
    });

    await prisma.report.deleteMany({
      where: {
        id: {
          in: Array.from(reportIdsToDelete),
        },
      },
    });

    return NextResponse.json(
      { message: "Contract and related records deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete contract:", error);
    return NextResponse.json(
      { error: "Failed to delete contract" },
      { status: 500 }
    );
  }
}
