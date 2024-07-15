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

  const { role } = decoded as { role: string };

  if (role !== "Admin" && role !== "SalesManager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;

  try {
    const contractId = Number(id);

    // Get the contract details
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { salesman: true },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    // Find related reports
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
          where: { contractId },
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

    // Collect paths of files to delete
    const pdfPaths = [];
    const excelPaths = [];
    const reportIdsToDelete = new Set<number>();

    for (const report of relatedReports) {
      for (const contractReport of report.contractReports) {
        pdfPaths.push(contractReport.pdfPath);
        excelPaths.push(contractReport.excelPath);
        reportIdsToDelete.add(contractReport.reportId);
      }
      for (const compensationReport of report.compensationReports) {
        pdfPaths.push(compensationReport.pdfPath);
        excelPaths.push(compensationReport.excelPath);
        reportIdsToDelete.add(compensationReport.reportId);
      }
    }

    // Delete the files before deleting the reports
    deleteFiles([...pdfPaths, ...excelPaths]);

    // Delete related records in the `ContractReport` and `CompensationReport` tables
    await prisma.contractReport.deleteMany({
      where: { contractId },
    });

    await prisma.compensationReport.deleteMany({
      where: {
        OR: [
          { salesmanId: contract.salesmanId },
          { teamId: contract.salesman.teamId },
        ],
      },
    });

    // Delete the contract and related branches
    await prisma.branch.deleteMany({
      where: { contractId },
    });

    await prisma.contract.delete({
      where: { id: contractId },
    });

    // Delete the reports
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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (!id) {
    return NextResponse.json({ error: "Invalid contract ID" }, { status: 400 });
  }

  try {
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        branches: true,
        salesman: true,
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
