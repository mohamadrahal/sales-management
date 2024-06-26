import { PrismaClient, ContractType, BusinessType } from "@prisma/client";
import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const salesmanId = Number(formData.get("salesmanId"));
  const type = formData.get("type") as ContractType;
  const companyName = formData.get("companyName") as string;
  const businessType = formData.get("businessType") as BusinessType;
  const ownerName = formData.get("ownerName") as string;
  const ownerMobileNumber = formData.get("ownerMobileNumber") as string;
  const companyMobileNumber = formData.get("companyMobileNumber") as string;
  const contactPersonName = formData.get("contactPersonName") as string;
  const contactPersonMobileNumber = formData.get(
    "contactPersonMobileNumber"
  ) as string;
  const bcdAccountNumber = formData.get("bcdAccountNumber") as string;
  const document = formData.get("document") as File | null;

  if (!document) {
    return NextResponse.json(
      { error: "Document file is required." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await document.arrayBuffer());
  const relativeUploadDir = `/uploads/${new Date(Date.now())
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-")}`;

  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error(
        "Error while trying to create directory when uploading a file\n",
        e
      );
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${document.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(document.type)}`;
    await writeFile(`${uploadDir}/${filename}`, buffer);
    const fileUrl = `${relativeUploadDir}/${filename}`;

    const salesman = await prisma.user.findUnique({
      where: { id: salesmanId },
    });

    if (!salesman) {
      return NextResponse.json(
        { error: "Salesman not found" },
        { status: 404 }
      );
    }

    const newContract = await prisma.contract.create({
      data: {
        salesmanId,
        type,
        companyName,
        businessType,
        ownerName,
        ownerMobileNumber,
        companyMobileNumber,
        contactPersonName,
        contactPersonMobileNumber,
        bcdAccountNumber,
        documentPath: fileUrl,
        status: "Pending",
      },
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (e) {
    console.error("Error while trying to upload a file\n", e);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    const [contracts, totalCount] = await Promise.all([
      prisma.contract.findMany({
        skip: offset,
        take: limit,
        include: {
          branches: true,
          salesman: true,
        },
      }),
      prisma.contract.count(),
    ]);

    // Map contracts to include the number of branches
    const contractsWithBranchCount = contracts.map((contract) => ({
      ...contract,
      numberOfBranches: contract.branches.length,
    }));

    return NextResponse.json(
      { contracts: contractsWithBranchCount, totalCount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
